import { redirect } from "next/navigation";
import { getUserListSafe } from "@/actions/listActions";
import { ensureUserListsTable } from "@/lib/ensure-user-lists-table";
import { getGenreDisplayName } from "@/lib/genres";
import { getMovieDetails, getTVDetails } from "@/lib/tmdb";
import { createClient } from "@/lib/supabase-server";
import { ProfileClient } from "./ProfileClient";

export const metadata = {
  title: "Profile",
};

async function computeFavoriteGenres(
  items: Awaited<ReturnType<typeof getUserListSafe>>["items"],
): Promise<string[]> {
  const relevant = items
    .filter((i) => i.status === "watched" || i.status === "loved")
    .slice(0, 15);

  const genreCounts = new Map<string, number>();

  await Promise.all(
    relevant.map(async (item) => {
      try {
        const details =
          item.content_type === "tv"
            ? await getTVDetails(item.content_id)
            : await getMovieDetails(item.content_id);

        for (const genre of details.genres) {
          const name = getGenreDisplayName(genre.id, genre.name);
          genreCounts.set(name, (genreCounts.get(name) ?? 0) + 1);
        }
      } catch {
        /* skip */
      }
    }),
  );

  return [...genreCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name]) => name);
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/profile");
  }

  await ensureUserListsTable().catch(() => false);
  const { items, dbReady } = await getUserListSafe(user.id);

  const watchedOrLoved = items.filter(
    (i) => i.status === "watched" || i.status === "loved",
  );

  const stats = {
    moviesWatched: watchedOrLoved.filter((i) => i.content_type === "movie")
      .length,
    showsWatched: watchedOrLoved.filter((i) => i.content_type === "tv")
      .length,
    favorites: items.filter((i) => i.status === "loved").length,
    totalList: items.length,
    watching: items.filter((i) => i.status === "watching").length,
    wantToWatch: items.filter((i) => i.status === "want_to_watch").length,
  };

  const favoriteGenres = dbReady ? await computeFavoriteGenres(items) : [];

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "User";

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <ProfileClient
      email={user.email ?? ""}
      displayName={displayName}
      avatarUrl={(user.user_metadata?.avatar_url as string | undefined) ?? null}
      memberSince={memberSince}
      stats={stats}
      favoriteGenres={favoriteGenres}
      dbReady={dbReady}
    />
  );
}
