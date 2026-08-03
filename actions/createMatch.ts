"use server";

import { createClient } from "@/lib/supabase-server";

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

export async function createMatch(input: CreateMatchInput): Promise<string> {
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
    throw new Error("Missing required match fields");
  }

  const supabase = await createClient();

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
      return code;
    }

    // Unique violation — try another code
    if (error.code === "23505") {
      continue;
    }

    throw new Error(error.message || "Failed to create match");
  }

  throw new Error("Could not generate a unique match code");
}
