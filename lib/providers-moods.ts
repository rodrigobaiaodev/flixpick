import type { MediaType } from "@/types/movie";

/** Mood slug → TMDB movie genre IDs (comma-AND on discover). */
export const MOOD_TO_MOVIE_GENRE_IDS: Record<string, number[]> = {
  "action-packed": [28, 12],
  "need-to-laugh": [35],
  "mind-bending": [878, 9648],
  "horror-night": [27, 53],
  "feel-good": [10749, 35, 18],
  "tense-mystery": [9648, 53],
  "good-cry": [18, 10749],
};

/** Mood slug → TMDB TV genre IDs. */
export const MOOD_TO_TV_GENRE_IDS: Record<string, number[]> = {
  "action-packed": [10759, 10765],
  "need-to-laugh": [35],
  "mind-bending": [9648, 10765],
  "horror-night": [9648, 80],
  "feel-good": [35, 10751],
  "tense-mystery": [9648, 80],
  "good-cry": [18, 10749],
};

/** @deprecated Use MOOD_TO_MOVIE_GENRE_IDS */
export const MOOD_TO_GENRE_IDS = MOOD_TO_MOVIE_GENRE_IDS;

/** Uses original_language !== "en" instead of genre IDs. */
export const WORLD_CINEMA_MOOD_SLUG = "world-cinema";

/** Platform slug → TMDB watch_provider ID (US). */
export const PROVIDER_SLUG_TO_TMDB_ID: Record<string, number> = {
  netflix: 8,
  "prime-video": 9,
  max: 384,
  "disney-plus": 337,
  "apple-tv-plus": 350,
  hulu: 15,
  peacock: 386,
  "paramount-plus": 531,
};

export const TMDB_PROVIDER_IDS = Object.values(PROVIDER_SLUG_TO_TMDB_ID);

export function isWorldCinemaMood(moodSlug: string): boolean {
  return moodSlug === WORLD_CINEMA_MOOD_SLUG;
}

export function getMoodGenreIds(
  moodSlug: string,
  mediaType: MediaType = "movie",
): number[] {
  if (isWorldCinemaMood(moodSlug)) return [];
  const map =
    mediaType === "tv" ? MOOD_TO_TV_GENRE_IDS : MOOD_TO_MOVIE_GENRE_IDS;
  return map[moodSlug] ?? [];
}

export function isValidMoodSlug(moodSlug: string): boolean {
  return (
    isWorldCinemaMood(moodSlug) ||
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
  return PROVIDER_SLUG_TO_TMDB_ID[slugOrId];
}
