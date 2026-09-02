"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { CountryFlag } from "@/components/shared/CountryFlag";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { useLocale } from "@/components/shared/LocaleProvider";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function LanguageSwitcher({
  className,
  compact = false,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((item) => item.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "btn-compact inline-flex min-h-[44px] items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]",
          compact && "min-h-[40px] px-2.5",
          open && "border-white/20 bg-white/[0.06]",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("language.choose")}
      >
        <CountryFlag
          countryCode={current.countryCode}
          size={compact ? "sm" : "md"}
          title={current.label}
        />
        <span className="hidden sm:inline">{current.region}</span>
        <span className="text-xs text-slate-500 sm:hidden">{current.shortLabel}</span>
        <ChevronDown
          className={cn(
            "size-4 text-slate-400 transition",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("language.label")}
          className="absolute right-0 top-full z-[60] mt-2 min-w-[210px] overflow-hidden rounded-2xl border border-white/15 bg-[#12121a] py-1.5 shadow-2xl shadow-black/50"
        >
          {LOCALES.map((item) => {
            const selected = item.code === locale;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => handleSelect(item.code)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-white/5",
                  selected ? "bg-white/[0.04] text-white" : "text-slate-300",
                )}
              >
                <CountryFlag
                  countryCode={item.countryCode}
                  size="lg"
                  title={item.label}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{item.label}</span>
                  <span className="text-xs text-slate-500">{item.region}</span>
                </span>
                {selected && (
                  <Check className="size-4 shrink-0 text-[#e50914]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
