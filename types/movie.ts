/** Core media type identifiers aligned with TMDB-style APIs */
export type MediaType = "movie" | "tv";

/** Recommendation / discover scope */
export type RecommendMediaType = MediaType | "both";

export type ContentRating =
  | "G"
  | "PG"
  | "PG-13"
  | "R"
  | "NC-17"
  | "TV-Y"
  | "TV-PG"
  | "TV-14"
  | "TV-MA"
  | "NR";

export interface Genre {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  profilePath: string | null;
  character?: string;
  job?: string;
}

export interface Network {
  id: number;
  name: string;
  logoPath: string | null;
}

export interface MovieCredits {
  cast: Person[];
  crew: Person[];
}

export interface StreamingProvider {
  id: number;
  name: string;
  logoPath: string | null;
  displayPriority: number;
  /** ISO 3166-1 alpha-2 region code, e.g. "US" */
  region: string;
}

export type WatchOptionType =
  | "flatrate"
  | "rent"
  | "buy"
  | "free"
  | "ads";

export interface WatchOption {
  provider: StreamingProvider;
  type: WatchOptionType;
  /** Deep link or affiliate URL when available */
  link: string | null;
  /** ISO 4217 currency code for rent/buy pricing */
  priceCurrency?: string;
  price?: number;
}

export interface MovieAvailability {
  region: string;
  options: WatchOption[];
  updatedAt: string;
}

/** Curated mood buckets for recommendation flows */
export interface Mood {
  id: string;
  slug: string;
  label: string;
  description: string;
  icon: string;
  /** TMDB genre IDs or internal tag IDs associated with this mood */
  genreIds: number[];
  gradientFrom: string;
  gradientTo: string;
}

/** Unified content model for movies and TV shows */
export interface ContentItem {
  id: number;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  originalTitle: string;
  overview: string;
  tagline: string | null;
  /** release_date for movies, first_air_date for TV */
  releaseDate: string;
  runtimeMinutes: number | null;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  contentRating: ContentRating | null;
  genres: Genre[];
  moods: Mood["id"][];
  availability: MovieAvailability[];
  credits?: MovieCredits;
  /** User-specific fields */
  inWatchlist?: boolean;
  userRating?: number | null;
  /** TV show fields (null for movies) */
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  status: string | null;
  networks: Network[];
}

/** @deprecated Use ContentItem — kept for backward compatibility */
export type Movie = ContentItem;

export interface MovieRecommendation {
  movie: ContentItem;
  score: number;
  reason: string;
  matchedMoods: Mood["id"][];
  matchedGenres: Genre[];
}

export interface MovieSearchFilters {
  query?: string;
  genres?: number[];
  moods?: string[];
  mediaType?: MediaType | "both";
  minRating?: number;
  yearFrom?: number;
  yearTo?: number;
  providers?: number[];
  region?: string;
  sortBy?: "popularity" | "rating" | "release_date" | "title";
  page?: number;
  pageSize?: number;
}

export interface MovieSearchResult {
  results: ContentItem[];
  page: number;
  totalPages: number;
  totalResults: number;
}
