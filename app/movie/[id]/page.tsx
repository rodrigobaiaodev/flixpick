import { notFound, redirect } from "next/navigation";
import { movieSlug } from "@/lib/genres";
import { getMoviePageData } from "@/lib/movie-detail";
import { parseContentId, parseSlugFromIdParam } from "@/lib/route-params";

interface MovieIdPageProps {
  params: Promise<{ id: string }>;
}

/** Handles /movie/550 or /movie/1083381-backrooms → canonical /movie/[id]/[slug]. */
export default async function MovieIdRedirectPage({ params }: MovieIdPageProps) {
  const { id } = await params;
  console.log("[movie/[id]/page] params:", { id });

  const movieId = parseContentId(id);
  if (!movieId) {
    notFound();
  }

  const slugFromId = parseSlugFromIdParam(id);
  if (slugFromId) {
    redirect(`/movie/${movieId}/${slugFromId}`);
  }

  try {
    const { movie } = await getMoviePageData(movieId);
    redirect(`/movie/${movieId}/${movieSlug(movie.title)}`);
  } catch {
    notFound();
  }
}
