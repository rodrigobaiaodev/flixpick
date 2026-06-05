import { notFound, redirect } from "next/navigation";
import { movieSlug } from "@/lib/genres";
import { getTVPageData } from "@/lib/tv-detail";
import { parseContentId, parseSlugFromIdParam } from "@/lib/route-params";

interface TVIdPageProps {
  params: Promise<{ id: string }>;
}

/** Handles /tv/3452 or /tv/3452-frasier → canonical /tv/[id]/[slug]. */
export default async function TVIdRedirectPage({ params }: TVIdPageProps) {
  const { id } = await params;
  console.log("[tv/[id]/page] params:", { id });

  const tvId = parseContentId(id);
  if (!tvId) {
    notFound();
  }

  const slugFromId = parseSlugFromIdParam(id);
  if (slugFromId) {
    redirect(`/tv/${tvId}/${slugFromId}`);
  }

  try {
    const { show } = await getTVPageData(tvId);
    redirect(`/tv/${tvId}/${movieSlug(show.title)}`);
  } catch {
    notFound();
  }
}
