"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  getGenreDisplayName,
  GENRE_MAP,
  movieSlug,
} from "@/lib/genres";
import { getWhereToWatchUrlForMovie } from "@/lib/watch-links";
import type { Movie } from "@/types/movie";
import type { MovieCardProps } from "@/types/ui";
import { cn } from "@/lib/utils";

const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect fill='%2312121a' width='500' height='750'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23475569' font-family='sans-serif' font-size='24'%3ENo Poster%3C/text%3E%3C/svg%3E";

const CARD_HEIGHT = "h-[420px]";
const CARD_WIDTH = "w-[200px]";
const POSTER_HEIGHT = "h-[280px]";
const INFO_HEIGHT = "h-[140px]";

export { GENRE_MAP, getGenreDisplayName, movieSlug };

function getPosterUrl(posterPath: string | null): string {
  if (!posterPath) return PLACEHOLDER_POSTER;
  if (posterPath.startsWith("http")) return posterPath;
  return `${TMDB_POSTER_BASE}${posterPath}`;
}

function getReleaseYear(releaseDate: string): string {
  return releaseDate?.slice(0, 4) || "—";
}

function StarRating({ rating }: { rating: number }) {
  const displayRating = rating > 0 ? rating.toFixed(1) : "—";

  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-slate-300">
      <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
      {displayRating}
    </span>
  );
}

export interface MovieCardExtendedProps extends MovieCardProps {
  hideActions?: boolean;
}

export type MovieCardComponentProps =
  | (MovieCardExtendedProps & { loading?: false })
  | { loading: true; className?: string };

function MovieCardSkeleton({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]",
        CARD_HEIGHT,
        CARD_WIDTH,
        "max-w-none shrink-0",
        className,
      )}
      aria-hidden
    >
      <div className={cn(POSTER_HEIGHT, "w-full shrink-0 animate-pulse bg-white/10")} />
      <div className={cn(INFO_HEIGHT, "flex shrink-0 flex-col gap-2 p-3")}>
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
        <div className="mt-auto h-8 animate-pulse rounded-lg bg-white/10" />
      </div>
    </article>
  );
}

export function MovieCard(props: MovieCardComponentProps) {
  if (props.loading) {
    return <MovieCardSkeleton className={props.className} />;
  }

  const { movie, priority = false, className, hideActions = false } = props;

  const isTV = movie.mediaType === "tv";
  const year = getReleaseYear(movie.releaseDate);
  const posterUrl = getPosterUrl(movie.posterPath);
  const detailBase = isTV ? "tv" : "movie";
  const detailHref = `/${detailBase}/${movie.id}/${movieSlug(movie.title)}`;
  const metaLabel = isTV
    ? movie.numberOfSeasons
      ? `${movie.numberOfSeasons} S`
      : year
    : year;

  const [watchHref, setWatchHref] = useState(() =>
    getWhereToWatchUrlForMovie(movie),
  );

  useEffect(() => {
    const localUrl = getWhereToWatchUrlForMovie(movie);
    const hasProviders = movie.availability.some((region) =>
      region.options.some((o) => o.type === "flatrate"),
    );

    if (hasProviders) {
      setWatchHref(localUrl);
      return;
    }

    let cancelled = false;

    async function fetchWatchUrl() {
      try {
        const params = new URLSearchParams({
          id: String(movie.id),
          title: movie.title,
          mediaType: movie.mediaType,
        });
        const response = await fetch(`/api/watch-url?${params.toString()}`);
        if (!response.ok) return;
        const data = (await response.json()) as { url?: string };
        if (!cancelled && data.url) {
          setWatchHref(data.url);
        }
      } catch {
        /* keep JustWatch fallback */
      }
    }

    void fetchWatchUrl();
    return () => {
      cancelled = true;
    };
  }, [movie]);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12121a] shadow-lg",
        "transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/40",
        CARD_HEIGHT,
        CARD_WIDTH,
        "max-w-none shrink-0",
        className,
      )}
    >
      <Link
        href={detailHref}
        className={cn("relative block w-full shrink-0 overflow-hidden", POSTER_HEIGHT)}
      >
        <Image
          src={posterUrl}
          alt={`${movie.title} poster`}
          fill
          sizes="200px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          unoptimized={posterUrl.startsWith("https://")}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12121a]/60 via-transparent to-transparent" />
        <span
          className={cn(
            "absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            isTV ? "bg-sky-500/90 text-white" : "bg-[#e50914]/90 text-white",
          )}
        >
          {isTV ? "TV" : "Movie"}
        </span>
      </Link>

      <div
        className={cn(
          "flex shrink-0 flex-col overflow-hidden p-3",
          INFO_HEIGHT,
        )}
      >
        <Link href={detailHref} className="shrink-0">
          <h3 className="line-clamp-2 overflow-hidden text-ellipsis text-sm font-bold leading-snug text-white hover:text-[#e50914]">
            {movie.title}
          </h3>
        </Link>

        <div className="mt-1 flex shrink-0 items-center gap-2 overflow-hidden text-xs whitespace-nowrap">
          <span className="truncate text-slate-400">{metaLabel}</span>
          <span className="text-white/20">•</span>
          <StarRating rating={movie.voteAverage} />
        </div>

        {!hideActions && (
          <div className="mt-auto flex shrink-0 flex-col gap-1.5 pt-2">
            <a
              href={watchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 shrink-0 items-center justify-center rounded-lg bg-[#e50914] text-xs font-semibold text-white transition-colors hover:bg-[#f6121d]"
            >
              Where to Watch
            </a>
            <Link
              href={detailHref}
              className="flex h-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-xs font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/10"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

export { MovieCardSkeleton };
