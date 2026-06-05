import { NextResponse } from "next/server";
import { enrichStreamingPlatforms } from "@/lib/tmdb-providers";

export const revalidate = 86400;

export async function GET() {
  try {
    const platforms = await enrichStreamingPlatforms();

    return NextResponse.json(
      { platforms },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=172800",
        },
      },
    );
  } catch (error) {
    console.error("[api/providers]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
