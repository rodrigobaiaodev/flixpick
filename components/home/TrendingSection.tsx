"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Flame, Star, TrendingUp } from "lucide-react";
import {
  getGenreDisplayName,
  movieSlug,
  MovieCardSkeleton,
} from "@/components/shared/MovieCard";
import { TmdbProviderLogo } from "@/components/shared/TmdbProviderLogo";
import { useTranslations } from "@/components/shared/LocaleProvider";
import type { ContentItem } from "@/types/movie";
import { cn } from "@/lib/utils";

interface TrendingSectionProps {
  movies: ContentItem[];
  loading: boolean;
  error: string | null;
}

function getPrimaryProvider(movie: ContentItem) {
  const us = movie.availability.find((a) => a.region === "US");
  return us?.options.find((o) => o.type === "flatrate")?.provider ?? null;
}

function TrendingCard({
  movie,
  rank,
}: {
  movie: ContentItem;
  rank: number;
}) {
  const t = useTranslations();
  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w342${movie.posterPath}`
    : null;
  const href = `/${movie.mediaType}/${movie.id}/${movieSlug(movie.title)}`;
  const year = movie.releaseDate?.slice(0, 4) || "—";
  const genre = movie.genres[0]
    ? getGenreDisplayName(movie.genres[0].id)
    : null;
  const provider = getPrimaryProvider(movie);

  return (
    <article className="group relative w-[155px] shrink-0 snap-start sm:w-[190px] md:w-[210px]">
      <Link href={href} className="block">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12121a] shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:border-[#e50914]/30 group-hover:shadow-[0_12px_40px_rgba(229,9,20,0.12)]">
          <div className="relative aspect-[2/3] overflow-hidden">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="210px"
                unoptimized
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-white/5 text-slate-600">
                No poster
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <span
              className={cn(
                "absolute left-2.5 top-2.5 flex size-8 items-center justify-center rounded-xl text-sm font-bold shadow-lg",
                rank <= 3
                  ? "bg-gradient-to-br from-[#e50914] to-[#b20710] text-white"
                  : "border border-white/20 bg-black/60 text-slate-200 backdrop-blur-sm",
              )}
            >
              {rank}
            </span>

            {movie.voteAverage > 0 && (
              <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-xl border border-white/15 bg-black/55 px-2 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-sm">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {movie.voteAverage.toFixed(1)}
              </span>
            )}

            {provider && (
              <span className="absolute bottom-2.5 right-2.5 overflow-hidden rounded-lg border border-white/15 bg-black/50 p-0.5 backdrop-blur-sm">
                <TmdbProviderLogo
                  logoPath={provider.logoPath}
                  name={provider.name}
                  tmdbProviderId={provider.id}
                  size={22}
                  className="rounded-md"
                />
              </span>
            )}
          </div>

          <div className="space-y-1.5 p-3.5">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white transition group-hover:text-[#ff6b6b]">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>{year}</span>
              {genre && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="truncate">{genre}</span>
                </>
              )}
            </div>
            {movie.popularity > 0 && (
              <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-emerald-400/80">
                <TrendingUp className="size-3" />
                {t("common.hotThisWeek")}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function TrendingSection({
  movies,
  loading,
  error,
}: TrendingSectionProps) {
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setScroll({
      canScrollLeft: scrollLeft > 8,
      canScrollRight: scrollLeft < scrollWidth - clientWidth - 8,
    });
  }, []);

  const scrollBy = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    updateScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [movies, loading, updateScroll]);

  return (
    <section className="border-t border-white/5 bg-[#07070b] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative pl-1">
            <div className="absolute -left-1 top-0 h-full w-1 rounded-full bg-gradient-to-b from-[#e50914] to-[#e50914]/20 shadow-[0_0_24px_rgba(229,9,20,0.5)]" />
            <div className="flex items-center gap-2">
              <Flame className="size-5 text-[#e50914]" />
              <h2 className="font-[family-name:var(--font-display)] tracking-wide text-slate-100">
                {t("home.trendingTitle")}
              </h2>
            </div>
            <p className="mt-2 max-w-lg text-sm text-slate-500">
              {t("home.trendingDesc")}
            </p>
          </div>
          <Link
            href="/browse"
            className="inline-flex min-h-[40px] items-center justify-center self-start rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] sm:self-auto"
          >
            {t("common.exploreAll")}
          </Link>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
          >
            {error}
          </p>
        )}

        <div className="relative rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-4 sm:p-5">
          {scroll.canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollBy("left")}
              aria-label="Scroll trending left"
              className="absolute -left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/15 bg-[#0a0a0f]/95 text-slate-200 shadow-xl backdrop-blur-sm transition hover:border-white/30 hover:bg-[#12121a] sm:left-2"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
          {scroll.canScrollRight && (
            <button
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="Scroll trending right"
              className="absolute -right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/15 bg-[#0a0a0f]/95 text-slate-200 shadow-xl backdrop-blur-sm transition hover:border-white/30 hover:bg-[#12121a] sm:right-2"
            >
              <ChevronRight className="size-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
          >
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <MovieCardSkeleton
                  key={`trending-skeleton-${i}`}
                  className="w-[155px] shrink-0 snap-start sm:w-[190px] md:w-[210px]"
                />
              ))}

            {!loading &&
              movies.map((movie, index) => (
                <TrendingCard
                  key={movie.id}
                  movie={movie}
                  rank={index + 1}
                />
              ))}

            {!loading && !error && movies.length === 0 && (
              <p className="snap-start py-8 text-slate-500">
                No trending titles right now.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
