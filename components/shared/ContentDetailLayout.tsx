"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeft,
  Clapperboard,
  Clock,
  Film,
  Play,
  Star,
  Tv,
  Users,
} from "lucide-react";
import { AdBanner } from "@/components/shared/AdBanner";
import { getGenreDisplayName, MovieCard } from "@/components/shared/MovieCard";
import {
  CastPhoto,
  TmdbProviderLogo,
} from "@/components/shared/TmdbProviderLogo";
import { TrailerModal } from "@/components/shared/TrailerModal";
import { ListButton } from "@/components/shared/ListButton";
import { WatchStatusButton } from "@/components/shared/WatchStatusButton";
import { useTranslations } from "@/components/shared/LocaleProvider";
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
  contentId: number;
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
  similarSectionTitle?: string;
  adSlots: { top: string; middle: string; bottom: string };
}

function RatingBadge({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-200">
      <Star className="size-4 fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
      <span className="text-xs font-normal text-amber-200/70">/10</span>
    </span>
  );
}

export function ContentDetailLayout({
  contentId,
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
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [activeVideoKey, setActiveVideoKey] = useState<string | null>(null);
  const [isOnList, setIsOnList] = useState(false);

  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : null;
  const backdropUrl = backdropPath
    ? `https://image.tmdb.org/t/p/original${backdropPath}`
    : null;

  const year = releaseDate?.slice(0, 4) || "—";
  const overviewCast = cast.slice(0, 8);
  const modalKey = activeVideoKey ?? trailerKey;
  const resolvedSimilarTitle =
    similarSectionTitle ??
    (mediaType === "tv" ? t("detail.similarShows") : t("detail.similarMovies"));

  const openVideo = (key: string) => {
    setActiveVideoKey(key);
    setTrailerOpen(true);
  };

  const closeTrailer = () => {
    setTrailerOpen(false);
    setActiveVideoKey(null);
  };

  const tabs: { id: DetailTab; label: string; icon: typeof Film }[] = [
    { id: "overview", label: t("detail.overview"), icon: Film },
    { id: "cast", label: t("detail.cast"), icon: Users },
    { id: "videos", label: t("detail.videos"), icon: Clapperboard },
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
              className="mb-8 inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-sm transition hover:border-white/30 hover:bg-black/60"
            >
              <ArrowLeft className="size-4" />
              {t("common.back")}
            </button>

            <div className="mt-auto flex flex-1 flex-col gap-8 pb-12 sm:gap-10 lg:flex-row lg:items-end lg:gap-14">
              {posterUrl && (
                <div className="mx-auto w-full max-w-[min(100%,280px)] shrink-0 sm:max-w-[240px] lg:sticky lg:top-28 lg:mx-0 lg:w-[280px] lg:max-w-none lg:self-start">
                  <div className="overflow-hidden rounded-3xl border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
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
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-300">
                  {mediaType === "tv" ? (
                    <Tv className="size-3" />
                  ) : (
                    <Film className="size-3" />
                  )}
                  {mediaType === "tv" ? t("detail.tvSeries") : t("detail.movie")}
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
                  {overview || t("common.noSynopsis")}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
                  {trailerKey && (
                    <button
                      type="button"
                      onClick={() => openVideo(trailerKey)}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e50914] to-[#b20710] px-7 text-sm font-semibold text-white shadow-lg shadow-[#e50914]/30 transition hover:from-[#f6121d] hover:to-[#c40812]"
                    >
                      <Play className="size-4 fill-current" />
                      {t("detail.watchTrailer")}
                    </button>
                  )}
                  <ListButton
                    contentId={contentId}
                    contentType={mediaType}
                    contentData={{
                      contentTitle: title,
                      posterPath,
                      backdropPath,
                      rating: voteAverage,
                    }}
                    variant="detail"
                    onListChange={setIsOnList}
                  />
                  <WatchStatusButton
                    contentId={contentId}
                    contentType={mediaType}
                    contentData={{
                      contentTitle: title,
                      posterPath,
                      backdropPath,
                      rating: voteAverage,
                    }}
                    isOnList={isOnList}
                    variant="detail"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AdBanner adClient={AD_CLIENT} adSlot={adSlots.top} className="py-8" />

          <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-2 sm:p-3">
            <nav
              className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Content sections"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition",
                      activeTab === tab.id
                        ? "bg-[#e50914] text-white shadow-lg shadow-[#e50914]/25"
                        : "text-slate-400 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="py-10">
            {activeTab === "overview" && (
              <div className="space-y-10">
                {overviewCast.length > 0 && (
                  <section className="rounded-3xl border border-white/10 bg-[#12121a]/60 p-6 sm:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                        {t("detail.topCast")}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab("cast")}
                        className="text-sm font-medium text-[#ff6b6b] hover:underline"
                      >
                        {t("detail.fullCast")} →
                      </button>
                    </div>
                    <ul className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {overviewCast.map((person) => (
                        <li
                          key={person.id}
                          className="w-[110px] shrink-0 text-center transition hover:-translate-y-1"
                        >
                          <CastPhoto
                            profilePath={person.profilePath}
                            name={person.name}
                            size={96}
                            square
                            className="mx-auto rounded-2xl"
                          />
                          <p className="mt-3 line-clamp-2 text-sm font-semibold text-white">
                            {person.name}
                          </p>
                          {person.character && (
                            <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">
                              {person.character}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {technicalDetails.length > 0 && (
                  <section>
                    <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                      {t("detail.details")}
                    </h2>
                    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {technicalDetails.map((row) => (
                        <div
                          key={row.label}
                          className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent px-5 py-4 transition hover:border-white/20"
                        >
                          <dt className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                            {row.label}
                          </dt>
                          <dd className="mt-2 text-sm font-medium leading-relaxed text-slate-100">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}

                <section
                  id="where-to-watch"
                  className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] via-[#12121a] to-[#0a0a0f] p-6 sm:p-8"
                >
                  <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                    {t("detail.whereToWatch")}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {t("detail.whereToWatchDesc")}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    {watchProviders.length > 0 ? (
                      watchProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className="flex min-w-[100px] flex-col items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 transition hover:border-emerald-500/30 hover:bg-black/50"
                        >
                          <TmdbProviderLogo
                            logoPath={provider.logoPath}
                            name={provider.name}
                            size={56}
                          />
                          <span className="max-w-[90px] text-center text-xs font-medium text-slate-200">
                            {provider.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">{t("detail.notListed")}</p>
                    )}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "cast" && (
              <section className="rounded-3xl border border-white/10 bg-[#12121a]/60 p-6 sm:p-8">
                <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                  {t("detail.fullCast")}
                </h2>
                <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {cast.map((person) => (
                    <li
                      key={person.id}
                      className="group text-center transition hover:-translate-y-1"
                    >
                      <CastPhoto
                        profilePath={person.profilePath}
                        name={person.name}
                        size={112}
                        square
                        className="mx-auto rounded-2xl ring-2 ring-transparent transition group-hover:ring-[#e50914]/40"
                      />
                      <p className="mt-3 line-clamp-2 text-sm font-semibold text-white">
                        {person.name}
                      </p>
                      {person.character && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">
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
                  {t("detail.videos")}
                </h2>
                {videos.length > 0 ? (
                  <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video) => (
                      <li key={video.key}>
                        <button
                          type="button"
                          onClick={() => openVideo(video.key)}
                          className="group w-full overflow-hidden rounded-2xl border border-white/10 bg-[#12121a] text-left transition hover:-translate-y-1 hover:border-[#e50914]/40 hover:shadow-xl hover:shadow-[#e50914]/10"
                        >
                          <div className="relative aspect-video bg-black">
                            <Image
                              src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                              alt={video.name}
                              fill
                              className="object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="flex size-14 items-center justify-center rounded-full bg-[#e50914]/90 text-white shadow-2xl shadow-[#e50914]/40 transition group-hover:scale-110">
                                <Play className="size-6 fill-white" />
                              </span>
                            </span>
                          </div>
                          <div className="p-4">
                            <p className="line-clamp-2 text-sm font-semibold text-white">
                              {video.name}
                            </p>
                            <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                              {video.type}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center text-slate-500">
                    {t("detail.noVideos")}
                  </p>
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
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                  {resolvedSimilarTitle}
                </h2>
                <span className="text-sm text-slate-500">{t("detail.moreLikeThis")}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {similar.map((item) => (
                  <MovieCard key={item.id} movie={item} showAvailability />
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
