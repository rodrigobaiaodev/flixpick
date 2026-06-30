import { NextResponse } from "next/server";
import { isValidMoodSlug } from "@/lib/providers-moods";
import {
  STREAMING_PLATFORMS,
  getTmdbDiscoverIds,
} from "@/lib/streaming-platforms";
import { browseByProvider } from "@/lib/tmdb";
import type { MediaType } from "@/types/movie";

export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerSlug = searchParams.get("provider");
    const mood = searchParams.get("mood") ?? undefined;
    const mediaType = (searchParams.get("mediaType") ?? "movie") as MediaType;
    const page = Number(searchParams.get("page") ?? "1");

    if (!providerSlug) {
      return NextResponse.json(
        { error: "Missing provider parameter" },
        { status: 400 },
      );
    }

    const platform = STREAMING_PLATFORMS.find((p) => p.id === providerSlug);
    const providerIds = platform ? getTmdbDiscoverIds(platform) : [];
    if (!platform || providerIds.length === 0) {
      return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
    }

    if (mood && !isValidMoodSlug(mood)) {
      return NextResponse.json({ error: "Unknown mood" }, { status: 400 });
    }

    if (mediaType !== "movie" && mediaType !== "tv") {
      return NextResponse.json({ error: "Invalid mediaType" }, { status: 400 });
    }

    const result = await browseByProvider({
      providerId: providerIds,
      mediaType,
      moodSlug: mood,
      page: Number.isNaN(page) ? 1 : page,
    });

    return NextResponse.json(
      { ...result, platform },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("[api/browse/provider]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
