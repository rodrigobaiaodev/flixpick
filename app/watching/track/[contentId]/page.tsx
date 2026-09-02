import { notFound, redirect } from "next/navigation";
import { getUserListSafe } from "@/actions/listActions";
import { ensureUserListsTable } from "@/lib/ensure-user-lists-table";
import { getTVSeasonsSummary } from "@/lib/tmdb";
import { createClient } from "@/lib/supabase-server";
import { EpisodeTrackerClient } from "./EpisodeTrackerClient";

export default async function EpisodeTrackerPage({
  params,
}: {
  params: Promise<{ contentId: string }>;
}) {
  const { contentId: contentIdStr } = await params;
  const contentId = Number(contentIdStr);
  if (!contentId) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/watching/track/${contentId}`);
  }

  await ensureUserListsTable().catch(() => false);
  const { items } = await getUserListSafe(user.id);
  const item = items.find(
    (i) =>
      i.content_id === contentId &&
      i.content_type === "tv" &&
      i.status === "watching",
  );

  if (!item) {
    redirect("/watching");
  }

  let showMeta = {
    numberOfSeasons: null as number | null,
    numberOfEpisodes: null as number | null,
    seasons: [] as { seasonNumber: number; episodeCount: number }[],
  };

  try {
    showMeta = await getTVSeasonsSummary(contentId);
  } catch {
    /* use defaults */
  }

  return <EpisodeTrackerClient item={item} showMeta={showMeta} />;
}
