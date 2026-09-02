"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clapperboard, Play, Tv } from "lucide-react";
import { movieSlug } from "@/lib/genres";
import { TrailerModal } from "@/components/shared/TrailerModal";
import type { ContentItem } from "@/types/movie";
import { cn } from "@/lib/utils";

interface TrailerItem extends ContentItem {
  youtubeKey: string;
}

interface TrailersResponse {
  trailers: TrailerItem[];
  error?: string;
}

function TrailerCard({
  item,
  rank,
  onPlay,
}: {
  item: TrailerItem;
  rank: number;
  onPlay: () => void;
}) {
  const thumb = item.backdropPath
    ? `https://image.tmdb.org/t/p/w500${item.backdropPath}`
    : item.posterPath
      ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
      : null;
  const href = `/${item.mediaType}/${item.id}/${movieSlug(item.title)}`;
  const year = item.releaseDate?.slice(0, 4) || "";

  return (
    <article className="group relative w-[260px] shrink-0 snap-start sm:w-[300px]">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121a] transition duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/30">
        <div className="relative aspect-video overflow-hidden">
          {thumb ? (
            <Image
              src={thumb}
              alt={item.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="300px"
              unoptimized
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#1a1a28] to-[#0d0d14]">
              <Clapperboard className="size-10 text-slate-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

          <span className="absolute left-3 top-3 flex size-7 items-center justify-center rounded-xl bg-[#e50914] text-xs font-bold text-white shadow-lg">
            {rank}
          </span>

          <button
            type="button"
            onClick={onPlay}
            className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#e50914]/90 text-white shadow-2xl shadow-[#e50914]/40 transition hover:scale-110 hover:bg-[#f6121d]"
            aria-label={`Play trailer for ${item.title}`}
          >
            <Play className="size-6 fill-white" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {item.mediaType === "tv" ? (
                <Tv className="size-3" />
              ) : (
                <Clapperboard className="size-3" />
              )}
              {item.mediaType === "tv" ? "Series" : "Movie"}
              {year && <span className="text-white/30">·</span>}
              {year}
            </div>
            <Link href={href}>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-white transition hover:text-[#ff6b6b]">
                {item.title}
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function TrailerSkeleton() {
  return (
    <div className="w-[260px] shrink-0 snap-start sm:w-[300px]">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]">
        <div className="aspect-video animate-pulse bg-white/10" />
        <div className="space-y-2 p-3">
          <div className="h-3 w-1/3 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function TopTrailersSection() {
  const [trailers, setTrailers] = useState<TrailerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTrailer, setActiveTrailer] = useState<{
    key: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/trailers/week");
        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error ?? "Failed to load trailers");
        }
        const data = (await response.json()) as TrailersResponse;
        if (!cancelled) setTrailers(data.trailers ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong",
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
  }, []);

  return (
    <>
      <section className="border-t border-white/5 bg-[#0a0a0f] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative pl-1">
              <div className="absolute -left-1 top-0 h-full w-1 rounded-full bg-gradient-to-b from-violet-500 to-violet-500/20 shadow-[0_0_24px_rgba(139,92,246,0.4)]" />
              <div className="flex items-center gap-2">
                <Play className="size-5 fill-violet-400 text-violet-400" />
                <h2 className="font-[family-name:var(--font-display)] tracking-wide text-slate-100">
                  Top 10 Trailers This Week
                </h2>
              </div>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                The hottest official trailers — watch before you pick tonight&apos;s title.
              </p>
            </div>
            <span
              className={cn(
                "inline-flex self-start rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-violet-300 sm:self-auto",
              )}
            >
              Updated weekly
            </span>
          </div>

          {error && (
            <p
              role="alert"
              className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
            >
              {error}
            </p>
          )}

          <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-violet-500/[0.04] to-transparent p-4 sm:p-5">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TrailerSkeleton key={`trailer-skel-${i}`} />
                ))}

              {!loading &&
                trailers.map((item, index) => (
                  <TrailerCard
                    key={`${item.mediaType}-${item.id}`}
                    item={item}
                    rank={index + 1}
                    onPlay={() =>
                      setActiveTrailer({
                        key: item.youtubeKey,
                        title: item.title,
                      })
                    }
                  />
                ))}

              {!loading && !error && trailers.length === 0 && (
                <p className="py-8 text-slate-500">No trailers available.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <TrailerModal
        open={activeTrailer !== null}
        onClose={() => setActiveTrailer(null)}
        youtubeKey={activeTrailer?.key ?? null}
        title={activeTrailer?.title}
      />
    </>
  );
}
