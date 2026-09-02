"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Link2, Share2, Sparkles, Star, X } from "lucide-react";
import { SHARE_PLATFORMS } from "@/lib/share-challenge";
import { useTranslations } from "@/components/shared/LocaleProvider";
import { cn } from "@/lib/utils";

export interface ShareChallengeModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  shareUrl: string;
  shareMessage: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  rating?: number;
  year?: string;
  moodLabel?: string;
  mediaType?: "movie" | "tv";
}

function tmdbImg(path: string | null | undefined, size: "w500" | "w780" | "original") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function ShareChallengeModal({
  open,
  onClose,
  title,
  shareUrl,
  shareMessage,
  posterPath,
  backdropPath,
  rating,
  year,
  moodLabel,
  mediaType = "movie",
}: ShareChallengeModalProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const heroImage = tmdbImg(backdropPath, "w780") ?? tmdbImg(posterPath, "w500");
  const posterImage = tmdbImg(posterPath, "w500");

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    setCopied(false);
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    setSharing(true);
    try {
      const shareData: ShareData = {
        title: `FlixPick — ${title}`,
        text: shareMessage,
        url: shareUrl,
      };

      if (posterImage) {
        try {
          const response = await fetch(posterImage);
          const blob = await response.blob();
          const file = new File([blob], "flixpick-pick.jpg", {
            type: blob.type || "image/jpeg",
          });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ ...shareData, files: [file] });
            return;
          }
        } catch {
          /* fall through to text-only share */
        }
      }

      await navigator.share(shareData);
    } catch {
      /* user cancelled or unsupported */
    } finally {
      setSharing(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-challenge-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        aria-label="Close share dialog"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d14] shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="btn-compact absolute right-4 top-4 z-30 flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-slate-300 backdrop-blur-sm transition hover:border-white/30 hover:bg-black/80 hover:text-white"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* Hero with content image */}
        <div className="relative h-44 overflow-hidden sm:h-52">
          {heroImage ? (
            <Image
              src={heroImage}
              alt=""
              fill
              className="object-cover"
              sizes="512px"
              unoptimized
              priority
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-[#e50914]/30 via-[#1a1a28] to-[#0d0d14]" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/70 to-[#0d0d14]/20" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0d0d14]/40 to-transparent" />

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end gap-4 p-5">
            {posterImage && (
              <div className="relative aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl shadow-black/50 sm:w-24">
                <Image
                  src={posterImage}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized
                />
              </div>
            )}
            <div className="min-w-0 flex-1 pb-1">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e50914]">
                <Sparkles className="size-3" />
                {t("share.challengeFriend")}
              </p>
              <h2
                id="share-challenge-title"
                className="mt-1 font-[family-name:var(--font-display)] text-xl tracking-wide text-white sm:text-2xl"
              >
                {t("share.sharePick")}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-200">
                {title}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {year && (
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-300">
                    {year}
                  </span>
                )}
                {rating != null && rating > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {rating.toFixed(1)}
                  </span>
                )}
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs capitalize text-slate-400">
                  {mediaType === "tv" ? t("detail.tvSeries") : t("detail.movie")}
                </span>
                {moodLabel && (
                  <span className="rounded-full border border-[#e50914]/30 bg-[#e50914]/10 px-2.5 py-0.5 text-xs text-[#ff6b6b]">
                    {moodLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          {canNativeShare && (
            <button
              type="button"
              onClick={() => void handleNativeShare()}
              disabled={sharing}
              className="btn-compact flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e50914] to-[#b20710] text-sm font-semibold text-white shadow-lg shadow-[#e50914]/25 transition hover:from-[#f6121d] hover:to-[#c40812] disabled:opacity-60"
            >
              <Share2 className="size-4" />
              {sharing ? t("share.sharing") : t("share.withImage")}
            </button>
          )}

          <div>
            <label className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              <Link2 className="size-3.5" />
              {t("share.yourLink")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="min-h-[48px] flex-1 truncate rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-slate-200 outline-none focus:border-[#e50914]/40"
                onFocus={(e) => e.target.select()}
              />
              <button
                type="button"
                onClick={() => void handleCopy()}
                className={cn(
                  "btn-compact inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white transition",
                  copied
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-white/10 hover:bg-white/15",
                )}
              >
                {copied ? (
                  <>
                    <Check className="size-4" />
                    {t("share.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    {t("share.copy")}
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              {t("share.shareOn")}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {SHARE_PLATFORMS.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.buildHref(shareUrl, shareMessage, title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "btn-compact flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-2xl px-2 text-center text-[10px] font-semibold text-white transition hover:scale-[1.03] active:scale-[0.98]",
                    platform.className,
                  )}
                >
                  {platform.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              {t("share.preview")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {shareMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
