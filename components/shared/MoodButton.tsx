"use client";

import {
  BookOpen,
  Brain,
  CloudRain,
  Coffee,
  Ghost,
  Heart,
  Search,
  Smile,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { MOOD_DEFINITIONS } from "@/lib/moods";
import type { Mood } from "@/types/movie";
import type { MoodChipProps } from "@/types/ui";
import { cn } from "@/lib/utils";

const MOOD_ICONS: Record<string, LucideIcon> = {
  "adrenaline-rush": Zap,
  "need-a-good-laugh": Smile,
  "hopeless-romantic": Heart,
  "keep-me-awake": Ghost,
  "mind-bending": Brain,
  "emotional-journey": CloudRain,
  "cozy-and-family": Coffee,
  "true-stories": BookOpen,
  whodunnit: Search,
  "epic-fantasy": Sparkles,
};

export const FLIXPICK_MOODS: Mood[] = MOOD_DEFINITIONS.map((mood) => ({
  ...mood,
  Icon: MOOD_ICONS[mood.slug] ?? Sparkles,
}));

export interface MoodIconProps {
  Icon: LucideIcon;
  selected?: boolean;
  size?: number;
  className?: string;
}

export function MoodIcon({
  Icon,
  selected = false,
  size = 18,
  className,
}: MoodIconProps) {
  return (
    <Icon
      size={size}
      strokeWidth={2}
      aria-hidden
      className={cn(
        "shrink-0 transition-colors",
        selected ? "text-[#e50914]" : "text-slate-400",
        className,
      )}
    />
  );
}

export interface MoodButtonProps extends MoodChipProps {
  subtitle?: string;
}

export function MoodButton({
  mood,
  selected = false,
  onSelect,
  className,
  subtitle,
}: MoodButtonProps) {
  const description = subtitle ?? mood.description;

  return (
    <>
      {selected && <MoodButtonStyles />}
      <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        onClick={() => onSelect?.(mood.id)}
        className={cn(
          "group relative flex min-h-[120px] w-full flex-col items-start justify-between overflow-hidden rounded-xl border border-white/10 p-4 text-left transition-all duration-300",
          "bg-gradient-to-br from-white/[0.06] to-white/[0.02] hover:border-white/20 hover:from-white/[0.08]",
          selected &&
            "animate-mood-glow border-[#e50914] shadow-[0_0_0_1px_#e50914,0_0_24px_rgba(229,9,20,0.35)]",
          className,
        )}
        style={
          selected
            ? undefined
            : {
                backgroundImage: `linear-gradient(135deg, ${mood.gradientFrom}22, ${mood.gradientTo}11)`,
              }
        }
      >
        <MoodIcon Icon={mood.Icon} selected={selected} size={24} />
        <span className="mt-3 block w-full">
          <span
            className={cn(
              "block text-base font-semibold transition-colors",
              selected ? "text-[#e50914]" : "text-slate-100",
            )}
          >
            {mood.label}
          </span>
          <span className="mt-0.5 block text-xs text-slate-400">{description}</span>
        </span>
      </button>
    </>
  );
}

export interface MoodButtonGridProps {
  moods?: Mood[];
  selectedMoodIds: string[];
  onMoodToggle: (moodId: string) => void;
  className?: string;
}

export function MoodButtonStyles() {
  return (
    <style jsx global>{`
      @keyframes mood-glow {
        0%,
        100% {
          box-shadow:
            0 0 0 1px #e50914,
            0 0 18px rgba(229, 9, 20, 0.3);
        }
        50% {
          box-shadow:
            0 0 0 1px #e50914,
            0 0 32px rgba(229, 9, 20, 0.55);
        }
      }
      .animate-mood-glow {
        animation: mood-glow 2s ease-in-out infinite;
      }
    `}</style>
  );
}

export function MoodButtonGrid({
  moods = FLIXPICK_MOODS,
  selectedMoodIds,
  onMoodToggle,
  className,
}: MoodButtonGridProps) {
  return (
    <>
      <MoodButtonStyles />
      <div
        className={cn(
          "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
          className,
        )}
      >
        {moods.map((mood) => (
          <MoodButton
            key={mood.id}
            mood={mood}
            selected={selectedMoodIds.includes(mood.id)}
            onSelect={onMoodToggle}
          />
        ))}
      </div>
    </>
  );
}
