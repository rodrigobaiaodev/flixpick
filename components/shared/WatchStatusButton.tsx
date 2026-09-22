"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  addToList,
  getListItemStatus,
  removeFromList,
  updateStatus,
} from "@/actions/listActions";
import { useAuth } from "@/components/shared/AuthProvider";
import { useUiTranslations } from "@/components/shared/LocaleProvider";
import type { ContentListData, ListStatus } from "@/types/list";
import { statusLabelKey } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { status: ListStatus; emoji: string }[] = [
  { status: "want_to_watch", emoji: "🔖" },
  { status: "watching", emoji: "▶️" },
  { status: "watched", emoji: "✅" },
  { status: "loved", emoji: "❤️" },
];

const STATUS_BUTTON_STYLES: Record<ListStatus, string> = {
  want_to_watch:
    "border-sky-500/40 bg-sky-500/15 text-sky-200 hover:bg-sky-500/25",
  watching:
    "border-amber-500/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25",
  watched:
    "border-emerald-500/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25",
  loved: "border-rose-500/40 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25",
};

interface WatchStatusButtonProps {
  contentId: number;
  contentType: "movie" | "tv";
  contentData: ContentListData;
  isOnList?: boolean;
  variant?: "detail" | "compact";
  className?: string;
  onStatusChange?: (status: ListStatus | null) => void;
}

/** Watch progress / status — separate from saving to My List. */
export function WatchStatusButton({
  contentId,
  contentType,
  contentData,
  isOnList: isOnListProp,
  variant = "detail",
  className,
  onStatusChange,
}: WatchStatusButtonProps) {
  const { user, openLoginModal } = useAuth();
  const tu = useUiTranslations();
  const [currentStatus, setCurrentStatus] = useState<ListStatus | null>(null);
  const [isOnList, setIsOnList] = useState(isOnListProp ?? false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOnListProp !== undefined) setIsOnList(isOnListProp);
  }, [isOnListProp]);

  useEffect(() => {
    if (!user) {
      setCurrentStatus(null);
      setIsOnList(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const status = await getListItemStatus(contentId, contentType);
        if (!cancelled) {
          setCurrentStatus(status);
          setIsOnList(status !== null);
        }
      } catch {
        /* ignore */
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user, contentId, contentType]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    async (status: ListStatus) => {
      if (!user) {
        openLoginModal();
        return;
      }

      setOpen(false);
      setLoading(true);
      const previous = currentStatus;

      try {
        if (previous === status) {
          setCurrentStatus(status);
          return;
        }

        setCurrentStatus(status);

        if (previous) {
          await updateStatus(contentId, contentType, status);
        } else {
          await addToList(contentId, contentType, status, contentData);
          setIsOnList(true);
        }
        onStatusChange?.(status);
      } catch {
        setCurrentStatus(previous);
      } finally {
        setLoading(false);
      }
    },
    [
      user,
      currentStatus,
      contentId,
      contentType,
      contentData,
      openLoginModal,
      onStatusChange,
    ],
  );

  const handleClearStatus = useCallback(async () => {
    if (!currentStatus || !isOnList) return;
    setOpen(false);
    setLoading(true);
    const previous = currentStatus;

    try {
      await removeFromList(contentId, contentType);
      setCurrentStatus(null);
      setIsOnList(false);
      onStatusChange?.(null);
    } catch {
      setCurrentStatus(previous);
    } finally {
      setLoading(false);
    }
  }, [currentStatus, isOnList, contentId, contentType, onStatusChange]);

  const activeLabel = currentStatus
    ? tu(statusLabelKey(currentStatus))
    : null;
  const activeEmoji = currentStatus
    ? STATUS_OPTIONS.find((o) => o.status === currentStatus)?.emoji
    : null;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => {
          if (!user) {
            openLoginModal();
            return;
          }
          if (!isOnList && !currentStatus) return;
          setOpen((p) => !p);
        }}
        disabled={loading || (!user ? false : !isOnList && !currentStatus)}
        title={
          !isOnList && !currentStatus ? tu("list.addFirst") : undefined
        }
        aria-label={
          currentStatus
            ? `${tu("status.label")}: ${activeLabel}`
            : tu("status.set")
        }
        aria-expanded={open}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40",
          variant === "detail"
            ? "min-h-[44px] px-5"
            : "min-h-[36px] w-full px-3 text-xs",
          currentStatus
            ? STATUS_BUTTON_STYLES[currentStatus]
            : "border-white/15 bg-white/5 text-slate-400",
        )}
      >
        {currentStatus ? (
          <>
            <span aria-hidden>{activeEmoji}</span>
            <span>{activeLabel}</span>
          </>
        ) : (
          <span>{tu("status.label")}</span>
        )}
        <ChevronDown
          className={cn(
            "size-3.5 transition",
            open && "rotate-180",
            variant === "compact" && "size-3",
          )}
        />
      </button>

      {open && user && (isOnList || currentStatus) && (
        <div
          className={cn(
            "absolute z-[100] mt-2 min-w-[220px] overflow-hidden rounded-xl border border-white/15 bg-[#12121a] py-1 shadow-2xl shadow-black/50",
            variant === "compact" ? "right-0" : "left-0",
          )}
        >
          <p className="border-b border-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {tu("status.track")}
          </p>
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.status}
              type="button"
              onClick={() => void handleSelect(option.status)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-white/5",
                currentStatus === option.status
                  ? "bg-white/5 text-white"
                  : "text-slate-300",
              )}
            >
              <span aria-hidden>{option.emoji}</span>
              <span>{tu(statusLabelKey(option.status))}</span>
              {currentStatus === option.status && (
                <span className="ml-auto text-xs text-emerald-400">✓</span>
              )}
            </button>
          ))}
          {currentStatus && (
            <>
              <hr className="my-1 border-white/10" />
              <button
                type="button"
                onClick={() => void handleClearStatus()}
                className="w-full px-4 py-2 text-left text-xs text-slate-500 transition hover:bg-white/5 hover:text-red-400"
              >
                {tu("status.removeFromList")}
              </button>
            </>
          )}
        </div>
      )}

      {variant === "detail" && !isOnList && !currentStatus && user && (
        <p className="mt-1.5 text-xs text-slate-500">
          {(() => {
            const parts = tu("status.saveFirst", {
              link: "|||",
            }).split("|||");
            return (
              <>
                {parts[0]}
                <a
                  href="/watching"
                  className="text-[#e50914] hover:underline"
                >
                  {tu("status.watchingLink")}
                </a>
                {parts[1] ?? ""}
              </>
            );
          })()}
        </p>
      )}
    </div>
  );
}
