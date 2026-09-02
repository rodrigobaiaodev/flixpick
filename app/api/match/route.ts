import { NextResponse } from "next/server";
import { ensureMatchesTable } from "@/lib/ensure-matches-table";
import { createServiceSupabase } from "@/lib/supabase-service";

const CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const CODE_LENGTH = 8;
const MAX_ATTEMPTS = 8;

function generateMatchCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

async function insertMatch(row: {
  code: string;
  movie_id: number;
  movie_title: string;
  mood: string;
  platforms: string[];
  media_type: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
}) {
  const supabase = createServiceSupabase();

  const full = {
    code: row.code,
    movie_id: row.movie_id,
    movie_title: row.movie_title,
    mood: row.mood,
    platforms: row.platforms,
    media_type: row.media_type,
    poster_path: row.poster_path ?? null,
    backdrop_path: row.backdrop_path ?? null,
  };

  const minimal = {
    code: row.code,
    movie_id: row.movie_id,
    movie_title: row.movie_title,
    mood: row.mood,
    platforms: row.platforms,
    media_type: row.media_type,
  };

  const first = await supabase.from("matches").insert(full);
  if (!first.error) return first;

  if (
    first.error.message.includes("backdrop_path") ||
    first.error.message.includes("poster_path") ||
    first.error.message.includes("schema cache")
  ) {
    return supabase.from("matches").insert(minimal);
  }

  return first;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      contentId?: number;
      contentTitle?: string;
      posterPath?: string | null;
      backdropPath?: string | null;
      mood?: string;
      platforms?: string[];
      mediaType?: "movie" | "tv";
    };

    const {
      contentId,
      contentTitle,
      posterPath,
      backdropPath,
      mood,
      platforms = [],
      mediaType = "movie",
    } = body;

    if (!contentId || !contentTitle?.trim() || !mood?.trim()) {
      return NextResponse.json(
        { error: "Missing required match fields" },
        { status: 400 },
      );
    }

    const row = {
      movie_id: contentId,
      movie_title: contentTitle.trim(),
      poster_path: posterPath ?? null,
      backdrop_path: backdropPath ?? null,
      mood: mood.trim(),
      platforms,
      media_type: mediaType === "tv" ? "tv" : "movie",
    };

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const code = generateMatchCode();
      const { error } = await insertMatch({ code, ...row });

      if (!error) {
        return NextResponse.json({ code });
      }

      if (error.code === "23505") {
        continue;
      }

      if (error.code === "42P01") {
        await ensureMatchesTable();
        const retry = await insertMatch({ code, ...row });
        if (!retry.error) {
          return NextResponse.json({ code });
        }
      }

      console.error("[api/match] insert failed:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create match", fallback: true },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: "Could not generate a unique match code", fallback: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("[api/match]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message, fallback: true }, { status: 200 });
  }
}
