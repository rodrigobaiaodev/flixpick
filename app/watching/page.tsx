import { redirect } from "next/navigation";
import { getUserListSafe } from "@/actions/listActions";
import { ensureUserListsTable } from "@/lib/ensure-user-lists-table";
import { getTVSeasonsSummary } from "@/lib/tmdb";
import { createClient } from "@/lib/supabase-server";
import { WatchingClient } from "./WatchingClient";

export const metadata = {
  title: "Watching",
};

export default async function WatchingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/watching");
  }

  await ensureUserListsTable().catch(() => false);
  const { items, dbReady } = await getUserListSafe(user.id);
  const watchingItems = items.filter((i) => i.status === "watching");

  const tvProgress = await Promise.all(
    watchingItems
      .filter((i) => i.content_type === "tv")
      .map(async (item) => {
        try {
          const summary = await getTVSeasonsSummary(item.content_id);
          return {
            contentId: item.content_id,
            numberOfSeasons: summary.numberOfSeasons,
            numberOfEpisodes: summary.numberOfEpisodes,
            seasons: summary.seasons,
          };
        } catch {
          return {
            contentId: item.content_id,
            numberOfSeasons: null,
            numberOfEpisodes: null,
            seasons: [],
          };
        }
      }),
  );

  return (
    <WatchingClient
      initialItems={watchingItems}
      tvProgress={tvProgress}
      dbReady={dbReady}
    />
  );
}
