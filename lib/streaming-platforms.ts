export interface StreamingPlatform {
  id: string;
  name: string;
  shortLabel: string;
  brandColor: string;
  /** TMDB provider ID when available */
  tmdbProviderId?: number;
  logoUrl?: string;
  iconBackground: string;
  /** Fallback when TMDB logo is unavailable */
  useLetterIcon?: boolean;
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
    shortLabel: "Max",
    brandColor: "#002be7",
    tmdbProviderId: 384,
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
    tmdbProviderId: 531,
    iconBackground: "#0064ff",
  },
];
