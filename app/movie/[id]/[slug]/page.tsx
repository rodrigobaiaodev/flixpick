import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getMoviePageData } from "@/lib/movie-detail";
import { movieSlug } from "@/lib/genres";
import { parseContentId, parseSlugFromIdParam } from "@/lib/route-params";
import { MovieDetailContent } from "./MovieDetailContent";

interface MoviePageProps {
  params: Promise<{ id: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  console.log("[movie/[id]/[slug]/generateMetadata] params:", { id });
  const movieId = parseContentId(id);

  if (!movieId) {
    return { title: "Movie Not Found | FlixPick" };
  }

  try {
    const { movie } = await getMoviePageData(movieId);
    return {
      title: `${movie.title} | FlixPick`,
      description: movie.overview?.slice(0, 160) ?? `Watch ${movie.title} on FlixPick.`,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: movie.posterPath
          ? [`https://image.tmdb.org/t/p/w500${movie.posterPath}`]
          : undefined,
      },
    };
  } catch {
    return { title: "Movie Not Found | FlixPick" };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id, slug } = await params;
  console.log("[movie/[id]/[slug]/page] params:", { id, slug });

  const movieId = parseContentId(id);
  if (!movieId) {
    notFound();
  }

  let data;
  try {
    data = await getMoviePageData(movieId);
  } catch {
    notFound();
  }

  const expectedSlug = movieSlug(data.movie.title);
  const slugFromId = parseSlugFromIdParam(id);
  const resolvedSlug = slug || slugFromId || expectedSlug;

  if (resolvedSlug !== expectedSlug) {
    redirect(`/movie/${movieId}/${expectedSlug}`);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: data.movie.title,
    description: data.movie.overview,
    image: data.movie.posterPath
      ? `https://image.tmdb.org/t/p/w500${data.movie.posterPath}`
      : undefined,
    datePublished: data.movie.releaseDate,
    aggregateRating:
      data.movie.voteCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: data.movie.voteAverage,
            ratingCount: data.movie.voteCount,
            bestRating: 10,
            worstRating: 0,
          }
        : undefined,
    genre: data.movie.genres.map((g) => g.name),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MovieDetailContent
        movie={data.movie}
        cast={data.cast}
        crew={data.crew}
        similar={data.similar}
        trailerKey={data.trailerKey}
        technicalDetails={data.technicalDetails}
        videos={data.videos}
      />
    </>
  );
}
