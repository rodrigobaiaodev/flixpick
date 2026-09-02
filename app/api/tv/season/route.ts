import { NextResponse } from "next/server";
import { getTVSeason } from "@/lib/tmdb";

export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tvId = Number(searchParams.get("tvId"));
  const season = Number(searchParams.get("season"));

  if (!tvId || !season || season < 0) {
    return NextResponse.json(
      { error: "tvId and season are required" },
      { status: 400 },
    );
  }

  try {
    const data = await getTVSeason(tvId, season);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
      },
    });
  } catch (error) {
    console.error("[api/tv/season]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
