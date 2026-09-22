"use client";

import Link from "next/link";
import { MovieCard } from "@/components/shared/MovieCard";
import { TmdbProviderLogo } from "@/components/shared/TmdbProviderLogo";
import { useExtraTranslations } from "@/components/shared/LocaleProvider";
import type { StreamingPlatform } from "@/lib/streaming-platforms";
import type { ContentItem } from "@/types/movie";

interface BrowseHubClientProps {
  platforms: StreamingPlatform[];
  trendingItems: ContentItem[];
}

export function BrowseHubClient({
  platforms,
  trendingItems,
}: BrowseHubClientProps) {
  const te = useExtraTranslations();

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 sm:mb-12">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white sm:text-4xl lg:text-5xl">
            {te("browse.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            {te("browse.subtitle")}
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <Link
              href="/browse/movies"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-[#e50914] px-4 font-semibold text-white transition hover:bg-[#f6121d]"
            >
              {te("browse.allMovies")}
            </Link>
            <Link
              href="/browse/tv"
              className="inline-flex min-h-[44px] items-center rounded-lg border border-white/15 bg-white/5 px-4 font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/10"
            >
              {te("browse.allTv")}
            </Link>
          </div>
        </header>

        <section className="mb-14 sm:mb-16">
          <h2 className="mb-6 border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-xl tracking-wide text-white sm:text-2xl">
            {te("browse.platforms")}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {platforms.map((platform) => (
              <Link
                key={platform.id}
                href={`/browse/${platform.id}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.06] sm:gap-4 sm:p-6"
                style={{
                  boxShadow: `0 0 0 1px transparent, 0 8px 32px ${platform.brandColor}15`,
                }}
              >
                <TmdbProviderLogo
                  logoUrl={platform.logoUrl}
                  name={platform.name}
                  tmdbProviderId={platform.tmdbProviderId}
                  fallbackLabel={platform.fallbackLabel}
                  fallbackBackground={platform.fallbackBackground}
                  size={56}
                />
                <span className="text-center text-xs font-semibold text-white group-hover:text-[#e50914] sm:text-sm">
                  {platform.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-xl tracking-wide text-white sm:text-2xl">
              {te("browse.trending")}
            </h2>
            <div className="flex gap-4 pl-5 text-sm sm:pl-0">
              <Link
                href="/browse/movies"
                className="text-slate-400 transition hover:text-white"
              >
                {te("browse.allMovies")} →
              </Link>
              <Link
                href="/browse/tv"
                className="text-slate-400 transition hover:text-white"
              >
                {te("browse.allTv")} →
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {trendingItems.map((item, index) => (
              <MovieCard
                key={`${item.mediaType}-${item.id}`}
                movie={item}
                priority={index < 6}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
