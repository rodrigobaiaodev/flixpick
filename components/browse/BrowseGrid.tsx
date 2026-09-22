"use client";

import { useCallback, useEffect, useState } from "react";
import { MovieCard, MovieCardSkeleton } from "@/components/shared/MovieCard";
import { useExtraTranslations, useLocale } from "@/components/shared/LocaleProvider";
import { getGenreOptions } from "@/lib/i18n/genres";
import type { ContentItem } from "@/types/movie";
import type { BrowseSort } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface BrowseGridProps {
  mediaType: "movie" | "tv";
  titleKey?: "nav.movies" | "nav.tvShows";
  title?: string;
  apiPath: string;
}

export function BrowseGrid({ mediaType, title, titleKey, apiPath }: BrowseGridProps) {
  const te = useExtraTranslations();
  const { locale, t } = useLocale();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [genre, setGenre] = useState<string>("");
  const [sort, setSort] = useState<BrowseSort>("popular");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const genreOptions = getGenreOptions(locale);
  const sortOptions: { value: BrowseSort; label: string }[] = [
    { value: "popular", label: te("browse.popular") },
    { value: "top_rated", label: te("browse.topRated") },
    { value: "new", label: te("browse.new") },
  ];

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
        throw new Error(body.error ?? te("browse.failedLoad"));
      }

      const data = (await response.json()) as {
        results: ContentItem[];
        totalPages: number;
        totalResults: number;
      };

      setItems((prev) =>
        append ? [...prev, ...data.results] : data.results,
      );
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults ?? 0);
      setPage(pageNum);
    },
    [apiPath, genre, sort, te],
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
          setError(
            err instanceof Error ? err.message : te("browse.failedLoad"),
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [fetchPage, te]);

  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      await fetchPage(page + 1, true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : te("browse.failedMore"),
      );
    } finally {
      setLoadingMore(false);
    }
  };

  const label =
    mediaType === "tv" ? te("browse.tvLabel") : te("browse.moviesLabel");
  const heading = titleKey ? t(titleKey) : title ?? "";

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 sm:mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white sm:text-4xl lg:text-5xl">
            {heading}
          </h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            {te("browse.catalogDesc", { label })}
          </p>
          {!loading && totalResults > 0 && (
            <p className="mt-2 text-xs text-slate-500 sm:text-sm">
              {te("browse.showingOf", {
                shown: items.length.toLocaleString(),
                total: totalResults.toLocaleString(),
                label,
              })}
            </p>
          )}
        </header>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="flex items-center gap-2 text-sm text-slate-400">
            {te("browse.genre")}
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="min-h-[44px] flex-1 rounded-lg border border-white/15 bg-[#12121a] px-3 py-2 text-sm text-white sm:flex-none"
            >
              <option value="">{te("browse.allGenres")}</option>
              {genreOptions.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-400">{te("browse.sort")}</span>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSort(option.value)}
                className={cn(
                  "min-h-[40px] rounded-lg border px-3 py-1.5 text-sm font-medium transition",
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

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
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
          <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12">
            <button
              type="button"
              onClick={() => void handleLoadMore()}
              disabled={loadingMore}
              className="inline-flex h-12 w-full max-w-sm items-center justify-center rounded-lg bg-[#e50914] px-8 text-sm font-semibold text-white transition hover:bg-[#f6121d] disabled:opacity-50 sm:w-auto sm:min-w-[220px]"
            >
              {loadingMore ? te("browse.loading") : te("browse.loadMore")}
            </button>
            <p className="text-xs text-slate-500">
              {te("browse.pageOf", {
                page,
                total: totalPages.toLocaleString(),
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
