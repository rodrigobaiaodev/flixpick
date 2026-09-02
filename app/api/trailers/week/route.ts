import { NextResponse } from "next/server";
import { getTrailerYoutubeKey, getTrendingAll } from "@/lib/tmdb";
import type { ContentItem } from "@/types/movie";

export const revalidate = 3600;

export interface WeekTrailerItem extends ContentItem {
  youtubeKey: string;
}

export async function GET() {
  try {
    const trending = await getTrendingAll("week");
    const trailers: WeekTrailerItem[] = [];

    for (const item of trending.results) {
      if (trailers.length >= 10) break;
      const youtubeKey = await getTrailerYoutubeKey(item.mediaType, item.id);
      if (youtubeKey) {
        trailers.push({ ...item, youtubeKey });
      }
    }

    return NextResponse.json(
      { trailers },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    );
  } catch (error) {
    console.error("[api/trailers/week]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
