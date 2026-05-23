"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Clock, Play, Star } from "lucide-react";
import { AdBanner } from "@/components/shared/AdBanner";
import { getGenreDisplayName, MovieCard } from "@/components/shared/MovieCard";
import { STREAMING_PLATFORMS } from "@/components/shared/PlatformSelector";
import { TrailerModal } from "@/components/shared/TrailerModal";
import type { Movie, Person } from "@/types/movie";

const AD_CLIENT = "ca-pub-XXXXXXXX";

interface MovieDetailContentProps {
  movie: Movie;
  cast: Person[];
  similar: Movie[];
  trailerKey: string | null;
}

function formatRuntime(minutes: number | null): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function MovieDetailContent({
  movie,
  cast,
  similar,
  trailerKey,
}: MovieDetailContentProps) {
  const router = useRouter();
  const [trailerOpen, setTrailerOpen] = useState(false);

  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;
  const backdropUrl = movie.backdropPath
    ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
    : null;

  const flatrateProviders = movie.availability.flatMap((a) =>
    a.options.filter((o) => o.type === "flatrate").map((o) => o.provider),
  );

  const providerIds = new Set(flatrateProviders.map((p) => p.id));
  const matchedPlatforms = STREAMING_PLATFORMS.filter(
    (p) => p.tmdbProviderId && providerIds.has(p.tmdbProviderId),
  );

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0f]">
        {/* Hero */}
        <section className="relative min-h-[420px] overflow-hidden border-b border-white/10">
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt=""
              fill
              className="object-cover"
              priority
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/92 to-[#0a0a0f]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/40" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/40 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-sm transition hover:border-white/30 hover:bg-black/60"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>

            <div className="mx-auto max-w-4xl py-4">
              <AdBanner
                adClient={AD_CLIENT}
                adSlot="3333333331"
                className="mb-8"
              />
            </div>

            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
              {posterUrl && (
                <div className="mx-auto w-[200px] shrink-0 lg:sticky lg:top-24 lg:mx-0 lg:w-[250px]">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
                    <Image
                      src={posterUrl}
                      alt={`${movie.title} poster`}
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 text-center lg:text-left">
                {movie.tagline && (
                  <p className="text-sm italic text-slate-400">{movie.tagline}</p>
                )}
                <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide text-white sm:text-5xl lg:text-6xl">
                  {movie.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300 lg:justify-start">
                  <span>{movie.releaseDate?.slice(0, 4) || "—"}</span>
                  <span className="text-white/20">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-4" />
                    {formatRuntime(movie.runtimeMinutes)}
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {movie.voteAverage.toFixed(1)}
                  </span>
                </div>

                <ul className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {movie.genres.map((genre) => (
                    <li key={genre.id}>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                        {getGenreDisplayName(genre.id, genre.name)}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-base leading-relaxed text-slate-200">
                  {movie.overview || "No synopsis available."}
                </p>

                {trailerKey && (
                  <button
                    type="button"
                    onClick={() => setTrailerOpen(true)}
                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[#0a0a0f] transition hover:bg-slate-200"
                  >
                    <Play className="size-4 fill-current" />
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <AdBanner adClient={AD_CLIENT} adSlot="3333333332" className="mb-12" />

          {/* Cast */}
          {cast.length > 0 && (
            <section className="mb-12">
              <h2 className="border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]">
                Cast
              </h2>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {cast.map((person) => (
                  <li
                    key={person.id}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center"
                  >
                    <p className="text-sm font-semibold text-white">{person.name}</p>
                    {person.character && (
                      <p className="mt-1 text-xs text-slate-400">
                        {person.character}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Where to Watch */}
          <section id="where-to-watch" className="mb-12 scroll-mt-24">
            <h2 className="border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]">
              Where to Watch
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Available on these platforms in the US.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {matchedPlatforms.length > 0 ? (
                matchedPlatforms.map((platform) => (
                  <span
                    key={platform.id}
                    className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-sm text-slate-200"
                  >
                    {platform.name}
                  </span>
                ))
              ) : (
                <p className="text-slate-500">
                  Streaming availability is not listed for the US region right now.
                </p>
              )}
            </div>
          </section>

          <AdBanner adClient={AD_CLIENT} adSlot="3333333333" className="mb-12" />

          {/* Similar */}
          {similar.length > 0 && (
            <section>
              <h2 className="border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]">
                Similar Movies
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {similar.map((similarMovie) => (
                  <MovieCard key={similarMovie.id} movie={similarMovie} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        youtubeKey={trailerKey}
        title={movie.title}
      />
    </>
  );
}
