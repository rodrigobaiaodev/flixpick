import Image from "next/image";
import { cn } from "@/lib/utils";

interface CountryFlagProps {
  /** ISO 3166-1 alpha-2, e.g. us, br, es */
  countryCode: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  title?: string;
}

const SIZE_MAP = {
  sm: { width: 20, height: 15 },
  md: { width: 28, height: 21 },
  lg: { width: 36, height: 27 },
} as const;

export function CountryFlag({
  countryCode,
  size = "md",
  className,
  title,
}: CountryFlagProps) {
  const code = countryCode.toLowerCase();
  const { width, height } = SIZE_MAP[size];

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-[4px] border border-white/15 bg-white/5 shadow-sm",
        className,
      )}
      style={{ width, height }}
      title={title}
      aria-hidden={!title}
    >
      <Image
        src={`https://flagcdn.com/w80/${code}.png`}
        alt={title ?? ""}
        fill
        className="object-cover"
        sizes={`${width}px`}
        unoptimized
      />
    </span>
  );
}
