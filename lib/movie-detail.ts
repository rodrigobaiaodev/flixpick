import {
  getMovieDetails,
  getWatchProviders,
  mapTmdbMovieToMovie,
} from "@/lib/tmdb";
import { getGenreDisplayName } from "@/components/shared/MovieCard";
import type { Genre, Movie, Person } from "@/types/movie";

const LANGUAGE = "en-US";

interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface TmdbCreditsResponse {
  cast: TmdbCastMember[];
}

interface TmdbSimilarResponse {
  results: {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    release_date: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count: number;
    popularity: number;
    genre_ids?: number[];
  }[];
}

interface TmdbVideo {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

interface TmdbVideosResponse {
  results: TmdbVideo[];
}

async function tmdbFetch<T>(path: string): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL?.replace(/\/$/, "");

  if (!apiKey || !baseUrl) {
    throw new Error("TMDB configuration missing");
  }

  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", LANGUAGE);

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TMDB ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function mapGenresFromIds(genreIds?: number[]): Genre[] {
  if (!genreIds?.length) return [];
  return genreIds.map((id) => ({
    id,
    name: getGenreDisplayName(id),
  }));
}

export async function getMovieCast(movieId: number): Promise<Person[]> {
  const data = await tmdbFetch<TmdbCreditsResponse>(`/movie/${movieId}/credits`);

  return data.cast
    .sort((a, b) => a.order - b.order)
    .slice(0, 12)
    .map((member) => ({
      id: member.id,
      name: member.name,
      profilePath: member.profile_path,
      character: member.character,
    }));
}

export async function getSimilarMovies(movieId: number, limit = 6): Promise<Movie[]> {
  const data = await tmdbFetch<TmdbSimilarResponse>(`/movie/${movieId}/similar`);

  return data.results.slice(0, limit).map((item) => {
    const movie = mapTmdbMovieToMovie(item);
    return {
      ...movie,
      genres:
        movie.genres.length > 0
          ? movie.genres.map((g) => ({
              id: g.id,
              name: getGenreDisplayName(g.id, g.name),
            }))
          : mapGenresFromIds(item.genre_ids),
    };
  });
}

export async function getMovieTrailerKey(movieId: number): Promise<string | null> {
  const data = await tmdbFetch<TmdbVideosResponse>(`/movie/${movieId}/videos`);

  const trailer =
    data.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
    ) ?? data.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

  return trailer?.key ?? null;
}

export interface MoviePageData {
  movie: Movie;
  cast: Person[];
  similar: Movie[];
  trailerKey: string | null;
}

export async function getMoviePageData(movieId: number): Promise<MoviePageData> {
  const [details, availability, cast, similar, trailerKey] = await Promise.all([
    getMovieDetails(movieId),
    getWatchProviders(movieId),
    getMovieCast(movieId),
    getSimilarMovies(movieId, 6),
    getMovieTrailerKey(movieId),
  ]);

  const movie: Movie = {
    ...details,
    genres: details.genres.map((g) => ({
      id: g.id,
      name: getGenreDisplayName(g.id, g.name),
    })),
    availability,
    credits: { cast, crew: [] },
  };

  return { movie, cast, similar, trailerKey };
}
