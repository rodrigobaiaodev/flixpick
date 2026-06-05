import Image from "next/image";
import { cn } from "@/lib/utils";
import { buildTmdbLogoUrl } from "@/lib/tmdb-providers";

const PLACEHOLDER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect fill='%2312121a' width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23475569' font-family='sans-serif' font-size='12'%3E?%3C/text%3E%3C/svg%3E";

interface TmdbProviderLogoProps {
  logoPath?: string | null;
  logoUrl?: string | null;
  name: string;
  size?: number;
  className?: string;
  selected?: boolean;
}

export function TmdbProviderLogo({
  logoPath,
  logoUrl,
  name,
  size = 40,
  className,
  selected = false,
}: TmdbProviderLogoProps) {
  const src =
    logoUrl ?? (logoPath ? buildTmdbLogoUrl(logoPath) : null);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-[#12121a]",
        selected
          ? "scale-110 border-white/40 shadow-lg ring-2 ring-white"
          : "border-white/15",
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
