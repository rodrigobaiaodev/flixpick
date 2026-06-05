"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Clock, Play, Star } from "lucide-react";
import { AdBanner } from "@/components/shared/AdBanner";
import { getGenreDisplayName, MovieCard } from "@/components/shared/MovieCard";
import {
  CastPhoto,
  TmdbProviderLogo,
} from "@/components/shared/TmdbProviderLogo";
import { TrailerModal } from "@/components/shared/TrailerModal";
import type { ContentItem, Genre, Person, StreamingProvider } from "@/types/movie";
import { cn } from "@/lib/utils";

const AD_CLIENT = "ca-pub-XXXXXXXX";

type DetailTab = "overview" | "cast" | "videos";

export interface ContentVideo {
  key: string;
  name: string;
  type: string;
  site: string;
}

export interface TechnicalDetailRow {
  label: string;
  value: string;
}

interface ContentDetailLayoutProps {
  mediaType: "movie" | "tv";
  title: string;
  originalTitle: string;
  tagline: string | null;
  releaseDate: string;
  metaSecondary: string;
  voteAverage: number;
  genres: Genre[];
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  cast: Person[];
  technicalDetails: TechnicalDetailRow[];
  watchProviders: StreamingProvider[];
  trailerKey: string | null;
  videos: ContentVideo[];
  similar: ContentItem[];
  similarSectionTitle: string;
  adSlots: { top: string; middle: string; bottom: string };
}

function RatingBadge({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-200">
      <Star className="size-4 fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
      <span className="text-xs font-normal text-amber-200/70">/10</span>
    </span>
  );
}

export function ContentDetailLayout({
  mediaType,
  title,
  originalTitle,
  tagline,
  releaseDate,
  metaSecondary,
  voteAverage,
  genres,
  overview,
  posterPath,
  backdropPath,
  cast,
  technicalDetails,
  watchProviders,
  trailerKey,
  videos,
  similar,
  similarSectionTitle,
  adSlots,
}: ContentDetailLayoutProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [activeVideoKey, setActiveVideoKey] = useState<string | null>(null);

  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : null;
  const backdropUrl = backdropPath
    ? `https://image.tmdb.org/t/p/original${backdropPath}`
    : null;

  const year = releaseDate?.slice(0, 4) || "—";
  const overviewCast = cast.slice(0, 6);
  const modalKey = activeVideoKey ?? trailerKey;

  const openVideo = (key: string) => {
    setActiveVideoKey(key);
    setTrailerOpen(true);
  };

  const closeTrailer = () => {
    setTrailerOpen(false);
    setActiveVideoKey(null);
  };

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "cast", label: "Cast" },
    { id: "videos", label: "Videos" },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0f]">
        <section className="relative min-h-screen overflow-hidden">
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt=""
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/85 to-[#0a0a0f]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/95 via-[#0a0a0f]/60 to-transparent" />

          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-8 pt-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-8 inline-flex w-fit items-center gap-2 rounded-lg border border-white/15 bg-black/40 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-sm transition hover:border-white/30 hover:bg-black/60"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>

            <div className="mt-auto flex flex-1 flex-col gap-10 pb-12 lg:flex-row lg:items-end lg:gap-14">
              {posterUrl && (
                <div className="mx-auto w-[220px] shrink-0 lg:sticky lg:top-28 lg:mx-0 lg:w-[280px] lg:self-start">
                  <div className="overflow-hidden rounded-2xl border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={posterUrl}
                        alt={`${title} poster`}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 text-center lg:pb-8 lg:text-left">
                <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-300">
                  {mediaType === "tv" ? "TV Series" : "Movie"}
                </span>
                <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight tracking-wide text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  {title}
                </h1>
                {originalTitle && originalTitle !== title && (
                  <p className="mt-2 text-base text-slate-400">{originalTitle}</p>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <span className="text-sm font-medium text-slate-200">{year}</span>
                  <span className="text-white/25">•</span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-200">
                    <Clock className="size-4 text-slate-400" />
                    {metaSecondary}
                  </span>
                  <span className="text-white/25">•</span>
                  <RatingBadge rating={voteAverage} />
                </div>

                <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {genres.map((genre) => (
                    <li key={genre.id}>
                      <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-200">
                        {getGenreDisplayName(genre.id, genre.name)}
                      </span>
                    </li>
                  ))}
                </ul>

                {tagline && (
                  <p className="mt-5 text-base italic text-slate-400">
                    &ldquo;{tagline}&rdquo;
                  </p>
                )}

                <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-200/90">
                  {overview || "No synopsis available."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdBanner adClient={AD_CLIENT} adSlot={adSlots.top} className="py-8" />

          <div className="border-b border-white/10">
            <nav
              className="flex gap-1 overflow-x-auto"
              aria-label="Content sections"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative shrink-0 px-5 py-4 text-sm font-semibold transition-colors",
                    activeTab === tab.id
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-300",
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#e50914]" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-10">
            {activeTab === "overview" && (
              <div className="space-y-12">
                {overviewCast.length > 0 && (
                  <section>
                    <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                      Top Cast
                    </h2>
                    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
                      {overviewCast.map((person) => (
                        <li key={person.id} className="text-center">
                          <CastPhoto
                            profilePath={person.profilePath}
                            name={person.name}
                            size={96}
                            square
                            className="mx-auto"
                          />
                          <p className="mt-3 text-sm font-semibold text-white">
                            {person.name}
                          </p>
                          {person.character && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              {person.character}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section>
                  <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                    Details
                  </h2>
                  <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {technicalDetails.map((row) => (
                      <div
                        key={row.label}
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                      >
                        <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                          {row.label}
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-slate-100">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <section
                  id="where-to-watch"
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 sm:p-8"
                >
                  <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                    Where to Watch
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Streaming availability in the US.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    {watchProviders.length > 0 ? (
                      watchProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className="flex flex-col items-center gap-2"
                        >
                          <TmdbProviderLogo
                            logoPath={provider.logoPath}
                            name={provider.name}
                            size={56}
                          />
                          <span className="max-w-[80px] text-center text-xs text-slate-300">
                            {provider.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">
                        Not currently listed for US streaming.
                      </p>
                    )}
                  </div>

                  {trailerKey && (
                    <button
                      type="button"
                      onClick={() => openVideo(trailerKey)}
                      className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#e50914] px-8 text-sm font-semibold text-white shadow-lg shadow-[#e50914]/25 transition hover:bg-[#f6121d]"
                    >
                      <Play className="size-4 fill-current" />
                      Watch Trailer
                    </button>
                  )}
                </section>
              </div>
            )}

            {activeTab === "cast" && (
              <section>
                <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                  Full Cast
                </h2>
                <ul className="flex gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
                  {cast.map((person) => (
                    <li
                      key={person.id}
                      className="w-[130px] shrink-0 text-center"
                    >
                      <CastPhoto
                        profilePath={person.profilePath}
                        name={person.name}
                        className="mx-auto"
                      />
                      <p className="mt-3 text-sm font-semibold text-white">
                        {person.name}
                      </p>
                      {person.character && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {person.character}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {activeTab === "videos" && (
              <section>
                <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                  Videos
                </h2>
                {videos.length > 0 ? (
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video) => (
                      <li key={video.key}>
                        <button
                          type="button"
                          onClick={() => openVideo(video.key)}
                          className="group w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-left transition hover:border-white/20"
                        >
                          <div className="relative aspect-video bg-black">
                            <Image
                              src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                              alt={video.name}
                              fill
                              className="object-cover opacity-90 transition group-hover:opacity-100"
                              unoptimized
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/20">
                              <Play className="size-10 fill-white text-white" />
                            </span>
                          </div>
                          <div className="p-3">
                            <p className="line-clamp-2 text-sm font-medium text-white">
                              {video.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {video.type}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">No videos available.</p>
                )}
              </section>
            )}
          </div>

          <AdBanner
            adClient={AD_CLIENT}
            adSlot={adSlots.middle}
            className="mb-12"
          />

          {similar.length > 0 && (
            <section className="pb-12">
              <h2 className="border-l-4 border-[#e50914] pl-4 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]">
                {similarSectionTitle}
              </h2>
              <div className="mt-6 flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
                {similar.map((item) => (
                  <MovieCard key={item.id} movie={item} className="shrink-0" />
                ))}
              </div>
            </section>
          )}

          <AdBanner adClient={AD_CLIENT} adSlot={adSlots.bottom} className="pb-12" />
        </div>
      </div>

      <TrailerModal
        open={trailerOpen}
        onClose={closeTrailer}
        youtubeKey={modalKey}
        title={title}
      />
    </>
  );
}
