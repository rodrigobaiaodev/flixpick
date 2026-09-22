import type { Locale } from "@/lib/i18n/config";

/** Extra UI strings for browse, search, institutional (en/pt/es). */
export type ExtraKey =
  | "browse.title"
  | "browse.subtitle"
  | "browse.allMovies"
  | "browse.allTv"
  | "browse.platforms"
  | "browse.trending"
  | "browse.catalogDesc"
  | "browse.showingOf"
  | "browse.genre"
  | "browse.allGenres"
  | "browse.sort"
  | "browse.popular"
  | "browse.topRated"
  | "browse.new"
  | "browse.loadMore"
  | "browse.loading"
  | "browse.pageOf"
  | "browse.moviesLabel"
  | "browse.tvLabel"
  | "browse.backToBrowse"
  | "browse.providerDesc"
  | "browse.showingTitles"
  | "browse.filterMood"
  | "browse.all"
  | "browse.noTitles"
  | "browse.failedLoad"
  | "browse.failedMore"
  | "search.title"
  | "search.subtitle"
  | "search.placeholder"
  | "search.clear"
  | "search.type"
  | "search.all"
  | "search.platform"
  | "search.anyPlatform"
  | "search.searching"
  | "search.resultsFor"
  | "search.enterTitle"
  | "search.noMatch"
  | "search.open"
  | "search.close"
  | "about.title"
  | "about.subtitle"
  | "about.intro"
  | "about.mission"
  | "about.missionLead"
  | "about.missionBody"
  | "about.offer"
  | "about.offer1"
  | "about.offer2"
  | "about.offer3"
  | "about.offer4"
  | "about.how"
  | "about.howBody"
  | "about.values"
  | "about.value1"
  | "about.value2"
  | "about.contact"
  | "about.contactBody"
  | "contact.title"
  | "contact.subtitle"
  | "contact.name"
  | "contact.email"
  | "contact.subject"
  | "contact.message"
  | "contact.send"
  | "contact.placeholderName"
  | "contact.placeholderEmail"
  | "contact.placeholderMessage"
  | "contact.general"
  | "contact.support"
  | "contact.privacy"
  | "contact.legal"
  | "privacy.title"
  | "privacy.updated"
  | "privacy.intro"
  | "privacy.collectTitle"
  | "privacy.collectBody"
  | "privacy.useTitle"
  | "privacy.useBody"
  | "privacy.shareTitle"
  | "privacy.shareBody"
  | "privacy.rightsTitle"
  | "privacy.rightsBody"
  | "privacy.moreTitle"
  | "privacy.moreBody"
  | "privacy.cookieLink"
  | "privacy.contactLink"
  | "cookies.title"
  | "cookies.updated"
  | "cookies.intro"
  | "cookies.essentialTitle"
  | "cookies.essentialBody"
  | "cookies.prefsTitle"
  | "cookies.prefsBody"
  | "cookies.adsTitle"
  | "cookies.adsBody"
  | "cookies.manageTitle"
  | "cookies.manageBody"
  | "cookies.privacyLink"
  | "terms.title"
  | "terms.updated"
  | "terms.intro"
  | "terms.eligibilityTitle"
  | "terms.eligibilityBody"
  | "terms.accountsTitle"
  | "terms.accountsBody"
  | "terms.useTitle"
  | "terms.useBody"
  | "terms.contentTitle"
  | "terms.contentBody"
  | "terms.disclaimerTitle"
  | "terms.disclaimerBody"
  | "legal.contactUs";

type ExtraMap = Record<ExtraKey, string>;

const en: ExtraMap = {
  "browse.title": "Browse",
  "browse.subtitle":
    "Explore movies and TV shows by streaming platform, or see what's trending right now. Thousands of titles via TMDB — keep loading to dig deeper.",
  "browse.allMovies": "All Movies",
  "browse.allTv": "All TV Shows",
  "browse.platforms": "Streaming Platforms",
  "browse.trending": "Trending Now",
  "browse.catalogDesc":
    "Browse {label} from the TMDB catalog — load more anytime for thousands of titles.",
  "browse.showingOf": "Showing {shown} of {total} {label}",
  "browse.genre": "Genre",
  "browse.allGenres": "All Genres",
  "browse.sort": "Sort",
  "browse.popular": "Popular",
  "browse.topRated": "Top Rated",
  "browse.new": "New",
  "browse.loadMore": "Load More",
  "browse.loading": "Loading…",
  "browse.pageOf": "Page {page} of {total}",
  "browse.moviesLabel": "movies",
  "browse.tvLabel": "TV shows",
  "browse.backToBrowse": "← Back to Browse",
  "browse.providerDesc": "Discover what's available on {name}.",
  "browse.showingTitles": "Showing {shown} of {total} titles",
  "browse.filterMood": "Filter by mood",
  "browse.all": "All",
  "browse.noTitles": "No titles found for this filter.",
  "browse.failedLoad": "Failed to load content",
  "browse.failedMore": "Failed to load more",
  "search.title": "Search",
  "search.subtitle": "Find movies and TV shows across major streaming platforms.",
  "search.placeholder": "Search movies, TV shows…",
  "search.clear": "Clear search",
  "search.type": "Type",
  "search.all": "All",
  "search.platform": "Platform",
  "search.anyPlatform": "Any Platform",
  "search.searching": "Searching…",
  "search.resultsFor": "{count} result(s) for \"{query}\"",
  "search.enterTitle": "Enter a title to start searching.",
  "search.noMatch": "No titles matched your search.",
  "search.open": "Open search",
  "search.close": "Close search",
  "about.title": "About FlixPick",
  "about.subtitle": "We help you stop scrolling and start watching.",
  "about.intro":
    "Every night, millions of people open a streaming app and spend more time browsing than watching. FlixPick was built to end that loop. We combine mood-based discovery, smart filters, and real availability data so you can pick a film in minutes—not hours.",
  "about.mission": "Our Mission",
  "about.missionLead": "We help you stop scrolling and start watching.",
  "about.missionBody":
    "Great entertainment should feel effortless. Whether you want something uplifting after a long day, a tense thriller for date night, or a comfort classic, FlixPick surfaces options that match how you feel—then shows you where to stream them in your region.",
  "about.offer": "What We Offer",
  "about.offer1":
    "Mood-first discovery: Start with how you want to feel, not endless grids of thumbnails.",
  "about.offer2":
    "Personal watchlist: Save titles across services and come back when you are ready to watch.",
  "about.offer3":
    "Where to watch: See streaming, rental, and purchase options so you spend less time searching elsewhere.",
  "about.offer4":
    "Global catalog: Built for viewers in the US and worldwide, with region-aware availability when data is available.",
  "about.how": "How Recommendations Work",
  "about.howBody":
    "FlixPick uses a mix of editorial mood categories, genre signals, ratings, and popularity trends to suggest titles. We continuously refine our algorithms based on aggregate usage patterns while respecting your privacy. Recommendations are guides—not guarantees—and taste is personal.",
  "about.values": "Our Values",
  "about.value1": "Clarity over clutter: A focused interface that respects your time.",
  "about.value2":
    "Transparency: Clear attribution for third-party movie data and streaming information.",
  "about.contact": "Get in Touch",
  "about.contactBody":
    "Questions, feedback, or partnership ideas? Visit our Contact page — we typically respond within 2 business days.",
  "contact.title": "Contact Us",
  "contact.subtitle": "We typically respond within 2 business days.",
  "contact.name": "Name",
  "contact.email": "Email",
  "contact.subject": "Subject",
  "contact.message": "Message",
  "contact.send": "Send message",
  "contact.placeholderName": "Your name",
  "contact.placeholderEmail": "you@example.com",
  "contact.placeholderMessage": "How can we help?",
  "contact.general": "General inquiries",
  "contact.support": "Customer support",
  "contact.privacy": "Privacy requests",
  "contact.legal": "Legal",
  "privacy.title": "Privacy Policy",
  "privacy.updated": "Last updated: May 23, 2026",
  "privacy.intro":
    "This Privacy Policy explains how flixpick.app collects, uses, and protects your information when you use our service. By using FlixPick, you agree to the practices described here.",
  "privacy.collectTitle": "Information We Collect",
  "privacy.collectBody":
    "We may collect account information, usage data, device/technical data, and cookies.",
  "privacy.useTitle": "How We Use Your Information",
  "privacy.useBody":
    "To provide recommendations, maintain your watchlist, improve the product, show ads when consented, and comply with the law.",
  "privacy.shareTitle": "Sharing",
  "privacy.shareBody":
    "We do not sell personal information. We may share data with service providers, content partners (e.g. TMDB), ads partners (with consent), and authorities when required.",
  "privacy.rightsTitle": "Your Rights",
  "privacy.rightsBody":
    "Depending on your location, you may request access, correction, deletion, or restriction of your data at privacy@flixpick.app.",
  "privacy.moreTitle": "More",
  "privacy.moreBody": "See also our {cookieLink} and {contactLink} page.",
  "privacy.cookieLink": "Cookie Policy",
  "privacy.contactLink": "Contact",
  "cookies.title": "Cookie Policy",
  "cookies.updated": "Last updated: August 3, 2026",
  "cookies.intro":
    "We use cookies and similar technologies to keep FlixPick working, remember your preferences (including language), and — with your consent — support analytics and advertising.",
  "cookies.essentialTitle": "Essential",
  "cookies.essentialBody":
    "Required for authentication, security, and core features (including language preference).",
  "cookies.prefsTitle": "Preferences",
  "cookies.prefsBody":
    "Remember choices such as mood, platforms, and locale on your device.",
  "cookies.adsTitle": "Analytics & advertising",
  "cookies.adsBody":
    "Used only after you accept cookies in our banner (e.g. Google AdSense).",
  "cookies.manageTitle": "Managing cookies",
  "cookies.manageBody":
    "You can change your browser settings or revisit our cookie banner preferences. See also our {privacyLink}.",
  "cookies.privacyLink": "Privacy Policy",
  "terms.title": "Terms of Service",
  "terms.updated": "Last updated: May 23, 2026",
  "terms.intro":
    "These Terms govern your use of flixpick.app. By accessing or using FlixPick, you agree to these Terms. If you do not agree, please do not use the service.",
  "terms.eligibilityTitle": "Eligibility",
  "terms.eligibilityBody":
    "You must be at least 13 years old (or the minimum age in your jurisdiction) to use FlixPick.",
  "terms.accountsTitle": "Accounts",
  "terms.accountsBody":
    "You are responsible for your credentials and activity under your account. Contact support@flixpick.app if you suspect unauthorized use.",
  "terms.useTitle": "Acceptable use",
  "terms.useBody":
    "Do not misuse the Service, scrape at abusive rates, or attempt to disrupt FlixPick or its partners.",
  "terms.contentTitle": "Content & recommendations",
  "terms.contentBody":
    "Movie and TV data come from third parties (e.g. TMDB). Recommendations are guides, not guarantees.",
  "terms.disclaimerTitle": "Disclaimer",
  "terms.disclaimerBody":
    "The Service is provided \"as is\" without warranties. Liability is limited to the maximum extent permitted by law.",
  "legal.contactUs": "Contact Us",
};

const pt: ExtraMap = {
  "browse.title": "Explorar",
  "browse.subtitle":
    "Explore filmes e séries por plataforma de streaming, ou veja o que está em alta agora. Milhares de títulos via TMDB — continue carregando para ir mais fundo.",
  "browse.allMovies": "Todos os filmes",
  "browse.allTv": "Todas as séries",
  "browse.platforms": "Plataformas de streaming",
  "browse.trending": "Em alta agora",
  "browse.catalogDesc":
    "Explore {label} do catálogo TMDB — carregue mais a qualquer momento para milhares de títulos.",
  "browse.showingOf": "Mostrando {shown} de {total} {label}",
  "browse.genre": "Gênero",
  "browse.allGenres": "Todos os gêneros",
  "browse.sort": "Ordenar",
  "browse.popular": "Popular",
  "browse.topRated": "Mais bem avaliados",
  "browse.new": "Novos",
  "browse.loadMore": "Carregar mais",
  "browse.loading": "Carregando…",
  "browse.pageOf": "Página {page} de {total}",
  "browse.moviesLabel": "filmes",
  "browse.tvLabel": "séries",
  "browse.backToBrowse": "← Voltar para Explorar",
  "browse.providerDesc": "Descubra o que está disponível no {name}.",
  "browse.showingTitles": "Mostrando {shown} de {total} títulos",
  "browse.filterMood": "Filtrar por humor",
  "browse.all": "Todos",
  "browse.noTitles": "Nenhum título encontrado para este filtro.",
  "browse.failedLoad": "Falha ao carregar conteúdo",
  "browse.failedMore": "Falha ao carregar mais",
  "search.title": "Buscar",
  "search.subtitle":
    "Encontre filmes e séries nas principais plataformas de streaming.",
  "search.placeholder": "Buscar filmes, séries…",
  "search.clear": "Limpar busca",
  "search.type": "Tipo",
  "search.all": "Todos",
  "search.platform": "Plataforma",
  "search.anyPlatform": "Qualquer plataforma",
  "search.searching": "Buscando…",
  "search.resultsFor": "{count} resultado(s) para \"{query}\"",
  "search.enterTitle": "Digite um título para começar a buscar.",
  "search.noMatch": "Nenhum título corresponde à sua busca.",
  "search.open": "Abrir busca",
  "search.close": "Fechar busca",
  "about.title": "Sobre o FlixPick",
  "about.subtitle": "Ajudamos você a parar de rolar e começar a assistir.",
  "about.intro":
    "Toda noite, milhões de pessoas abrem um app de streaming e passam mais tempo navegando do que assistindo. O FlixPick foi feito para acabar com esse ciclo. Combinamos descoberta por humor, filtros inteligentes e dados reais de disponibilidade para você escolher um filme em minutos — não em horas.",
  "about.mission": "Nossa missão",
  "about.missionLead": "Ajudamos você a parar de rolar e começar a assistir.",
  "about.missionBody":
    "Um bom entretenimento deve parecer fácil. Seja algo leve depois de um dia longo, um thriller tenso para o encontro ou um clássico aconchegante, o FlixPick mostra opções que combinam com o seu humor — e onde assistir na sua região.",
  "about.offer": "O que oferecemos",
  "about.offer1":
    "Descoberta por humor: comece por como você quer se sentir, não por grades infinitas de capas.",
  "about.offer2":
    "Lista pessoal: salve títulos entre serviços e volte quando estiver pronto para assistir.",
  "about.offer3":
    "Onde assistir: veja opções de streaming, aluguel e compra e perca menos tempo procurando.",
  "about.offer4":
    "Catálogo global: feito para espectadores nos EUA e no mundo, com disponibilidade regional quando os dados existem.",
  "about.how": "Como funcionam as recomendações",
  "about.howBody":
    "O FlixPick usa categorias de humor, sinais de gênero, notas e tendências de popularidade para sugerir títulos. Refinamos os algoritmos com base em uso agregado, respeitando sua privacidade. Recomendações são guias — não garantias — e o gosto é pessoal.",
  "about.values": "Nossos valores",
  "about.value1": "Clareza acima de bagunça: uma interface focada que respeita seu tempo.",
  "about.value2":
    "Transparência: atribuição clara de dados de filmes e informações de streaming de terceiros.",
  "about.contact": "Fale conosco",
  "about.contactBody":
    "Dúvidas, feedback ou parcerias? Visite a página de Contato — respondemos em até 2 dias úteis.",
  "contact.title": "Contato",
  "contact.subtitle": "Normalmente respondemos em até 2 dias úteis.",
  "contact.name": "Nome",
  "contact.email": "E-mail",
  "contact.subject": "Assunto",
  "contact.message": "Mensagem",
  "contact.send": "Enviar mensagem",
  "contact.placeholderName": "Seu nome",
  "contact.placeholderEmail": "voce@email.com",
  "contact.placeholderMessage": "Como podemos ajudar?",
  "contact.general": "Assuntos gerais",
  "contact.support": "Suporte",
  "contact.privacy": "Privacidade",
  "contact.legal": "Jurídico",
  "privacy.title": "Política de Privacidade",
  "privacy.updated": "Atualizado em: 23 de maio de 2026",
  "privacy.intro":
    "Esta Política de Privacidade explica como o flixpick.app coleta, usa e protege suas informações ao usar nosso serviço. Ao usar o FlixPick, você concorda com as práticas descritas aqui.",
  "privacy.collectTitle": "Informações que coletamos",
  "privacy.collectBody":
    "Podemos coletar dados de conta, uso, dispositivo/técnicos e cookies.",
  "privacy.useTitle": "Como usamos suas informações",
  "privacy.useBody":
    "Para recomendar títulos, manter sua watchlist, melhorar o produto, exibir anúncios com consentimento e cumprir a lei.",
  "privacy.shareTitle": "Compartilhamento",
  "privacy.shareBody":
    "Não vendemos informações pessoais. Podemos compartilhar dados com provedores de serviço, parceiros de conteúdo (ex.: TMDB), parceiros de anúncios (com consentimento) e autoridades quando exigido.",
  "privacy.rightsTitle": "Seus direitos",
  "privacy.rightsBody":
    "Conforme sua localização, você pode pedir acesso, correção, exclusão ou restrição dos seus dados em privacy@flixpick.app.",
  "privacy.moreTitle": "Mais",
  "privacy.moreBody": "Veja também nossa {cookieLink} e a página de {contactLink}.",
  "privacy.cookieLink": "Política de Cookies",
  "privacy.contactLink": "Contato",
  "cookies.title": "Política de Cookies",
  "cookies.updated": "Atualizado em: 3 de agosto de 2026",
  "cookies.intro":
    "Usamos cookies e tecnologias semelhantes para manter o FlixPick funcionando, lembrar suas preferências (incluindo idioma) e — com seu consentimento — apoiar análises e publicidade.",
  "cookies.essentialTitle": "Essenciais",
  "cookies.essentialBody":
    "Necessários para autenticação, segurança e recursos principais (incluindo preferência de idioma).",
  "cookies.prefsTitle": "Preferências",
  "cookies.prefsBody":
    "Lembram escolhas como humor, plataformas e idioma no seu dispositivo.",
  "cookies.adsTitle": "Análises e publicidade",
  "cookies.adsBody":
    "Usados apenas depois que você aceita cookies no banner (ex.: Google AdSense).",
  "cookies.manageTitle": "Gerenciar cookies",
  "cookies.manageBody":
    "Você pode alterar as configurações do navegador ou revisitar as preferências do banner. Veja também nossa {privacyLink}.",
  "cookies.privacyLink": "Política de Privacidade",
  "terms.title": "Termos de Uso",
  "terms.updated": "Atualizado em: 23 de maio de 2026",
  "terms.intro":
    "Estes Termos regem o uso do flixpick.app. Ao acessar ou usar o FlixPick, você concorda com estes Termos. Se não concordar, não use o serviço.",
  "terms.eligibilityTitle": "Elegibilidade",
  "terms.eligibilityBody":
    "Você deve ter pelo menos 13 anos (ou a idade mínima da sua jurisdição) para usar o FlixPick.",
  "terms.accountsTitle": "Contas",
  "terms.accountsBody":
    "Você é responsável pelas credenciais e pela atividade na sua conta. Contate support@flixpick.app se suspeitar de uso não autorizado.",
  "terms.useTitle": "Uso aceitável",
  "terms.useBody":
    "Não misuse o Serviço, não faça scraping abusivo nem tente atrapalhar o FlixPick ou seus parceiros.",
  "terms.contentTitle": "Conteúdo e recomendações",
  "terms.contentBody":
    "Dados de filmes e séries vêm de terceiros (ex.: TMDB). Recomendações são guias, não garantias.",
  "terms.disclaimerTitle": "Isenção de responsabilidade",
  "terms.disclaimerBody":
    "O Serviço é oferecido \"como está\", sem garantias. A responsabilidade é limitada na máxima extensão permitida por lei.",
  "legal.contactUs": "Fale conosco",
};

const es: ExtraMap = {
  "browse.title": "Explorar",
  "browse.subtitle":
    "Explora películas y series por plataforma de streaming, o mira qué está en tendencia ahora. Miles de títulos vía TMDB — sigue cargando para profundizar.",
  "browse.allMovies": "Todas las películas",
  "browse.allTv": "Todas las series",
  "browse.platforms": "Plataformas de streaming",
  "browse.trending": "Tendencias ahora",
  "browse.catalogDesc":
    "Explora {label} del catálogo TMDB — carga más en cualquier momento para miles de títulos.",
  "browse.showingOf": "Mostrando {shown} de {total} {label}",
  "browse.genre": "Género",
  "browse.allGenres": "Todos los géneros",
  "browse.sort": "Ordenar",
  "browse.popular": "Popular",
  "browse.topRated": "Mejor valorados",
  "browse.new": "Nuevos",
  "browse.loadMore": "Cargar más",
  "browse.loading": "Cargando…",
  "browse.pageOf": "Página {page} de {total}",
  "browse.moviesLabel": "películas",
  "browse.tvLabel": "series",
  "browse.backToBrowse": "← Volver a Explorar",
  "browse.providerDesc": "Descubre qué hay disponible en {name}.",
  "browse.showingTitles": "Mostrando {shown} de {total} títulos",
  "browse.filterMood": "Filtrar por mood",
  "browse.all": "Todos",
  "browse.noTitles": "No se encontraron títulos para este filtro.",
  "browse.failedLoad": "Error al cargar el contenido",
  "browse.failedMore": "Error al cargar más",
  "search.title": "Buscar",
  "search.subtitle":
    "Encuentra películas y series en las principales plataformas de streaming.",
  "search.placeholder": "Buscar películas, series…",
  "search.clear": "Limpiar búsqueda",
  "search.type": "Tipo",
  "search.all": "Todos",
  "search.platform": "Plataforma",
  "search.anyPlatform": "Cualquier plataforma",
  "search.searching": "Buscando…",
  "search.resultsFor": "{count} resultado(s) para \"{query}\"",
  "search.enterTitle": "Escribe un título para empezar a buscar.",
  "search.noMatch": "Ningún título coincide con tu búsqueda.",
  "search.open": "Abrir búsqueda",
  "search.close": "Cerrar búsqueda",
  "about.title": "Acerca de FlixPick",
  "about.subtitle": "Te ayudamos a dejar de scrollear y empezar a ver.",
  "about.intro":
    "Cada noche, millones de personas abren una app de streaming y pasan más tiempo navegando que viendo. FlixPick nació para terminar ese ciclo. Combinamos descubrimiento por mood, filtros inteligentes y datos reales de disponibilidad para que elijas una película en minutos — no en horas.",
  "about.mission": "Nuestra misión",
  "about.missionLead": "Te ayudamos a dejar de scrollear y empezar a ver.",
  "about.missionBody":
    "El buen entretenimiento debería sentirse fácil. Ya sea algo ligero tras un día largo, un thriller tenso para una cita o un clásico reconfortante, FlixPick muestra opciones que coinciden con cómo te sientes — y dónde verlas en tu región.",
  "about.offer": "Qué ofrecemos",
  "about.offer1":
    "Descubrimiento por mood: empieza por cómo quieres sentirte, no por rejillas infinitas de portadas.",
  "about.offer2":
    "Lista personal: guarda títulos entre servicios y vuelve cuando estés listo para ver.",
  "about.offer3":
    "Dónde ver: opciones de streaming, alquiler y compra para perder menos tiempo buscando.",
  "about.offer4":
    "Catálogo global: pensado para espectadores en EE. UU. y en todo el mundo, con disponibilidad regional cuando hay datos.",
  "about.how": "Cómo funcionan las recomendaciones",
  "about.howBody":
    "FlixPick usa categorías de mood, señales de género, valoraciones y tendencias de popularidad para sugerir títulos. Refinamos los algoritmos con uso agregado, respetando tu privacidad. Las recomendaciones son guías — no garantías — y el gusto es personal.",
  "about.values": "Nuestros valores",
  "about.value1": "Claridad sobre el ruido: una interfaz enfocada que respeta tu tiempo.",
  "about.value2":
    "Transparencia: atribución clara de datos de películas e información de streaming de terceros.",
  "about.contact": "Contacto",
  "about.contactBody":
    "¿Preguntas, feedback o alianzas? Visita la página de Contacto — solemos responder en 2 días hábiles.",
  "contact.title": "Contáctanos",
  "contact.subtitle": "Solemos responder en 2 días hábiles.",
  "contact.name": "Nombre",
  "contact.email": "Correo",
  "contact.subject": "Asunto",
  "contact.message": "Mensaje",
  "contact.send": "Enviar mensaje",
  "contact.placeholderName": "Tu nombre",
  "contact.placeholderEmail": "tu@email.com",
  "contact.placeholderMessage": "¿Cómo podemos ayudarte?",
  "contact.general": "Consultas generales",
  "contact.support": "Soporte",
  "contact.privacy": "Privacidad",
  "contact.legal": "Legal",
  "privacy.title": "Política de Privacidad",
  "privacy.updated": "Última actualización: 23 de mayo de 2026",
  "privacy.intro":
    "Esta Política de Privacidad explica cómo flixpick.app recopila, usa y protege tu información al usar nuestro servicio. Al usar FlixPick, aceptas las prácticas descritas aquí.",
  "privacy.collectTitle": "Información que recopilamos",
  "privacy.collectBody":
    "Podemos recopilar datos de cuenta, uso, dispositivo/técnicos y cookies.",
  "privacy.useTitle": "Cómo usamos tu información",
  "privacy.useBody":
    "Para ofrecer recomendaciones, mantener tu lista, mejorar el producto, mostrar anuncios con consentimiento y cumplir la ley.",
  "privacy.shareTitle": "Compartir",
  "privacy.shareBody":
    "No vendemos información personal. Podemos compartir datos con proveedores de servicio, socios de contenido (p. ej. TMDB), socios de anuncios (con consentimiento) y autoridades cuando sea necesario.",
  "privacy.rightsTitle": "Tus derechos",
  "privacy.rightsBody":
    "Según tu ubicación, puedes solicitar acceso, corrección, eliminación o restricción de tus datos en privacy@flixpick.app.",
  "privacy.moreTitle": "Más",
  "privacy.moreBody": "Consulta también nuestra {cookieLink} y la página de {contactLink}.",
  "privacy.cookieLink": "Política de Cookies",
  "privacy.contactLink": "Contacto",
  "cookies.title": "Política de Cookies",
  "cookies.updated": "Última actualización: 3 de agosto de 2026",
  "cookies.intro":
    "Usamos cookies y tecnologías similares para que FlixPick funcione, recordar tus preferencias (incluido el idioma) y — con tu consentimiento — apoyar analítica y publicidad.",
  "cookies.essentialTitle": "Esenciales",
  "cookies.essentialBody":
    "Necesarias para autenticación, seguridad y funciones principales (incluida la preferencia de idioma).",
  "cookies.prefsTitle": "Preferencias",
  "cookies.prefsBody":
    "Recuerdan opciones como mood, plataformas e idioma en tu dispositivo.",
  "cookies.adsTitle": "Analítica y publicidad",
  "cookies.adsBody":
    "Se usan solo después de aceptar cookies en nuestro banner (p. ej. Google AdSense).",
  "cookies.manageTitle": "Gestionar cookies",
  "cookies.manageBody":
    "Puedes cambiar la configuración del navegador o revisar las preferencias del banner. Consulta también nuestra {privacyLink}.",
  "cookies.privacyLink": "Política de Privacidad",
  "terms.title": "Términos de Servicio",
  "terms.updated": "Última actualización: 23 de mayo de 2026",
  "terms.intro":
    "Estos Términos rigen el uso de flixpick.app. Al acceder o usar FlixPick, aceptas estos Términos. Si no estás de acuerdo, no uses el servicio.",
  "terms.eligibilityTitle": "Elegibilidad",
  "terms.eligibilityBody":
    "Debes tener al menos 13 años (o la edad mínima de tu jurisdicción) para usar FlixPick.",
  "terms.accountsTitle": "Cuentas",
  "terms.accountsBody":
    "Eres responsable de tus credenciales y de la actividad en tu cuenta. Contacta support@flixpick.app si sospechas uso no autorizado.",
  "terms.useTitle": "Uso aceptable",
  "terms.useBody":
    "No abuses del Servicio, no hagas scraping abusivo ni intentes interrumpir FlixPick o sus socios.",
  "terms.contentTitle": "Contenido y recomendaciones",
  "terms.contentBody":
    "Los datos de películas y series provienen de terceros (p. ej. TMDB). Las recomendaciones son guías, no garantías.",
  "terms.disclaimerTitle": "Descargo",
  "terms.disclaimerBody":
    "El Servicio se ofrece \"tal cual\", sin garantías. La responsabilidad se limita en la máxima medida permitida por la ley.",
  "legal.contactUs": "Contáctanos",
};

export const extraMessages: Record<Locale, ExtraMap> = { en, pt, es };

export function translateExtra(
  locale: Locale,
  key: ExtraKey,
  params?: Record<string, string | number>,
): string {
  let text = extraMessages[locale][key] ?? extraMessages.en[key] ?? key;
  if (params) {
    for (const [param, value] of Object.entries(params)) {
      text = text.replace(`{${param}}`, String(value));
    }
  }
  return text;
}
