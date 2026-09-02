import { movieSlug } from "@/lib/genres";
import type { ContentItem } from "@/types/movie";

export function buildContentShareUrl(
  origin: string,
  item: Pick<ContentItem, "id" | "title" | "mediaType">,
  moodSlug?: string,
): string {
  const slug = movieSlug(item.title);
  const path = item.mediaType === "tv" ? "tv" : "movie";
  const base = `${origin}/${path}/${item.id}/${slug}`;
  if (moodSlug) {
    return `${base}?challenge=1&mood=${encodeURIComponent(moodSlug)}`;
  }
  return base;
}

export function buildMatchShareUrl(origin: string, code: string): string {
  return `${origin}/match/${code}`;
}

export function buildChallengeMessage(title: string, url: string): string {
  return `FlixPick chose ${title} for us tonight 🎬 Do you agree or want to roll your own? ${url}`;
}

export interface SharePlatform {
  id: string;
  label: string;
  /** Tailwind bg class */
  className: string;
  buildHref: (url: string, message: string, title: string) => string;
}

export const SHARE_PLATFORMS: SharePlatform[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    className: "bg-[#25D366] hover:bg-[#20bd5a]",
    buildHref: (_url, message) =>
      `https://wa.me/?text=${encodeURIComponent(message)}`,
  },
  {
    id: "imessage",
    label: "iMessage",
    className: "bg-[#34C759] hover:bg-[#2db84e]",
    buildHref: (_url, message) => `sms:&body=${encodeURIComponent(message)}`,
  },
  {
    id: "facebook",
    label: "Facebook",
    className: "bg-[#1877F2] hover:bg-[#166fe5]",
    buildHref: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "messenger",
    label: "Messenger",
    className: "bg-[#0084FF] hover:bg-[#0078e7]",
    buildHref: (url) =>
      `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=87741124305&redirect_uri=${encodeURIComponent(url)}`,
  },
  {
    id: "x",
    label: "X",
    className: "bg-[#000000] hover:bg-[#1a1a1a] border border-white/15",
    buildHref: (_url, message) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
  },
  {
    id: "reddit",
    label: "Reddit",
    className: "bg-[#FF4500] hover:bg-[#e63e00]",
    buildHref: (url, _message, title) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(`FlixPick chose ${title} for movie night`)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    className: "bg-[#229ED9] hover:bg-[#1f8fc7]",
    buildHref: (url, message) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message.replace(url, "").trim())}`,
  },
  {
    id: "email",
    label: "Email",
    className: "bg-[#64748b] hover:bg-[#556275]",
    buildHref: (url, message, title) =>
      `mailto:?subject=${encodeURIComponent(`Movie night pick: ${title}`)}&body=${encodeURIComponent(message)}`,
  },
];
