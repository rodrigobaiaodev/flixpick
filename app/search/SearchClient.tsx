"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clapperboard, Search, Tv, X } from "lucide-react";
import {
  MovieCard,
  MovieCardSkeleton,
} from "@/components/shared/MovieCard";
import { MoodIcon } from "@/components/shared/MoodButton";
import { TmdbProviderLogo } from "@/components/shared/TmdbProviderLogo";
import { STREAMING_PLATFORMS } from "@/lib/streaming-platforms";
import type { ContentItem } from "@/types/movie";
import { cn } from "@/lib/utils";

type MediaFilter = "all" | "movie" | "tv";

interface SearchResponse {
  results: ContentItem[];
  query: string;
  page: number;
  totalPages: number;
  totalResults: number;
  error?: string;
}

const MEDIA_FILTERS: {
  value: MediaFilter;
  label: string;
  Icon: typeof Clapperboard;
}[] = [
  { value: "all", label: "All", Icon: Search },
  { value: "movie", label: "Movies", Icon: Clapperboard },
  { value: "tv", label: "TV Shows", Icon: Tv },
];

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const initialMedia = (searchParams.get("mediaType") ?? "all") as MediaFilter;
  const initialProvider = searchParams.get("provider") ?? "";

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>(initialMedia);
  const [providerFilter, setProviderFilter] = useState(initialProvider);
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const activeQuery = searchParams.get("q")?.trim() ?? "";

  const updateUrl = useCallback(
    (next: { q?: string; mediaType?: MediaFilter; provider?: string }) => {
      const params = new URLSearchParams();
      const q = next.q ?? activeQuery;
      const mediaType = next.mediaType ?? mediaFilter;
      const provider = next.provider ?? providerFilter;

      if (q) params.set("q", q);
      if (mediaType !== "all") params.set("mediaType", mediaType);
      if (provider) params.set("provider", provider);

      router.replace(`/search?${params.toString()}`);
    },
    [activeQuery, mediaFilter, providerFilter, router],
  );

  useEffect(() => {
    setQueryInput(activeQuery);
    setMediaFilter(initialMedia);
    setProviderFilter(initialProvider);
  }, [activeQuery, initialMedia, initialProvider]);

  useEffect(() => {
    if (!activeQuery) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    let cancelled = false;

    async function runSearch() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ q: activeQuery });
        if (mediaFilter !== "all") params.set("mediaType", mediaFilter);
        if (providerFilter) params.set("provider", providerFilter);

        const response = await fetch(`/api/search?${params.toString()}`);
        const data = (await response.json()) as SearchResponse;

        if (!response.ok) {
          throw new Error(data.error ?? "Search failed");
        }

        if (!cancelled) {
          setResults(data.results);
          setTotalResults(data.totalResults);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Search failed");
          setResults([]);
          setTotalResults(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void runSearch();
    return () => {
      cancelled = true;
    };
  }, [activeQuery, mediaFilter, providerFilter]);

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = queryInput.trim();
    if (!trimmed) return;
    updateUrl({ q: trimmed });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white sm:text-4xl">
            Search
          </h1>
          <p className="mt-2 text-slate-400">
            Find movies and TV shows across streaming platforms.
          </p>
        </header>

        <form onSubmit={handleSearchSubmit} className="mb-8">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Search movies, TV shows…"
              className="w-full rounded-2xl border border-white/10 bg-[#12121a] py-3.5 pl-12 pr-12 text-base text-white placeholder:text-slate-500 focus:border-[#e50914]/50 focus:outline-none focus:ring-2 focus:ring-[#e50914]/20"
            />
            {queryInput && (
              <button
                type="button"
                onClick={() => setQueryInput("")}
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-white/5 hover:text-white"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </form>

        {activeQuery && (
          <>
            <div className="mb-4 space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
                  Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {MEDIA_FILTERS.map((filter) => {
                    const selected = mediaFilter === filter.value;
                    return (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => {
                          setMediaFilter(filter.value);
                          updateUrl({ mediaType: filter.value });
                        }}
                        className={cn(
                          "inline-flex min-h-[40px] items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all",
                          selected
                            ? "border-[#e50914] bg-[#e50914]/15 text-[#e50914]"
                            : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:text-white",
                        )}
                      >
                        <MoodIcon
                          Icon={filter.Icon}
                          selected={selected}
                          size={18}
                        />
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
                  Platform
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setProviderFilter("");
                      updateUrl({ provider: "" });
                    }}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1.5 text-sm transition",
                      !providerFilter
                        ? "border-[#e50914] bg-[#e50914]/15 text-[#e50914]"
                        : "border-white/10 text-slate-400 hover:text-white",
                    )}
                  >
                    Any Platform
                  </button>
                  {STREAMING_PLATFORMS.map((platform) => {
                    const selected = providerFilter === platform.id;
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        title={platform.name}
                        onClick={() => {
                          const next =
                            providerFilter === platform.id ? "" : platform.id;
                          setProviderFilter(next);
                          updateUrl({ provider: next });
                        }}
                        className={cn(
                          "shrink-0 transition-all",
                          selected ? "scale-110" : "opacity-70 hover:opacity-100",
                        )}
                      >
                        <TmdbProviderLogo
                          logoUrl={platform.logoUrl}
                          name={platform.name}
                          tmdbProviderId={platform.tmdbProviderId}
                          fallbackLabel={platform.fallbackLabel}
                          fallbackBackground={platform.fallbackBackground}
                          size={40}
                          selected={selected}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="mb-6 text-sm text-slate-500">
              {loading
                ? "Searching…"
                : `${results.length} result${results.length === 1 ? "" : "s"} for “${activeQuery}”${
                    totalResults > results.length
                      ? ` (${totalResults} total on TMDB)`
                      : ""
                  }`}
            </p>
          </>
        )}

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {!activeQuery && !loading && (
          <p className="py-16 text-center text-slate-500">
            Enter a title, actor, or keyword to start searching.
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {loading &&
            Array.from({ length: 12 }).map((_, index) => (
              <MovieCardSkeleton key={`search-skeleton-${index}`} />
            ))}

          {!loading &&
            results.map((item, index) => (
              <MovieCard
                key={`${item.mediaType}-${item.id}`}
                movie={item}
                showAvailability
                priority={index < 6}
              />
            ))}
        </div>

        {!loading && activeQuery && results.length === 0 && !error && (
          <p className="py-12 text-center text-slate-500">
            No titles matched your search. Try another keyword or filter.
          </p>
        )}
      </div>
    </div>
  );
}
