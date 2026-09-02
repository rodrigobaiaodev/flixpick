"use client";

import { ContentDetailLayout } from "@/components/shared/ContentDetailLayout";
import type { ContentVideo, TechnicalDetailRow } from "@/lib/movie-detail";
import type { Movie, Person } from "@/types/movie";

interface MovieDetailContentProps {
  movie: Movie;
  cast: Person[];
  crew: Person[];
  similar: Movie[];
  trailerKey: string | null;
  technicalDetails: TechnicalDetailRow[];
  videos: ContentVideo[];
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
  technicalDetails,
  videos,
}: MovieDetailContentProps) {
  const watchProviders = movie.availability.flatMap((a) =>
    a.options
      .filter((o) => o.type === "flatrate")
      .map((o) => o.provider),
  );

  const uniqueProviders = Array.from(
    new Map(watchProviders.map((p) => [p.id, p])).values(),
  );

  return (
    <ContentDetailLayout
      contentId={movie.id}
      mediaType="movie"
      title={movie.title}
      originalTitle={movie.originalTitle}
      tagline={movie.tagline}
      releaseDate={movie.releaseDate}
      metaSecondary={formatRuntime(movie.runtimeMinutes)}
      voteAverage={movie.voteAverage}
      genres={movie.genres}
      overview={movie.overview}
      posterPath={movie.posterPath}
      backdropPath={movie.backdropPath}
      cast={cast}
      technicalDetails={technicalDetails}
      watchProviders={uniqueProviders}
      trailerKey={trailerKey}
      videos={videos}
      similar={similar}
      adSlots={{
        top: "3333333331",
        middle: "3333333332",
        bottom: "3333333333",
      }}
    />
  );
}
