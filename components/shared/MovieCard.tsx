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
import { ListButton } from "@/components/shared/ListButton";
import { TmdbProviderLogo } from "@/components/shared/TmdbProviderLogo";
import type { ContentItem } from "@/types/movie";
import type { MovieCardProps } from "@/types/ui";
import { cn } from "@/lib/utils";

const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect fill='%2312121a' width='500' height='750'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23475569' font-family='sans-serif' font-size='24'%3ENo Poster%3C/text%3E%3C/svg%3E";

export { GENRE_MAP, getGenreDisplayName, movieSlug };

function getPosterUrl(posterPath: string | null): string {
  if (!posterPath) return PLACEHOLDER_POSTER;
  if (posterPath.startsWith("http")) return posterPath;
  return `${TMDB_POSTER_BASE}${posterPath}`;
}

function getReleaseYear(releaseDate: string): string {
  return releaseDate?.slice(0, 4) || "—";
}

function getPrimaryProvider(movie: ContentItem) {
  const usAvailability = movie.availability.find((a) => a.region === "US");
  const flatrate = usAvailability?.options.find((o) => o.type === "flatrate");
  return flatrate?.provider ?? null;
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
        "flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]",
        className,
      )}
      aria-hidden
    >
      <div className="aspect-[2/3] w-full animate-pulse bg-white/10" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="h-8 animate-pulse rounded-lg bg-white/10" />
      </div>
    </article>
  );
}

export function MovieCard(props: MovieCardComponentProps) {
  if (props.loading) {
    return <MovieCardSkeleton className={props.className} />;
  }

  const {
    movie,
    priority = false,
    className,
    hideActions = false,
    showAvailability = false,
  } = props;

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
  const primaryGenre = movie.genres[0];
  const primaryProvider = showAvailability ? getPrimaryProvider(movie) : null;

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
        "group flex w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#12121a] shadow-lg sm:overflow-visible sm:rounded-2xl",
        "transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/40",
        className,
      )}
    >
      <Link
        href={detailHref}
        className="relative block aspect-[2/3] w-full overflow-hidden"
      >
        <Image
          src={posterUrl}
          alt={`${movie.title} poster`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          unoptimized={posterUrl.startsWith("https://")}
        />

        {/* Synopsis overlay — hover on desktop only */}
        {movie.overview && (
          <div className="pointer-events-none absolute inset-0 hidden items-end bg-black/85 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
            <p className="line-clamp-6 text-xs leading-relaxed text-slate-200">
              {movie.overview}
            </p>
          </div>
        )}

        {/* Rating badge — top left */}
        <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
          {movie.voteAverage > 0 ? movie.voteAverage.toFixed(1) : "—"}
        </span>

        {/* Platform badge — top right */}
        {primaryProvider && (
          <span className="absolute right-2 top-2 z-10">
            <TmdbProviderLogo
              logoPath={primaryProvider.logoPath}
              name={primaryProvider.name}
              tmdbProviderId={primaryProvider.id}
              size={28}
              className="shadow-lg"
            />
          </span>
        )}

        {/* List button — bottom right */}
        <ListButton
          contentId={movie.id}
          contentType={movie.mediaType}
          contentData={{
            contentTitle: movie.title,
            posterPath: movie.posterPath,
            backdropPath: movie.backdropPath,
            rating: movie.voteAverage,
          }}
          variant="card"
          className="absolute bottom-14 right-2"
        />

        {/* Title overlay — bottom gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-2 pb-2 pt-10 sm:px-3 sm:pb-3 sm:pt-12">
          <h3 className="line-clamp-2 font-[family-name:var(--font-display)] text-xs font-bold leading-snug tracking-wide text-white sm:line-clamp-3 sm:text-sm">
            {movie.title}
          </h3>
        </div>
      </Link>

      <div className="flex flex-col gap-1.5 p-2 sm:gap-2 sm:p-3">
        <div className="flex flex-wrap items-center gap-1 text-[10px] text-slate-400 sm:gap-1.5 sm:text-xs">
          <span>{metaLabel}</span>
          <span className="text-white/20">•</span>
          <StarRating rating={movie.voteAverage} />
          {primaryGenre && (
            <>
              <span className="hidden text-white/20 sm:inline">•</span>
              <span className="hidden rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-300 sm:inline">
                {getGenreDisplayName(primaryGenre.id, primaryGenre.name)}
              </span>
            </>
          )}
        </div>

        {!hideActions && (
          <div className="flex gap-1.5 sm:gap-2">
            <a
              href={watchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-compact flex min-h-[40px] flex-1 items-center justify-center rounded-lg bg-[#e50914] text-[11px] font-semibold text-white transition-colors hover:bg-[#f6121d] sm:min-h-[44px] sm:text-xs"
            >
              ▶ Watch
            </a>
            <Link
              href={detailHref}
              className="btn-compact flex min-h-[40px] flex-1 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-[11px] font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/10 sm:min-h-[44px] sm:text-xs"
            >
              Details
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

export { MovieCardSkeleton };
