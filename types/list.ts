export type ListStatus =
  | "want_to_watch"
  | "watching"
  | "watched"
  | "loved";

export interface UserListItem {
  id: string;
  user_id: string;
  content_id: number;
  content_type: "movie" | "tv";
  content_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  rating: number | null;
  status: ListStatus;
  added_at: string;
  updated_at: string;
}

export interface ContentListData {
  contentTitle: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  rating?: number | null;
}

export const LIST_STATUS_CONFIG: Record<
  ListStatus,
  { label: string; emoji: string; color: string }
> = {
  want_to_watch: {
    label: "Want to Watch",
    emoji: "🔖",
    color: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  },
  watching: {
    label: "Currently Watching",
    emoji: "▶️",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  watched: {
    label: "Watched",
    emoji: "✅",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  loved: {
    label: "Loved it",
    emoji: "❤️",
    color: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  },
};
