import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMoviePageData } from "@/lib/movie-detail";
import { movieSlug } from "@/components/shared/MovieCard";
import { MovieDetailContent } from "./MovieDetailContent";

interface MoviePageProps {
  params: Promise<{ id: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = Number(id);

  if (Number.isNaN(movieId)) {
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
  const movieId = Number(id);

  if (Number.isNaN(movieId)) {
    notFound();
  }

  let data;
  try {
    data = await getMoviePageData(movieId);
  } catch {
    notFound();
  }

  const expectedSlug = movieSlug(data.movie.title);
  if (slug !== expectedSlug) {
    notFound();
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
        similar={data.similar}
        trailerKey={data.trailerKey}
      />
    </>
  );
}
