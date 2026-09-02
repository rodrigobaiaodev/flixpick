"use server";

import {
  checkMatchesTableExists,
  ensureMatchesTable,
} from "@/lib/ensure-matches-table";
import { createServiceSupabase } from "@/lib/supabase-service";

export interface CreateMatchInput {
  contentId: number;
  contentTitle: string;
  posterPath: string | null;
  backdropPath: string | null;
  mood: string;
  platforms: string[];
  mediaType: "movie" | "tv";
}

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

export async function createMatch(
  input: CreateMatchInput,
): Promise<{ code: string } | { error: string }> {
  const {
    contentId,
    contentTitle,
    posterPath,
    backdropPath,
    mood,
    platforms,
    mediaType,
  } = input;

  if (!contentId || !contentTitle?.trim() || !mood?.trim()) {
    return { error: "Missing required match fields" };
  }

  try {
    let tableReady = await checkMatchesTableExists();
    if (!tableReady) {
      tableReady = await ensureMatchesTable();
    }
    if (!tableReady) {
      return {
        error:
          "Share is not ready. Run matches.sql in Supabase or add SUPABASE_DB_PASSWORD.",
      };
    }

    const supabase = createServiceSupabase();

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const code = generateMatchCode();

      const { error } = await supabase.from("matches").insert({
        code,
        movie_id: contentId,
        movie_title: contentTitle.trim(),
        poster_path: posterPath,
        backdrop_path: backdropPath,
        mood: mood.trim(),
        platforms,
        media_type: mediaType === "tv" ? "tv" : "movie",
      });

      if (!error) {
        return { code };
      }

      if (error.code === "23505") {
        continue;
      }

      if (error.code === "42P01") {
        return {
          error:
            "Share is not configured yet. Run the matches migration in Supabase.",
        };
      }

      return { error: error.message || "Failed to create match" };
    }

    return { error: "Could not generate a unique match code" };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create match",
    };
  }
}
