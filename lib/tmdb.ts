import {
  getMoodExcludeGenreIds,
  getMoodGenreIds,
  getMoodConfig,
  isWorldCinemaMood,
} from "@/lib/providers-moods";
import type {
  ContentItem,
  Genre,
  MediaType,
  MovieAvailability,
  MovieSearchResult,
  Network,
  RecommendMediaType,
  StreamingProvider,
  WatchOption,
  WatchOptionType,
} from "@/types/movie";

const LANGUAGE = "en-US";
const WATCH_REGION = "US";

const DISCOVER_QUALITY_FILTERS = {
  "vote_count.gte": 100,
  "popularity.gte": 10,
  "vote_average.gte": 5.5,
} as const;

export interface MoodDiscoverOptions {
  minVotes?: number;
  minRating?: number;
  excludeGenreIds?: number[];
  /** When set, narrows discover to this genre (mood refine). */
  refineGenreId?: number;
  /** Skip default DISCOVER_QUALITY_FILTERS and use mood thresholds only. */
  useMoodQuality?: boolean;
}

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

interface TmdbTVListItem {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: TmdbGenre[];
  original_language?: string;
  tagline?: string | null;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  networks?: TmdbNetwork[];
  episode_run_time?: number[];
}

interface TmdbTVDetails extends TmdbTVListItem {
  genres: TmdbGenre[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  networks: TmdbNetwork[];
}

interface TmdbNetwork {
  id: number;
  name: string;
  logo_path: string | null;
}

interface TmdbTrendingAllItem {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  original_language?: string;
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

function mapNetworks(networks?: TmdbNetwork[]): Network[] {
  if (!networks?.length) return [];
  return networks.map((n) => ({
    id: n.id,
    name: n.name,
    logoPath: n.logo_path,
  }));
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

const EMPTY_TV_FIELDS = {
  numberOfSeasons: null,
  numberOfEpisodes: null,
  status: null,
  networks: [] as Network[],
} as const;

export function mapTmdbMovieToMovie(
  item: TmdbMovieListItem | TmdbMovieDetails,
  extras?: {
    availability?: MovieAvailability[];
    moods?: string[];
    mediaType?: MediaType;
  },
): ContentItem {
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
    ...EMPTY_TV_FIELDS,
  };
}

export function mapTmdbTVToContentItem(
  item: TmdbTVListItem | TmdbTVDetails,
  extras?: {
    availability?: MovieAvailability[];
    moods?: string[];
  },
): ContentItem {
  const genres = mapGenres(item.genres, item.genre_ids);
  const runtimeMinutes =
    item.episode_run_time?.[0] ?? null;

  return {
    id: item.id,
    tmdbId: item.id,
    mediaType: "tv",
    title: item.name,
    originalTitle: item.original_name,
    overview: item.overview ?? "",
    tagline: item.tagline ?? null,
    releaseDate: item.first_air_date ?? "",
    runtimeMinutes,
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    voteAverage: item.vote_average ?? 0,
    voteCount: item.vote_count ?? 0,
    popularity: item.popularity ?? 0,
    contentRating: null,
    genres,
    moods: extras?.moods ?? [],
    availability: extras?.availability ?? [],
    numberOfSeasons: item.number_of_seasons ?? null,
    numberOfEpisodes: item.number_of_episodes ?? null,
    status: item.status ?? null,
    networks: mapNetworks(item.networks),
  };
}

function mapTrendingAllItem(item: TmdbTrendingAllItem): ContentItem | null {
  if (item.media_type === "movie") {
    return mapTmdbMovieToMovie(
      {
        id: item.id,
        title: item.title ?? "",
        original_title: item.original_title ?? item.title ?? "",
        overview: item.overview ?? "",
        release_date: item.release_date ?? "",
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average,
        vote_count: item.vote_count,
        popularity: item.popularity,
        genre_ids: item.genre_ids,
        original_language: item.original_language,
      },
      { mediaType: "movie" },
    );
  }

  if (item.media_type === "tv") {
    return mapTmdbTVToContentItem({
      id: item.id,
      name: item.name ?? "",
      original_name: item.original_name ?? item.name ?? "",
      overview: item.overview ?? "",
      first_air_date: item.first_air_date ?? "",
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
      vote_count: item.vote_count,
      popularity: item.popularity,
      genre_ids: item.genre_ids,
      original_language: item.original_language,
    });
  }

  return null;
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

function buildDiscoverParams(
  moodSlug: string,
  providerIds: number[],
  page: number,
  mediaType: MediaType,
  options?: MoodDiscoverOptions,
): Record<string, TmdbQueryValue> {
  const genreIds = getMoodGenreIds(moodSlug, mediaType);
  const params: Record<string, TmdbQueryValue> = {
    watch_region: WATCH_REGION,
    page,
    sort_by: "popularity.desc",
    include_adult: false,
  };

  if (options?.useMoodQuality) {
    params["vote_count.gte"] = options.minVotes ?? 200;
    params["vote_average.gte"] = options.minRating ?? 6.5;
  } else {
    Object.assign(params, DISCOVER_QUALITY_FILTERS);
  }

  if (options?.refineGenreId) {
    params.with_genres = String(options.refineGenreId);
  } else if (genreIds.length > 0) {
    // Recommend path uses OR so multi-genre moods stay populated
    params.with_genres = options?.useMoodQuality
      ? genreIds.join("|")
      : genreIds.join(",");
  }

  const excludeIds =
    options?.excludeGenreIds ??
    (options?.useMoodQuality ? getMoodExcludeGenreIds(moodSlug) : []);
  if (excludeIds.length > 0) {
    params.without_genres = excludeIds.join(",");
  }

  if (providerIds.length > 0) {
    params.with_watch_providers = providerIds.join("|");
    params.with_watch_monetization_types = "flatrate|free|ads";
  }

  return params;
}

export async function getMoviesByMood(
  moodSlug: string,
  providerIds: number[],
  page = 1,
  options?: MoodDiscoverOptions,
): Promise<MovieSearchResult> {
  const data = await tmdbFetch<TmdbPaginatedResponse<TmdbMovieListItem>>(
    "/discover/movie",
    buildDiscoverParams(moodSlug, providerIds, page, "movie", options),
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

export async function getTVByMood(
  moodSlug: string,
  providerIds: number[],
  page = 1,
  options?: MoodDiscoverOptions,
): Promise<MovieSearchResult> {
  const data = await tmdbFetch<TmdbPaginatedResponse<TmdbTVListItem>>(
    "/discover/tv",
    buildDiscoverParams(moodSlug, providerIds, page, "tv", options),
    { next: { revalidate: 300 } },
  );

  let rawResults = data.results;
  if (isWorldCinemaMood(moodSlug)) {
    rawResults = rawResults.filter(
      (item) => item.original_language && item.original_language !== "en",
    );
  }

  const results = rawResults.map((item) =>
    mapTmdbTVToContentItem(item, { moods: [moodSlug] }),
  );

  return {
    results,
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function getMovieDetails(movieId: number): Promise<ContentItem> {
  const data = await tmdbFetch<TmdbMovieDetails>(`/movie/${movieId}`, {
    watch_region: WATCH_REGION,
  });

  return mapTmdbMovieToMovie(data);
}

export async function getTVDetails(tvId: number): Promise<ContentItem> {
  const data = await tmdbFetch<TmdbTVDetails>(`/tv/${tvId}`, {
    watch_region: WATCH_REGION,
  });

  return mapTmdbTVToContentItem(data);
}

export async function getWatchProviders(
  movieId: number,
): Promise<MovieAvailability[]> {
  const data = await tmdbFetch<TmdbWatchProvidersResponse>(
    `/movie/${movieId}/watch/providers`,
  );

  return mapWatchProvidersResponse(data, WATCH_REGION);
}

export async function getTVWatchProviders(
  tvId: number,
): Promise<MovieAvailability[]> {
  const data = await tmdbFetch<TmdbWatchProvidersResponse>(
    `/tv/${tvId}/watch/providers`,
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

export async function getTrendingAll(
  timeWindow: "day" | "week",
): Promise<MovieSearchResult> {
  const data = await tmdbFetch<TmdbPaginatedResponse<TmdbTrendingAllItem>>(
    `/trending/all/${timeWindow}`,
    { watch_region: WATCH_REGION },
    { next: { revalidate: 3600 } },
  );

  const results = data.results
    .map(mapTrendingAllItem)
    .filter((item): item is ContentItem => item !== null);

  return {
    results,
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

export async function searchMulti(
  query: string,
  page = 1,
): Promise<MovieSearchResult> {
  const data = await tmdbFetch<TmdbPaginatedResponse<TmdbTrendingAllItem>>(
    "/search/multi",
    {
      query,
      include_adult: false,
      page,
      watch_region: WATCH_REGION,
    },
    { next: { revalidate: 300 } },
  );

  const results = data.results
    .map(mapTrendingAllItem)
    .filter((item): item is ContentItem => item !== null);

  return {
    results,
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function enrichContentWithAvailability(
  items: ContentItem[],
): Promise<ContentItem[]> {
  return Promise.all(
    items.map(async (item) => {
      try {
        const availability =
          item.mediaType === "tv"
            ? await getTVWatchProviders(item.id)
            : await getWatchProviders(item.id);
        return { ...item, availability };
      } catch {
        return item;
      }
    }),
  );
}

export function contentMatchesProviders(
  item: ContentItem,
  providerIds: number[],
): boolean {
  if (providerIds.length === 0) return true;

  return item.availability.some((region) =>
    region.options.some(
      (option) =>
        option.type === "flatrate" &&
        providerIds.includes(option.provider.id),
    ),
  );
}

async function getTrailerUrl(
  mediaType: MediaType,
  id: number,
): Promise<string | null> {
  const path = mediaType === "tv" ? `/tv/${id}/videos` : `/movie/${id}/videos`;
  const data = await tmdbFetch<TmdbVideosResponse>(path);

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

export async function getMovieTrailerUrl(
  movieId: number,
): Promise<string | null> {
  return getTrailerUrl("movie", movieId);
}

/** Fetch discover pages until at least `targetCount` candidates (max 5 pages). */
async function fetchMoodCandidatesByType(
  moodSlug: string,
  providerIds: number[],
  mediaType: MediaType,
  targetCount: number,
  options?: MoodDiscoverOptions,
): Promise<ContentItem[]> {
  const collected: ContentItem[] = [];
  const seenIds = new Set<number>();
  let page = 1;
  let totalPages = 1;

  while (collected.length < targetCount && page <= totalPages && page <= 5) {
    const batch =
      mediaType === "tv"
        ? await getTVByMood(moodSlug, providerIds, page, options)
        : await getMoviesByMood(moodSlug, providerIds, page, options);
    totalPages = batch.totalPages;

    for (const item of batch.results) {
      if (seenIds.has(item.id)) continue;
      seenIds.add(item.id);
      collected.push(item);
      if (collected.length >= targetCount) break;
    }

    page += 1;
  }

  return collected;
}

export async function fetchMoodCandidates(
  moodSlug: string,
  providerIds: number[],
  targetCount = 40,
): Promise<ContentItem[]> {
  return fetchMoodCandidatesByType(moodSlug, providerIds, "movie", targetCount);
}

export async function fetchRecommendCandidates(
  moodSlug: string,
  providerIds: number[],
  mediaType: RecommendMediaType = "both",
  options?: MoodDiscoverOptions & { targetCount?: number },
): Promise<ContentItem[]> {
  const targetCount = options?.targetCount ?? 60;
  const config = getMoodConfig(moodSlug);
  const discoverOptions: MoodDiscoverOptions = {
    useMoodQuality: true,
    minVotes: options?.minVotes ?? config?.minVotes ?? 500,
    minRating: options?.minRating ?? config?.minRating ?? 7.0,
    excludeGenreIds:
      options?.excludeGenreIds ?? getMoodExcludeGenreIds(moodSlug),
    refineGenreId: options?.refineGenreId,
  };

  if (mediaType === "both") {
    const half = Math.ceil(targetCount / 2);
    const [movies, shows] = await Promise.all([
      fetchMoodCandidatesByType(
        moodSlug,
        providerIds,
        "movie",
        half,
        discoverOptions,
      ),
      fetchMoodCandidatesByType(
        moodSlug,
        providerIds,
        "tv",
        half,
        discoverOptions,
      ),
    ]);
    return [...movies, ...shows];
  }

  return fetchMoodCandidatesByType(
    moodSlug,
    providerIds,
    mediaType,
    targetCount,
    discoverOptions,
  );
}

export async function buildFullMoviePick(
  movieId: number,
  moodSlug?: string,
): Promise<{ movie: ContentItem; trailerUrl: string | null }> {
  const [details, availability, trailerUrl] = await Promise.all([
    getMovieDetails(movieId),
    getWatchProviders(movieId),
    getMovieTrailerUrl(movieId),
  ]);

  const movie: ContentItem = {
    ...details,
    availability,
    moods: moodSlug ? [moodSlug] : details.moods,
  };

  return { movie, trailerUrl };
}

export async function buildFullTVPick(
  tvId: number,
  moodSlug?: string,
): Promise<{ movie: ContentItem; trailerUrl: string | null }> {
  const [details, availability, trailerUrl] = await Promise.all([
    getTVDetails(tvId),
    getTVWatchProviders(tvId),
    getTrailerUrl("tv", tvId),
  ]);

  const movie: ContentItem = {
    ...details,
    availability,
    moods: moodSlug ? [moodSlug] : details.moods,
  };

  return { movie, trailerUrl };
}

export async function buildFullContentPick(
  id: number,
  mediaType: MediaType,
  moodSlug?: string,
): Promise<{ movie: ContentItem; trailerUrl: string | null }> {
  if (mediaType === "tv") {
    return buildFullTVPick(id, moodSlug);
  }
  return buildFullMoviePick(id, moodSlug);
}

export type BrowseSort = "popular" | "top_rated" | "new";

const MOVIE_SORT_MAP: Record<BrowseSort, string> = {
  popular: "popularity.desc",
  top_rated: "vote_average.desc",
  new: "release_date.desc",
};

const TV_SORT_MAP: Record<BrowseSort, string> = {
  popular: "popularity.desc",
  top_rated: "vote_average.desc",
  new: "first_air_date.desc",
};

export async function browseDiscoverMovies(options: {
  genreId?: number;
  sort?: BrowseSort;
  page?: number;
}): Promise<MovieSearchResult> {
  const { genreId, sort = "popular", page = 1 } = options;
  const params: Record<string, TmdbQueryValue> = {
    watch_region: WATCH_REGION,
    page,
    sort_by: MOVIE_SORT_MAP[sort],
    include_adult: false,
    "vote_count.gte": 20,
  };

  if (genreId) params.with_genres = String(genreId);

  const data = await tmdbFetch<TmdbPaginatedResponse<TmdbMovieListItem>>(
    "/discover/movie",
    params,
    { next: { revalidate: 300 } },
  );

  return {
    results: data.results.map((item) => mapTmdbMovieToMovie(item)),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function browseDiscoverTV(options: {
  genreId?: number;
  sort?: BrowseSort;
  page?: number;
}): Promise<MovieSearchResult> {
  const { genreId, sort = "popular", page = 1 } = options;
  const params: Record<string, TmdbQueryValue> = {
    watch_region: WATCH_REGION,
    page,
    sort_by: TV_SORT_MAP[sort],
    include_adult: false,
    "vote_count.gte": 20,
  };

  if (genreId) params.with_genres = String(genreId);

  const data = await tmdbFetch<TmdbPaginatedResponse<TmdbTVListItem>>(
    "/discover/tv",
    params,
    { next: { revalidate: 300 } },
  );

  return {
    results: data.results.map((item) => mapTmdbTVToContentItem(item)),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function browseByProvider(options: {
  providerId: number | number[];
  mediaType: MediaType;
  moodSlug?: string;
  page?: number;
}): Promise<MovieSearchResult> {
  const { providerId, mediaType, moodSlug, page = 1 } = options;
  const providerQuery = Array.isArray(providerId)
    ? providerId.join("|")
    : String(providerId);

  const params: Record<string, TmdbQueryValue> = {
    watch_region: WATCH_REGION,
    page,
    sort_by: "popularity.desc",
    include_adult: false,
    with_watch_providers: providerQuery,
    with_watch_monetization_types: "flatrate|free|ads",
    "vote_count.gte": 20,
  };

  if (moodSlug) {
    const genreIds = getMoodGenreIds(moodSlug, mediaType);
    if (genreIds.length > 0) params.with_genres = genreIds.join(",");
  }

  const path = mediaType === "tv" ? "/discover/tv" : "/discover/movie";
  const data = await tmdbFetch<
    TmdbPaginatedResponse<TmdbMovieListItem | TmdbTVListItem>
  >(path, params, { next: { revalidate: 300 } });

  let rawResults = data.results;
  if (moodSlug && isWorldCinemaMood(moodSlug)) {
    rawResults = rawResults.filter(
      (item) => item.original_language && item.original_language !== "en",
    );
  }

  const results: ContentItem[] =
    mediaType === "tv"
      ? (rawResults as TmdbTVListItem[]).map((item) =>
          mapTmdbTVToContentItem(item, { moods: moodSlug ? [moodSlug] : [] }),
        )
      : (rawResults as TmdbMovieListItem[]).map((item) =>
          mapTmdbMovieToMovie(item, { moods: moodSlug ? [moodSlug] : [] }),
        );

  return {
    results,
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}
