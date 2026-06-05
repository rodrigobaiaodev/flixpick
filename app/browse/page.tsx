import Link from "next/link";
import { MovieCard } from "@/components/shared/MovieCard";
import { TmdbProviderLogo } from "@/components/shared/TmdbProviderLogo";
import { enrichStreamingPlatforms } from "@/lib/tmdb-providers";
import { getTrendingAll } from "@/lib/tmdb";

export const revalidate = 3600;

export default async function BrowsePage() {
  const [platforms, trending] = await Promise.all([
    enrichStreamingPlatforms(),
    getTrendingAll("day"),
  ]);

  const trendingItems = trending.results.slice(0, 20);

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-white sm:text-5xl">
            Browse
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Explore movies and TV shows by streaming platform, or see what&apos;s
            trending right now.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="mb-6 border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
            Streaming Platforms
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {platforms.map((platform) => (
              <Link
                key={platform.id}
                href={`/browse/${platform.id}`}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.06]"
                style={{
                  boxShadow: `0 0 0 1px transparent, 0 8px 32px ${platform.brandColor}15`,
                }}
              >
                <TmdbProviderLogo
                  logoUrl={platform.logoUrl}
                  name={platform.name}
                  size={64}
                />
                <span className="text-center text-sm font-semibold text-white group-hover:text-[#e50914]">
                  {platform.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              Trending Now
            </h2>
            <div className="flex gap-3 text-sm">
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
