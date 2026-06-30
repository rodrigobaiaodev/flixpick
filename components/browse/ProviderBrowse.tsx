"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Clapperboard, Tv } from "lucide-react";
import { FLIXPICK_MOODS, MoodIcon } from "@/components/shared/MoodButton";
import { MovieCard, MovieCardSkeleton } from "@/components/shared/MovieCard";
import { TmdbProviderLogo } from "@/components/shared/TmdbProviderLogo";
import type { StreamingPlatform } from "@/lib/streaming-platforms";
import type { ContentItem } from "@/types/movie";
import { cn } from "@/lib/utils";

interface ProviderBrowseProps {
  platform: StreamingPlatform;
}

export function ProviderBrowse({ platform }: ProviderBrowseProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        provider: platform.id,
        mediaType,
        page: "1",
      });
      if (selectedMood) params.set("mood", selectedMood);

      const response = await fetch(`/api/browse/provider?${params.toString()}`);
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? "Failed to load content");
      }

      const data = (await response.json()) as { results: ContentItem[] };
      setItems(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [platform.id, mediaType, selectedMood]);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  return (
    <div
      className="min-h-screen px-4 py-12 sm:px-6 lg:px-8"
      style={{
        background: `linear-gradient(180deg, ${platform.brandColor}18 0%, #0a0a0f 320px)`,
      }}
    >
      <div className="mx-auto max-w-7xl">
        <Link
          href="/browse"
          className="mb-8 inline-block text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Browse
        </Link>

        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center">
          <TmdbProviderLogo
            logoUrl={platform.logoUrl}
            name={platform.name}
            tmdbProviderId={platform.tmdbProviderId}
            fallbackLabel={platform.fallbackLabel}
            fallbackBackground={platform.fallbackBackground}
            size={80}
          />
          <div>
            <h1
              className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-white sm:text-5xl"
              style={{ color: platform.brandColor }}
            >
              {platform.name}
            </h1>
            <p className="mt-2 text-slate-400">
              Discover what&apos;s available on {platform.name}.
            </p>
          </div>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          {(
            [
              { type: "movie" as const, label: "Movies", Icon: Clapperboard },
              { type: "tv" as const, label: "TV Shows", Icon: Tv },
            ] as const
          ).map(({ type, label, Icon }) => {
            const selected = mediaType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setMediaType(type)}
                className={cn(
                  "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
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
            Filter by mood
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedMood(null)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition",
                !selectedMood
                  ? "border-[#e50914] bg-[#e50914]/15 text-[#e50914]"
                  : "border-white/10 text-slate-400 hover:text-white",
              )}
            >
              All
            </button>
            {FLIXPICK_MOODS.map((mood) => {
              const selected = selectedMood === mood.id;
              return (
              <button
                key={mood.id}
                type="button"
                onClick={() => setSelectedMood(mood.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                  selected
                    ? "border-[#e50914] bg-[#e50914]/15 text-[#e50914]"
                    : "border-white/10 text-slate-400 hover:text-white",
                )}
              >
                <MoodIcon Icon={mood.Icon} selected={selected} size={18} />
                {mood.label}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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

        {!loading && items.length === 0 && (
          <p className="py-12 text-center text-slate-500">
            No titles found for this filter.
          </p>
        )}
      </div>
    </div>
  );
}
