"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Movie } from "@/types/movie";
import type { MovieCardProps } from "@/types/ui";
import { cn } from "@/lib/utils";

const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect fill='%2312121a' width='500' height='750'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23475569' font-family='sans-serif' font-size='24'%3ENo Poster%3C/text%3E%3C/svg%3E";

const CARD_HEIGHT = "h-[420px]";
const CARD_WIDTH = "w-[200px]";

export const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export function getGenreDisplayName(id: number, fallbackName?: string): string {
  if (GENRE_MAP[id]) return GENRE_MAP[id];
  if (fallbackName && !/^Genre \d+$/.test(fallbackName)) return fallbackName;
  return "Unknown";
}

export function movieSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "movie";
}

const GENRE_PILL_COLORS = [
  "bg-rose-500/20 text-rose-200 ring-rose-500/30",
  "bg-amber-500/20 text-amber-200 ring-amber-500/30",
  "bg-emerald-500/20 text-emerald-200 ring-emerald-500/30",
  "bg-sky-500/20 text-sky-200 ring-sky-500/30",
  "bg-violet-500/20 text-violet-200 ring-violet-500/30",
  "bg-orange-500/20 text-orange-200 ring-orange-500/30",
] as const;

function getPosterUrl(posterPath: string | null): string {
  if (!posterPath) return PLACEHOLDER_POSTER;
  if (posterPath.startsWith("http")) return posterPath;
  return `${TMDB_POSTER_BASE}${posterPath}`;
}

function getReleaseYear(releaseDate: string): string {
  return releaseDate?.slice(0, 4) || "—";
}

function StarRating({ rating }: { rating: number }) {
  const normalized = Math.max(0, Math.min(10, rating)) / 2;
  const fullStars = Math.floor(normalized);
  const hasHalf = normalized - fullStars >= 0.25 && normalized - fullStars < 0.75;
  const displayRating = rating > 0 ? rating.toFixed(1) : "—";

  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-300">
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
      <div className="h-[65%] w-full animate-pulse bg-white/10" />
      <div className="flex flex-1 flex-col gap-2 p-3">
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

  const year = getReleaseYear(movie.releaseDate);
  const posterUrl = getPosterUrl(movie.posterPath);
  const detailHref = `/movie/${movie.id}/${movieSlug(movie.title)}`;
  const watchHref = `${detailHref}#where-to-watch`;

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
        className="relative block h-[65%] w-full shrink-0 overflow-hidden"
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12121a]/80 via-transparent to-transparent" />
      </Link>

      <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        <div className="min-h-0 flex-1">
          <Link href={detailHref}>
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white hover:text-[#e50914]">
              {movie.title}
            </h3>
          </Link>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-slate-400">{year}</span>
            <span className="text-white/20">•</span>
            <StarRating rating={movie.voteAverage} />
          </div>

          {movie.genres.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1" aria-label="Genres">
              {movie.genres.slice(0, 2).map((genre, index) => (
                <li key={genre.id}>
                  <span
                    className={cn(
                      "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                      GENRE_PILL_COLORS[index % GENRE_PILL_COLORS.length],
                    )}
                  >
                    {getGenreDisplayName(genre.id, genre.name)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!hideActions && (
          <div className="mt-auto flex flex-col gap-1.5">
            <Link
              href={watchHref}
              className="flex h-8 items-center justify-center rounded-lg bg-[#e50914] text-xs font-semibold text-white transition-colors hover:bg-[#f6121d]"
            >
              Where to Watch
            </Link>
            <Link
              href={detailHref}
              className="flex h-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-xs font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/10"
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
