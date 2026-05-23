"use client";

import type { Mood } from "@/types/movie";
import type { MoodChipProps } from "@/types/ui";
import { cn } from "@/lib/utils";

export const FLIXPICK_MOODS: Mood[] = [
  {
    id: "action-packed",
    slug: "action-packed",
    label: "Action-Packed",
    description: "High-octane thrills",
    icon: "🔥",
    genreIds: [28, 12],
    gradientFrom: "#7f1d1d",
    gradientTo: "#ea580c",
  },
  {
    id: "need-to-laugh",
    slug: "need-to-laugh",
    label: "Need to Laugh",
    description: "Pure comedy gold",
    icon: "😂",
    genreIds: [35],
    gradientFrom: "#854d0e",
    gradientTo: "#facc15",
  },
  {
    id: "mind-bending",
    slug: "mind-bending",
    label: "Mind-Bending",
    description: "Sci-fi that changes you",
    icon: "🤯",
    genreIds: [878, 9648],
    gradientFrom: "#312e81",
    gradientTo: "#7c3aed",
  },
  {
    id: "horror-night",
    slug: "horror-night",
    label: "Horror Night",
    description: "Sleep with the lights on",
    icon: "💀",
    genreIds: [27, 53],
    gradientFrom: "#1a1a1a",
    gradientTo: "#450a0a",
  },
  {
    id: "feel-good",
    slug: "feel-good",
    label: "Feel Good",
    description: "Warm your heart",
    icon: "❤️",
    genreIds: [10749, 18],
    gradientFrom: "#9d174d",
    gradientTo: "#fb7185",
  },
  {
    id: "tense-mystery",
    slug: "tense-mystery",
    label: "Tense Mystery",
    description: "You won't see it coming",
    icon: "🕵️",
    genreIds: [9648, 53],
    gradientFrom: "#1e3a5f",
    gradientTo: "#334155",
  },
  {
    id: "good-cry",
    slug: "good-cry",
    label: "Good Cry",
    description: "Emotionally devastating",
    icon: "😢",
    genreIds: [18],
    gradientFrom: "#1e40af",
    gradientTo: "#60a5fa",
  },
  {
    id: "world-cinema",
    slug: "world-cinema",
    label: "World Cinema",
    description: "Beyond Hollywood",
    icon: "🌍",
    genreIds: [36],
    gradientFrom: "#14532d",
    gradientTo: "#22c55e",
  },
];

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
      <span className="text-3xl" aria-hidden>
        {mood.icon}
      </span>
      <span className="mt-3 block w-full">
        <span className="block text-base font-semibold text-slate-100">
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
