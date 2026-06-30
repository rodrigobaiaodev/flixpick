"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Play, Tv } from "lucide-react";
import { updateStatus } from "@/actions/listActions";
import { ListDbSetupBanner } from "@/components/shared/ListDbSetupBanner";
import { movieSlug } from "@/lib/genres";
import type { UserListItem } from "@/types/list";
import { cn } from "@/lib/utils";

interface TVProgressInfo {
  contentId: number;
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
}

interface WatchingClientProps {
  initialItems: UserListItem[];
  tvProgress: TVProgressInfo[];
  dbReady: boolean;
}

export function WatchingClient({
  initialItems,
  tvProgress,
  dbReady,
}: WatchingClientProps) {
  const [items, setItems] = useState(initialItems);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const progressMap = new Map(tvProgress.map((p) => [p.contentId, p]));

  async function markWatched(item: UserListItem) {
    setUpdatingId(item.id);
    try {
      await updateStatus(
        item.content_id,
        item.content_type as "movie" | "tv",
        "watched",
      );
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch {
      /* keep item */
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <section className="border-b border-white/5 bg-gradient-to-b from-amber-500/10 to-transparent px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            In Progress
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] tracking-wide text-white">
            Currently Watching
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            {items.length > 0
              ? `You have ${items.length} title${items.length === 1 ? "" : "s"} in progress. Pick up where you left off.`
              : "Nothing in progress right now — start watching something great."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {!dbReady && <ListDbSetupBanner className="mb-10" />}

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-20 text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-amber-500/10">
              <Play className="size-8 text-amber-400" />
            </div>
            <p className="text-xl font-semibold text-slate-200">
              Nothing in progress
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {dbReady
                ? 'Save a title and set its status to "Currently Watching" from any movie card.'
                : "Complete the setup above, then mark titles as watching from any card."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/browse"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#e50914] px-8 text-sm font-semibold text-white shadow-lg shadow-[#e50914]/25 hover:bg-[#f6121d]"
              >
                Find Something to Watch
              </Link>
              <Link
                href="/my-list"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/15 px-8 text-sm font-medium text-slate-300 hover:bg-white/5"
              >
                Go to My List
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {items.map((item) => {
              const posterUrl = item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : null;
              const backdropUrl = item.backdrop_path
                ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
                : null;
              const detailHref = `/${item.content_type}/${item.content_id}/${movieSlug(item.content_title)}`;
              const tvInfo =
                item.content_type === "tv"
                  ? progressMap.get(item.content_id)
                  : null;
              const progressPercent =
                tvInfo?.numberOfEpisodes && tvInfo.numberOfEpisodes > 0
                  ? Math.min(85, 20 + Math.round(tvInfo.numberOfEpisodes / 2))
                  : item.content_type === "movie"
                    ? 45
                    : 35;

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#12121a] transition hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5"
                >
                  <div className="relative h-32 overflow-hidden sm:h-36">
                    {backdropUrl ? (
                      <Image
                        src={backdropUrl}
                        alt=""
                        fill
                        className="object-cover opacity-60"
                        sizes="600px"
                        unoptimized
                      />
                    ) : (
                      <div className="size-full bg-gradient-to-r from-amber-900/40 to-[#12121a]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/60 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-200">
                      ▶ In Progress
                    </span>
                  </div>

                  <div className="flex gap-4 p-5 sm:p-6">
                    <Link
                      href={detailHref}
                      className="relative -mt-14 aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-xl border-2 border-white/15 shadow-2xl sm:w-28"
                    >
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={item.content_title}
                          fill
                          className="object-cover"
                          sizes="112px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-white/5 text-slate-600">
                          <Tv className="size-8" />
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col pt-1">
                      <Link href={detailHref}>
                        <h2 className="line-clamp-2 font-[family-name:var(--font-display)] text-lg tracking-wide text-white transition group-hover:text-amber-200">
                          {item.content_title}
                        </h2>
                      </Link>
                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                        {item.content_type === "tv" ? "TV Series" : "Movie"}
                        {item.rating != null && item.rating > 0 && (
                          <span className="ml-2 text-amber-400">
                            ★ {Number(item.rating).toFixed(1)}
                          </span>
                        )}
                      </p>

                      {item.content_type === "tv" && tvInfo && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                          <Tv className="size-3.5 shrink-0" />
                          {tvInfo.numberOfSeasons != null && (
                            <span>
                              {tvInfo.numberOfSeasons} season
                              {tvInfo.numberOfSeasons !== 1 ? "s" : ""}
                              {tvInfo.numberOfEpisodes != null &&
                                ` · ${tvInfo.numberOfEpisodes} episodes`}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-4">
                        <div className="mb-1.5 flex justify-between text-[10px] font-medium uppercase tracking-wider text-slate-500">
                          <span>Progress</span>
                          <span className="text-amber-400/80">
                            {progressPercent}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => void markWatched(item)}
                        disabled={updatingId === item.id}
                        className={cn(
                          "mt-5 flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-50",
                        )}
                      >
                        <Check className="size-4" />
                        {updatingId === item.id
                          ? "Updating…"
                          : "Mark as Watched"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
