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
  | "language.choose"
  | "common.back"
  | "common.noSynopsis"
  | "common.somethingWrong"
  | "common.exploreAll"
  | "common.updatedWeekly"
  | "common.hotThisWeek"
  | "detail.overview"
  | "detail.cast"
  | "detail.videos"
  | "detail.topCast"
  | "detail.fullCast"
  | "detail.details"
  | "detail.whereToWatch"
  | "detail.whereToWatchDesc"
  | "detail.notListed"
  | "detail.watchTrailer"
  | "detail.noVideos"
  | "detail.similarMovies"
  | "detail.similarShows"
  | "detail.movie"
  | "detail.tvSeries"
  | "detail.starring"
  | "detail.moreLikeThis"
  | "home.brand"
  | "home.headline1"
  | "home.headline2"
  | "home.subtitle"
  | "home.tonightsPick"
  | "home.findingPick"
  | "home.watchTrailer"
  | "home.whereToWatch"
  | "home.viewDetails"
  | "home.challengeFriend"
  | "home.creatingLink"
  | "home.rollAgain"
  | "home.changeMood"
  | "home.moodQuestion"
  | "home.mediaMovies"
  | "home.mediaTv"
  | "home.mediaBoth"
  | "home.pickMood"
  | "home.whereWatch"
  | "home.feelingTonight"
  | "home.refineGenre"
  | "home.pickMoodFirst"
  | "home.trendingTitle"
  | "home.trendingDesc"
  | "home.trailersTitle"
  | "home.trailersDesc"
  | "footer.about"
  | "footer.contact"
  | "footer.privacy"
  | "footer.cookies"
  | "footer.terms"
  | "footer.rights"
  | "cookie.message"
  | "cookie.policy"
  | "cookie.decline"
  | "cookie.accept"
  | "watching.inProgress"
  | "watching.title"
  | "watching.subtitle"
  | "watching.empty"
  | "watching.emptyHint"
  | "watching.findSomething"
  | "watching.goToList"
  | "watching.progress"
  | "watching.setEpisode"
  | "watching.updateEpisode"
  | "watching.markWatched"
  | "watching.updating"
  | "share.challengeFriend"
  | "share.sharePick"
  | "share.yourLink"
  | "share.copy"
  | "share.copied"
  | "share.shareOn"
  | "share.preview"
  | "share.withImage"
  | "share.sharing"
  | "share.copyHint";

type MessageMap = Record<TranslationKey, string>;

const en: MessageMap = {
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
  "common.back": "Back",
  "common.noSynopsis": "No synopsis available.",
  "common.somethingWrong": "Something went wrong",
  "common.exploreAll": "Explore all",
  "common.updatedWeekly": "Updated weekly",
  "common.hotThisWeek": "Hot this week",
  "detail.overview": "Overview",
  "detail.cast": "Cast",
  "detail.videos": "Videos",
  "detail.topCast": "Top Cast",
  "detail.fullCast": "Full Cast",
  "detail.details": "Details",
  "detail.whereToWatch": "Where to Watch",
  "detail.whereToWatchDesc": "Streaming availability in the US.",
  "detail.notListed": "Not currently listed for US streaming.",
  "detail.watchTrailer": "Watch Trailer",
  "detail.noVideos": "No videos available.",
  "detail.similarMovies": "Similar Movies",
  "detail.similarShows": "Similar Shows",
  "detail.movie": "Movie",
  "detail.tvSeries": "TV Series",
  "detail.starring": "Starring",
  "detail.moreLikeThis": "More like this",
  "home.brand": "FlixPick",
  "home.headline1": "Stop Scrolling.",
  "home.headline2": "Start Watching.",
  "home.subtitle":
    "Tell us your mood, pick your platforms. We'll find your perfect movie in seconds.",
  "home.tonightsPick": "Tonight's pick",
  "home.findingPick": "Finding your next pick…",
  "home.watchTrailer": "Watch Trailer",
  "home.whereToWatch": "Where to Watch",
  "home.viewDetails": "View Details",
  "home.challengeFriend": "🎬 Challenge a Friend",
  "home.creatingLink": "Creating link…",
  "home.rollAgain": "Roll Again",
  "home.changeMood": "Change Mood",
  "home.moodQuestion": "What are you in the mood for?",
  "home.mediaMovies": "Movies",
  "home.mediaTv": "TV Shows",
  "home.mediaBoth": "Both",
  "home.pickMood": "Pick your mood",
  "home.whereWatch": "Where do you watch?",
  "home.feelingTonight": "How are you feeling tonight?",
  "home.refineGenre": "Refine by genre (optional):",
  "home.pickMoodFirst": "Pick a mood first to spin the wheel.",
  "home.trendingTitle": "Trending Now",
  "home.trendingDesc":
    "What everyone's watching right now — ranked by buzz and ratings.",
  "home.trailersTitle": "Top 10 Trailers This Week",
  "home.trailersDesc":
    "The hottest official trailers — watch before you pick tonight's title.",
  "footer.about": "About",
  "footer.contact": "Contact",
  "footer.privacy": "Privacy Policy",
  "footer.cookies": "Cookies",
  "footer.terms": "Terms of Service",
  "footer.rights": "All rights reserved.",
  "cookie.message":
    "We use cookies for essential features and, with your OK, for ads and analytics. See our",
  "cookie.policy": "Cookie Policy",
  "cookie.decline": "Decline",
  "cookie.accept": "Accept",
  "watching.inProgress": "In Progress",
  "watching.title": "Currently Watching",
  "watching.subtitle": "You have {count} title(s) in progress. Pick up where you left off.",
  "watching.empty": "Nothing in progress",
  "watching.emptyHint":
    'Save a title and set its status to "Currently Watching" from any movie card.',
  "watching.findSomething": "Find Something to Watch",
  "watching.goToList": "Go to My List",
  "watching.progress": "Progress",
  "watching.setEpisode": "Set episode",
  "watching.updateEpisode": "Update episode",
  "watching.markWatched": "Mark as Watched",
  "watching.updating": "Updating…",
  "share.challengeFriend": "Challenge a friend",
  "share.sharePick": "Share your pick",
  "share.yourLink": "Your link",
  "share.copy": "Copy",
  "share.copied": "Copied",
  "share.shareOn": "Share on",
  "share.preview": "Preview message",
  "share.withImage": "Share with image",
  "share.sharing": "Sharing…",
  "share.copyHint": "Copy the full message or tap a platform below to share instantly.",
};

const pt: MessageMap = {
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
  "common.back": "Voltar",
  "common.noSynopsis": "Sinopse não disponível.",
  "common.somethingWrong": "Algo deu errado",
  "common.exploreAll": "Ver tudo",
  "common.updatedWeekly": "Atualizado semanalmente",
  "common.hotThisWeek": "Em alta esta semana",
  "detail.overview": "Visão geral",
  "detail.cast": "Elenco",
  "detail.videos": "Vídeos",
  "detail.topCast": "Elenco principal",
  "detail.fullCast": "Elenco completo",
  "detail.details": "Detalhes",
  "detail.whereToWatch": "Onde assistir",
  "detail.whereToWatchDesc": "Disponibilidade de streaming nos EUA.",
  "detail.notListed": "Não listado para streaming nos EUA no momento.",
  "detail.watchTrailer": "Assistir trailer",
  "detail.noVideos": "Nenhum vídeo disponível.",
  "detail.similarMovies": "Filmes parecidos",
  "detail.similarShows": "Séries parecidas",
  "detail.movie": "Filme",
  "detail.tvSeries": "Série",
  "detail.starring": "Estrelando",
  "detail.moreLikeThis": "Mais como este",
  "home.brand": "FlixPick",
  "home.headline1": "Pare de rolar.",
  "home.headline2": "Comece a assistir.",
  "home.subtitle":
    "Diga seu humor, escolha suas plataformas. Encontramos o filme perfeito em segundos.",
  "home.tonightsPick": "Escolha de hoje",
  "home.findingPick": "Buscando sua próxima escolha…",
  "home.watchTrailer": "Assistir trailer",
  "home.whereToWatch": "Onde assistir",
  "home.viewDetails": "Ver detalhes",
  "home.challengeFriend": "🎬 Desafiar um amigo",
  "home.creatingLink": "Criando link…",
  "home.rollAgain": "Girar de novo",
  "home.changeMood": "Mudar humor",
  "home.moodQuestion": "Do que você está a fim?",
  "home.mediaMovies": "Filmes",
  "home.mediaTv": "Séries",
  "home.mediaBoth": "Ambos",
  "home.pickMood": "Escolha seu humor",
  "home.whereWatch": "Onde você assiste?",
  "home.feelingTonight": "Como você está se sentindo hoje?",
  "home.refineGenre": "Refinar por gênero (opcional):",
  "home.pickMoodFirst": "Escolha um humor antes de girar a roleta.",
  "home.trendingTitle": "Em alta agora",
  "home.trendingDesc":
    "O que todo mundo está assistindo — ranqueado por buzz e avaliações.",
  "home.trailersTitle": "Top 10 trailers da semana",
  "home.trailersDesc":
    "Os trailers oficiais mais quentes — assista antes de escolher o título de hoje.",
  "footer.about": "Sobre",
  "footer.contact": "Contato",
  "footer.privacy": "Privacidade",
  "footer.cookies": "Cookies",
  "footer.terms": "Termos de uso",
  "footer.rights": "Todos os direitos reservados.",
  "cookie.message":
    "Usamos cookies para recursos essenciais e, com sua permissão, para anúncios e análises. Veja nossa",
  "cookie.policy": "Política de Cookies",
  "cookie.decline": "Recusar",
  "cookie.accept": "Aceitar",
  "watching.inProgress": "Em andamento",
  "watching.title": "Assistindo agora",
  "watching.subtitle":
    "Você tem {count} título(s) em progresso. Continue de onde parou.",
  "watching.empty": "Nada em andamento",
  "watching.emptyHint":
    'Salve um título e defina o status como "Assistindo agora" em qualquer card.',
  "watching.findSomething": "Encontrar algo para assistir",
  "watching.goToList": "Ir para minha lista",
  "watching.progress": "Progresso",
  "watching.setEpisode": "Definir episódio",
  "watching.updateEpisode": "Atualizar episódio",
  "watching.markWatched": "Marcar como assistido",
  "watching.updating": "Atualizando…",
  "share.challengeFriend": "Desafiar um amigo",
  "share.sharePick": "Compartilhar sua escolha",
  "share.yourLink": "Seu link",
  "share.copy": "Copiar",
  "share.copied": "Copiado",
  "share.shareOn": "Compartilhar em",
  "share.preview": "Prévia da mensagem",
  "share.withImage": "Compartilhar com imagem",
  "share.sharing": "Compartilhando…",
  "share.copyHint":
    "Copie a mensagem completa ou toque em uma plataforma abaixo para compartilhar.",
};

const es: MessageMap = {
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
  "common.back": "Volver",
  "common.noSynopsis": "Sinopsis no disponible.",
  "common.somethingWrong": "Algo salió mal",
  "common.exploreAll": "Ver todo",
  "common.updatedWeekly": "Actualizado semanalmente",
  "common.hotThisWeek": "Tendencia esta semana",
  "detail.overview": "Resumen",
  "detail.cast": "Reparto",
  "detail.videos": "Videos",
  "detail.topCast": "Reparto principal",
  "detail.fullCast": "Reparto completo",
  "detail.details": "Detalles",
  "detail.whereToWatch": "Dónde ver",
  "detail.whereToWatchDesc": "Disponibilidad de streaming en EE. UU.",
  "detail.notListed": "No disponible en streaming en EE. UU. por ahora.",
  "detail.watchTrailer": "Ver tráiler",
  "detail.noVideos": "No hay videos disponibles.",
  "detail.similarMovies": "Películas similares",
  "detail.similarShows": "Series similares",
  "detail.movie": "Película",
  "detail.tvSeries": "Serie",
  "detail.starring": "Protagonistas",
  "detail.moreLikeThis": "Más como esto",
  "home.brand": "FlixPick",
  "home.headline1": "Deja de scrollear.",
  "home.headline2": "Empieza a ver.",
  "home.subtitle":
    "Dinos tu mood, elige tus plataformas. Encontramos tu película perfecta en segundos.",
  "home.tonightsPick": "Elección de hoy",
  "home.findingPick": "Buscando tu próxima elección…",
  "home.watchTrailer": "Ver tráiler",
  "home.whereToWatch": "Dónde ver",
  "home.viewDetails": "Ver detalles",
  "home.challengeFriend": "🎬 Desafiar a un amigo",
  "home.creatingLink": "Creando enlace…",
  "home.rollAgain": "Girar de nuevo",
  "home.changeMood": "Cambiar mood",
  "home.moodQuestion": "¿De qué tienes ganas?",
  "home.mediaMovies": "Películas",
  "home.mediaTv": "Series",
  "home.mediaBoth": "Ambos",
  "home.pickMood": "Elige tu mood",
  "home.whereWatch": "¿Dónde ves contenido?",
  "home.feelingTonight": "¿Cómo te sientes esta noche?",
  "home.refineGenre": "Refinar por género (opcional):",
  "home.pickMoodFirst": "Elige un mood antes de girar la ruleta.",
  "home.trendingTitle": "Tendencias ahora",
  "home.trendingDesc":
    "Lo que todos están viendo — clasificado por buzz y valoraciones.",
  "home.trailersTitle": "Top 10 tráilers de la semana",
  "home.trailersDesc":
    "Los tráilers oficiales más populares — mira antes de elegir el título de hoy.",
  "footer.about": "Acerca de",
  "footer.contact": "Contacto",
  "footer.privacy": "Privacidad",
  "footer.cookies": "Cookies",
  "footer.terms": "Términos",
  "footer.rights": "Todos los derechos reservados.",
  "cookie.message":
    "Usamos cookies para funciones esenciales y, con tu permiso, para anuncios y análisis. Consulta nuestra",
  "cookie.policy": "Política de Cookies",
  "cookie.decline": "Rechazar",
  "cookie.accept": "Aceptar",
  "watching.inProgress": "En progreso",
  "watching.title": "Viendo ahora",
  "watching.subtitle":
    "Tienes {count} título(s) en progreso. Continúa donde lo dejaste.",
  "watching.empty": "Nada en progreso",
  "watching.emptyHint":
    'Guarda un título y pon su estado en "Viendo ahora" desde cualquier tarjeta.',
  "watching.findSomething": "Encontrar algo para ver",
  "watching.goToList": "Ir a mi lista",
  "watching.progress": "Progreso",
  "watching.setEpisode": "Definir episodio",
  "watching.updateEpisode": "Actualizar episodio",
  "watching.markWatched": "Marcar como visto",
  "watching.updating": "Actualizando…",
  "share.challengeFriend": "Desafiar a un amigo",
  "share.sharePick": "Compartir tu elección",
  "share.yourLink": "Tu enlace",
  "share.copy": "Copiar",
  "share.copied": "Copiado",
  "share.shareOn": "Compartir en",
  "share.preview": "Vista previa del mensaje",
  "share.withImage": "Compartir con imagen",
  "share.sharing": "Compartiendo…",
  "share.copyHint":
    "Copia el mensaje completo o toca una plataforma abajo para compartir al instante.",
};

export const messages: Record<Locale, MessageMap> = { en, pt, es };

export function translate(locale: Locale, key: TranslationKey): string {
  return messages[locale][key] ?? messages.en[key] ?? key;
}

export function translateWithParams(
  locale: Locale,
  key: TranslationKey,
  params: Record<string, string | number>,
): string {
  let text = translate(locale, key);
  for (const [param, value] of Object.entries(params)) {
    text = text.replace(`{${param}}`, String(value));
  }
  return text;
}
