"use client";

import { useCallback, useEffect, useState } from "react";
import { MovieCard, MovieCardSkeleton } from "@/components/shared/MovieCard";
import { GENRE_MAP } from "@/lib/genres";
import type { ContentItem } from "@/types/movie";
import type { BrowseSort } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

const GENRE_OPTIONS = Object.entries(GENRE_MAP).map(([id, name]) => ({
  id: Number(id),
  name,
}));

const SORT_OPTIONS: { value: BrowseSort; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "top_rated", label: "Top Rated" },
  { value: "new", label: "New" },
];

interface BrowseGridProps {
  mediaType: "movie" | "tv";
  title: string;
  apiPath: string;
}

export function BrowseGrid({ mediaType, title, apiPath }: BrowseGridProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genre, setGenre] = useState<string>("");
  const [sort, setSort] = useState<BrowseSort>("popular");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number, append: boolean) => {
      const params = new URLSearchParams({
        page: String(pageNum),
        sort,
      });
      if (genre) params.set("genre", genre);

      const response = await fetch(`${apiPath}?${params.toString()}`);
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? "Failed to load content");
      }

      const data = (await response.json()) as {
        results: ContentItem[];
        totalPages: number;
      };

      setItems((prev) =>
        append ? [...prev, ...data.results] : data.results,
      );
      setTotalPages(data.totalPages);
      setPage(pageNum);
    },
    [apiPath, genre, sort],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        await fetchPage(1, false);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [fetchPage]);

  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      await fetchPage(page + 1, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 text-slate-400">
            Browse {mediaType === "tv" ? "TV shows" : "movies"} from our database.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-400">
            Genre
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="rounded-lg border border-white/15 bg-[#12121a] px-3 py-2 text-sm text-white"
            >
              <option value="">All Genres</option>
              {GENRE_OPTIONS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Sort by</span>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSort(option.value)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                  sort === option.value
                    ? "border-[#e50914] bg-[#e50914]/15 text-white"
                    : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {loading
            ? Array.from({ length: 20 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))
            : items.map((item, index) => (
                <MovieCard
                  key={`${item.mediaType}-${item.id}`}
                  movie={item}
                  priority={index < 6}
                />
              ))}
        </div>

        {!loading && page < totalPages && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => void handleLoadMore()}
              disabled={loadingMore}
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-lg bg-[#e50914] px-8 text-sm font-semibold text-white transition hover:bg-[#f6121d] disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
