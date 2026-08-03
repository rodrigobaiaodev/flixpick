import { NextResponse } from "next/server";
import {
  getMoodConfig,
  getMoodExcludeGenreIds,
  isValidMoodSlug,
} from "@/lib/providers-moods";
import {
  buildFullContentPick,
  fetchRecommendCandidates,
} from "@/lib/tmdb";
import type { ContentItem, MediaType, RecommendMediaType } from "@/types/movie";

export const revalidate = 300;

interface RecommendRequestBody {
  mood: string;
  providers: number[];
  minRating?: number;
  excludeIds?: number[];
  mediaType?: RecommendMediaType;
  /** Optional genre refinement from homepage pills. */
  genreId?: number;
}

interface RecommendResponseBody {
  movie: ContentItem;
  trailerUrl: string | null;
  mediaType: MediaType;
}

function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)] ?? null;
}

function pickWeightedByPopularity(candidates: ContentItem[]): ContentItem | null {
  const sorted = [...candidates].sort((a, b) => b.popularity - a.popularity);
  const top = sorted.slice(0, 20);
  return pickRandom(top);
}

const VALID_MEDIA_TYPES: RecommendMediaType[] = ["movie", "tv", "both"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecommendRequestBody;
    const { mood, providers, excludeIds = [], genreId } = body;
    const mediaType: RecommendMediaType = body.mediaType ?? "both";

    if (!mood || typeof mood !== "string") {
      return NextResponse.json(
        { error: "Missing required field: mood" },
        { status: 400 },
      );
    }

    if (!isValidMoodSlug(mood)) {
      return NextResponse.json(
        { error: `Unknown mood: ${mood}` },
        { status: 400 },
      );
    }

    if (!VALID_MEDIA_TYPES.includes(mediaType)) {
      return NextResponse.json(
        { error: "mediaType must be 'movie', 'tv', or 'both'" },
        { status: 400 },
      );
    }

    if (!Array.isArray(providers)) {
      return NextResponse.json(
        { error: "providers must be an array of TMDB provider IDs" },
        { status: 400 },
      );
    }

    const providerIds = providers.filter(
      (id): id is number => typeof id === "number" && id > 0,
    );

    const moodConfig = getMoodConfig(mood);
    const minRating = body.minRating ?? moodConfig?.minRating ?? 7.0;
    const minVotes = moodConfig?.minVotes ?? 500;
    const excludeGenreIds = getMoodExcludeGenreIds(mood);
    const refineGenreId =
      typeof genreId === "number" && genreId > 0 ? genreId : undefined;

    const excludeSet = new Set(
      excludeIds.filter((id): id is number => typeof id === "number"),
    );

    async function loadCandidates(voteFloor: number) {
      const candidates = await fetchRecommendCandidates(
        mood,
        providerIds,
        mediaType,
        {
          targetCount: 60,
          minVotes: voteFloor,
          minRating,
          excludeGenreIds,
          refineGenreId,
        },
      );

      return candidates.filter(
        (item) =>
          item.voteAverage >= minRating && !excludeSet.has(item.id),
      );
    }

    let filtered = await loadCandidates(minVotes);

    // Relax vote threshold if the pool is too small
    if (filtered.length < 5 && minVotes > 200) {
      filtered = await loadCandidates(200);
    }

    if (filtered.length === 0) {
      return NextResponse.json(
        {
          error:
            "No titles matched your filters. Try different platforms, clear exclusions, or another mood.",
        },
        { status: 404 },
      );
    }

    const picked = pickWeightedByPopularity(filtered);
    if (!picked) {
      return NextResponse.json(
        { error: "Unable to select a recommendation." },
        { status: 500 },
      );
    }

    const { movie, trailerUrl } = await buildFullContentPick(
      picked.id,
      picked.mediaType,
      mood,
    );

    const payload: RecommendResponseBody = {
      movie,
      trailerUrl,
      mediaType: movie.mediaType,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[api/recommend]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
