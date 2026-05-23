"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";
import { getGenreDisplayName } from "@/components/shared/MovieCard";

const WHEEL_SEGMENTS = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Classic",
] as const;

const SPIN_DURATION_MS = 4200;

export interface RouletteWheelProps {
  onSpin: () => void | Promise<void>;
  result?: Movie | null;
  isLoading?: boolean;
  spinDisabled?: boolean;
  className?: string;
  segments?: readonly string[];
  onChangeMood?: () => void;
}

type WheelPhase = "idle" | "spinning" | "snapping" | "result";

function posterSrc(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `https://image.tmdb.org/t/p/w500${path}`;
}

function backdropSrc(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `https://image.tmdb.org/t/p/original${path}`;
}

function ShimmerSlot({
  variant,
  pulseDelay,
}: {
  variant: "side" | "center";
  pulseDelay?: string;
}) {
  const isCenter = variant === "center";

  return (
    <div
      className={cn(
        "relative aspect-[2/3] overflow-hidden rounded-lg border bg-[#12121a]",
        isCenter
          ? "w-[108px] border-[#e50914]/40 shadow-[0_0_28px_rgba(229,9,20,0.25)] sm:w-[120px]"
          : "w-[72px] border-white/10 opacity-60 blur-sm sm:w-[80px]",
      )}
      style={pulseDelay ? { animationDelay: pulseDelay } : undefined}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#12121a] to-[#0a0a0f]",
          isCenter ? "animate-slot-pulse" : "animate-slot-pulse-slow",
        )}
      />
      <div
        className="slot-shimmer absolute inset-0 opacity-80"
        aria-hidden
      />
      {isCenter && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.35)_0%,transparent_70%)]" />
      )}
    </div>
  );
}

export function RouletteWheel({
  onSpin,
  result = null,
  isLoading = false,
  spinDisabled = false,
  className,
  segments: _segments = WHEEL_SEGMENTS,
  onChangeMood,
}: RouletteWheelProps) {
  const [phase, setPhase] = useState<WheelPhase>("idle");
  const [snapPulse, setSnapPulse] = useState(false);
  const spinResolveRef = useRef<(() => void) | null>(null);
  const resultRef = useRef(result);

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  const handleSpinEnd = useCallback(() => {
    setPhase("result");
    spinResolveRef.current?.();
    spinResolveRef.current = null;
  }, []);

  const handleFindMovie = async () => {
    if (isLoading || phase === "spinning" || phase === "snapping" || spinDisabled)
      return;

    setPhase("spinning");
    setSnapPulse(false);

    const spinPromise = new Promise<void>((resolve) => {
      spinResolveRef.current = resolve;
      setTimeout(resolve, SPIN_DURATION_MS);
    });

    try {
      await Promise.all([onSpin(), spinPromise]);

      if (!resultRef.current?.posterPath) {
        setPhase("idle");
        return;
      }

      setPhase("snapping");
      setSnapPulse(true);

      setTimeout(() => {
        setSnapPulse(false);
        handleSpinEnd();
      }, 500);
    } catch {
      setPhase("idle");
      setSnapPulse(false);
    }
  };

  const handleRollAgain = () => {
    setPhase("idle");
    void handleFindMovie();
  };

  useEffect(() => {
    if (!result && phase === "result") {
      setPhase("idle");
    }
  }, [result, phase]);

  const showShimmer =
    phase === "spinning" || phase === "snapping" || (phase === "idle" && !result);
  const showSnapPoster = phase === "snapping" && resultRef.current?.posterPath;
  const showResult = phase === "result" && result && !isLoading;

  const resultPoster = result ? posterSrc(result.posterPath) : null;
  const resultBackdrop = result ? backdropSrc(result.backdropPath) : null;

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      {/* Slot machine — CSS shimmer while spinning */}
      {showShimmer && !showResult && (
        <div className="relative w-full max-w-md">
          <div
            className="pointer-events-none absolute -inset-4 rounded-3xl bg-[#e50914]/10 blur-2xl"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f]/90 p-4 shadow-2xl shadow-black/60 backdrop-blur-sm">
            <div className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              {phase === "spinning" ? "Picking your film" : "Your match"}
            </div>
            <div className="flex items-center justify-center gap-3">
              <ShimmerSlot variant="side" pulseDelay="0s" />
              {showSnapPoster && resultPoster ? (
                <div
                  className={cn(
                    "relative aspect-[2/3] w-[108px] overflow-hidden rounded-lg border border-[#e50914]/60 shadow-[0_0_28px_rgba(229,9,20,0.45)] sm:w-[120px]",
                    snapPulse && "animate-slot-snap",
                  )}
                >
                  <Image
                    src={resultPoster}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent" />
                </div>
              ) : (
                <ShimmerSlot variant="center" pulseDelay="0.15s" />
              )}
              <ShimmerSlot variant="side" pulseDelay="0.3s" />
            </div>
            {snapPulse && (
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#e50914]/50 animate-ping"
                aria-hidden
              />
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      {!showResult && (
        <button
          type="button"
          onClick={() => void handleFindMovie()}
          disabled={
            isLoading ||
            phase === "spinning" ||
            phase === "snapping" ||
            spinDisabled
          }
          className={cn(
            "inline-flex h-12 min-w-[200px] items-center justify-center rounded-lg bg-[#e50914] px-8 text-base font-semibold text-white transition-colors",
            "hover:bg-[#f6121d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e50914]",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {isLoading || phase === "spinning" || phase === "snapping" ? (
            <span className="flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Finding your movie…
            </span>
          ) : (
            "Find My Movie"
          )}
        </button>
      )}

      {/* Cinematic result reveal */}
      {showResult && result && resultPoster && (
        <div className="slot-card-rise flex w-full max-w-2xl flex-col items-center gap-6">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-[#e50914]">
            Tonight&apos;s pick
          </p>

          <div className="relative w-full min-h-[300px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60">
            {resultBackdrop && (
              <Image
                src={resultBackdrop}
                alt=""
                fill
                className="object-cover"
                unoptimized
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/95 to-[#0a0a0f]/85" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-[#0a0a0f]/60" />

            <div className="relative z-10 flex min-h-[300px] flex-col items-center gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
              <div
                className={cn(
                  "relative aspect-[2/3] w-[200px] shrink-0 overflow-hidden rounded-xl border border-white/15 shadow-2xl",
                  "sm:w-[250px]",
                )}
              >
                <Image
                  src={resultPoster}
                  alt={`${result.title} poster`}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              </div>

              <div className="flex flex-1 flex-col text-center sm:text-left">
                <h3 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white drop-shadow-md sm:text-4xl">
                  {result.title}
                </h3>
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {result.genres.slice(0, 3).map((g) => (
                    <span
                      key={g.id}
                      className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-slate-100"
                    >
                      {getGenreDisplayName(g.id, g.name)}
                    </span>
                  ))}
                </div>
                {result.overview && (
                  <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-200 sm:line-clamp-5">
                    {result.overview}
                  </p>
                )}
              </div>
            </div>

            <div
              className="pointer-events-none absolute -inset-4 rounded-3xl bg-[#e50914]/15 blur-3xl"
              aria-hidden
            />
          </div>

          <div className="flex w-full max-w-xs flex-col gap-2">
            <button
              type="button"
              onClick={handleRollAgain}
              className="rounded-lg border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-slate-100"
            >
              Not feeling it? Roll Again
            </button>
            {onChangeMood && (
              <button
                type="button"
                onClick={onChangeMood}
                className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-white/20 hover:text-slate-200"
              >
                Change Mood
              </button>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slot-shimmer-slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes slot-pulse {
          0%,
          100% {
            opacity: 0.85;
            box-shadow: inset 0 0 24px rgba(229, 9, 20, 0.15);
          }
          50% {
            opacity: 1;
            box-shadow: inset 0 0 36px rgba(229, 9, 20, 0.35);
          }
        }
        @keyframes slot-snap {
          0% {
            transform: scale(1.1);
          }
          45% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes slot-card-rise {
          from {
            opacity: 0;
            transform: translateY(2.5rem) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .slot-shimmer {
          background: linear-gradient(
            105deg,
            transparent 35%,
            rgba(229, 9, 20, 0.12) 45%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(229, 9, 20, 0.12) 55%,
            transparent 65%
          );
          animation: slot-shimmer-slide 1.2s ease-in-out infinite;
        }
        .animate-slot-pulse {
          animation: slot-pulse 1.4s ease-in-out infinite;
        }
        .animate-slot-pulse-slow {
          animation: slot-pulse 1.8s ease-in-out infinite;
        }
        .animate-slot-snap {
          animation: slot-snap 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .slot-card-rise {
          animation: slot-card-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}
