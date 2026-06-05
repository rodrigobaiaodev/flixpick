import { NextResponse } from "next/server";
import { resolveWhereToWatchUrl } from "@/lib/watch-links";
import type { MediaType } from "@/types/movie";

export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    const title = searchParams.get("title");
    const mediaType = (searchParams.get("mediaType") ?? "movie") as MediaType;

    if (!id || Number.isNaN(id) || !title) {
      return NextResponse.json(
        { error: "Missing id or title" },
        { status: 400 },
      );
    }

    if (mediaType !== "movie" && mediaType !== "tv") {
      return NextResponse.json({ error: "Invalid mediaType" }, { status: 400 });
    }

    const url = await resolveWhereToWatchUrl(mediaType, id, title);

    return NextResponse.json(
      { url },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    );
  } catch (error) {
    console.error("[api/watch-url]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
