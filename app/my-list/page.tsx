import { redirect } from "next/navigation";
import { getUserListSafe } from "@/actions/listActions";
import { ensureUserListsTable } from "@/lib/ensure-user-lists-table";
import { createClient } from "@/lib/supabase-server";
import { MyListClient } from "./MyListClient";

export const metadata = {
  title: "My List",
};

export default async function MyListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/my-list");
  }

  await ensureUserListsTable().catch(() => false);
  const { items, dbReady } = await getUserListSafe(user.id);

  return <MyListClient initialItems={items} dbReady={dbReady} />;
}
