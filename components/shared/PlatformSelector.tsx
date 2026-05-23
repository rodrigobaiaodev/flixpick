"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export interface StreamingPlatform {
  id: string;
  name: string;
  shortLabel: string;
  brandColor: string;
  /** TMDB provider ID when available */
  tmdbProviderId?: number;
  logoUrl?: string;
  iconBackground: string;
  /** Peacock has no reliable CDN icon — render styled letter */
  useLetterIcon?: boolean;
}

export const STREAMING_PLATFORMS: StreamingPlatform[] = [
  {
    id: "netflix",
    name: "Netflix",
    shortLabel: "N",
    brandColor: "#e50914",
    tmdbProviderId: 8,
    logoUrl: "https://cdn.simpleicons.org/netflix/ffffff",
    iconBackground: "#e50914",
  },
  {
    id: "prime",
    name: "Prime Video",
    shortLabel: "PV",
    brandColor: "#00a8e1",
    tmdbProviderId: 9,
    logoUrl: "https://cdn.simpleicons.org/primevideo/ffffff",
    iconBackground: "#00a8e1",
  },
  {
    id: "max",
    name: "Max",
    shortLabel: "Max",
    brandColor: "#002be7",
    tmdbProviderId: 1899,
    logoUrl: "https://cdn.simpleicons.org/max/ffffff",
    iconBackground: "#002be7",
  },
  {
    id: "disney",
    name: "Disney+",
    shortLabel: "D+",
    brandColor: "#113ccf",
    tmdbProviderId: 337,
    logoUrl: "https://cdn.simpleicons.org/disneyplus/ffffff",
    iconBackground: "#113ccf",
  },
  {
    id: "apple",
    name: "Apple TV+",
    shortLabel: "ATV",
    brandColor: "#000000",
    tmdbProviderId: 350,
    logoUrl: "https://cdn.simpleicons.org/appletv/ffffff",
    iconBackground: "#000000",
  },
  {
    id: "hulu",
    name: "Hulu",
    shortLabel: "Hulu",
    brandColor: "#1ce783",
    tmdbProviderId: 15,
    logoUrl: "https://cdn.simpleicons.org/hulu/000000",
    iconBackground: "#1ce783",
  },
  {
    id: "peacock",
    name: "Peacock",
    shortLabel: "P",
    brandColor: "#0056ff",
    tmdbProviderId: 386,
    iconBackground: "#0056ff",
    useLetterIcon: true,
  },
  {
    id: "paramount",
    name: "Paramount+",
    shortLabel: "P+",
    brandColor: "#0064ff",
    tmdbProviderId: 531,
    logoUrl: "https://cdn.simpleicons.org/paramount/ffffff",
    iconBackground: "#0064ff",
  },
];

function PlatformLogo({ platform }: { platform: StreamingPlatform }) {
  return (
    <span
      className="flex size-8 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: platform.iconBackground }}
    >
      {platform.useLetterIcon ? (
        <span
          className="font-[family-name:var(--font-display)] text-lg leading-none text-white"
          aria-hidden
        >
          P
        </span>
      ) : (
        platform.logoUrl && (
          <Image
            src={platform.logoUrl}
            alt=""
            width={20}
            height={20}
            className="size-5 object-contain"
          />
        )
      )}
    </span>
  );
}

export interface PlatformSelectorProps {
  selectedPlatformIds: string[];
  onSelectionChange: (platformIds: string[]) => void;
  platforms?: StreamingPlatform[];
  className?: string;
}

export function PlatformSelector({
  selectedPlatformIds,
  onSelectionChange,
  platforms = STREAMING_PLATFORMS,
  className,
}: PlatformSelectorProps) {
  const allPlatformIds = platforms.map((p) => p.id);
  const isAllSelected =
    allPlatformIds.length > 0 &&
    allPlatformIds.every((id) => selectedPlatformIds.includes(id));

  const togglePlatform = (platformId: string) => {
    if (selectedPlatformIds.includes(platformId)) {
      onSelectionChange(selectedPlatformIds.filter((id) => id !== platformId));
    } else {
      onSelectionChange([...selectedPlatformIds, platformId]);
    }
  };

  const selectAll = () => {
    onSelectionChange(isAllSelected ? [] : [...allPlatformIds]);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={selectAll}
          aria-pressed={isAllSelected}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
            isAllSelected
              ? "border-white/30 bg-white/[0.08] text-white opacity-100 ring-2 ring-white"
              : "border-white/10 bg-white/5 text-slate-300 opacity-50 hover:opacity-70",
          )}
        >
          Any Platform
        </button>
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Streaming platforms"
      >
        {platforms.map((platform) => {
          const isSelected = selectedPlatformIds.includes(platform.id);

          return (
            <button
              key={platform.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              aria-label={platform.name}
              onClick={() => togglePlatform(platform.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0a0a0f]/80 px-3 py-2 text-sm font-medium transition-all duration-200",
                isSelected
                  ? "text-white opacity-100 ring-2 ring-white"
                  : "text-slate-400 opacity-50 hover:opacity-70",
              )}
            >
              <PlatformLogo platform={platform} />
              <span className="whitespace-nowrap">{platform.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
