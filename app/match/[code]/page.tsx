import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { AdBanner } from "@/components/shared/AdBanner";
import { getMoodDefinition } from "@/lib/moods";
import { movieSlug } from "@/lib/genres";
import { createClient } from "@/lib/supabase-server";
import { getMovieDetails, getTVDetails } from "@/lib/tmdb";
import type { ContentItem } from "@/types/movie";

const AD_CLIENT = "ca-pub-XXXXXXXX";
const SITE_URL = "https://flixpick.app";
const TMDB_IMAGE = "https://image.tmdb.org/t/p";

interface MatchPageProps {
  params: Promise<{ code: string }>;
}

interface MatchRow {
  code: string;
  movie_id: number;
  movie_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  mood: string;
  platforms: string[] | null;
  media_type: string | null;
}

function tmdbPath(path: string | null, size: string): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${TMDB_IMAGE}/${size}${path}`;
}

async function getMatchByCode(code: string): Promise<MatchRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matches")
    .select(
      "code, movie_id, movie_title, poster_path, backdrop_path, mood, platforms, media_type",
    )
    .eq("code", code.toLowerCase())
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

async function loadDetails(match: MatchRow): Promise<ContentItem | null> {
  try {
    if (match.media_type === "tv") {
      return await getTVDetails(match.movie_id);
    }
    return await getMovieDetails(match.movie_id);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: MatchPageProps): Promise<Metadata> {
  const { code } = await params;
  const match = await getMatchByCode(code);

  if (!match) {
    return { title: "Match Not Found" };
  }

  const mood = getMoodDefinition(match.mood);
  const title = `FlixPick chose ${match.movie_title} — do you agree?`;
  const description = mood
    ? `Tonight's ${mood.label.toLowerCase()} pick is ${match.movie_title}. Agree or roll your own on flixpick.app.`
    : `FlixPick chose ${match.movie_title} for movie night. Agree or roll your own pick.`;

  const ogImage =
    tmdbPath(match.backdrop_path, "w1280") ??
    tmdbPath(match.poster_path, "w780");

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/match/${match.code}`,
      type: "website",
      siteName: "flixpick.app",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1280,
              height: 720,
              alt: match.movie_title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { code } = await params;
  const match = await getMatchByCode(code);

  if (!match) {
    notFound();
  }

  const details = await loadDetails(match);
  const mood = getMoodDefinition(match.mood);
  const mediaType = match.media_type === "tv" ? "tv" : "movie";
  const title = details?.title ?? match.movie_title;
  const overview =
    details?.overview ||
    "FlixPick picked this title for a shared movie night. Agree with the pick or roll your own.";
  const voteAverage = details?.voteAverage ?? 0;
  const year = (details?.releaseDate ?? "").slice(0, 4);
  const genres = details?.genres?.slice(0, 4) ?? [];

  const backdropUrl =
    tmdbPath(details?.backdropPath ?? match.backdrop_path, "w1280") ??
    tmdbPath(match.poster_path, "w780");
  const posterUrl = tmdbPath(
    details?.posterPath ?? match.poster_path,
    "w500",
  );

  const detailHref = `/${mediaType}/${match.movie_id}/${movieSlug(title)}`;
  const homeWithMoodHref = `/?mood=${encodeURIComponent(match.mood)}`;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <section className="relative min-h-[70vh] w-full overflow-hidden">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt=""
            fill
            className="object-cover"
            unoptimized
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/90 to-[#0a0a0f]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-end sm:px-6 sm:py-16 lg:px-8">
          {posterUrl && (
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[200px] shrink-0 overflow-hidden rounded-xl border border-white/15 shadow-2xl sm:mx-0 sm:max-w-[240px]">
              <Image
                src={posterUrl}
                alt={`${title} poster`}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          )}

          <div className="flex-1 text-center sm:pb-2 sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e50914]">
              Friend challenge
              {mood ? ` · ${mood.label}` : ""}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-wide text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-200 sm:justify-start">
              {year && <span>{year}</span>}
              {voteAverage > 0 && (
                <>
                  <span className="text-white/20">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {voteAverage.toFixed(1)}
                  </span>
                </>
              )}
              <span className="text-white/20">•</span>
              <span className="capitalize text-slate-300">{mediaType}</span>
              {genres.map((g) => (
                <span
                  key={g.id}
                  className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-200"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-200/90 sm:text-base">
              {overview}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={detailHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#e50914] px-8 text-sm font-semibold text-white transition hover:bg-[#f6121d]"
              >
                I Agree!
              </Link>
              <Link
                href={homeWithMoodHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                Roll My Own Pick
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <AdBanner adClient={AD_CLIENT} adSlot="6666666666" className="mb-8" />
        <p className="text-center text-sm text-slate-500">
          Shared via flixpick.app · Code {match.code.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
