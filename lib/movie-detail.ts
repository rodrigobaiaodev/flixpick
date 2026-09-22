import {
  getMovieDetails,
  getWatchProviders,
  mapTmdbMovieToMovie,
} from "@/lib/tmdb";
import { getGenreDisplayName } from "@/lib/genres";
import type { Genre, Movie, Person } from "@/types/movie";

const LANGUAGE = "en-US";

const KEY_CREW_JOBS = [
  "Director",
  "Screenplay",
  "Writer",
  "Story",
  "Producer",
  "Executive Producer",
  "Director of Photography",
  "Original Music Composer",
] as const;

interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

interface TmdbCreditsResponse {
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
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
  name: string;
  site: string;
  type: string;
  official: boolean;
}

interface TmdbVideosResponse {
  results: TmdbVideo[];
}

interface TmdbMovieExtended {
  budget: number;
  revenue: number;
  status: string;
  original_language: string;
  production_countries: { name: string }[];
  spoken_languages: { english_name: string }[];
}

export interface ContentVideo {
  key: string;
  name: string;
  type: string;
  site: string;
}

export interface TechnicalDetailRow {
  label: string;
  value: string;
}

async function tmdbFetch<T>(path: string, language?: string): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL?.replace(/\/$/, "");

  if (!apiKey || !baseUrl) {
    throw new Error("TMDB configuration missing");
  }

  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", language ?? LANGUAGE);

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

export async function getMovieCast(
  movieId: number,
  language?: string,
): Promise<Person[]> {
  const data = await tmdbFetch<TmdbCreditsResponse>(
    `/movie/${movieId}/credits`,
    language,
  );

  return data.cast
    .sort((a, b) => a.order - b.order)
    .slice(0, 18)
    .map((member) => ({
      id: member.id,
      name: member.name,
      profilePath: member.profile_path,
      character: member.character,
    }));
}

export async function getMovieCrew(
  movieId: number,
  language?: string,
): Promise<Person[]> {
  const data = await tmdbFetch<TmdbCreditsResponse>(
    `/movie/${movieId}/credits`,
    language,
  );

  const seen = new Set<string>();
  const crew: Person[] = [];

  for (const job of KEY_CREW_JOBS) {
    const member = data.crew.find((c) => c.job === job);
    if (!member || seen.has(`${member.id}-${member.job}`)) continue;
    seen.add(`${member.id}-${member.job}`);
    crew.push({
      id: member.id,
      name: member.name,
      profilePath: member.profile_path,
      job: member.job,
    });
    if (crew.length >= 8) break;
  }

  return crew;
}

function formatCurrency(amount: number): string {
  if (!amount) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function getMovieTechnicalDetails(
  movieId: number,
  crew: Person[],
  language?: string,
): Promise<TechnicalDetailRow[]> {
  const data = await tmdbFetch<TmdbMovieExtended>(`/movie/${movieId}`, language);
  const director = crew.find((p) => p.job === "Director");

  return [
    { label: "Director", value: director?.name ?? "—" },
    { label: "Budget", value: formatCurrency(data.budget) },
    { label: "Revenue", value: formatCurrency(data.revenue) },
    {
      label: "Country",
      value: data.production_countries?.map((c) => c.name).join(", ") || "—",
    },
    {
      label: "Language",
      value:
        data.spoken_languages?.map((l) => l.english_name).join(", ") ||
        data.original_language?.toUpperCase() ||
        "—",
    },
    { label: "Status", value: data.status || "—" },
  ];
}

export async function getMovieVideos(
  movieId: number,
  language?: string,
): Promise<ContentVideo[]> {
  const data = await tmdbFetch<TmdbVideosResponse>(
    `/movie/${movieId}/videos`,
    language,
  );

  return data.results
    .filter((v) => v.site === "YouTube")
    .slice(0, 12)
    .map((v) => ({
      key: v.key,
      name: v.name,
      type: v.type,
      site: v.site,
    }));
}

export async function getSimilarMovies(
  movieId: number,
  limit = 8,
  language?: string,
): Promise<Movie[]> {
  const data = await tmdbFetch<TmdbSimilarResponse>(
    `/movie/${movieId}/similar`,
    language,
  );

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

export async function getMovieTrailerKey(
  movieId: number,
  language?: string,
): Promise<string | null> {
  const data = await tmdbFetch<TmdbVideosResponse>(
    `/movie/${movieId}/videos`,
    language,
  );

  const trailer =
    data.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
    ) ?? data.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

  return trailer?.key ?? null;
}

export interface MoviePageData {
  movie: Movie;
  cast: Person[];
  crew: Person[];
  similar: Movie[];
  trailerKey: string | null;
  technicalDetails: TechnicalDetailRow[];
  videos: ContentVideo[];
}

export async function getMoviePageData(
  movieId: number,
  language?: string,
): Promise<MoviePageData> {
  const [details, availability, cast, crew, similar, trailerKey, videos] =
    await Promise.all([
      getMovieDetails(movieId, language),
      getWatchProviders(movieId),
      getMovieCast(movieId, language),
      getMovieCrew(movieId, language),
      getSimilarMovies(movieId, 8, language),
      getMovieTrailerKey(movieId, language),
      getMovieVideos(movieId, language),
    ]);

  const technicalDetails = await getMovieTechnicalDetails(
    movieId,
    crew,
    language,
  );

  const movie: Movie = {
    ...details,
    genres: details.genres.map((g) => ({
      id: g.id,
      name: getGenreDisplayName(g.id, g.name),
    })),
    availability,
    credits: { cast, crew },
  };

  return { movie, cast, crew, similar, trailerKey, technicalDetails, videos };
}
