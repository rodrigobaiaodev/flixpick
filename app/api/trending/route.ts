import { NextResponse } from "next/server";
import {
  getTrendingAll,
  getTVWatchProviders,
  getWatchProviders,
} from "@/lib/tmdb";
import type { ContentItem } from "@/types/movie";

export const revalidate = 3600;

export async function GET() {
  try {
    const trending = await getTrendingAll("day");

    const itemsWithWatch: ContentItem[] = await Promise.all(
      trending.results.map(async (item) => {
        const availability =
          item.mediaType === "tv"
            ? await getTVWatchProviders(item.id)
            : await getWatchProviders(item.id);
        return { ...item, availability };
      }),
    );

    return NextResponse.json(
      {
        movies: itemsWithWatch,
        page: trending.page,
        totalResults: trending.totalResults,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    );
  } catch (error) {
    console.error("[api/trending]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
