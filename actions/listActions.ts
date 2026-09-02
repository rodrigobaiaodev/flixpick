"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { isMissingUserListsTableError } from "@/lib/list-db";
import type { ContentListData, ListStatus, UserListItem } from "@/types/list";

export interface UserListQueryResult {
  items: UserListItem[];
  dbReady: boolean;
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Not authenticated");
  }

  return user.id;
}

function revalidateListPages() {
  revalidatePath("/my-list");
  revalidatePath("/watching");
  revalidatePath("/profile");
}

export async function getUserListSafe(
  userId?: string,
): Promise<UserListQueryResult> {
  const supabase = await createClient();

  let targetUserId = userId;
  if (!targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { items: [], dbReady: true };
    targetUserId = user.id;
  }

  const { data, error } = await supabase
    .from("user_lists")
    .select("*")
    .eq("user_id", targetUserId)
    .order("added_at", { ascending: false });

  if (error) {
    if (isMissingUserListsTableError(error.message)) {
      return { items: [], dbReady: false };
    }
    throw new Error(error.message);
  }

  return { items: (data ?? []) as UserListItem[], dbReady: true };
}

export async function getUserList(userId?: string): Promise<UserListItem[]> {
  const { items } = await getUserListSafe(userId);
  return items;
}

export async function addToList(
  contentId: number,
  contentType: "movie" | "tv",
  status: ListStatus,
  contentData: ContentListData,
): Promise<UserListItem> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  const row = {
    user_id: userId,
    content_id: contentId,
    content_type: contentType,
    content_title: contentData.contentTitle,
    poster_path: contentData.posterPath ?? null,
    backdrop_path: contentData.backdropPath ?? null,
    rating: contentData.rating ?? null,
    status,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_lists")
    .upsert(row, { onConflict: "user_id,content_id,content_type" })
    .select()
    .single();

  if (error) {
    if (isMissingUserListsTableError(error.message)) {
      throw new Error(
        "Your watchlist database is not set up yet. Please run the SQL migration in Supabase.",
      );
    }
    throw new Error(error.message);
  }

  revalidateListPages();
  return data as UserListItem;
}

export async function removeFromList(
  contentId: number,
  contentType: "movie" | "tv",
): Promise<void> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_lists")
    .delete()
    .eq("user_id", userId)
    .eq("content_id", contentId)
    .eq("content_type", contentType);

  if (error) {
    if (isMissingUserListsTableError(error.message)) return;
    throw new Error(error.message);
  }

  revalidateListPages();
}

export async function updateStatus(
  contentId: number,
  contentType: "movie" | "tv",
  newStatus: ListStatus,
): Promise<UserListItem> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_lists")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("content_id", contentId)
    .eq("content_type", contentType)
    .select()
    .single();

  if (error) {
    if (isMissingUserListsTableError(error.message)) {
      throw new Error(
        "Your watchlist database is not set up yet. Please run the SQL migration in Supabase.",
      );
    }
    throw new Error(error.message);
  }

  revalidateListPages();
  return data as UserListItem;
}

export async function updateWatchProgress(
  contentId: number,
  contentType: "movie" | "tv",
  season: number | null,
  episode: number | null,
): Promise<UserListItem> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_lists")
    .update({
      watch_season: season,
      watch_episode: episode,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("content_id", contentId)
    .eq("content_type", contentType)
    .select()
    .single();

  if (error) {
    if (isMissingUserListsTableError(error.message)) {
      throw new Error(
        "Your watchlist database is not set up yet. Please run the SQL migration in Supabase.",
      );
    }
    const lower = error.message.toLowerCase();
    if (lower.includes("watch_season") || lower.includes("watch_episode")) {
      throw new Error(
        "Episode tracking requires a database update. Run supabase/migrations/watch_progress.sql in Supabase.",
      );
    }
    throw new Error(error.message);
  }

  revalidateListPages();
  return data as UserListItem;
}

export async function getListItemStatus(
  contentId: number,
  contentType: "movie" | "tv",
): Promise<ListStatus | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_lists")
    .select("status")
    .eq("user_id", user.id)
    .eq("content_id", contentId)
    .eq("content_type", contentType)
    .maybeSingle();

  if (error) {
    if (isMissingUserListsTableError(error.message)) return null;
    return null;
  }

  if (!data) return null;
  return data.status as ListStatus;
}
