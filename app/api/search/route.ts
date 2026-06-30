import { NextResponse } from "next/server";
import {
  STREAMING_PLATFORMS,
  getTmdbDiscoverIds,
} from "@/lib/streaming-platforms";
import {
  contentMatchesProviders,
  enrichContentWithAvailability,
  searchMulti,
} from "@/lib/tmdb";
import type { MediaType } from "@/types/movie";

export const revalidate = 300;

type SearchMediaFilter = "all" | MediaType;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() ?? "";
    const page = Number(searchParams.get("page") ?? "1");
    const mediaType = (searchParams.get("mediaType") ?? "all") as SearchMediaFilter;
    const providerSlug = searchParams.get("provider") ?? "";

    if (!query) {
      return NextResponse.json({ error: "Missing search query" }, { status: 400 });
    }

    if (mediaType !== "all" && mediaType !== "movie" && mediaType !== "tv") {
      return NextResponse.json({ error: "Invalid mediaType" }, { status: 400 });
    }

    const searchResult = await searchMulti(
      query,
      Number.isNaN(page) || page < 1 ? 1 : page,
    );

    let results = searchResult.results;

    if (mediaType !== "all") {
      results = results.filter((item) => item.mediaType === mediaType);
    }

    const platform = providerSlug
      ? STREAMING_PLATFORMS.find((entry) => entry.id === providerSlug)
      : undefined;
    const providerIds = platform ? getTmdbDiscoverIds(platform) : [];

    if (providerIds.length > 0) {
      const enriched = await enrichContentWithAvailability(results.slice(0, 24));
      results = enriched.filter((item) =>
        contentMatchesProviders(item, providerIds),
      );
    }

    return NextResponse.json(
      {
        query,
        results,
        page: searchResult.page,
        totalPages: searchResult.totalPages,
        totalResults: searchResult.totalResults,
        mediaType,
        provider: providerSlug || null,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("[api/search]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
