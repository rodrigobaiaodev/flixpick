import Image from "next/image";
import { cn } from "@/lib/utils";
import { buildTmdbLogoUrl } from "@/lib/tmdb-providers";

const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect fill='%2312121a' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23475569' font-family='sans-serif' font-size='12'%3E?%3C/text%3E%3C/svg%3E";

/** Built-in SVG-text fallbacks for providers missing TMDB logos */
const PROVIDER_FALLBACKS: Record<
  number,
  { label: string; background: string; fontSize?: string }
> = {
  1899: { label: "max", background: "#002be7", fontSize: "11px" },
  2303: { label: "P+", background: "#0064ff", fontSize: "13px" },
};

interface TmdbProviderLogoProps {
  logoPath?: string | null;
  logoUrl?: string | null;
  name: string;
  tmdbProviderId?: number;
  fallbackLabel?: string;
  fallbackBackground?: string;
  size?: number;
  className?: string;
  selected?: boolean;
  /** Avoid scale transform that clips on mobile scroll rows */
  disableScale?: boolean;
}

function ProviderFallback({
  label,
  background,
  fontSize,
  size,
}: {
  label: string;
  background: string;
  fontSize?: string;
  size: number;
}) {
  return (
    <span
      className="flex size-full items-center justify-center font-bold uppercase text-white"
      style={{
        background,
        fontSize: fontSize ?? (size <= 32 ? "9px" : size <= 48 ? "11px" : "13px"),
        letterSpacing: label.length > 3 ? "-0.02em" : "0.02em",
      }}
    >
      {label}
    </span>
  );
}

export function TmdbProviderLogo({
  logoPath,
  logoUrl,
  name,
  tmdbProviderId,
  fallbackLabel,
  fallbackBackground,
  size = 40,
  className,
  selected = false,
  disableScale = false,
}: TmdbProviderLogoProps) {
  const src =
    logoUrl ?? (logoPath ? buildTmdbLogoUrl(logoPath) : null);

  const builtInFallback =
    tmdbProviderId !== undefined
      ? PROVIDER_FALLBACKS[tmdbProviderId]
      : undefined;

  const textFallback = builtInFallback
    ? {
        label: builtInFallback.label,
        background: builtInFallback.background,
        fontSize: builtInFallback.fontSize,
      }
    : fallbackLabel && fallbackBackground
      ? { label: fallbackLabel, background: fallbackBackground }
      : null;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border",
        selected
          ? disableScale
            ? "border-white/40"
            : "scale-110 border-white/40 shadow-lg ring-2 ring-white"
          : "border-white/15",
        !src && !textFallback && "bg-[#12121a]",
        className,
      )}
      style={{ width: size, height: size }}
      title={name}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          className="size-full object-cover"
        />
      ) : textFallback ? (
        <ProviderFallback
          label={textFallback.label}
          background={textFallback.background}
          fontSize={textFallback.fontSize}
          size={size}
        />
      ) : (
        <span className="text-[10px] font-bold text-slate-400">
          {name.slice(0, 2).toUpperCase()}
        </span>
      )}
    </span>
  );
}

interface CastPhotoProps {
  profilePath: string | null;
  name: string;
  size?: number;
  square?: boolean;
  className?: string;
}

export function CastPhoto({
  profilePath,
  name,
  size = 120,
  square = false,
  className,
}: CastPhotoProps) {
  const src = profilePath
    ? `https://image.tmdb.org/t/p/w185${profilePath}`
    : PLACEHOLDER_AVATAR;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden border border-white/10 bg-[#12121a]",
        square ? "rounded-full" : "rounded-xl",
        className,
      )}
      style={{
        width: size,
        height: square ? size : Math.round(size * 1.3),
      }}
    >
      <Image
        src={src}
        alt={name}
        fill
        className="object-cover"
        sizes={`${size}px`}
        unoptimized={!profilePath}
      />
    </div>
  );
}
