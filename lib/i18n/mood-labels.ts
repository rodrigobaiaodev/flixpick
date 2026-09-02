import type { Locale } from "@/lib/i18n/config";

const MOOD_SLUGS = [
  "adrenaline-rush",
  "need-a-good-laugh",
  "hopeless-romantic",
  "keep-me-awake",
  "mind-bending",
  "emotional-journey",
  "cozy-and-family",
  "true-stories",
  "whodunnit",
  "epic-fantasy",
] as const;

type MoodSlug = (typeof MOOD_SLUGS)[number];

const labels: Record<Locale, Record<MoodSlug, string>> = {
  en: {
    "adrenaline-rush": "Adrenaline Rush",
    "need-a-good-laugh": "Need a Good Laugh",
    "hopeless-romantic": "Hopeless Romantic",
    "keep-me-awake": "Keep me Awake",
    "mind-bending": "Mind-Bending",
    "emotional-journey": "Emotional Journey",
    "cozy-and-family": "Cozy & Family",
    "true-stories": "True Stories",
    whodunnit: "Whodunnit?",
    "epic-fantasy": "Epic Fantasy",
  },
  pt: {
    "adrenaline-rush": "Adrenalina pura",
    "need-a-good-laugh": "Quero rir",
    "hopeless-romantic": "Romântico",
    "keep-me-awake": "Me mantenha acordado",
    "mind-bending": "Mente explodindo",
    "emotional-journey": "Jornada emocional",
    "cozy-and-family": "Aconchego em família",
    "true-stories": "Histórias reais",
    whodunnit: "Quem é o culpado?",
    "epic-fantasy": "Fantasia épica",
  },
  es: {
    "adrenaline-rush": "Adrenalina pura",
    "need-a-good-laugh": "Necesito reír",
    "hopeless-romantic": "Romántico",
    "keep-me-awake": "Que no me duerma",
    "mind-bending": "Mente retorcida",
    "emotional-journey": "Viaje emocional",
    "cozy-and-family": "En familia",
    "true-stories": "Historias reales",
    whodunnit: "¿Quién lo hizo?",
    "epic-fantasy": "Fantasía épica",
  },
};

export function getMoodLabel(
  locale: Locale,
  slug: string,
  fallback: string,
): string {
  const map = labels[locale];
  return (map as Record<string, string>)[slug] ?? fallback;
}
