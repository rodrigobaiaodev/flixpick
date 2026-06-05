import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { movieSlug } from "@/lib/genres";
import { getTVPageData } from "@/lib/tv-detail";
import { parseContentId, parseSlugFromIdParam } from "@/lib/route-params";
import { TVDetailContent } from "./TVDetailContent";

interface TVPageProps {
  params: Promise<{ id: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: TVPageProps): Promise<Metadata> {
  const { id } = await params;
  console.log("[tv/[id]/[slug]/generateMetadata] params:", { id });
  const tvId = parseContentId(id);

  if (!tvId) {
    return { title: "TV Show Not Found | FlixPick" };
  }

  try {
    const { show } = await getTVPageData(tvId);
    return {
      title: `${show.title} | FlixPick`,
      description:
        show.overview?.slice(0, 160) ?? `Watch ${show.title} on FlixPick.`,
      openGraph: {
        title: show.title,
        description: show.overview,
        images: show.posterPath
          ? [`https://image.tmdb.org/t/p/w500${show.posterPath}`]
          : undefined,
      },
    };
  } catch {
    return { title: "TV Show Not Found | FlixPick" };
  }
}

export default async function TVPage({ params }: TVPageProps) {
  const { id, slug } = await params;
  console.log("[tv/[id]/[slug]/page] params:", { id, slug });

  const tvId = parseContentId(id);
  if (!tvId) {
    notFound();
  }

  let data;
  try {
    data = await getTVPageData(tvId);
  } catch {
    notFound();
  }

  const expectedSlug = movieSlug(data.show.title);
  const slugFromId = parseSlugFromIdParam(id);
  const resolvedSlug = slug || slugFromId || expectedSlug;

  if (resolvedSlug !== expectedSlug) {
    redirect(`/tv/${tvId}/${expectedSlug}`);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: data.show.title,
    description: data.show.overview,
    image: data.show.posterPath
      ? `https://image.tmdb.org/t/p/w500${data.show.posterPath}`
      : undefined,
    datePublished: data.show.releaseDate,
    numberOfSeasons: data.show.numberOfSeasons ?? undefined,
    numberOfEpisodes: data.show.numberOfEpisodes ?? undefined,
    aggregateRating:
      data.show.voteCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: data.show.voteAverage,
            ratingCount: data.show.voteCount,
            bestRating: 10,
            worstRating: 0,
          }
        : undefined,
    genre: data.show.genres.map((g) => g.name),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TVDetailContent
        show={data.show}
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
