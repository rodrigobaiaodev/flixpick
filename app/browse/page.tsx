import type { Metadata } from "next";
import Link from "next/link";
import { MovieCard } from "@/components/shared/MovieCard";
import { TmdbProviderLogo } from "@/components/shared/TmdbProviderLogo";
import { enrichStreamingPlatforms } from "@/lib/tmdb-providers";
import { getTrendingAll } from "@/lib/tmdb";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Browse Movies & TV Shows",
  description:
    "Browse movies and TV shows by streaming platform on flixpick.app. Explore Netflix, Prime Video, Max, Disney+, and more — plus what's trending now.",
  alternates: {
    canonical: "https://flixpick.app/browse",
  },
  openGraph: {
    title: "Browse Movies & TV Shows | flixpick.app",
    description:
      "Explore streaming catalogs and trending titles across major platforms.",
    url: "https://flixpick.app/browse",
  },
};

export default async function BrowsePage() {
  const [platforms, trending] = await Promise.all([
    enrichStreamingPlatforms(),
    getTrendingAll("day"),
  ]);

  const trendingItems = trending.results.slice(0, 18);

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 sm:mb-12">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white sm:text-4xl lg:text-5xl">
            Browse
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Explore movies and TV shows by streaming platform, or see what&apos;s
            trending right now. Thousands of titles via TMDB — keep loading to
            dig deeper.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <Link
              href="/browse/movies"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-[#e50914] px-4 font-semibold text-white transition hover:bg-[#f6121d]"
            >
              All Movies
            </Link>
            <Link
              href="/browse/tv"
              className="inline-flex min-h-[44px] items-center rounded-lg border border-white/15 bg-white/5 px-4 font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/10"
            >
              All TV Shows
            </Link>
          </div>
        </header>

        <section className="mb-14 sm:mb-16">
          <h2 className="mb-6 border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-xl tracking-wide text-white sm:text-2xl">
            Streaming Platforms
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
              Trending Now
            </h2>
            <div className="flex gap-4 pl-5 text-sm sm:pl-0">
              <Link
                href="/browse/movies"
                className="text-slate-400 transition hover:text-white"
              >
                All Movies →
              </Link>
              <Link
                href="/browse/tv"
                className="text-slate-400 transition hover:text-white"
              >
                All TV →
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
