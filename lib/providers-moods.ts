import type { MediaType } from "@/types/movie";
import {
  getAllTmdbDiscoverIds,
  STREAMING_PLATFORMS,
  getTmdbDiscoverIds,
} from "@/lib/streaming-platforms";
import { getMoodDefinition, MOOD_DEFINITIONS } from "@/lib/moods";

/** Mood slug → TMDB movie genre IDs (comma-AND on discover). */
export const MOOD_TO_MOVIE_GENRE_IDS: Record<string, number[]> =
  Object.fromEntries(
    MOOD_DEFINITIONS.map((mood) => [mood.slug, mood.movieGenres]),
  );

/** Mood slug → TMDB TV genre IDs. */
export const MOOD_TO_TV_GENRE_IDS: Record<string, number[]> = Object.fromEntries(
  MOOD_DEFINITIONS.map((mood) => [mood.slug, mood.tvGenres]),
);

/** @deprecated Use MOOD_TO_MOVIE_GENRE_IDS */
export const MOOD_TO_GENRE_IDS = MOOD_TO_MOVIE_GENRE_IDS;

/** Uses original_language !== "en" instead of genre IDs. */
export const WORLD_CINEMA_MOOD_SLUG = "world-cinema";

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

export function isWorldCinemaMood(moodSlug: string): boolean {
  return moodSlug === WORLD_CINEMA_MOOD_SLUG;
}

export function getMoodGenreIds(
  moodSlug: string,
  mediaType: MediaType = "movie",
): number[] {
  if (isWorldCinemaMood(moodSlug)) return [];

  const mood = getMoodDefinition(moodSlug);
  if (mood) {
    return mediaType === "tv" ? mood.tvGenres : mood.movieGenres;
  }

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
  const platform = STREAMING_PLATFORMS.find((p) => p.id === slugOrId);
  if (platform) return getTmdbDiscoverIds(platform)[0];
  return PROVIDER_SLUG_TO_TMDB_ID[slugOrId];
}
