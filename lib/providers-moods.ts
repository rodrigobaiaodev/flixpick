import type { MediaType } from "@/types/movie";
import {
  getAllTmdbDiscoverIds,
  STREAMING_PLATFORMS,
  getTmdbDiscoverIds,
} from "@/lib/streaming-platforms";

export interface MoodConfig {
  label: string;
  emoji: string;
  movieGenres: number[];
  tvGenres: number[];
  minRating: number;
  minVotes: number;
  excludeGenres: number[];
  keywords: string;
}

/** Improved mood → TMDB discover config (genres, quality, exclusions). */
export const MOOD_CONFIG: Record<string, MoodConfig> = {
  "adrenaline-rush": {
    label: "Adrenaline Rush",
    emoji: "⚡",
    movieGenres: [28, 12, 53],
    tvGenres: [10759, 10765],
    minRating: 7.0,
    minVotes: 500,
    excludeGenres: [16, 10751],
    keywords: "action,chase,explosion,combat,survival",
  },
  "need-a-good-laugh": {
    label: "Need a Good Laugh",
    emoji: "😂",
    movieGenres: [35],
    tvGenres: [35],
    minRating: 6.5,
    minVotes: 500,
    excludeGenres: [16, 10751],
    keywords: "comedy,humor,funny,satire,parody",
  },
  "hopeless-romantic": {
    label: "Hopeless Romantic",
    emoji: "❤️",
    movieGenres: [10749, 18],
    tvGenres: [10749, 18],
    minRating: 6.5,
    minVotes: 300,
    excludeGenres: [16],
    keywords: "romance,love,relationship",
  },
  "keep-me-awake": {
    label: "Keep me Awake",
    emoji: "👻",
    movieGenres: [27, 53, 9648],
    tvGenres: [9648, 80],
    minRating: 6.8,
    minVotes: 500,
    excludeGenres: [16, 10751],
    keywords: "horror,scary,suspense,psychological",
  },
  "mind-bending": {
    label: "Mind-Bending",
    emoji: "🤯",
    movieGenres: [878, 9648, 53],
    tvGenres: [9648, 10765],
    minRating: 7.0,
    minVotes: 500,
    excludeGenres: [16],
    keywords: "twist,psychological,mindfuck,mystery,complex",
  },
  "emotional-journey": {
    label: "Emotional Journey",
    emoji: "😢",
    movieGenres: [18],
    tvGenres: [18],
    minRating: 7.5,
    minVotes: 500,
    excludeGenres: [16],
    keywords: "drama,emotional,touching,tearjerker",
  },
  "cozy-and-family": {
    label: "Cozy & Family",
    emoji: "🛋️",
    movieGenres: [10751, 16, 35, 14],
    tvGenres: [10751, 16, 35],
    minRating: 6.5,
    minVotes: 200,
    excludeGenres: [27, 53, 28],
    keywords: "family,feel-good,animation,adventure",
  },
  "true-stories": {
    label: "True Stories",
    emoji: "📖",
    movieGenres: [99, 36, 18],
    tvGenres: [99, 18],
    minRating: 7.0,
    minVotes: 300,
    excludeGenres: [16],
    keywords: "biography,true-story,documentary,historical,based-on-true-events",
  },
  whodunnit: {
    label: "Whodunnit?",
    emoji: "🔍",
    movieGenres: [9648, 80, 53],
    tvGenres: [9648, 80],
    minRating: 7.0,
    minVotes: 300,
    excludeGenres: [16],
    keywords: "mystery,detective,crime,whodunit,investigation",
  },
  "epic-fantasy": {
    label: "Epic Fantasy",
    emoji: "⚔️",
    movieGenres: [14, 878, 12, 28],
    tvGenres: [10765, 10759, 14],
    minRating: 7.0,
    minVotes: 500,
    excludeGenres: [],
    keywords: "fantasy,epic,magic,adventure,mythology",
  },
};

/** Optional genre refinement chips shown after mood selection (max 3). */
export const MOOD_REFINE_GENRES: Record<
  string,
  { id: number; label: string }[]
> = {
  "adrenaline-rush": [
    { id: 28, label: "Action" },
    { id: 53, label: "Thriller" },
    { id: 878, label: "Sci-Fi" },
  ],
  "need-a-good-laugh": [
    { id: 35, label: "Comedy" },
    { id: 10749, label: "Rom-Com" },
    { id: 35, label: "Satire" },
  ],
  "mind-bending": [
    { id: 878, label: "Sci-Fi" },
    { id: 53, label: "Thriller" },
    { id: 9648, label: "Mystery" },
  ],
  "keep-me-awake": [
    { id: 27, label: "Horror" },
    { id: 53, label: "Thriller" },
    { id: 9648, label: "Psychological" },
  ],
  "epic-fantasy": [
    { id: 14, label: "Fantasy" },
    { id: 12, label: "Adventure" },
    { id: 878, label: "Sci-Fi" },
  ],
  "emotional-journey": [
    { id: 18, label: "Drama" },
    { id: 36, label: "Biography" },
    { id: 10749, label: "Romance" },
  ],
  "true-stories": [
    { id: 99, label: "Documentary" },
    { id: 36, label: "Biography" },
    { id: 36, label: "History" },
  ],
  whodunnit: [
    { id: 9648, label: "Mystery" },
    { id: 80, label: "Crime" },
    { id: 53, label: "Thriller" },
  ],
  "cozy-and-family": [
    { id: 10751, label: "Family" },
    { id: 16, label: "Animation" },
    { id: 12, label: "Adventure" },
  ],
  "hopeless-romantic": [
    { id: 10749, label: "Romance" },
    { id: 18, label: "Drama" },
    { id: 35, label: "Comedy" },
  ],
};

/** Mood slug → TMDB movie genre IDs. */
export const MOOD_TO_MOVIE_GENRE_IDS: Record<string, number[]> =
  Object.fromEntries(
    Object.entries(MOOD_CONFIG).map(([slug, config]) => [
      slug,
      config.movieGenres,
    ]),
  );

/** Mood slug → TMDB TV genre IDs. */
export const MOOD_TO_TV_GENRE_IDS: Record<string, number[]> = Object.fromEntries(
  Object.entries(MOOD_CONFIG).map(([slug, config]) => [slug, config.tvGenres]),
);

/** @deprecated Use MOOD_TO_MOVIE_GENRE_IDS */
export const MOOD_TO_GENRE_IDS = MOOD_TO_MOVIE_GENRE_IDS;

/** Uses original_language !== "en" instead of genre IDs. */
export const WORLD_CINEMA_MOOD_SLUG = "world-cinema";

const ANIMATION_GENRE_ID = 16;

/** Platform slug → primary TMDB watch_provider ID (US). */
export const PROVIDER_SLUG_TO_TMDB_ID: Record<string, number> = {
  netflix: 8,
  prime: 9,
  "prime-video": 9,
  max: 1899,
  disney: 337,
  "disney-plus": 337,
  apple: 350,
  "apple-tv-plus": 350,
  hulu: 15,
  peacock: 386,
  paramount: 2303,
  "paramount-plus": 2303,
};

export const TMDB_PROVIDER_IDS = getAllTmdbDiscoverIds();

export function getMoodConfig(moodSlug: string): MoodConfig | undefined {
  return MOOD_CONFIG[moodSlug];
}

export function isWorldCinemaMood(moodSlug: string): boolean {
  return moodSlug === WORLD_CINEMA_MOOD_SLUG;
}

export function getMoodGenreIds(
  moodSlug: string,
  mediaType: MediaType = "movie",
): number[] {
  if (isWorldCinemaMood(moodSlug)) return [];

  const config = MOOD_CONFIG[moodSlug];
  if (config) {
    return mediaType === "tv" ? config.tvGenres : config.movieGenres;
  }

  const map =
    mediaType === "tv" ? MOOD_TO_TV_GENRE_IDS : MOOD_TO_MOVIE_GENRE_IDS;
  return map[moodSlug] ?? [];
}

/**
 * Genres to exclude on discover.
 * Always adds Animation (16) for non–cozy-and-family moods.
 */
export function getMoodExcludeGenreIds(moodSlug: string): number[] {
  const config = MOOD_CONFIG[moodSlug];
  const base = config?.excludeGenres ?? [];
  if (moodSlug === "cozy-and-family") {
    return [...base];
  }
  return Array.from(new Set([...base, ANIMATION_GENRE_ID]));
}

export function isValidMoodSlug(moodSlug: string): boolean {
  return (
    isWorldCinemaMood(moodSlug) ||
    moodSlug in MOOD_CONFIG ||
    moodSlug in MOOD_TO_MOVIE_GENRE_IDS ||
    moodSlug in MOOD_TO_TV_GENRE_IDS
  );
}

export function resolveProviderTmdbId(
  slugOrId: string | number,
): number | undefined {
  if (typeof slugOrId === "number") return slugOrId;
  const asNumber = Number(slugOrId);
  if (!Number.isNaN(asNumber) && TMDB_PROVIDER_IDS.includes(asNumber)) {
    return asNumber;
  }
  const platform = STREAMING_PLATFORMS.find((p) => p.id === slugOrId);
  if (platform) return getTmdbDiscoverIds(platform)[0];
  return PROVIDER_SLUG_TO_TMDB_ID[slugOrId];
}
