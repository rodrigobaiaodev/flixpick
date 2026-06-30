export interface StreamingPlatform {
  id: string;
  name: string;
  shortLabel: string;
  brandColor: string;
  /** Primary TMDB provider ID (logo lookup) */
  tmdbProviderId?: number;
  /** TMDB provider IDs for discover queries; defaults to [tmdbProviderId] */
  tmdbDiscoverProviderIds?: number[];
  logoUrl?: string;
  iconBackground: string;
  /** Fallback when TMDB logo is unavailable */
  useLetterIcon?: boolean;
  /** Custom fallback text rendered on iconBackground when no TMDB logo */
  fallbackLabel?: string;
  fallbackBackground?: string;
}

export function getTmdbDiscoverIds(platform: StreamingPlatform): number[] {
  if (platform.tmdbDiscoverProviderIds?.length) {
    return platform.tmdbDiscoverProviderIds;
  }
  return platform.tmdbProviderId != null ? [platform.tmdbProviderId] : [];
}

export function getAllTmdbDiscoverIds(): number[] {
  return STREAMING_PLATFORMS.flatMap(getTmdbDiscoverIds);
}

export function getTmdbDiscoverIdsBySlug(slug: string): number[] {
  const platform = STREAMING_PLATFORMS.find((p) => p.id === slug);
  return platform ? getTmdbDiscoverIds(platform) : [];
}

export const STREAMING_PLATFORMS: StreamingPlatform[] = [
  {
    id: "netflix",
    name: "Netflix",
    shortLabel: "N",
    brandColor: "#e50914",
    tmdbProviderId: 8,
    iconBackground: "#e50914",
  },
  {
    id: "prime",
    name: "Prime Video",
    shortLabel: "PV",
    brandColor: "#00a8e1",
    tmdbProviderId: 9,
    iconBackground: "#00a8e1",
  },
  {
    id: "max",
    name: "Max",
    shortLabel: "max",
    brandColor: "#002be7",
    tmdbProviderId: 1899,
    iconBackground: "#002be7",
  },
  {
    id: "disney",
    name: "Disney+",
    shortLabel: "D+",
    brandColor: "#113ccf",
    tmdbProviderId: 337,
    iconBackground: "#113ccf",
  },
  {
    id: "apple",
    name: "Apple TV+",
    shortLabel: "ATV",
    brandColor: "#000000",
    tmdbProviderId: 350,
    iconBackground: "#000000",
  },
  {
    id: "hulu",
    name: "Hulu",
    shortLabel: "Hulu",
    brandColor: "#1ce783",
    tmdbProviderId: 15,
    iconBackground: "#1ce783",
  },
  {
    id: "peacock",
    name: "Peacock",
    shortLabel: "P",
    brandColor: "#0056ff",
    tmdbProviderId: 386,
    iconBackground: "#0056ff",
    useLetterIcon: true,
  },
  {
    id: "paramount",
    name: "Paramount+",
    shortLabel: "P+",
    brandColor: "#0064ff",
    tmdbProviderId: 2303,
    tmdbDiscoverProviderIds: [2303, 2616],
    iconBackground: "#0064ff",
  },
];
