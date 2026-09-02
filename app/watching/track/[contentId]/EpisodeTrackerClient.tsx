"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Loader2, Tv } from "lucide-react";
import { updateWatchProgress } from "@/actions/listActions";
import { movieSlug } from "@/lib/genres";
import {
  computeTVProgressPercent,
  formatWatchProgress,
} from "@/lib/watch-progress";
import type { UserListItem } from "@/types/list";
import { cn } from "@/lib/utils";

interface SeasonEpisodeCount {
  seasonNumber: number;
  episodeCount: number;
}

interface TVShowMeta {
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  seasons: SeasonEpisodeCount[];
}

interface SeasonEpisode {
  id: number;
  episodeNumber: number;
  name: string;
  overview: string;
  stillPath: string | null;
  airDate: string;
  runtimeMinutes: number | null;
}

interface SeasonResponse {
  seasonNumber: number;
  name: string;
  posterPath: string | null;
  episodes: SeasonEpisode[];
}

interface EpisodeTrackerClientProps {
  item: UserListItem;
  showMeta: TVShowMeta;
}

export function EpisodeTrackerClient({
  item,
  showMeta,
}: EpisodeTrackerClientProps) {
  const [selectedSeason, setSelectedSeason] = useState(
    item.watch_season ?? 1,
  );
  const [selectedEpisode, setSelectedEpisode] = useState(
    item.watch_episode ?? 1,
  );
  const [episodes, setEpisodes] = useState<SeasonEpisode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detailHref = `/tv/${item.content_id}/${movieSlug(item.content_title)}`;
  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : null;

  const seasonOptions = useMemo(() => {
    const max =
      showMeta.numberOfSeasons ??
      (showMeta.seasons.length > 0
        ? Math.max(...showMeta.seasons.map((s) => s.seasonNumber))
        : 1);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [showMeta]);

  const loadEpisodes = useCallback(async (season: number) => {
    setLoadingEpisodes(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/tv/season?tvId=${item.content_id}&season=${season}`,
      );
      if (!response.ok) {
        throw new Error("Could not load episodes");
      }
      const data = (await response.json()) as SeasonResponse;
      setEpisodes(data.episodes);
    } catch (err) {
      setEpisodes([]);
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoadingEpisodes(false);
    }
  }, [item.content_id]);

  useEffect(() => {
    void loadEpisodes(selectedSeason);
  }, [selectedSeason, loadEpisodes]);

  const progressPercent = computeTVProgressPercent(
    showMeta.numberOfEpisodes ?? 0,
    showMeta.seasons,
    selectedSeason,
    selectedEpisode,
  );

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await updateWatchProgress(
        item.content_id,
        "tv",
        selectedSeason,
        selectedEpisode,
      );
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save progress");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <section className="border-b border-white/5 bg-gradient-to-b from-amber-500/10 to-transparent px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/watching"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Watching
          </Link>

          <div className="flex gap-4 sm:gap-6">
            {posterUrl && (
              <div className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-2xl border border-white/15 shadow-2xl sm:w-32">
                <Image
                  src={posterUrl}
                  alt={item.content_title}
                  fill
                  className="object-cover"
                  sizes="128px"
                  unoptimized
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                Track progress
              </p>
              <h1 className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white sm:text-3xl">
                {item.content_title}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                {showMeta.numberOfSeasons != null && (
                  <>
                    {showMeta.numberOfSeasons} season
                    {showMeta.numberOfSeasons !== 1 ? "s" : ""}
                    {showMeta.numberOfEpisodes != null &&
                      ` · ${showMeta.numberOfEpisodes} episodes`}
                  </>
                )}
              </p>
              <Link
                href={detailHref}
                className="mt-3 inline-flex items-center gap-1 text-sm text-[#ff6b6b] hover:underline"
              >
                View show details
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <p
            role="alert"
            className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
          >
            {error}
          </p>
        )}

        <div className="rounded-3xl border border-white/10 bg-[#12121a] p-5 sm:p-6">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-slate-500">
              <span>Overall progress</span>
              <span className="text-amber-400">{progressPercent}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {formatWatchProgress(selectedSeason, selectedEpisode) && (
              <p className="mt-2 text-sm text-slate-400">
                Currently on{" "}
                <span className="font-semibold text-amber-300">
                  {formatWatchProgress(selectedSeason, selectedEpisode)}
                </span>
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="season-select"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Season
            </label>
            <div className="flex flex-wrap gap-2">
              {seasonOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSelectedSeason(s);
                    setSelectedEpisode(1);
                  }}
                  className={cn(
                    "min-h-[40px] rounded-2xl border px-4 text-sm font-medium transition",
                    selectedSeason === s
                      ? "border-amber-500/50 bg-amber-500/15 text-amber-200"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white",
                  )}
                >
                  S{s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Episode
            </p>
            {loadingEpisodes ? (
              <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
                <Loader2 className="size-5 animate-spin" />
                Loading episodes…
              </div>
            ) : episodes.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-slate-500">
                <Tv className="size-8 opacity-50" />
                <p className="text-sm">No episodes found for this season.</p>
              </div>
            ) : (
              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {episodes.map((ep) => {
                  const isSelected = ep.episodeNumber === selectedEpisode;
                  const still = ep.stillPath
                    ? `https://image.tmdb.org/t/p/w300${ep.stillPath}`
                    : null;

                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => setSelectedEpisode(ep.episodeNumber)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition",
                        isSelected
                          ? "border-amber-500/40 bg-amber-500/10"
                          : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]",
                      )}
                    >
                      <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl bg-white/5">
                        {still ? (
                          <Image
                            src={still}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="96px"
                            unoptimized
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-xs text-slate-600">
                            E{ep.episodeNumber}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Episode {ep.episodeNumber}
                        </p>
                        <p className="line-clamp-1 text-sm font-semibold text-white">
                          {ep.name}
                        </p>
                        {ep.airDate && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {ep.airDate.slice(0, 4)}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="size-5 shrink-0 text-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className={cn(
              "mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white transition",
              saved
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500",
              saving && "opacity-70",
            )}
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving…
              </>
            ) : saved ? (
              <>
                <Check className="size-4" />
                Progress saved
              </>
            ) : (
              "Save progress"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
