import { NextResponse } from "next/server";
import { getTrendingMovies, getWatchProviders } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";

export const revalidate = 3600;

export async function GET() {
  try {
    const trending = await getTrendingMovies("day");

    const moviesWithWatch: Movie[] = await Promise.all(
      trending.results.map(async (movie) => {
        const availability = await getWatchProviders(movie.id);
        return { ...movie, availability };
      }),
    );

    return NextResponse.json(
      {
        movies: moviesWithWatch,
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
