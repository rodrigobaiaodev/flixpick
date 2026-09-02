import type { Locale } from "@/lib/i18n/config";

export type TranslationKey =
  | "nav.home"
  | "nav.movies"
  | "nav.tvShows"
  | "nav.browse"
  | "nav.search"
  | "nav.myList"
  | "nav.watching"
  | "nav.profile"
  | "auth.signIn"
  | "auth.signOut"
  | "language.label"
  | "language.choose";

const en: Record<TranslationKey, string> = {
  "nav.home": "Home",
  "nav.movies": "Movies",
  "nav.tvShows": "TV Shows",
  "nav.browse": "Browse",
  "nav.search": "Search",
  "nav.myList": "My List",
  "nav.watching": "Watching",
  "nav.profile": "Profile",
  "auth.signIn": "Sign In",
  "auth.signOut": "Sign Out",
  "language.label": "Language",
  "language.choose": "Choose language",
};

const pt: Record<TranslationKey, string> = {
  "nav.home": "Início",
  "nav.movies": "Filmes",
  "nav.tvShows": "Séries",
  "nav.browse": "Explorar",
  "nav.search": "Buscar",
  "nav.myList": "Minha Lista",
  "nav.watching": "Assistindo",
  "nav.profile": "Perfil",
  "auth.signIn": "Entrar",
  "auth.signOut": "Sair",
  "language.label": "Idioma",
  "language.choose": "Escolher idioma",
};

const es: Record<TranslationKey, string> = {
  "nav.home": "Inicio",
  "nav.movies": "Películas",
  "nav.tvShows": "Series",
  "nav.browse": "Explorar",
  "nav.search": "Buscar",
  "nav.myList": "Mi Lista",
  "nav.watching": "Viendo",
  "nav.profile": "Perfil",
  "auth.signIn": "Iniciar sesión",
  "auth.signOut": "Cerrar sesión",
  "language.label": "Idioma",
  "language.choose": "Elegir idioma",
};

export const messages: Record<Locale, Record<TranslationKey, string>> = {
  en,
  pt,
  es,
};

export function translate(locale: Locale, key: TranslationKey): string {
  return messages[locale][key] ?? messages.en[key] ?? key;
}
