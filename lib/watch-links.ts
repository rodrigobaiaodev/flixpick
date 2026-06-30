import { getTVWatchProviders, getWatchProviders } from "@/lib/tmdb";
import type { ContentItem, MediaType, MovieAvailability } from "@/types/movie";

/** TMDB provider_id → platform search URL builder (priority order). */
const PROVIDER_SEARCH_BUILDERS: {
  id: number;
  build: (title: string) => string;
}[] = [
  {
    id: 8,
    build: (title) =>
      `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
  },
  {
    id: 9,
    build: (title) =>
      `https://www.amazon.com/s?k=${encodeURIComponent(title)}`,
  },
  {
    id: 1899,
    build: (title) =>
      `https://www.max.com/search?q=${encodeURIComponent(title)}`,
  },
  {
    id: 1825,
    build: (title) =>
      `https://www.max.com/search?q=${encodeURIComponent(title)}`,
  },
  {
    id: 337,
    build: (title) =>
      `https://www.disneyplus.com/search/${encodeURIComponent(title)}`,
  },
];

function justWatchUrl(title: string): string {
  return `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`;
}

function urlFromAvailability(
  title: string,
  availability: MovieAvailability[],
): string | null {
  const flatrateIds = new Set(
    availability.flatMap((region) =>
      region.options
        .filter((o) => o.type === "flatrate")
        .map((o) => o.provider.id),
    ),
  );

  for (const { id, build } of PROVIDER_SEARCH_BUILDERS) {
    if (flatrateIds.has(id)) return build(title);
  }

  return null;
}

export function getWhereToWatchUrl(
  title: string,
  availability: MovieAvailability[],
): string {
  return urlFromAvailability(title, availability) ?? justWatchUrl(title);
}

export async function resolveWhereToWatchUrl(
  mediaType: MediaType,
  id: number,
  title: string,
  availability?: MovieAvailability[],
): Promise<string> {
  if (availability?.length) {
    const fromData = urlFromAvailability(title, availability);
    if (fromData) return fromData;
  }

  try {
    const providers =
      mediaType === "tv"
        ? await getTVWatchProviders(id)
        : await getWatchProviders(id);
    return getWhereToWatchUrl(title, providers);
  } catch {
    return justWatchUrl(title);
  }
}

export function getWhereToWatchUrlForMovie(movie: ContentItem): string {
  return getWhereToWatchUrl(movie.title, movie.availability);
}
