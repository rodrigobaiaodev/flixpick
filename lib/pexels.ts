const PEXELS_API_BASE = "https://api.pexels.com/v1";

export interface PexelsPhotoSrc {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt: string;
  src: PexelsPhotoSrc;
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

function getPexelsApiKey(): string | null {
  return process.env.PEXELS_API_KEY ?? null;
}

async function pexelsFetch<T>(path: string, params?: Record<string, string>) {
  const apiKey = getPexelsApiKey();
  if (!apiKey) return null;

  const url = new URL(`${PEXELS_API_BASE}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url.toString(), {
    headers: { Authorization: apiKey },
    next: { revalidate: 86_400 },
  });

  if (!response.ok) return null;
  return (await response.json()) as T;
}

/** Search stock photos on Pexels (server-side only). */
export async function searchPexelsPhotos(
  query: string,
  perPage = 12,
  page = 1,
): Promise<PexelsPhoto[]> {
  const data = await pexelsFetch<PexelsSearchResponse>("/search", {
    query,
    per_page: String(perPage),
    page: String(page),
    orientation: "landscape",
  });
  return data?.photos ?? [];
}

/** Pick a random landscape photo URL for a query, or null if unavailable. */
export async function getPexelsHeroImage(query: string): Promise<string | null> {
  const photos = await searchPexelsPhotos(query, 8);
  if (photos.length === 0) return null;
  const pick = photos[Math.floor(Math.random() * photos.length)];
  return pick.src.large2x ?? pick.src.large ?? null;
}

/** Best landscape image URL from search results. */
export function pickPexelsLandscapeUrl(photo: PexelsPhoto): string {
  return photo.src.landscape || photo.src.large2x || photo.src.large;
}
