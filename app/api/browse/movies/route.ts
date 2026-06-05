import { NextResponse } from "next/server";
import { browseDiscoverMovies, type BrowseSort } from "@/lib/tmdb";

export const revalidate = 300;

const VALID_SORTS: BrowseSort[] = ["popular", "top_rated", "new"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");
    const genreId = searchParams.get("genre")
      ? Number(searchParams.get("genre"))
      : undefined;
    const sort = (searchParams.get("sort") ?? "popular") as BrowseSort;

    if (!VALID_SORTS.includes(sort)) {
      return NextResponse.json({ error: "Invalid sort" }, { status: 400 });
    }

    const result = await browseDiscoverMovies({
      genreId: genreId && !Number.isNaN(genreId) ? genreId : undefined,
      sort,
      page: Number.isNaN(page) ? 1 : page,
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[api/browse/movies]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
