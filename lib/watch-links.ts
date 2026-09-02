import { getTVWatchProviders, getWatchProviders } from "@/lib/tmdb";
import { getTmdbDiscoverIdsBySlug } from "@/lib/streaming-platforms";
import type {
  ContentItem,
  MediaType,
  MovieAvailability,
  WatchOption,
} from "@/types/movie";

/** TMDB provider_id → title search on the correct streaming site. */
const PROVIDER_WATCH_URLS: Record<number, (title: string) => string> = {
  8: (title) =>
    `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
  9: (title) =>
    `https://www.primevideo.com/search/ref=atv_sr_sug?phrase=${encodeURIComponent(title)}`,
  119: (title) =>
    `https://www.primevideo.com/search/ref=atv_sr_sug?phrase=${encodeURIComponent(title)}`,
  1899: (title) =>
    `https://www.max.com/search?q=${encodeURIComponent(title)}`,
  1825: (title) =>
    `https://www.max.com/search?q=${encodeURIComponent(title)}`,
  337: (title) =>
    `https://www.disneyplus.com/search/${encodeURIComponent(title)}`,
  350: (title) =>
    `https://tv.apple.com/search?term=${encodeURIComponent(title)}`,
  15: (title) =>
    `https://www.hulu.com/search?q=${encodeURIComponent(title)}`,
  386: (title) =>
    `https://www.peacocktv.com/search/${encodeURIComponent(title)}`,
  2303: (title) =>
    `https://www.paramountplus.com/search/?q=${encodeURIComponent(title)}`,
  2616: (title) =>
    `https://www.paramountplus.com/search/?q=${encodeURIComponent(title)}`,
};

const WATCH_OPTION_PRIORITY: WatchOption["type"][] = [
  "flatrate",
  "free",
  "ads",
  "rent",
  "buy",
];

function tmdbWatchPageUrl(mediaType: MediaType, id: number): string {
  return `https://www.themoviedb.org/${mediaType}/${id}/watch?locale=US`;
}

function justWatchUrl(title: string): string {
  return `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`;
}

function getUsWatchOptions(
  availability: MovieAvailability[],
): WatchOption[] {
  const us =
    availability.find((region) => region.region === "US") ?? availability[0];
  if (!us?.options.length) return [];

  return [...us.options].sort((a, b) => {
    const typeDiff =
      WATCH_OPTION_PRIORITY.indexOf(a.type) -
      WATCH_OPTION_PRIORITY.indexOf(b.type);
    if (typeDiff !== 0) return typeDiff;
    return a.provider.displayPriority - b.provider.displayPriority;
  });
}

function providerSearchUrl(providerId: number, title: string): string | null {
  const builder = PROVIDER_WATCH_URLS[providerId];
  return builder ? builder(title) : null;
}

function optionWatchUrl(option: WatchOption, title: string): string | null {
  if (option.link) return option.link;
  return providerSearchUrl(option.provider.id, title);
}

function resolvePreferredProviderIds(platformSlugs: string[]): number[] {
  if (!platformSlugs.length) return [];
  return Array.from(
    new Set(platformSlugs.flatMap((slug) => getTmdbDiscoverIdsBySlug(slug))),
  );
}

function urlFromAvailability(
  title: string,
  availability: MovieAvailability[],
  preferredProviderIds: number[] = [],
): string | null {
  const options = getUsWatchOptions(availability);
  if (!options.length) return null;

  if (preferredProviderIds.length > 0) {
    for (const providerId of preferredProviderIds) {
      const match = options.find((option) => option.provider.id === providerId);
      if (match) {
        const url = optionWatchUrl(match, title);
        if (url) return url;
      }
    }
  }

  for (const option of options) {
    const url = optionWatchUrl(option, title);
    if (url) return url;
  }

  return null;
}

export function getWhereToWatchUrl(
  title: string,
  availability: MovieAvailability[],
  options?: {
    mediaType?: MediaType;
    contentId?: number;
    preferredPlatformSlugs?: string[];
  },
): string {
  const preferredIds = resolvePreferredProviderIds(
    options?.preferredPlatformSlugs ?? [],
  );

  const fromProviders = urlFromAvailability(title, availability, preferredIds);
  if (fromProviders) return fromProviders;

  if (options?.mediaType && options?.contentId) {
    return tmdbWatchPageUrl(options.mediaType, options.contentId);
  }

  return justWatchUrl(title);
}

export async function resolveWhereToWatchUrl(
  mediaType: MediaType,
  id: number,
  title: string,
  options?: {
    availability?: MovieAvailability[];
    preferredPlatformSlugs?: string[];
  },
): Promise<string> {
  const common = {
    mediaType,
    contentId: id,
    preferredPlatformSlugs: options?.preferredPlatformSlugs,
  };

  if (options?.availability?.length) {
    const fromData = getWhereToWatchUrl(title, options.availability, common);
    if (!fromData.includes("justwatch.com")) return fromData;
  }

  try {
    const providers =
      mediaType === "tv"
        ? await getTVWatchProviders(id)
        : await getWatchProviders(id);

    const url = getWhereToWatchUrl(title, providers, common);
    if (!url.includes("justwatch.com")) return url;

    return tmdbWatchPageUrl(mediaType, id);
  } catch {
    return tmdbWatchPageUrl(mediaType, id);
  }
}

export function getWhereToWatchUrlForMovie(
  movie: ContentItem,
  preferredPlatformSlugs?: string[],
): string {
  return getWhereToWatchUrl(movie.title, movie.availability, {
    mediaType: movie.mediaType,
    contentId: movie.id,
    preferredPlatformSlugs,
  });
}
