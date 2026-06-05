import {
  STREAMING_PLATFORMS,
  type StreamingPlatform,
} from "@/lib/streaming-platforms";

const LANGUAGE = "en-US";
const WATCH_REGION = "US";

interface TmdbProviderCatalogEntry {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

interface TmdbProviderCatalogResponse {
  results: TmdbProviderCatalogEntry[];
}

function getTmdbConfig() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL?.replace(/\/$/, "");

  if (!apiKey || !baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_TMDB_API_KEY or NEXT_PUBLIC_TMDB_BASE_URL",
    );
  }

  return { apiKey, baseUrl };
}

export function buildTmdbLogoUrl(logoPath: string | null): string | null {
  if (!logoPath) return null;
  return `https://image.tmdb.org/t/p/original${logoPath}`;
}

export async function fetchTmdbProviderCatalog(): Promise<
  TmdbProviderCatalogEntry[]
> {
  const { apiKey, baseUrl } = getTmdbConfig();
  const url = new URL(`${baseUrl}/watch/providers/movie`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", LANGUAGE);
  url.searchParams.set("watch_region", WATCH_REGION);

  const response = await fetch(url.toString(), {
    next: { revalidate: 86400 },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`TMDB providers ${response.status}`);
  }

  const data = (await response.json()) as TmdbProviderCatalogResponse;
  return data.results ?? [];
}

export async function enrichStreamingPlatforms(
  platforms: StreamingPlatform[] = STREAMING_PLATFORMS,
): Promise<StreamingPlatform[]> {
  const catalog = await fetchTmdbProviderCatalog();
  const byId = new Map(catalog.map((entry) => [entry.provider_id, entry]));

  return platforms.map((platform) => {
    const tmdb = platform.tmdbProviderId
      ? byId.get(platform.tmdbProviderId)
      : undefined;
    const logoUrl = buildTmdbLogoUrl(tmdb?.logo_path ?? null);

    return {
      ...platform,
      logoUrl: logoUrl ?? platform.logoUrl,
      useLetterIcon: !logoUrl && !platform.logoUrl,
    };
  });
}
