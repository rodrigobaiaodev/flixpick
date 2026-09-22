"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Clapperboard, Tv } from "lucide-react";
import { FLIXPICK_MOODS, MoodIcon } from "@/components/shared/MoodButton";
import { MovieCard, MovieCardSkeleton } from "@/components/shared/MovieCard";
import { TmdbProviderLogo } from "@/components/shared/TmdbProviderLogo";
import type { StreamingPlatform } from "@/lib/streaming-platforms";
import { useExtraTranslations, useLocale } from "@/components/shared/LocaleProvider";
import { getMoodLabel } from "@/lib/i18n/mood-labels";
import type { ContentItem } from "@/types/movie";
import { cn } from "@/lib/utils";

interface ProviderBrowseProps {
  platform: StreamingPlatform;
}

export function ProviderBrowse({ platform }: ProviderBrowseProps) {
  const te = useExtraTranslations();
  const { locale, t } = useLocale();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number, append: boolean) => {
      const params = new URLSearchParams({
        provider: platform.id,
        mediaType,
        page: String(pageNum),
      });
      if (selectedMood) params.set("mood", selectedMood);

      const response = await fetch(`/api/browse/provider?${params.toString()}`);
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
    [platform.id, mediaType, selectedMood, te],
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
  }, [fetchPage]);

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

  return (
    <div
      className="min-h-screen px-3 py-8 sm:px-6 sm:py-12 lg:px-8"
      style={{
        background: `linear-gradient(180deg, ${platform.brandColor}18 0%, #0a0a0f 320px)`,
      }}
    >
      <div className="mx-auto max-w-7xl">
        <Link
          href="/browse"
          className="mb-6 inline-block text-sm text-slate-400 transition hover:text-white sm:mb-8"
        >
          {te("browse.backToBrowse")}
        </Link>

        <header className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-center sm:gap-6">
          <TmdbProviderLogo
            logoUrl={platform.logoUrl}
            name={platform.name}
            tmdbProviderId={platform.tmdbProviderId}
            fallbackLabel={platform.fallbackLabel}
            fallbackBackground={platform.fallbackBackground}
            size={72}
          />
          <div>
            <h1
              className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white sm:text-4xl lg:text-5xl"
              style={{ color: platform.brandColor }}
            >
              {platform.name}
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              {te("browse.providerDesc", { name: platform.name })}
            </p>
            {!loading && totalResults > 0 && (
              <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                {te("browse.showingTitles", {
                  shown: items.length.toLocaleString(),
                  total: totalResults.toLocaleString(),
                })}
              </p>
            )}
          </div>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              { type: "movie" as const, label: t("nav.movies"), Icon: Clapperboard },
              { type: "tv" as const, label: t("nav.tvShows"), Icon: Tv },
            ] as const
          ).map(({ type, label, Icon }) => {
            const selected = mediaType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setMediaType(type)}
                className={cn(
                  "inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300",
                  selected
                    ? "border-[#e50914] bg-[#e50914]/15 text-[#e50914] shadow-[0_0_20px_rgba(229,9,20,0.25)]"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                )}
              >
                <MoodIcon Icon={Icon} selected={selected} size={18} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="mb-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-slate-500">
            {te("browse.filterMood")}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedMood(null)}
              className={cn(
                "min-h-[40px] rounded-lg border px-3 py-1.5 text-sm transition",
                !selectedMood
                  ? "border-[#e50914] bg-[#e50914]/15 text-[#e50914]"
                  : "border-white/10 text-slate-400 hover:text-white",
              )}
            >
              {te("browse.all")}
            </button>
            {FLIXPICK_MOODS.map((mood) => {
              const selected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setSelectedMood(mood.id)}
                  className={cn(
                    "inline-flex min-h-[40px] items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition",
                    selected
                      ? "border-[#e50914] bg-[#e50914]/15 text-[#e50914]"
                      : "border-white/10 text-slate-400 hover:text-white",
                  )}
                >
                  <MoodIcon Icon={mood.Icon} selected={selected} size={18} />
                  {getMoodLabel(locale, mood.id, mood.label)}
                </button>
              );
            })}
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

        {!loading && items.length === 0 && (
          <p className="py-12 text-center text-slate-500">
            {te("browse.noTitles")}
          </p>
        )}

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
