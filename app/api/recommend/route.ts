import { NextResponse } from "next/server";
import { isValidMoodSlug } from "@/lib/providers-moods";
import {
  buildFullMoviePick,
  fetchMoodCandidates,
} from "@/lib/tmdb";
import type { Movie } from "@/types/movie";

export const revalidate = 300;

interface RecommendRequestBody {
  mood: string;
  providers: number[];
  minRating?: number;
  excludeIds?: number[];
}

interface RecommendResponseBody {
  movie: Movie;
  trailerUrl: string | null;
}

function pickRandom<T>(items: T[]): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)] ?? null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecommendRequestBody;
    const { mood, providers, excludeIds = [] } = body;
    const minRating = body.minRating ?? 7.0;

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

    if (!Array.isArray(providers)) {
      return NextResponse.json(
        { error: "providers must be an array of TMDB provider IDs" },
        { status: 400 },
      );
    }

    const providerIds = providers.filter(
      (id): id is number => typeof id === "number" && id > 0,
    );

    const candidates = await fetchMoodCandidates(mood, providerIds, 40);

    const excludeSet = new Set(excludeIds);
    const filtered = candidates.filter(
      (movie) =>
        movie.voteAverage >= minRating && !excludeSet.has(movie.id),
    );

    if (filtered.length === 0) {
      return NextResponse.json(
        {
          error:
            "No movies matched your filters. Try different providers, a lower minRating, or fewer exclusions.",
        },
        { status: 404 },
      );
    }

    const picked = pickRandom(filtered);
    if (!picked) {
      return NextResponse.json(
        { error: "Unable to select a recommendation." },
        { status: 500 },
      );
    }

    const { movie, trailerUrl } = await buildFullMoviePick(picked.id, mood);

    const payload: RecommendResponseBody = { movie, trailerUrl };

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
