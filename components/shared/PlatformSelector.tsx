"use client";

import { useEffect, useState } from "react";
import { TmdbProviderLogo } from "@/components/shared/TmdbProviderLogo";
import {
  STREAMING_PLATFORMS,
  type StreamingPlatform,
} from "@/lib/streaming-platforms";
import { cn } from "@/lib/utils";

export type { StreamingPlatform };
export { STREAMING_PLATFORMS };

function PlatformLogo({
  platform,
  size = 32,
}: {
  platform: StreamingPlatform;
  size?: number;
}) {
  if (platform.logoUrl) {
    return (
      <TmdbProviderLogo
        logoUrl={platform.logoUrl}
        name={platform.name}
        size={size}
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: platform.iconBackground,
      }}
      aria-hidden
    >
      {platform.shortLabel}
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
  platforms: platformsProp,
  className,
}: PlatformSelectorProps) {
  const [platforms, setPlatforms] = useState<StreamingPlatform[]>(
    platformsProp ?? STREAMING_PLATFORMS,
  );

  useEffect(() => {
    if (platformsProp) {
      setPlatforms(platformsProp);
      return;
    }

    let cancelled = false;

    async function loadLogos() {
      try {
        const response = await fetch("/api/providers");
        if (!response.ok) return;
        const data = (await response.json()) as {
          platforms?: StreamingPlatform[];
        };
        if (!cancelled && data.platforms?.length) {
          setPlatforms(data.platforms);
        }
      } catch {
        /* keep defaults */
      }
    }

    void loadLogos();
    return () => {
      cancelled = true;
    };
  }, [platformsProp]);

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
              title={platform.name}
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
