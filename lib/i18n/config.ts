export const LOCALES = [
  {
    code: "en",
    label: "English",
    shortLabel: "EN",
    region: "US",
    countryCode: "us",
    htmlLang: "en",
  },
  {
    code: "pt",
    label: "Português",
    shortLabel: "PT",
    region: "BR",
    countryCode: "br",
    htmlLang: "pt-BR",
  },
  {
    code: "es",
    label: "Español",
    shortLabel: "ES",
    region: "ES",
    countryCode: "es",
    htmlLang: "es",
  },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "flixpick_locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.some((locale) => locale.code === value);
}

export function getLocaleMeta(code: Locale) {
  return LOCALES.find((locale) => locale.code === code) ?? LOCALES[0];
}

/** TMDB API `language` query value for each app locale. */
export function localeToTmdbLanguage(locale: Locale): string {
  switch (locale) {
    case "pt":
      return "pt-BR";
    case "es":
      return "es-ES";
    default:
      return "en-US";
  }
}

/** Detect locale from Accept-Language / navigator language string. */
export function detectLocaleFromAcceptLanguage(
  acceptLanguage: string | null | undefined,
): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const primary = acceptLanguage.split(",")[0]?.trim().toLowerCase() ?? "";
  if (primary.startsWith("pt")) return "pt";
  if (primary.startsWith("es")) return "es";
  return DEFAULT_LOCALE;
}
