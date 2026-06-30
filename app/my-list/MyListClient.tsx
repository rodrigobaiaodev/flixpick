"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, Film, Trash2, Tv } from "lucide-react";
import { removeFromList } from "@/actions/listActions";
import { ListDbSetupBanner } from "@/components/shared/ListDbSetupBanner";
import { WatchStatusButton } from "@/components/shared/WatchStatusButton";
import { movieSlug } from "@/lib/genres";
import type { ListStatus, UserListItem } from "@/types/list";
import { LIST_STATUS_CONFIG } from "@/types/list";
import { cn } from "@/lib/utils";

type TabFilter = "all" | ListStatus;
type SortOption = "recent" | "title" | "rating";

const TABS: { id: TabFilter; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "📋" },
  { id: "want_to_watch", label: "Want to Watch", emoji: "🔖" },
  { id: "watching", label: "Watching", emoji: "▶️" },
  { id: "watched", label: "Watched", emoji: "✅" },
  { id: "loved", label: "Loved", emoji: "❤️" },
];

interface MyListClientProps {
  initialItems: UserListItem[];
  dbReady: boolean;
}

export function MyListClient({ initialItems, dbReady }: MyListClientProps) {
  const [items, setItems] = useState(initialItems);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const watched = items.filter(
      (i) => i.status === "watched" || i.status === "loved",
    );
    return {
      movies: watched.filter((i) => i.content_type === "movie").length,
      shows: watched.filter((i) => i.content_type === "tv").length,
      total: items.length,
    };
  }, [items]);

  const tabCounts = useMemo(() => {
    const counts: Record<TabFilter, number> = {
      all: items.length,
      want_to_watch: 0,
      watching: 0,
      watched: 0,
      loved: 0,
    };
    for (const item of items) {
      counts[item.status]++;
    }
    return counts;
  }, [items]);

  const filtered = useMemo(() => {
    let result =
      activeTab === "all"
        ? items
        : items.filter((i) => i.status === activeTab);

    result = [...result].sort((a, b) => {
      if (sort === "title") {
        return a.content_title.localeCompare(b.content_title);
      }
      if (sort === "rating") {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }
      return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
    });

    return result;
  }, [items, activeTab, sort]);

  async function handleRemove(item: UserListItem) {
    setRemovingId(item.id);
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    try {
      await removeFromList(
        item.content_id,
        item.content_type as "movie" | "tv",
      );
    } catch {
      setItems(previous);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <section className="border-b border-white/5 bg-gradient-to-b from-[#e50914]/10 to-transparent px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e50914]">
                Your Collection
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-display)] tracking-wide text-white">
                My List
              </h1>
              <p className="mt-3 max-w-xl text-slate-400">
                You&apos;ve watched{" "}
                <span className="font-semibold text-white">{stats.movies}</span>{" "}
                {stats.movies === 1 ? "movie" : "movies"} and{" "}
                <span className="font-semibold text-white">{stats.shows}</span>{" "}
                {stats.shows === 1 ? "show" : "shows"}.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="rounded-xl border border-white/10 bg-[#12121a]/80 px-5 py-3 text-center backdrop-blur-sm">
                <p className="font-[family-name:var(--font-display)] text-2xl text-white">
                  {stats.total}
                </p>
                <p className="text-xs text-slate-500">Saved</p>
              </div>
              <Link
                href="/watching"
                className="flex min-h-[44px] items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20"
              >
                ▶ Watching
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {!dbReady && <ListDbSetupBanner className="mb-10" />}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "btn-compact shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                  activeTab === tab.id
                    ? "border-[#e50914] bg-[#e50914]/15 text-white shadow-[0_0_16px_rgba(229,9,20,0.2)]"
                    : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white",
                )}
              >
                <span aria-hidden>{tab.emoji}</span>{" "}
                {tab.label}
                <span className="ml-1.5 text-xs opacity-60">
                  ({tabCounts[tab.id]})
                </span>
              </button>
            ))}
          </div>

          <label className="flex shrink-0 items-center gap-2 text-sm text-slate-400">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-white/15 bg-[#12121a] px-3 py-2 text-sm text-white"
            >
              <option value="recent">Recently Added</option>
              <option value="title">Title</option>
              <option value="rating">Rating</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-20 text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-white/5">
              <Bookmark className="size-8 text-slate-500" />
            </div>
            <p className="text-xl font-semibold text-slate-200">
              {dbReady ? "Your list is empty" : "Ready to start collecting?"}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {dbReady
                ? "Tap the bookmark on any movie or show card to save it here."
                : "Complete the one-time setup above, then save titles from any card."}
            </p>
            <Link
              href="/browse"
              className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#e50914] px-8 text-sm font-semibold text-white shadow-lg shadow-[#e50914]/25 transition hover:bg-[#f6121d]"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((item) => {
              const config = LIST_STATUS_CONFIG[item.status];
              const posterUrl = item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : null;
              const detailHref = `/${item.content_type}/${item.content_id}/${movieSlug(item.content_title)}`;

              return (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#12121a] transition hover:border-white/20 hover:shadow-xl hover:shadow-black/40"
                >
                  <Link href={detailHref} className="block">
                    <div className="relative aspect-[2/3] bg-white/5">
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={item.content_title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="220px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex size-full flex-col items-center justify-center gap-2 text-slate-600">
                          {item.content_type === "tv" ? (
                            <Tv className="size-8" />
                          ) : (
                            <Film className="size-8" />
                          )}
                          <span className="text-xs">No poster</span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-12">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                            config.color,
                          )}
                        >
                          {config.emoji} {config.label}
                        </span>
                        <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-display)] text-sm font-bold text-white">
                          {item.content_title}
                        </h3>
                      </div>
                    </div>
                    {item.rating != null && item.rating > 0 && (
                      <p className="px-3 py-2 text-xs text-amber-400">
                        ★ {Number(item.rating).toFixed(1)}
                      </p>
                    )}
                  </Link>
                  <div
                    className="border-t border-white/10 p-2"
                    onClick={(e) => e.preventDefault()}
                  >
                    <WatchStatusButton
                      contentId={item.content_id}
                      contentType={item.content_type as "movie" | "tv"}
                      contentData={{
                        contentTitle: item.content_title,
                        posterPath: item.poster_path,
                        backdropPath: item.backdrop_path,
                        rating: item.rating,
                      }}
                      isOnList
                      variant="compact"
                      className="w-full"
                      onStatusChange={(status) => {
                        if (!status) {
                          setItems((prev) =>
                            prev.filter((i) => i.id !== item.id),
                          );
                          return;
                        }
                        setItems((prev) =>
                          prev.map((i) =>
                            i.id === item.id ? { ...i, status } : i,
                          ),
                        );
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleRemove(item)}
                    disabled={removingId === item.id}
                    aria-label={`Remove ${item.content_title}`}
                    className="btn-compact absolute right-2 top-2 flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/70 text-slate-300 opacity-0 backdrop-blur-sm transition hover:border-red-500/40 hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
