"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { AdBanner } from "@/components/shared/AdBanner";
import { FLIXPICK_MOODS } from "@/components/shared/MoodButton";
import {
  getGenreDisplayName,
  movieSlug,
  MovieCard,
  MovieCardSkeleton,
} from "@/components/shared/MovieCard";
import {
  STREAMING_PLATFORMS,
  type StreamingPlatform,
} from "@/lib/streaming-platforms";
import { TmdbProviderLogo } from "@/components/shared/TmdbProviderLogo";
import { RouletteWheel } from "@/components/shared/RouletteWheel";
import { TrailerModal } from "@/components/shared/TrailerModal";
import { TMDB_PROVIDER_IDS } from "@/lib/providers-moods";
import { cn } from "@/lib/utils";
import type { ContentItem, RecommendMediaType } from "@/types/movie";

const AD_CLIENT = "ca-pub-XXXXXXXX";

const STORAGE_KEYS = {
  mood: "flixpick:selectedMood",
  platforms: "flixpick:selectedPlatforms",
  lastPick: "flixpick:lastPick",
  excludeIds: "flixpick:excludeIds",
} as const;

/** Map PlatformSelector slugs → TMDB watch_provider IDs (US). */
const PLATFORM_SLUG_TO_TMDB_ID: Record<string, number> = {
  netflix: 8,
  prime: 9,
  max: 384,
  disney: 337,
  apple: 350,
  hulu: 15,
  peacock: 386,
  paramount: 531,
};

interface RecommendResponse {
  movie: ContentItem;
  trailerUrl: string | null;
}

interface TrendingResponse {
  movies: ContentItem[];
  page: number;
  totalResults: number;
}

interface StoredLastPick {
  movie: ContentItem;
  trailerUrl: string | null;
  savedAt: string;
}

const MEDIA_TYPE_OPTIONS: {
  value: RecommendMediaType;
  label: string;
  icon: string;
}[] = [
  { value: "movie", label: "Movies", icon: "🎬" },
  { value: "tv", label: "TV Shows", icon: "📺" },
  { value: "both", label: "Both", icon: "🎯" },
];

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode */
  }
}

function resolveProviderIds(selectedPlatformSlugs: string[]): number[] {
  if (selectedPlatformSlugs.length === 0) {
    return [...TMDB_PROVIDER_IDS];
  }

  const ids = selectedPlatformSlugs
    .map((slug) => PLATFORM_SLUG_TO_TMDB_ID[slug])
    .filter((id): id is number => typeof id === "number");

  return ids.length > 0 ? ids : [...TMDB_PROVIDER_IDS];
}

function tmdbImageUrl(
  path: string | null,
  size: "w500" | "original" = "w500",
): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

function getReleaseYear(releaseDate: string): string {
  return releaseDate?.slice(0, 4) || "—";
}

function youtubeKeyFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1) || null;
    }
    return parsed.searchParams.get("v");
  } catch {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] ?? null;
  }
}

function SectionReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
    >
      {children}
    </section>
  );
}

export default function HomePage() {
  const moodSectionRef = useRef<HTMLDivElement>(null);
  const platformSectionRef = useRef<HTMLDivElement>(null);
  const rouletteSectionRef = useRef<HTMLDivElement>(null);
  const rouletteRef = useRef<HTMLDivElement>(null);
  const trendingScrollRef = useRef<HTMLDivElement>(null);

  const [hydrated, setHydrated] = useState(false);
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);
  const [excludeIds, setExcludeIds] = useState<number[]>([]);

  const [pickResult, setPickResult] = useState<ContentItem | null>(null);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedMediaType, setSelectedMediaType] =
    useState<RecommendMediaType>("both");

  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  const [streamingPlatforms, setStreamingPlatforms] =
    useState<StreamingPlatform[]>(STREAMING_PLATFORMS);
  const [trendingMovies, setTrendingMovies] = useState<ContentItem[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState<string | null>(null);
  const [trendingScroll, setTrendingScroll] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  useEffect(() => {
    const savedMood = readJson<string>(STORAGE_KEYS.mood);
    const savedPlatforms = readJson<string[]>(STORAGE_KEYS.platforms);
    const savedExclude = readJson<number[]>(STORAGE_KEYS.excludeIds);
    const savedPick = readJson<StoredLastPick>(STORAGE_KEYS.lastPick);

    if (savedMood && FLIXPICK_MOODS.some((m) => m.id === savedMood)) {
      setSelectedMoodId(savedMood);
    }
    if (Array.isArray(savedPlatforms)) {
      setSelectedPlatformIds(savedPlatforms);
    }
    if (Array.isArray(savedExclude)) {
      setExcludeIds(savedExclude);
    }
    if (savedPick?.movie) {
      setPickResult(savedPick.movie);
      setTrailerUrl(savedPick.trailerUrl ?? null);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (selectedMoodId) writeJson(STORAGE_KEYS.mood, selectedMoodId);
  }, [selectedMoodId, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson(STORAGE_KEYS.platforms, selectedPlatformIds);
  }, [selectedPlatformIds, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeJson(STORAGE_KEYS.excludeIds, excludeIds);
  }, [excludeIds, hydrated]);

  useEffect(() => {
    if (!hydrated || !pickResult) return;
    const payload: StoredLastPick = {
      movie: pickResult,
      trailerUrl,
      savedAt: new Date().toISOString(),
    };
    writeJson(STORAGE_KEYS.lastPick, payload);
  }, [pickResult, trailerUrl, hydrated]);

  useEffect(() => {
    let cancelled = false;

    async function loadProviderLogos() {
      try {
        const response = await fetch("/api/providers");
        if (!response.ok) return;
        const data = (await response.json()) as {
          platforms?: StreamingPlatform[];
        };
        if (!cancelled && data.platforms?.length) {
          setStreamingPlatforms(data.platforms);
        }
      } catch {
        /* keep defaults */
      }
    }

    void loadProviderLogos();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadTrending() {
      setTrendingLoading(true);
      setTrendingError(null);
      try {
        const response = await fetch("/api/trending");
        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error ?? "Failed to load trending movies");
        }
        const data = (await response.json()) as TrendingResponse;
        if (!cancelled) {
          setTrendingMovies(data.movies ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          setTrendingError(
            error instanceof Error ? error.message : "Something went wrong",
          );
        }
      } finally {
        if (!cancelled) setTrendingLoading(false);
      }
    }

    void loadTrending();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleMoodSelect = useCallback((moodId: string) => {
    setSelectedMoodId(moodId);
    setRecommendError(null);

    requestAnimationFrame(() => {
      platformSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const handleSpin = useCallback(
    async (additionalExcludeId?: number) => {
    if (!selectedMoodId) {
      setRecommendError("Pick a mood first to spin the wheel.");
      return;
    }

    const excludeIdsForRequest =
      additionalExcludeId !== undefined
        ? excludeIds.includes(additionalExcludeId)
          ? excludeIds
          : [...excludeIds, additionalExcludeId]
        : excludeIds;

    if (
      additionalExcludeId !== undefined &&
      !excludeIds.includes(additionalExcludeId)
    ) {
      setExcludeIds(excludeIdsForRequest);
    }

    setRecommendLoading(true);
    setRecommendError(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMoodId,
          providers: resolveProviderIds(selectedPlatformIds),
          minRating: 7.0,
          excludeIds: excludeIdsForRequest,
          mediaType: selectedMediaType,
        }),
      });

      const data = (await response.json()) as RecommendResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Could not find a recommendation");
      }

      setPickResult(data.movie);
      setTrailerUrl(data.trailerUrl ?? null);
      setExcludeIds((prev) =>
        prev.includes(data.movie.id) ? prev : [...prev, data.movie.id],
      );

      requestAnimationFrame(() => {
        rouletteSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      });
    } catch (error) {
      setRecommendError(
        error instanceof Error ? error.message : "Recommendation failed",
      );
    } finally {
      setRecommendLoading(false);
    }
  },
    [selectedMoodId, selectedPlatformIds, excludeIds, selectedMediaType],
  );

  const handleRollAgain = useCallback(() => {
    if (!pickResult || !selectedMoodId) return;
    void handleSpin(pickResult.id);
  }, [pickResult, selectedMoodId, handleSpin]);

  const handleChangeMood = useCallback(() => {
    setPickResult(null);
    setTrailerUrl(null);
    setRecommendError(null);
    setExcludeIds([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.lastPick);
    }
    requestAnimationFrame(() => {
      moodSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const updateTrendingScrollState = useCallback(() => {
    const el = trendingScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setTrendingScroll({
      canScrollLeft: scrollLeft > 8,
      canScrollRight: scrollLeft < scrollWidth - clientWidth - 8,
    });
  }, []);

  const scrollTrending = useCallback((direction: "left" | "right") => {
    const el = trendingScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    updateTrendingScrollState();
    const el = trendingScrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateTrendingScrollState, { passive: true });
    window.addEventListener("resize", updateTrendingScrollState);
    return () => {
      el.removeEventListener("scroll", updateTrendingScrollState);
      window.removeEventListener("resize", updateTrendingScrollState);
    };
  }, [trendingMovies, trendingLoading, updateTrendingScrollState]);

  const allPlatformIds = streamingPlatforms.map((p) => p.id);
  const isAllPlatformsSelected =
    allPlatformIds.length > 0 &&
    allPlatformIds.every((id) => selectedPlatformIds.includes(id));

  const togglePlatform = (platformId: string) => {
    if (selectedPlatformIds.includes(platformId)) {
      setSelectedPlatformIds(
        selectedPlatformIds.filter((id) => id !== platformId),
      );
    } else {
      setSelectedPlatformIds([...selectedPlatformIds, platformId]);
    }
  };

  const toggleAllPlatforms = () => {
    setSelectedPlatformIds(isAllPlatformsSelected ? [] : [...allPlatformIds]);
  };

  const selectedMoodIds = selectedMoodId ? [selectedMoodId] : [];
  const pickDetailHref = pickResult
    ? `/${pickResult.mediaType === "tv" ? "tv" : "movie"}/${pickResult.id}/${movieSlug(pickResult.title)}`
    : null;
  const posterUrl = pickResult ? tmdbImageUrl(pickResult.posterPath, "w500") : null;
  const backdropUrl = pickResult
    ? tmdbImageUrl(pickResult.backdropPath, "original")
    : null;

  return (
    <div className="flex flex-col bg-[#0a0a0f]">
      <style jsx global>{`
        @keyframes hero-orb-pulse {
          0%,
          100% {
            opacity: 0.45;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(1.12);
          }
        }
        @keyframes hero-particle-float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-18px) translateX(6px);
            opacity: 0.55;
          }
        }
        @keyframes cinematic-reveal {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .hero-orb {
          animation: hero-orb-pulse 6s ease-in-out infinite;
        }
        .hero-particle {
          animation: hero-particle-float 5s ease-in-out infinite;
        }
        .cinematic-reveal {
          animation: cinematic-reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }
      `}</style>

      {/* Full-screen cinematic hero */}
      <section className="relative flex min-h-screen min-h-[100dvh] flex-col overflow-hidden">
        {/* Background */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#1a0a0a] to-[#0a0a0f]"
          aria-hidden
        />
        <div
          className="hero-orb pointer-events-none absolute left-1/2 top-[28%] size-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e50914]/25 blur-[100px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 50% 15%, rgba(229,9,20,0.22), transparent 65%)",
          }}
          aria-hidden
        />

        {/* Floating particles */}
        {[
          { left: "12%", top: "22%", delay: "0s", size: 4 },
          { left: "78%", top: "18%", delay: "1.2s", size: 3 },
          { left: "65%", top: "38%", delay: "0.6s", size: 5 },
          { left: "28%", top: "42%", delay: "1.8s", size: 3 },
          { left: "88%", top: "32%", delay: "2.4s", size: 4 },
          { left: "8%", top: "55%", delay: "0.9s", size: 3 },
        ].map((p, i) => (
          <span
            key={i}
            className="hero-particle pointer-events-none absolute rounded-full bg-[#e50914]"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
            }}
            aria-hidden
          />
        ))}

        {/* Film grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          {/* Headline */}
          <header className="text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#e50914]/90">
              FlixPick
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[0.95] tracking-wide text-slate-100 sm:text-6xl lg:text-7xl">
              Stop Scrolling.{" "}
              <span className="bg-gradient-to-r from-[#e50914] to-[#ff4d4d] bg-clip-text text-transparent">
                Start Watching.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
              Tell us your mood, pick your platforms. We&apos;ll find your
              perfect movie in seconds.
            </p>
          </header>

          {/* Cinematic result */}
          {pickResult && (
            <div
              ref={rouletteSectionRef}
              className="cinematic-reveal relative mt-8 flex min-h-[300px] w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60"
            >
              {backdropUrl && (
                <Image
                  src={backdropUrl}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/93 to-[#0a0a0f]/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-[#0a0a0f]/30" />

              {recommendLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <span className="flex items-center gap-3 text-sm font-medium text-slate-200">
                    <span className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-[#e50914]" />
                    Finding your next pick…
                  </span>
                </div>
              )}

              <div className="relative z-10 flex min-h-[300px] flex-col gap-8 p-6 sm:p-10 lg:flex-row lg:items-center lg:gap-12">
                {posterUrl && (
                  <div className="relative mx-auto aspect-[2/3] w-[200px] shrink-0 overflow-hidden rounded-xl border border-white/15 shadow-2xl sm:w-[250px] lg:mx-0">
                    <Image
                      src={posterUrl}
                      alt={`${pickResult.title} poster`}
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-center text-center lg:text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e50914] drop-shadow-sm">
                    Tonight&apos;s pick
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide text-white drop-shadow-lg sm:text-5xl">
                    {pickResult.title}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-200 lg:justify-start">
                    <span>{getReleaseYear(pickResult.releaseDate)}</span>
                    <span className="text-white/20">•</span>
                    <span className="flex items-center gap-1">
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                      {pickResult.voteAverage.toFixed(1)}
                    </span>
                    {pickResult.genres.slice(0, 3).map((g) => (
                      <span
                        key={g.id}
                        className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-200"
                      >
                        {getGenreDisplayName(g.id, g.name)}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-100/90 sm:line-clamp-5 sm:text-base">
                    {pickResult.overview}
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                    {trailerUrl && (
                      <button
                        type="button"
                        onClick={() => setTrailerOpen(true)}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[#0a0a0f] transition hover:bg-slate-200"
                      >
                        <Play className="size-4 fill-current" />
                        Watch Trailer
                      </button>
                    )}
                    {pickDetailHref && (
                      <Link
                        href={pickDetailHref}
                        className="inline-flex h-12 items-center justify-center rounded-lg bg-[#e50914] px-6 text-sm font-semibold text-white transition hover:bg-[#f6121d]"
                      >
                        View Full Details
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleRollAgain}
                      disabled={recommendLoading}
                      className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/10 disabled:opacity-50"
                    >
                      Roll Again
                    </button>
                    <button
                      type="button"
                      onClick={handleChangeMood}
                      disabled={recommendLoading}
                      className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 px-6 text-sm font-medium text-slate-400 transition hover:border-white/25 hover:text-slate-200 disabled:opacity-50"
                    >
                      Change Mood
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative z-10 border-t border-white/10 px-4 py-4 sm:px-6">
                <AdBanner
                  adClient={AD_CLIENT}
                  adSlot="2222222222"
                  className="mx-auto max-w-3xl"
                />
              </div>
            </div>
          )}

          {/* Picker + wheel (above the fold) */}
          {!pickResult && (
            <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-6 sm:gap-8">
              {/* Media type toggle */}
              <div className="w-full max-w-md">
                <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-slate-500">
                  What are you in the mood for?
                </p>
                <div
                  className="flex justify-center gap-2"
                  role="group"
                  aria-label="Select media type"
                >
                  {MEDIA_TYPE_OPTIONS.map((option) => {
                    const selected = selectedMediaType === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setSelectedMediaType(option.value)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                          selected
                            ? "border-[#e50914] bg-[#e50914]/15 text-white shadow-[0_0_20px_rgba(229,9,20,0.25)]"
                            : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                        )}
                      >
                        <span aria-hidden>{option.icon}</span>
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mood pills */}
              <div
                id="mood-selection"
                ref={moodSectionRef}
                className="w-full max-w-4xl scroll-mt-24"
              >
                <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-slate-500">
                  How are you feeling tonight?
                </p>
                <div
                  className="flex flex-wrap justify-center gap-2"
                  role="group"
                  aria-label="Select your mood"
                >
                  {FLIXPICK_MOODS.map((mood) => {
                    const selected = selectedMoodIds.includes(mood.id);
                    return (
                      <button
                        key={mood.id}
                        type="button"
                        role="checkbox"
                        aria-checked={selected}
                        onClick={() => handleMoodSelect(mood.id)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all duration-300",
                          selected
                            ? "border-[#e50914] bg-[#e50914]/15 text-white shadow-[0_0_20px_rgba(229,9,20,0.25)]"
                            : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                        )}
                      >
                        <span aria-hidden>{mood.icon}</span>
                        <span className="whitespace-nowrap">{mood.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Platform icon pills */}
              <div
                ref={platformSectionRef}
                className="w-full max-w-3xl scroll-mt-24"
              >
                <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                    Where do you watch?
                  </p>
                  <button
                    type="button"
                    onClick={toggleAllPlatforms}
                    aria-pressed={isAllPlatformsSelected}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-all",
                      isAllPlatformsSelected
                        ? "border-[#e50914]/60 bg-[#e50914]/10 text-[#e50914]"
                        : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300",
                    )}
                  >
                    Any Platform
                  </button>
                </div>
                <div
                  className="flex flex-wrap justify-center gap-2"
                  role="group"
                  aria-label="Streaming platforms"
                >
                  {streamingPlatforms.map((platform) => {
                    const selected = selectedPlatformIds.includes(platform.id);
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        role="checkbox"
                        aria-checked={selected}
                        aria-label={platform.name}
                        title={platform.name}
                        onClick={() => togglePlatform(platform.id)}
                        className={cn(
                          "transition-all",
                          selected ? "scale-110" : "opacity-70 hover:opacity-100",
                        )}
                      >
                        <TmdbProviderLogo
                          logoUrl={platform.logoUrl}
                          name={platform.name}
                          size={44}
                          selected={selected}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {recommendError && (
                <p
                  role="alert"
                  className="max-w-md rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
                >
                  {recommendError}
                </p>
              )}

              {/* Roulette + CTA */}
              <div
                ref={rouletteSectionRef}
                className="flex w-full max-w-lg flex-col items-center"
              >
                <div
                  ref={rouletteRef}
                  className={cn(
                    "w-full",
                    "[&>div>button]:h-14 [&>div>button]:min-w-[260px] [&>div>button]:rounded-xl [&>div>button]:text-lg [&>div>button]:font-bold [&>div>button]:shadow-[0_8px_32px_rgba(229,9,20,0.35)]",
                    "[&>div>button]:transition-transform [&>div>button]:hover:scale-[1.02]",
                    "[&>div]:gap-5 [&>div>div:first-child]:scale-[0.85] sm:[&>div>div:first-child]:scale-90",
                  )}
                >
                  <RouletteWheel
                    onSpin={handleSpin}
                    result={pickResult}
                    isLoading={recommendLoading}
                    spinDisabled={!selectedMoodId}
                  />
                </div>
                {!selectedMoodId && (
                  <p className="mt-3 text-center text-xs text-slate-500">
                    Select a mood to unlock Find My Movie
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Hidden roulette host for Roll Again when result is showing */}
      {pickResult && (
        <div
          ref={rouletteRef}
          className="pointer-events-none fixed -left-[9999px] opacity-0"
          aria-hidden
        >
          <RouletteWheel
            onSpin={handleSpin}
            result={pickResult}
            isLoading={recommendLoading}
            spinDisabled={!selectedMoodId}
            onChangeMood={handleChangeMood}
          />
        </div>
      )}

      {/* Trending */}
      <SectionReveal className="border-t border-white/5 bg-[#07070b] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 border-l-4 border-[#e50914] pl-5 shadow-[0_0_20px_rgba(229,9,20,0.35)]">
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-slate-100 sm:text-4xl">
              Trending Tonight 🔥
            </h2>
            <p className="mt-2 max-w-lg text-sm text-slate-500">
              What everyone&apos;s watching right now.
            </p>
          </div>

          {trendingError && (
            <p
              role="alert"
              className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
            >
              {trendingError}
            </p>
          )}

          <div className="relative">
            {trendingScroll.canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollTrending("left")}
                aria-label="Scroll trending left"
                className="absolute -left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0a0a0f]/95 text-slate-200 shadow-lg backdrop-blur-sm transition hover:border-white/30 hover:bg-[#12121a] sm:left-0"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {trendingScroll.canScrollRight && (
              <button
                type="button"
                onClick={() => scrollTrending("right")}
                aria-label="Scroll trending right"
                className="absolute -right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0a0a0f]/95 text-slate-200 shadow-lg backdrop-blur-sm transition hover:border-white/30 hover:bg-[#12121a] sm:right-0"
              >
                <ChevronRight className="size-5" />
              </button>
            )}

            <div
              ref={trendingScrollRef}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {trendingLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <MovieCardSkeleton
                    key={`trending-skeleton-${i}`}
                    className="snap-start"
                  />
                ))}

              {!trendingLoading &&
                trendingMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    showAvailability
                    className="snap-start"
                  />
                ))}

              {!trendingLoading &&
                !trendingError &&
                trendingMovies.length === 0 && (
                  <p className="snap-start text-slate-500">
                    No trending movies right now.
                  </p>
                )}
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Footer ad */}
      <SectionReveal className="border-t border-white/5 px-4 py-10 sm:px-6 lg:px-8">
        <AdBanner
          adClient={AD_CLIENT}
          adSlot="1111111111"
          className="mx-auto max-w-4xl"
        />
      </SectionReveal>

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        youtubeKey={trailerUrl ? youtubeKeyFromUrl(trailerUrl) : null}
        title={pickResult?.title}
      />
    </div>
  );
}
