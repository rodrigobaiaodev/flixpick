"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clapperboard, ExternalLink, Play, Share2, Shuffle, Star, Tv } from "lucide-react";
import { createMatch } from "@/actions/createMatch";
import { AdBanner } from "@/components/shared/AdBanner";
import { FLIXPICK_MOODS, MoodIcon } from "@/components/shared/MoodButton";
import {
  getGenreDisplayName,
  movieSlug,
  MovieCard,
  MovieCardSkeleton,
} from "@/components/shared/MovieCard";
import {
  STREAMING_PLATFORMS,
  getAllTmdbDiscoverIds,
  getTmdbDiscoverIdsBySlug,
  type StreamingPlatform,
} from "@/lib/streaming-platforms";
import { MOOD_REFINE_GENRES } from "@/lib/providers-moods";
import { TmdbProviderLogo } from "@/components/shared/TmdbProviderLogo";
import { RouletteWheel } from "@/components/shared/RouletteWheel";
import { TrailerModal } from "@/components/shared/TrailerModal";
import { getWhereToWatchUrlForMovie } from "@/lib/watch-links";
import { cn } from "@/lib/utils";
import type { ContentItem, RecommendMediaType } from "@/types/movie";
import type { LucideIcon } from "lucide-react";

const AD_CLIENT = "ca-pub-XXXXXXXX";

const STORAGE_KEYS = {
  mood: "flixpick:selectedMood",
  platforms: "flixpick:selectedPlatforms",
  lastPick: "flixpick:lastPick",
  excludeIds: "flixpick:excludeIds",
} as const;

function resolveProviderIds(selectedPlatformSlugs: string[]): number[] {
  if (selectedPlatformSlugs.length === 0) {
    return getAllTmdbDiscoverIds();
  }

  const ids = selectedPlatformSlugs.flatMap((slug) =>
    getTmdbDiscoverIdsBySlug(slug),
  );

  return ids.length > 0 ? ids : getAllTmdbDiscoverIds();
}

interface RecommendResponse {
  movie: ContentItem;
  trailerUrl: string | null;
  mediaType?: ContentItem["mediaType"];
}

interface TrendingResponse {
  movies: ContentItem[];
  page: number;
  totalResults: number;
}

interface FeaturedResponse {
  movies: ContentItem[];
}

interface StoredLastPick {
  movie: ContentItem;
  trailerUrl: string | null;
  savedAt: string;
}

const MEDIA_TYPE_OPTIONS: {
  value: RecommendMediaType;
  label: string;
  Icon: LucideIcon;
}[] = [
  { value: "movie", label: "Movies", Icon: Clapperboard },
  { value: "tv", label: "TV Shows", Icon: Tv },
  { value: "both", label: "Both", Icon: Shuffle },
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

function tmdbImageUrl(
  path: string | null,
  size: "w500" | "w1280" | "original" = "w500",
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
  const [selectedRefineGenreId, setSelectedRefineGenreId] = useState<
    number | null
  >(null);
  const [selectedRefineLabel, setSelectedRefineLabel] = useState<string | null>(
    null,
  );
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

  const [featuredMovies, setFeaturedMovies] = useState<ContentItem[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [pickWatchHref, setPickWatchHref] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const heroBackdrops = useMemo(
    () =>
      trendingMovies
        .map((m) => tmdbImageUrl(m.backdropPath, "original"))
        .filter((url): url is string => Boolean(url)),
    [trendingMovies],
  );

  useEffect(() => {
    const savedMood = readJson<string>(STORAGE_KEYS.mood);
    const savedPlatforms = readJson<string[]>(STORAGE_KEYS.platforms);
    const savedExclude = readJson<number[]>(STORAGE_KEYS.excludeIds);
    const savedPick = readJson<StoredLastPick>(STORAGE_KEYS.lastPick);
    const moodFromUrl = new URLSearchParams(window.location.search).get("mood");

    if (moodFromUrl && FLIXPICK_MOODS.some((m) => m.id === moodFromUrl)) {
      setSelectedMoodId(moodFromUrl);
      setSelectedRefineGenreId(null);
      setSelectedRefineLabel(null);
      setPickResult(null);
      setTrailerUrl(null);
      localStorage.removeItem(STORAGE_KEYS.lastPick);
      requestAnimationFrame(() => {
        moodSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } else if (savedMood && FLIXPICK_MOODS.some((m) => m.id === savedMood)) {
      setSelectedMoodId(savedMood);
      if (savedPick?.movie) {
        setPickResult(savedPick.movie);
        setTrailerUrl(savedPick.trailerUrl ?? null);
      }
    } else if (savedPick?.movie) {
      setPickResult(savedPick.movie);
      setTrailerUrl(savedPick.trailerUrl ?? null);
    }

    if (Array.isArray(savedPlatforms)) {
      setSelectedPlatformIds(savedPlatforms);
    }
    if (Array.isArray(savedExclude)) {
      setExcludeIds(savedExclude);
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

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      setFeaturedLoading(true);
      setFeaturedError(null);
      try {
        const response = await fetch("/api/featured");
        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body.error ?? "Failed to load editor's picks");
        }
        const data = (await response.json()) as FeaturedResponse;
        if (!cancelled) {
          setFeaturedMovies(data.movies ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          setFeaturedError(
            error instanceof Error ? error.message : "Something went wrong",
          );
        }
      } finally {
        if (!cancelled) setFeaturedLoading(false);
      }
    }

    void loadFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (heroBackdrops.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlideIndex((i) => (i + 1) % heroBackdrops.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBackdrops.length]);

  useEffect(() => {
    if (!pickResult) {
      setPickWatchHref(null);
      return;
    }

    const movie = pickResult;
    const localUrl = getWhereToWatchUrlForMovie(movie);
    const hasProviders = movie.availability.some((region) =>
      region.options.some((o) => o.type === "flatrate"),
    );

    if (hasProviders) {
      setPickWatchHref(localUrl);
      return;
    }

    let cancelled = false;

    async function fetchWatchUrl() {
      try {
        const params = new URLSearchParams({
          id: String(movie.id),
          title: movie.title,
          mediaType: movie.mediaType,
        });
        const response = await fetch(`/api/watch-url?${params.toString()}`);
        if (!response.ok) return;
        const data = (await response.json()) as { url?: string };
        if (!cancelled) {
          setPickWatchHref(data.url ?? localUrl);
        }
      } catch {
        if (!cancelled) setPickWatchHref(localUrl);
      }
    }

    void fetchWatchUrl();
    return () => {
      cancelled = true;
    };
  }, [pickResult]);

  const handleMoodSelect = useCallback((moodId: string) => {
    setSelectedMoodId(moodId);
    setSelectedRefineGenreId(null);
    setSelectedRefineLabel(null);
    setRecommendError(null);

    requestAnimationFrame(() => {
      platformSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const handleRefineGenreToggle = useCallback(
    (genre: { id: number; label: string }) => {
      setSelectedRefineLabel((prevLabel) => {
        if (prevLabel === genre.label) {
          setSelectedRefineGenreId(null);
          return null;
        }
        setSelectedRefineGenreId(genre.id);
        return genre.label;
      });
    },
    [],
  );

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
            excludeIds: excludeIdsForRequest,
            mediaType: selectedMediaType,
            ...(selectedRefineGenreId
              ? { genreId: selectedRefineGenreId }
              : {}),
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
    [
      selectedMoodId,
      selectedPlatformIds,
      excludeIds,
      selectedMediaType,
      selectedRefineGenreId,
    ],
  );

  const handleRollAgain = useCallback(() => {
    if (!pickResult || !selectedMoodId) return;
    void handleSpin(pickResult.id);
  }, [pickResult, selectedMoodId, handleSpin]);

  const handleChangeMood = useCallback(() => {
    setPickResult(null);
    setTrailerUrl(null);
    setRecommendError(null);
    setSelectedRefineGenreId(null);
    setSelectedRefineLabel(null);
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

  const showShareToast = useCallback((message: string) => {
    setShareToast(message);
    window.setTimeout(() => setShareToast(null), 2500);
  }, []);

  const handleChallengeFriend = useCallback(async () => {
    if (!pickResult || !selectedMoodId || shareLoading) return;

    setShareLoading(true);
    try {
      const code = await createMatch({
        contentId: pickResult.id,
        contentTitle: pickResult.title,
        posterPath: pickResult.posterPath,
        backdropPath: pickResult.backdropPath,
        mood: selectedMoodId,
        platforms: selectedPlatformIds,
        mediaType: pickResult.mediaType === "tv" ? "tv" : "movie",
      });

      const url = `https://flixpick.app/match/${code}`;
      const message = `FlixPick chose ${pickResult.title} for us tonight 🎬 Do you agree or want to roll your own? ${url}`;

      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        try {
          await navigator.share({
            title: `FlixPick: ${pickResult.title}`,
            text: message,
            url,
          });
          return;
        } catch (shareError) {
          if (
            shareError instanceof DOMException &&
            shareError.name === "AbortError"
          ) {
            return;
          }
          /* fall through to clipboard */
        }
      }

      await navigator.clipboard.writeText(message);
      showShareToast("Link copied!");
    } catch (error) {
      showShareToast(
        error instanceof Error ? error.message : "Could not create share link",
      );
    } finally {
      setShareLoading(false);
    }
  }, [
    pickResult,
    selectedMoodId,
    selectedPlatformIds,
    shareLoading,
    showShareToast,
  ]);

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
      left:
        direction === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75,
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
  const refineGenreOptions = selectedMoodId
    ? MOOD_REFINE_GENRES[selectedMoodId] ?? []
    : [];
  const pickDetailHref = pickResult
    ? `/${pickResult.mediaType === "tv" ? "tv" : "movie"}/${pickResult.id}/${movieSlug(pickResult.title)}`
    : null;
  const posterUrl = pickResult
    ? tmdbImageUrl(pickResult.posterPath, "w500")
    : null;
  const backdropUrl = pickResult
    ? tmdbImageUrl(pickResult.backdropPath, "w1280")
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
        @keyframes hero-backdrop-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
        .hero-backdrop-active {
          animation: hero-backdrop-fade 1.2s ease-in-out forwards;
        }
        .cinematic-reveal {
          animation: cinematic-reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }
      `}</style>

      {/* Full-screen cinematic hero */}
      <section className="relative flex min-h-screen min-h-[100dvh] flex-col overflow-hidden">
        {/* Rotating backdrop slideshow */}
        {heroBackdrops.length > 0 && !pickResult && (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {heroBackdrops.map((url, index) => (
              <Image
                key={url}
                src={url}
                alt=""
                fill
                className={cn(
                  "object-cover transition-opacity duration-[1200ms]",
                  index === heroSlideIndex
                    ? "opacity-40 hero-backdrop-active"
                    : "opacity-0",
                )}
                unoptimized
                priority={index === 0}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/70 via-[#0a0a0f]/85 to-[#0a0a0f]" />
          </div>
        )}

        {/* Fallback background when no trending backdrops */}
        {(heroBackdrops.length === 0 || pickResult) && (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#1a0a0a] to-[#0a0a0f]"
            aria-hidden
          />
        )}

        <div
          className="hero-orb pointer-events-none absolute left-1/2 top-[28%] size-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e50914]/20 blur-[100px]"
          aria-hidden
        />

        {/* Film grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 pt-8 sm:px-6 sm:pt-12 lg:px-8">
          {/* Headline */}
          <header className="text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#e50914]/90">
              FlixPick
            </p>
            <h1 className="font-[family-name:var(--font-display)] leading-[0.95] tracking-wide text-slate-100">
              Stop Scrolling.{" "}
              <span className="bg-gradient-to-r from-[#e50914] to-[#ff4d4d] bg-clip-text text-transparent">
                Start Watching.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Tell us your mood, pick your platforms. We&apos;ll find your
              perfect movie in seconds.
            </p>
          </header>

          {/* Cinematic roulette result */}
          {pickResult && (
            <div
              ref={rouletteSectionRef}
              className="cinematic-reveal relative mt-6 flex min-h-[320px] w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60 sm:mt-8"
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/93 to-[#0a0a0f]/75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-[#0a0a0f]/30" />

              {recommendLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <span className="flex items-center gap-3 text-sm font-medium text-slate-200">
                    <span className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-[#e50914]" />
                    Finding your next pick…
                  </span>
                </div>
              )}

              <div className="relative z-10 flex min-h-[320px] flex-col gap-6 p-5 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
                {posterUrl && (
                  <div className="relative mx-auto aspect-[2/3] w-full max-w-[200px] shrink-0 overflow-hidden rounded-xl border border-white/15 shadow-2xl sm:max-w-[220px] lg:max-w-[250px] lg:mx-0">
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

                <div className="flex flex-1 flex-col justify-center text-center sm:text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e50914] drop-shadow-sm">
                    Tonight&apos;s pick
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-display)] tracking-wide text-white drop-shadow-lg">
                    {pickResult.title}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-200 sm:justify-start">
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
                  <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-100/90 sm:line-clamp-5">
                    {pickResult.overview}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {trailerUrl && (
                      <button
                        type="button"
                        onClick={() => setTrailerOpen(true)}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[#0a0a0f] transition hover:bg-slate-200"
                      >
                        <Play className="size-4 fill-current" />
                        Watch Trailer
                      </button>
                    )}
                    {pickWatchHref && (
                      <a
                        href={pickWatchHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#e50914] px-6 text-sm font-semibold text-white transition hover:bg-[#f6121d]"
                      >
                        <ExternalLink className="size-4" />
                        Where to Watch
                      </a>
                    )}
                    {pickDetailHref && (
                      <Link
                        href={pickDetailHref}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                      >
                        View Details
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => void handleChallengeFriend()}
                      disabled={shareLoading || !selectedMoodId}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#e50914]/40 bg-[#e50914]/10 px-6 text-sm font-semibold text-[#ff6b6b] transition hover:border-[#e50914]/60 hover:bg-[#e50914]/20 disabled:opacity-50"
                    >
                      <Share2 className="size-4" />
                      {shareLoading ? "Creating link…" : "🎬 Challenge a Friend"}
                    </button>
                    <button
                      type="button"
                      onClick={handleRollAgain}
                      disabled={recommendLoading}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/10 disabled:opacity-50"
                    >
                      Roll Again
                    </button>
                    <button
                      type="button"
                      onClick={handleChangeMood}
                      disabled={recommendLoading}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/10 px-6 text-sm font-medium text-slate-400 transition hover:border-white/25 hover:text-slate-200 disabled:opacity-50"
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

          {/* Picker (above the fold) */}
          {!pickResult && (
            <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-5 sm:mt-8 sm:gap-7">
              {/* Media type toggle */}
              <div className="w-full max-w-md">
                <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-slate-500">
                  What are you in the mood for?
                </p>
                <div
                  className="flex flex-wrap justify-center gap-2"
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
                          "btn-compact inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                          selected
                            ? "border-[#e50914] bg-[#e50914]/15 text-[#e50914] shadow-[0_0_20px_rgba(229,9,20,0.25)]"
                            : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                        )}
                      >
                        <MoodIcon Icon={option.Icon} selected={selected} size={18} />
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
                          "btn-compact inline-flex min-h-[44px] items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all duration-300",
                          selected
                            ? "border-[#e50914] bg-[#e50914]/15 text-[#e50914] shadow-[0_0_20px_rgba(229,9,20,0.25)]"
                            : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                        )}
                      >
                        <span aria-hidden className="text-base leading-none">
                          {mood.emoji}
                        </span>
                        <span className="whitespace-nowrap">{mood.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedMoodId && refineGenreOptions.length > 0 && (
                <div className="w-full max-w-3xl">
                  <p className="mb-2 text-center text-[11px] font-medium tracking-wide text-slate-500">
                    Refine by genre (optional):
                  </p>
                  <div
                    className="flex flex-wrap justify-center gap-1.5"
                    role="group"
                    aria-label="Optional genre refine"
                  >
                    {refineGenreOptions.map((genre) => {
                      const selected = selectedRefineLabel === genre.label;
                      return (
                        <button
                          key={`${genre.label}-${genre.id}`}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => handleRefineGenreToggle(genre)}
                          className={cn(
                            "inline-flex min-h-[32px] items-center rounded-md border px-2.5 py-1 text-[11px] font-medium transition",
                            selected
                              ? "border-amber-500/50 bg-amber-500/10 text-amber-200"
                              : "border-white/8 bg-transparent text-slate-500 hover:border-white/15 hover:text-slate-300",
                          )}
                        >
                          {genre.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Platform pills — horizontal scroll on mobile */}
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
                      "btn-compact rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-all",
                      isAllPlatformsSelected
                        ? "border-[#e50914]/60 bg-[#e50914]/10 text-[#e50914]"
                        : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300",
                    )}
                  >
                    Any Platform
                  </button>
                </div>
                <div
                  className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
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
                          "btn-compact shrink-0 transition-all",
                          selected ? "scale-110" : "opacity-70 hover:opacity-100",
                        )}
                      >
                        <TmdbProviderLogo
                          logoUrl={platform.logoUrl}
                          name={platform.name}
                          tmdbProviderId={platform.tmdbProviderId}
                          fallbackLabel={platform.fallbackLabel}
                          fallbackBackground={platform.fallbackBackground}
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
                    "[&>div>button]:min-h-[44px] [&>div>button]:min-w-[260px] [&>div>button]:rounded-xl [&>div>button]:text-lg [&>div>button]:font-bold [&>div>button]:shadow-[0_8px_32px_rgba(229,9,20,0.35)]",
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
      <SectionReveal className="border-t border-white/5 bg-[#07070b] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4 border-l-4 border-[#e50914] pl-5 shadow-[0_0_20px_rgba(229,9,20,0.35)]">
            <div>
              <h2 className="font-[family-name:var(--font-display)] tracking-wide text-slate-100">
                Trending Now 🔥
              </h2>
              <p className="mt-2 max-w-lg text-sm text-slate-500">
                What everyone&apos;s watching right now.
              </p>
            </div>
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
                className="absolute -left-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0a0a0f]/95 text-slate-200 shadow-lg backdrop-blur-sm transition hover:border-white/30 hover:bg-[#12121a] sm:left-0"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {trendingScroll.canScrollRight && (
              <button
                type="button"
                onClick={() => scrollTrending("right")}
                aria-label="Scroll trending right"
                className="absolute -right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0a0a0f]/95 text-slate-200 shadow-lg backdrop-blur-sm transition hover:border-white/30 hover:bg-[#12121a] sm:right-0"
              >
                <ChevronRight className="size-5" />
              </button>
            )}

            <div
              ref={trendingScrollRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
            >
              {trendingLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <MovieCardSkeleton
                    key={`trending-skeleton-${i}`}
                    className="w-[140px] shrink-0 snap-start sm:w-[180px] md:w-[200px]"
                  />
                ))}

              {!trendingLoading &&
                trendingMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    showAvailability
                    className="w-[140px] shrink-0 snap-start sm:w-[180px] md:w-[200px]"
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

      {/* Editor's Picks */}
      <SectionReveal className="border-t border-white/5 bg-[#0a0a0f] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 border-l-4 border-[#e50914] pl-5 shadow-[0_0_20px_rgba(229,9,20,0.35)]">
            <h2 className="font-[family-name:var(--font-display)] tracking-wide text-slate-100">
              Editor&apos;s Picks
            </h2>
            <p className="mt-2 max-w-lg text-sm text-slate-500">
              Hand-curated masterpieces — rated 8.0+ by thousands of viewers.
            </p>
          </div>

          {featuredError && (
            <p
              role="alert"
              className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
            >
              {featuredError}
            </p>
          )}

          <div className="flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-3 xl:grid-cols-6 [&::-webkit-scrollbar]:hidden">
            {featuredLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <MovieCardSkeleton
                  key={`featured-skeleton-${i}`}
                  className="w-[140px] shrink-0 snap-start sm:w-[180px] md:w-full md:shrink md:snap-align-none"
                />
              ))}

            {!featuredLoading &&
              featuredMovies.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  showAvailability
                  priority={index < 3}
                  className="w-[140px] shrink-0 snap-start sm:w-[180px] md:w-full md:shrink md:snap-align-none"
                />
              ))}
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

      {shareToast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-lg border border-white/15 bg-[#12121a] px-4 py-3 text-sm font-medium text-white shadow-xl"
        >
          {shareToast}
        </div>
      )}
    </div>
  );
}
