import { NextResponse } from "next/server";
import { browseDiscoverMovies } from "@/lib/tmdb";
import type { ContentItem } from "@/types/movie";

export const revalidate = 3600;

export async function GET() {
  try {
    const featured: ContentItem[] = [];

    for (let page = 1; page <= 5 && featured.length < 6; page++) {
      const data = await browseDiscoverMovies({ sort: "top_rated", page });
      for (const movie of data.results) {
        if (movie.voteAverage >= 8.0 && movie.voteCount >= 1000) {
          featured.push(movie);
          if (featured.length >= 6) break;
        }
      }
    }

    return NextResponse.json(
      { movies: featured },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    );
  } catch (error) {
    console.error("[api/featured]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
