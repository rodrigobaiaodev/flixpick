import {
  getMoodGenreIds,
  isWorldCinemaMood,
} from "@/lib/providers-moods";
import type {
  Genre,
  MediaType,
  Movie,
  MovieAvailability,
  MovieSearchResult,
  StreamingProvider,
  WatchOption,
  WatchOptionType,
} from "@/types/movie";

const LANGUAGE = "en-US";
const WATCH_REGION = "US";

type TmdbQueryValue = string | number | boolean | undefined;

interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbMovieListItem {
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
  genres?: TmdbGenre[];
  original_language?: string;
  tagline?: string | null;
  runtime?: number | null;
}

interface TmdbMovieDetails extends TmdbMovieListItem {
  genres: TmdbGenre[];
  runtime: number | null;
  tagline: string | null;
}

interface TmdbProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority: number;
}

interface TmdbWatchProvidersResult {
  link?: string;
  flatrate?: TmdbProvider[];
  rent?: TmdbProvider[];
  buy?: TmdbProvider[];
  free?: TmdbProvider[];
  ads?: TmdbProvider[];
}

interface TmdbWatchProvidersResponse {
  id: number;
  results: Record<string, TmdbWatchProvidersResult>;
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

function getTmdbConfig() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

  if (!apiKey || !baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_TMDB_API_KEY or NEXT_PUBLIC_TMDB_BASE_URL",
    );
  }

  return { apiKey, baseUrl: baseUrl.replace(/\/$/, "") };
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, TmdbQueryValue> = {},
  options?: RequestInit & { next?: { revalidate?: number } },
): Promise<T> {
  const { apiKey, baseUrl } = getTmdbConfig();
  const url = new URL(`${baseUrl}${path.startsWith("/") ? path : `/${path}`}`);

  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", LANGUAGE);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`TMDB ${response.status}: ${body || response.statusText}`);
  }

  return response.json() as Promise<T>;
}

function mapGenres(
  genres?: TmdbGenre[],
  genreIds?: number[],
): Genre[] {
  if (genres?.length) {
    return genres.map((g) => ({ id: g.id, name: g.name }));
  }
  if (genreIds?.length) {
    return genreIds.map((id) => ({ id, name: `Genre ${id}` }));
  }
  return [];
}

function mapWatchOptions(
  regionData: TmdbWatchProvidersResult | undefined,
  region: string,
): WatchOption[] {
  if (!regionData) return [];

  const buckets: { type: WatchOptionType; items?: TmdbProvider[] }[] = [
    { type: "flatrate", items: regionData.flatrate },
    { type: "free", items: regionData.free },
    { type: "ads", items: regionData.ads },
    { type: "rent", items: regionData.rent },
    { type: "buy", items: regionData.buy },
  ];

  const options: WatchOption[] = [];

  for (const { type, items } of buckets) {
    if (!items?.length) continue;

    for (const item of items) {
      const provider: StreamingProvider = {
        id: item.provider_id,
        name: item.provider_name,
        logoPath: item.logo_path,
        displayPriority: item.display_priority,
        region,
      };

      options.push({
        provider,
        type,
        link: regionData.link ?? null,
      });
    }
  }

  return options.sort(
    (a, b) => a.provider.displayPriority - b.provider.displayPriority,
  );
}

export function mapTmdbMovieToMovie(
  item: TmdbMovieListItem | TmdbMovieDetails,
  extras?: {
    availability?: MovieAvailability[];
    moods?: string[];
    mediaType?: MediaType;
  },
): Movie {
  const genres = mapGenres(item.genres, item.genre_ids);

  return {
    id: item.id,
    tmdbId: item.id,
    mediaType: extras?.mediaType ?? "movie",
    title: item.title,
    originalTitle: item.original_title,
    overview: item.overview ?? "",
    tagline: "tagline" in item ? (item.tagline ?? null) : null,
    releaseDate: item.release_date ?? "",
    runtimeMinutes: "runtime" in item ? (item.runtime ?? null) : null,
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    voteAverage: item.vote_average ?? 0,
    voteCount: item.vote_count ?? 0,
    popularity: item.popularity ?? 0,
    contentRating: null,
    genres,
    moods: extras?.moods ?? [],
    availability: extras?.availability ?? [],
  };
}

export function mapWatchProvidersResponse(
  data: TmdbWatchProvidersResponse,
  region: string = WATCH_REGION,
): MovieAvailability[] {
  const regionData = data.results[region];
  if (!regionData) return [];

  return [
    {
      region,
      options: mapWatchOptions(regionData, region),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export async function getMoviesByMood(
  moodSlug: string,
  providerIds: number[],
  page = 1,
): Promise<MovieSearchResult> {
  const genreIds = getMoodGenreIds(moodSlug);
  const params: Record<string, TmdbQueryValue> = {
    watch_region: WATCH_REGION,
    page,
    sort_by: "popularity.desc",
    include_adult: false,
    "vote_count.gte": 50,
    "vote_average.gte": 5.5,
  };

  if (genreIds.length > 0) {
    params.with_genres = genreIds.join(",");
  }

  if (providerIds.length > 0) {
    params.with_watch_providers = providerIds.join("|");
    params.with_watch_monetization_types = "flatrate|free|ads";
  }

  const data = await tmdbFetch<TmdbPaginatedResponse<TmdbMovieListItem>>(
    "/discover/movie",
    params,
    { next: { revalidate: 300 } },
  );

  let rawResults = data.results;
  if (isWorldCinemaMood(moodSlug)) {
    rawResults = rawResults.filter(
      (item) => item.original_language && item.original_language !== "en",
    );
  }

  const results = rawResults.map((item) =>
    mapTmdbMovieToMovie(item, { moods: [moodSlug] }),
  );

  return {
    results,
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function getMovieDetails(movieId: number): Promise<Movie> {
  const data = await tmdbFetch<TmdbMovieDetails>(`/movie/${movieId}`, {
    watch_region: WATCH_REGION,
  });

  return mapTmdbMovieToMovie(data);
}

export async function getWatchProviders(
  movieId: number,
): Promise<MovieAvailability[]> {
  const data = await tmdbFetch<TmdbWatchProvidersResponse>(
    `/movie/${movieId}/watch/providers`,
  );

  return mapWatchProvidersResponse(data, WATCH_REGION);
}

export async function getTrendingMovies(
  timeWindow: "day" | "week",
): Promise<MovieSearchResult> {
  const data = await tmdbFetch<TmdbPaginatedResponse<TmdbMovieListItem>>(
    `/trending/movie/${timeWindow}`,
    { watch_region: WATCH_REGION },
    { next: { revalidate: 3600 } },
  );

  return {
    results: data.results.map((item) => mapTmdbMovieToMovie(item)),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function searchMovies(query: string): Promise<MovieSearchResult> {
  const data = await tmdbFetch<TmdbPaginatedResponse<TmdbMovieListItem>>(
    "/search/movie",
    {
      query,
      watch_region: WATCH_REGION,
      include_adult: false,
      page: 1,
    },
    { next: { revalidate: 300 } },
  );

  return {
    results: data.results.map((item) => mapTmdbMovieToMovie(item)),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function getMovieTrailerUrl(
  movieId: number,
): Promise<string | null> {
  const data = await tmdbFetch<TmdbVideosResponse>(`/movie/${movieId}/videos`);

  const trailer =
    data.results.find(
      (v) =>
        v.site === "YouTube" &&
        v.type === "Trailer" &&
        v.official,
    ) ??
    data.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

  if (!trailer?.key) return null;
  return `https://www.youtube.com/watch?v=${trailer.key}`;
}

/** Fetch discover pages until at least `targetCount` candidates (max 5 pages). */
export async function fetchMoodCandidates(
  moodSlug: string,
  providerIds: number[],
  targetCount = 40,
): Promise<Movie[]> {
  const collected: Movie[] = [];
  const seenIds = new Set<number>();
  let page = 1;
  let totalPages = 1;

  while (collected.length < targetCount && page <= totalPages && page <= 5) {
    const batch = await getMoviesByMood(moodSlug, providerIds, page);
    totalPages = batch.totalPages;

    for (const movie of batch.results) {
      if (seenIds.has(movie.id)) continue;
      seenIds.add(movie.id);
      collected.push(movie);
      if (collected.length >= targetCount) break;
    }

    page += 1;
  }

  return collected;
}

export async function buildFullMoviePick(
  movieId: number,
  moodSlug?: string,
): Promise<{ movie: Movie; trailerUrl: string | null }> {
  const [details, availability, trailerUrl] = await Promise.all([
    getMovieDetails(movieId),
    getWatchProviders(movieId),
    getMovieTrailerUrl(movieId),
  ]);

  const movie: Movie = {
    ...details,
    availability,
    moods: moodSlug ? [moodSlug] : details.moods,
  };

  return { movie, trailerUrl };
}
