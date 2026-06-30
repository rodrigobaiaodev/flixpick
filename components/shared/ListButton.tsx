"use client";

import { useCallback, useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import {
  addToList,
  getListItemStatus,
  removeFromList,
} from "@/actions/listActions";
import { useAuth } from "@/components/shared/AuthProvider";
import type { ContentListData } from "@/types/list";
import { cn } from "@/lib/utils";

interface ListButtonProps {
  contentId: number;
  contentType: "movie" | "tv";
  contentData: ContentListData;
  variant?: "card" | "detail";
  className?: string;
  onListChange?: (saved: boolean) => void;
}

/** Simple save/unsave toggle — does NOT change watch status. */
export function ListButton({
  contentId,
  contentType,
  contentData,
  variant = "card",
  className,
  onListChange,
}: ListButtonProps) {
  const { user, openLoginModal } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const status = await getListItemStatus(contentId, contentType);
        if (!cancelled) setSaved(status !== null);
      } catch {
        if (!cancelled) setSaved(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user, contentId, contentType]);

  const toggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        openLoginModal();
        return;
      }

      const wasSaved = saved;
      setSaved(!wasSaved);
      setLoading(true);

      try {
        if (wasSaved) {
          await removeFromList(contentId, contentType);
          onListChange?.(false);
        } else {
          await addToList(
            contentId,
            contentType,
            "want_to_watch",
            contentData,
          );
          onListChange?.(true);
        }
      } catch {
        setSaved(wasSaved);
      } finally {
        setLoading(false);
      }
    },
    [
      user,
      saved,
      contentId,
      contentType,
      contentData,
      openLoginModal,
      onListChange,
    ],
  );

  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={(e) => void toggle(e)}
        disabled={loading}
        aria-label={saved ? "Remove from My List" : "Add to My List"}
        aria-pressed={saved}
        className={cn(
          "inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-all",
          saved
            ? "border-[#e50914] bg-[#e50914]/15 text-white shadow-[0_0_20px_rgba(229,9,20,0.2)]"
            : "border-white/15 bg-white/5 text-slate-200 hover:border-white/25 hover:bg-white/10",
          loading && "opacity-60",
          className,
        )}
      >
        <Bookmark
          className={cn("size-4", saved && "fill-[#e50914] text-[#e50914]")}
        />
        {saved ? "Saved to My List" : "Add to My List"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => void toggle(e)}
      disabled={loading}
      aria-label={saved ? "Remove from My List" : "Add to My List"}
      aria-pressed={saved}
      className={cn(
        "btn-compact flex size-9 items-center justify-center rounded-full border border-white/20 shadow-lg backdrop-blur-sm transition-all",
        saved
          ? "bg-[#e50914]/90 text-white hover:bg-[#e50914]"
          : "bg-black/70 text-white hover:bg-black/90",
        loading && "opacity-60",
        className,
      )}
    >
      <Bookmark className={cn("size-4", saved && "fill-current")} />
    </button>
  );
}
