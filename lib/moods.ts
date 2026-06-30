/** Canonical mood definitions shared by UI and TMDB discover helpers. */
export interface MoodDefinition {
  id: string;
  slug: string;
  label: string;
  description: string;
  movieGenres: number[];
  tvGenres: number[];
  gradientFrom: string;
  gradientTo: string;
}

export const MOOD_DEFINITIONS: MoodDefinition[] = [
  {
    id: "adrenaline-rush",
    slug: "adrenaline-rush",
    label: "Adrenaline Rush",
    description: "High-octane thrills",
    movieGenres: [28, 12, 53],
    tvGenres: [10759],
    gradientFrom: "#7f1d1d",
    gradientTo: "#ea580c",
  },
  {
    id: "need-a-good-laugh",
    slug: "need-a-good-laugh",
    label: "Need a Good Laugh",
    description: "Pure comedy gold",
    movieGenres: [35],
    tvGenres: [35],
    gradientFrom: "#854d0e",
    gradientTo: "#facc15",
  },
  {
    id: "hopeless-romantic",
    slug: "hopeless-romantic",
    label: "Hopeless Romantic",
    description: "Love stories that hit",
    movieGenres: [10749],
    tvGenres: [18, 35],
    gradientFrom: "#9d174d",
    gradientTo: "#fb7185",
  },
  {
    id: "keep-me-awake",
    slug: "keep-me-awake",
    label: "Keep me Awake",
    description: "Sleep with the lights on",
    movieGenres: [27, 53],
    tvGenres: [9648, 10765],
    gradientFrom: "#1a1a1a",
    gradientTo: "#450a0a",
  },
  {
    id: "mind-bending",
    slug: "mind-bending",
    label: "Mind-Bending",
    description: "Sci-fi & mysteries",
    movieGenres: [878, 9648],
    tvGenres: [10765, 9648],
    gradientFrom: "#312e81",
    gradientTo: "#7c3aed",
  },
  {
    id: "emotional-journey",
    slug: "emotional-journey",
    label: "Emotional Journey",
    description: "Stories that stay with you",
    movieGenres: [18],
    tvGenres: [18],
    gradientFrom: "#1e40af",
    gradientTo: "#60a5fa",
  },
  {
    id: "cozy-and-family",
    slug: "cozy-and-family",
    label: "Cozy & Family",
    description: "Warm & feel-good family time",
    movieGenres: [10751, 16],
    tvGenres: [10751, 16, 10762],
    gradientFrom: "#14532d",
    gradientTo: "#22c55e",
  },
  {
    id: "true-stories",
    slug: "true-stories",
    label: "True Stories",
    description: "Real worlds on screen",
    movieGenres: [99, 36],
    tvGenres: [99],
    gradientFrom: "#3f3f46",
    gradientTo: "#a1a1aa",
  },
  {
    id: "whodunnit",
    slug: "whodunnit",
    label: "Whodunnit?",
    description: "Crime & mystery",
    movieGenres: [80, 9648],
    tvGenres: [80, 9648],
    gradientFrom: "#1e3a5f",
    gradientTo: "#334155",
  },
  {
    id: "epic-fantasy",
    slug: "epic-fantasy",
    label: "Epic Fantasy",
    description: "Other worlds await",
    movieGenres: [14],
    tvGenres: [10765],
    gradientFrom: "#4c1d95",
    gradientTo: "#c084fc",
  },
];

export function getMoodDefinition(slug: string): MoodDefinition | undefined {
  return MOOD_DEFINITIONS.find((mood) => mood.slug === slug || mood.id === slug);
}
