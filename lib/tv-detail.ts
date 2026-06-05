import {
  getTVDetails,
  getTVWatchProviders,
  mapTmdbTVToContentItem,
} from "@/lib/tmdb";
import { getGenreDisplayName } from "@/lib/genres";
import type { ContentItem, Genre, Person } from "@/types/movie";

const LANGUAGE = "en-US";

const KEY_CREW_JOBS = [
  "Director",
  "Executive Producer",
  "Producer",
  "Writer",
  "Creator",
  "Series Creator",
] as const;

interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

interface TmdbCreditsResponse {
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

interface TmdbSimilarTVResponse {
  results: {
    id: number;
    name: string;
    original_name: string;
    overview: string;
    first_air_date: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count: number;
    popularity: number;
    genre_ids?: number[];
  }[];
}

interface TmdbVideo {
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

interface TmdbVideosResponse {
  results: TmdbVideo[];
}

export interface ContentVideo {
  key: string;
  name: string;
  type: string;
  site: string;
}

export interface TechnicalDetailRow {
  label: string;
  value: string;
}

async function tmdbFetch<T>(path: string): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL?.replace(/\/$/, "");

  if (!apiKey || !baseUrl) {
    throw new Error("TMDB configuration missing");
  }

  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", LANGUAGE);

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TMDB ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function mapGenresFromIds(genreIds?: number[]): Genre[] {
  if (!genreIds?.length) return [];
  return genreIds.map((id) => ({
    id,
    name: getGenreDisplayName(id),
  }));
}

export async function getTVCast(tvId: number): Promise<Person[]> {
  const data = await tmdbFetch<TmdbCreditsResponse>(`/tv/${tvId}/credits`);

  return data.cast
    .sort((a, b) => a.order - b.order)
    .slice(0, 18)
    .map((member) => ({
      id: member.id,
      name: member.name,
      profilePath: member.profile_path,
      character: member.character,
    }));
}

export async function getTVCrew(tvId: number): Promise<Person[]> {
  const data = await tmdbFetch<TmdbCreditsResponse>(`/tv/${tvId}/credits`);

  const seen = new Set<string>();
  const crew: Person[] = [];

  for (const job of KEY_CREW_JOBS) {
    const member = data.crew.find((c) => c.job === job);
    if (!member || seen.has(`${member.id}-${member.job}`)) continue;
    seen.add(`${member.id}-${member.job}`);
    crew.push({
      id: member.id,
      name: member.name,
      profilePath: member.profile_path,
      job: member.job,
    });
    if (crew.length >= 8) break;
  }

  return crew;
}

export async function getTVTechnicalDetails(
  tvId: number,
  show: ContentItem,
  crew: Person[],
): Promise<TechnicalDetailRow[]> {
  const extended = await tmdbFetch<{
    original_language: string;
    origin_country: string[];
  }>(`/tv/${tvId}`);

  const creator =
    crew.find((p) => p.job === "Creator" || p.job === "Series Creator") ??
    crew.find((p) => p.job === "Director");

  return [
    { label: "Creator", value: creator?.name ?? "—" },
    {
      label: "Seasons",
      value: show.numberOfSeasons ? String(show.numberOfSeasons) : "—",
    },
    {
      label: "Episodes",
      value: show.numberOfEpisodes ? String(show.numberOfEpisodes) : "—",
    },
    {
      label: "Country",
      value: extended.origin_country?.join(", ").toUpperCase() || "—",
    },
    {
      label: "Language",
      value: extended.original_language?.toUpperCase() || "—",
    },
    { label: "Status", value: formatTVStatus(show.status) },
  ];
}

export async function getTVVideos(tvId: number): Promise<ContentVideo[]> {
  const data = await tmdbFetch<TmdbVideosResponse>(`/tv/${tvId}/videos`);

  return data.results
    .filter((v) => v.site === "YouTube")
    .slice(0, 12)
    .map((v) => ({
      key: v.key,
      name: v.name,
      type: v.type,
      site: v.site,
    }));
}

export async function getSimilarTVShows(
  tvId: number,
  limit = 8,
): Promise<ContentItem[]> {
  const data = await tmdbFetch<TmdbSimilarTVResponse>(`/tv/${tvId}/similar`);

  return data.results.slice(0, limit).map((item) => {
    const show = mapTmdbTVToContentItem(item);
    return {
      ...show,
      genres:
        show.genres.length > 0
          ? show.genres.map((g) => ({
              id: g.id,
              name: getGenreDisplayName(g.id, g.name),
            }))
          : mapGenresFromIds(item.genre_ids),
    };
  });
}

export async function getTVTrailerKey(tvId: number): Promise<string | null> {
  const data = await tmdbFetch<TmdbVideosResponse>(`/tv/${tvId}/videos`);

  const trailer =
    data.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
    ) ?? data.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

  return trailer?.key ?? null;
}

export interface TVPageData {
  show: ContentItem;
  cast: Person[];
  crew: Person[];
  similar: ContentItem[];
  trailerKey: string | null;
  technicalDetails: TechnicalDetailRow[];
  videos: ContentVideo[];
}

export async function getTVPageData(tvId: number): Promise<TVPageData> {
  const [details, availability, cast, crew, similar, trailerKey, videos] =
    await Promise.all([
      getTVDetails(tvId),
      getTVWatchProviders(tvId),
      getTVCast(tvId),
      getTVCrew(tvId),
      getSimilarTVShows(tvId, 8),
      getTVTrailerKey(tvId),
      getTVVideos(tvId),
    ]);

  const show: ContentItem = {
    ...details,
    genres: details.genres.map((g) => ({
      id: g.id,
      name: getGenreDisplayName(g.id, g.name),
    })),
    availability,
    credits: { cast, crew },
  };

  const technicalDetails = await getTVTechnicalDetails(tvId, show, crew);

  return { show, cast, crew, similar, trailerKey, technicalDetails, videos };
}

export function formatTVStatus(status: string | null): string {
  if (!status) return "—";
  if (status === "Returning Series") return "Returning";
  if (status === "Ended") return "Ended";
  if (status === "Canceled") return "Canceled";
  if (status === "In Production") return "In Production";
  return status;
}
