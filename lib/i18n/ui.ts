import type { Locale } from "@/lib/i18n/config";

/** UI strings for list, status, auth, tech details, profile, etc. */
export type UiKey =
  | "list.add"
  | "list.saved"
  | "list.remove"
  | "list.addFirst"
  | "list.title"
  | "list.empty"
  | "list.emptyHint"
  | "list.emptySetup"
  | "list.emptySetupHint"
  | "list.all"
  | "list.sortRecent"
  | "list.sortTitle"
  | "list.sortRating"
  | "list.removeItem"
  | "list.collection"
  | "list.savedCount"
  | "list.browseContent"
  | "list.sortBy"
  | "list.sortRecentFull"
  | "list.watchedMovies"
  | "list.watchedShows"
  | "common.cancel"
  | "profile.editName"
  | "status.wantToWatch"
  | "status.watching"
  | "status.watched"
  | "status.loved"
  | "status.label"
  | "status.set"
  | "status.track"
  | "status.removeFromList"
  | "status.saveFirst"
  | "status.watchingLink"
  | "platform.any"
  | "home.notFeelingIt"
  | "auth.continueGoogle"
  | "auth.signingIn"
  | "auth.loginFailed"
  | "auth.googleFailed"
  | "auth.email"
  | "auth.password"
  | "auth.or"
  | "auth.noAccount"
  | "auth.signUp"
  | "auth.welcomeBack"
  | "auth.createAccount"
  | "auth.modalTitle"
  | "auth.modalSubtitle"
  | "auth.emailPlaceholder"
  | "auth.close"
  | "tech.director"
  | "tech.budget"
  | "tech.revenue"
  | "tech.country"
  | "tech.language"
  | "tech.creator"
  | "tech.seasons"
  | "tech.episodes"
  | "tech.status"
  | "tvStatus.returning"
  | "tvStatus.ended"
  | "tvStatus.canceled"
  | "tvStatus.inProduction"
  | "common.movie"
  | "common.series"
  | "common.noPoster"
  | "common.scrollLeft"
  | "common.scrollRight"
  | "common.saving"
  | "common.save"
  | "common.loading"
  | "common.cancel"
  | "profile.moviesWatched"
  | "profile.showsWatched"
  | "profile.favorites"
  | "profile.totalSaved"
  | "profile.displayName"
  | "profile.updateFailed"
  | "profile.editName"
  | "watching.saveProgress"
  | "watching.season"
  | "watching.episode"
  | "watching.loadFailed"
  | "search.failed"
  | "search.loadMoreFailed"
  | "trailers.failed"
  | "banner.listSetup";

type UiMap = Record<UiKey, string>;

const en: UiMap = {
  "list.add": "Add to My List",
  "list.saved": "Saved to My List",
  "list.remove": "Remove from My List",
  "list.addFirst": "Add to My List first, then set your watch status",
  "list.title": "My List",
  "list.empty": "Your list is empty",
  "list.emptyHint":
    "Tap the bookmark on any movie or show card to save it here.",
  "list.emptySetup": "Ready to start collecting?",
  "list.emptySetupHint":
    "Complete the one-time setup above, then save titles from any card.",
  "list.all": "All",
  "list.sortRecent": "Recent",
  "list.sortTitle": "Title",
  "list.sortRating": "Rating",
  "list.removeItem": "Remove",
  "list.collection": "Your Collection",
  "list.savedCount": "Saved",
  "list.browseContent": "Browse Content",
  "list.sortBy": "Sort by",
  "list.sortRecentFull": "Recently Added",
  "list.watchedMovies": "{count} movie(s)",
  "list.watchedShows": "{count} show(s)",
  "status.wantToWatch": "Want to Watch",
  "status.watching": "Currently Watching",
  "status.watched": "Watched",
  "status.loved": "Loved it",
  "status.label": "Watch Status",
  "status.set": "Set watch status",
  "status.track": "Track your progress",
  "status.removeFromList": "Remove from list",
  "status.saveFirst":
    "Save to My List first, then set your status here or on the {link} page.",
  "status.watchingLink": "Watching",
  "platform.any": "Any Platform",
  "home.notFeelingIt": "Not feeling it? Roll Again",
  "auth.continueGoogle": "Continue with Google",
  "auth.signingIn": "Signing in…",
  "auth.loginFailed": "Login failed",
  "auth.googleFailed": "Google sign-in failed",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.or": "or",
  "auth.noAccount": "Don't have an account?",
  "auth.signUp": "Sign up",
  "auth.welcomeBack": "Welcome back",
  "auth.createAccount": "Create account",
  "auth.modalTitle": "Sign up free — save your favorites forever",
  "auth.modalSubtitle":
    "Build your watchlist, track what you're watching, and never lose a great pick.",
  "auth.emailPlaceholder": "Email address",
  "auth.close": "Close",
  "tech.director": "Director",
  "tech.budget": "Budget",
  "tech.revenue": "Revenue",
  "tech.country": "Country",
  "tech.language": "Language",
  "tech.creator": "Creator",
  "tech.seasons": "Seasons",
  "tech.episodes": "Episodes",
  "tech.status": "Status",
  "tvStatus.returning": "Returning",
  "tvStatus.ended": "Ended",
  "tvStatus.canceled": "Canceled",
  "tvStatus.inProduction": "In Production",
  "common.movie": "Movie",
  "common.series": "Series",
  "common.noPoster": "No poster",
  "common.scrollLeft": "Scroll left",
  "common.scrollRight": "Scroll right",
  "common.saving": "Saving…",
  "common.save": "Save",
  "common.loading": "Loading…",
  "common.cancel": "Cancel",
  "profile.moviesWatched": "Movies Watched",
  "profile.showsWatched": "Shows Watched",
  "profile.favorites": "Favorites",
  "profile.totalSaved": "Total Saved",
  "profile.displayName": "Display name",
  "profile.updateFailed": "Could not update name",
  "profile.editName": "Edit name",
  "watching.saveProgress": "Save progress",
  "watching.season": "Season",
  "watching.episode": "Episode",
  "watching.loadFailed": "Could not load episodes",
  "search.failed": "Search failed",
  "search.loadMoreFailed": "Failed to load more",
  "trailers.failed": "Failed to load trailers",
  "banner.listSetup":
    "Run the SQL below once — then My List, Watching, and Profile will work.",
};

const pt: UiMap = {
  "list.add": "Adicionar à Minha Lista",
  "list.saved": "Salvo na Minha Lista",
  "list.remove": "Remover da Minha Lista",
  "list.addFirst":
    "Adicione à Minha Lista primeiro e depois defina o status",
  "list.title": "Minha Lista",
  "list.empty": "Sua lista está vazia",
  "list.emptyHint":
    "Toque no marcador em qualquer card de filme ou série para salvar aqui.",
  "list.emptySetup": "Pronto para começar a colecionar?",
  "list.emptySetupHint":
    "Conclua a configuração única acima e depois salve títulos em qualquer card.",
  "list.all": "Todos",
  "list.sortRecent": "Recentes",
  "list.sortTitle": "Título",
  "list.sortRating": "Nota",
  "list.removeItem": "Remover",
  "list.collection": "Sua coleção",
  "list.savedCount": "Salvos",
  "list.browseContent": "Explorar conteúdo",
  "list.sortBy": "Ordenar por",
  "list.sortRecentFull": "Adicionados recentemente",
  "list.watchedMovies": "{count} filme(s)",
  "list.watchedShows": "{count} série(s)",
  "status.wantToWatch": "Quero assistir",
  "status.watching": "Assistindo agora",
  "status.watched": "Assistido",
  "status.loved": "Amei",
  "status.label": "Status",
  "status.set": "Definir status",
  "status.track": "Acompanhe seu progresso",
  "status.removeFromList": "Remover da lista",
  "status.saveFirst":
    "Salve na Minha Lista primeiro e depois defina o status aqui ou na página {link}.",
  "status.watchingLink": "Assistindo",
  "platform.any": "Qualquer plataforma",
  "home.notFeelingIt": "Não curtiu? Girar de novo",
  "auth.continueGoogle": "Continuar com Google",
  "auth.signingIn": "Entrando…",
  "auth.loginFailed": "Falha no login",
  "auth.googleFailed": "Falha no login com Google",
  "auth.email": "E-mail",
  "auth.password": "Senha",
  "auth.or": "ou",
  "auth.noAccount": "Não tem conta?",
  "auth.signUp": "Criar conta",
  "auth.welcomeBack": "Bem-vindo de volta",
  "auth.createAccount": "Criar conta",
  "auth.modalTitle": "Cadastre-se grátis — salve seus favoritos para sempre",
  "auth.modalSubtitle":
    "Monte sua watchlist, acompanhe o que está assistindo e nunca perca uma ótima escolha.",
  "auth.emailPlaceholder": "Seu e-mail",
  "auth.close": "Fechar",
  "tech.director": "Diretor",
  "tech.budget": "Orçamento",
  "tech.revenue": "Bilheteria",
  "tech.country": "País",
  "tech.language": "Idioma",
  "tech.creator": "Criador",
  "tech.seasons": "Temporadas",
  "tech.episodes": "Episódios",
  "tech.status": "Status",
  "tvStatus.returning": "Em exibição",
  "tvStatus.ended": "Encerrada",
  "tvStatus.canceled": "Cancelada",
  "tvStatus.inProduction": "Em produção",
  "common.movie": "Filme",
  "common.series": "Série",
  "common.noPoster": "Sem pôster",
  "common.scrollLeft": "Rolar para a esquerda",
  "common.scrollRight": "Rolar para a direita",
  "common.saving": "Salvando…",
  "common.save": "Salvar",
  "common.loading": "Carregando…",
  "common.cancel": "Cancelar",
  "profile.moviesWatched": "Filmes assistidos",
  "profile.showsWatched": "Séries assistidas",
  "profile.favorites": "Favoritos",
  "profile.totalSaved": "Total salvos",
  "profile.displayName": "Nome de exibição",
  "profile.updateFailed": "Não foi possível atualizar o nome",
  "profile.editName": "Editar nome",
  "watching.saveProgress": "Salvar progresso",
  "watching.season": "Temporada",
  "watching.episode": "Episódio",
  "watching.loadFailed": "Não foi possível carregar os episódios",
  "search.failed": "Falha na busca",
  "search.loadMoreFailed": "Falha ao carregar mais",
  "trailers.failed": "Falha ao carregar trailers",
  "banner.listSetup":
    "Execute o SQL abaixo uma vez — depois Minha Lista, Assistindo e Perfil funcionarão.",
};

const es: UiMap = {
  "list.add": "Añadir a Mi Lista",
  "list.saved": "Guardado en Mi Lista",
  "list.remove": "Quitar de Mi Lista",
  "list.addFirst":
    "Añade a Mi Lista primero y luego define el estado",
  "list.title": "Mi Lista",
  "list.empty": "Tu lista está vacía",
  "list.emptyHint":
    "Toca el marcador en cualquier tarjeta de película o serie para guardarla aquí.",
  "list.emptySetup": "¿Listo para empezar a coleccionar?",
  "list.emptySetupHint":
    "Completa la configuración única de arriba y luego guarda títulos desde cualquier tarjeta.",
  "list.all": "Todos",
  "list.sortRecent": "Recientes",
  "list.sortTitle": "Título",
  "list.sortRating": "Valoración",
  "list.removeItem": "Quitar",
  "list.collection": "Tu colección",
  "list.savedCount": "Guardados",
  "list.browseContent": "Explorar contenido",
  "list.sortBy": "Ordenar por",
  "list.sortRecentFull": "Añadidos recientemente",
  "list.watchedMovies": "{count} película(s)",
  "list.watchedShows": "{count} serie(s)",
  "status.wantToWatch": "Quiero ver",
  "status.watching": "Viendo ahora",
  "status.watched": "Visto",
  "status.loved": "Me encantó",
  "status.label": "Estado",
  "status.set": "Definir estado",
  "status.track": "Sigue tu progreso",
  "status.removeFromList": "Quitar de la lista",
  "status.saveFirst":
    "Guarda en Mi Lista primero y luego define el estado aquí o en la página {link}.",
  "status.watchingLink": "Viendo",
  "platform.any": "Cualquier plataforma",
  "home.notFeelingIt": "¿No te convence? Girar de nuevo",
  "auth.continueGoogle": "Continuar con Google",
  "auth.signingIn": "Iniciando sesión…",
  "auth.loginFailed": "Error al iniciar sesión",
  "auth.googleFailed": "Error con Google",
  "auth.email": "Correo",
  "auth.password": "Contraseña",
  "auth.or": "o",
  "auth.noAccount": "¿No tienes cuenta?",
  "auth.signUp": "Regístrate",
  "auth.welcomeBack": "Bienvenido de nuevo",
  "auth.createAccount": "Crear cuenta",
  "auth.modalTitle": "Regístrate gratis — guarda tus favoritos para siempre",
  "auth.modalSubtitle":
    "Crea tu lista, sigue lo que estás viendo y nunca pierdas una gran elección.",
  "auth.emailPlaceholder": "Correo electrónico",
  "auth.close": "Cerrar",
  "tech.director": "Director",
  "tech.budget": "Presupuesto",
  "tech.revenue": "Recaudación",
  "tech.country": "País",
  "tech.language": "Idioma",
  "tech.creator": "Creador",
  "tech.seasons": "Temporadas",
  "tech.episodes": "Episodios",
  "tech.status": "Estado",
  "tvStatus.returning": "En emisión",
  "tvStatus.ended": "Finalizada",
  "tvStatus.canceled": "Cancelada",
  "tvStatus.inProduction": "En producción",
  "common.movie": "Película",
  "common.series": "Serie",
  "common.noPoster": "Sin póster",
  "common.scrollLeft": "Desplazar a la izquierda",
  "common.scrollRight": "Desplazar a la derecha",
  "common.saving": "Guardando…",
  "common.save": "Guardar",
  "common.loading": "Cargando…",
  "common.cancel": "Cancelar",
  "profile.moviesWatched": "Películas vistas",
  "profile.showsWatched": "Series vistas",
  "profile.favorites": "Favoritos",
  "profile.totalSaved": "Total guardados",
  "profile.displayName": "Nombre visible",
  "profile.updateFailed": "No se pudo actualizar el nombre",
  "profile.editName": "Editar nombre",
  "watching.saveProgress": "Guardar progreso",
  "watching.season": "Temporada",
  "watching.episode": "Episodio",
  "watching.loadFailed": "No se pudieron cargar los episodios",
  "search.failed": "Error en la búsqueda",
  "search.loadMoreFailed": "Error al cargar más",
  "trailers.failed": "Error al cargar tráilers",
  "banner.listSetup":
    "Ejecuta el SQL de abajo una vez — luego Mi Lista, Viendo y Perfil funcionarán.",
};

export const uiMessages: Record<Locale, UiMap> = { en, pt, es };

export function translateUi(
  locale: Locale,
  key: UiKey,
  params?: Record<string, string | number>,
): string {
  let text = uiMessages[locale][key] ?? uiMessages.en[key] ?? key;
  if (params) {
    for (const [param, value] of Object.entries(params)) {
      text = text.replace(`{${param}}`, String(value));
    }
  }
  return text;
}

const TECH_LABEL_TO_KEY: Record<string, UiKey> = {
  Director: "tech.director",
  Budget: "tech.budget",
  Revenue: "tech.revenue",
  Country: "tech.country",
  Language: "tech.language",
  Creator: "tech.creator",
  Seasons: "tech.seasons",
  Episodes: "tech.episodes",
  Status: "tech.status",
};

const TV_STATUS_TO_KEY: Record<string, UiKey> = {
  Returning: "tvStatus.returning",
  Ended: "tvStatus.ended",
  Canceled: "tvStatus.canceled",
  "In Production": "tvStatus.inProduction",
};

export function translateTechLabel(locale: Locale, label: string): string {
  const key = TECH_LABEL_TO_KEY[label];
  return key ? translateUi(locale, key) : label;
}

export function translateTechValue(locale: Locale, value: string): string {
  const key = TV_STATUS_TO_KEY[value];
  return key ? translateUi(locale, key) : value;
}

export function statusLabelKey(
  status: "want_to_watch" | "watching" | "watched" | "loved",
): UiKey {
  switch (status) {
    case "want_to_watch":
      return "status.wantToWatch";
    case "watching":
      return "status.watching";
    case "watched":
      return "status.watched";
    case "loved":
      return "status.loved";
  }
}
