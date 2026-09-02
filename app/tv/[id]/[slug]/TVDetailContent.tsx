"use client";

import { ContentDetailLayout } from "@/components/shared/ContentDetailLayout";
import type { ContentVideo, TechnicalDetailRow } from "@/lib/tv-detail";
import { formatTVStatus } from "@/lib/tv-detail";
import type { ContentItem, Person } from "@/types/movie";

interface TVDetailContentProps {
  show: ContentItem;
  cast: Person[];
  crew: Person[];
  similar: ContentItem[];
  trailerKey: string | null;
  technicalDetails: TechnicalDetailRow[];
  videos: ContentVideo[];
}

export function TVDetailContent({
  show,
  cast,
  similar,
  trailerKey,
  technicalDetails,
  videos,
}: TVDetailContentProps) {
  const watchProviders = show.availability.flatMap((a) =>
    a.options
      .filter((o) => o.type === "flatrate")
      .map((o) => o.provider),
  );

  const uniqueProviders = Array.from(
    new Map(watchProviders.map((p) => [p.id, p])).values(),
  );

  const metaSecondary = [
    show.numberOfSeasons
      ? `${show.numberOfSeasons} Season${show.numberOfSeasons !== 1 ? "s" : ""}`
      : null,
    show.numberOfEpisodes ? `${show.numberOfEpisodes} Eps` : null,
    formatTVStatus(show.status),
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <ContentDetailLayout
      contentId={show.id}
      mediaType="tv"
      title={show.title}
      originalTitle={show.originalTitle}
      tagline={show.tagline}
      releaseDate={show.releaseDate}
      metaSecondary={metaSecondary || "—"}
      voteAverage={show.voteAverage}
      genres={show.genres}
      overview={show.overview}
      posterPath={show.posterPath}
      backdropPath={show.backdropPath}
      cast={cast}
      technicalDetails={technicalDetails}
      watchProviders={uniqueProviders}
      trailerKey={trailerKey}
      videos={videos}
      similar={similar}
      adSlots={{
        top: "4444444441",
        middle: "4444444442",
        bottom: "4444444443",
      }}
    />
  );
}
