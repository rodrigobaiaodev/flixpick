import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  detectLocaleFromAcceptLanguage,
  isLocale,
  localeToTmdbLanguage,
  type Locale,
} from "@/lib/i18n/config";

/** Locale from cookie, or Accept-Language fallback (server). */
export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (fromCookie && isLocale(fromCookie)) return fromCookie;

  const headerStore = await headers();
  return detectLocaleFromAcceptLanguage(
    headerStore.get("accept-language"),
  );
}

export async function getRequestTmdbLanguage(): Promise<string> {
  return localeToTmdbLanguage(await getRequestLocale());
}
