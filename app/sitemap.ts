import type { MetadataRoute } from "next";
import { movieSlug } from "@/lib/genres";
import { MOOD_DEFINITIONS } from "@/lib/moods";
import { STREAMING_PLATFORMS } from "@/lib/streaming-platforms";
import { browseDiscoverMovies, browseDiscoverTV } from "@/lib/tmdb";

const SITE_URL = "https://flixpick.app";
/** Index enough catalog URLs for discovery without oversized build-time crawls. */
const CATALOG_LIMIT = 500;

async function fetchTopByPopularity(
  mediaType: "movie" | "tv",
  count: number,
): Promise<{ id: number; title: string }[]> {
  const pagesNeeded = Math.ceil(count / 20);
  const pageNumbers = Array.from({ length: pagesNeeded }, (_, i) => i + 1);

  const batches = await Promise.all(
    pageNumbers.map((page) =>
      mediaType === "movie"
        ? browseDiscoverMovies({ sort: "popular", page })
        : browseDiscoverTV({ sort: "popular", page }),
    ),
  );

  const results: { id: number; title: string }[] = [];
  const seen = new Set<number>();

  for (const batch of batches) {
    for (const item of batch.results) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      results.push({ id: item.id, title: item.title });
      if (results.length >= count) return results;
    }
  }

  return results;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/browse`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/browse/movies`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/browse/tv`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookie-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const providerBrowsePages: MetadataRoute.Sitemap = STREAMING_PLATFORMS.map(
    (platform) => ({
      url: `${SITE_URL}/browse/${platform.id}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }),
  );

  const whatToWatchPages: MetadataRoute.Sitemap =
    STREAMING_PLATFORMS.flatMap((platform) =>
      MOOD_DEFINITIONS.map((mood) => ({
        url: `${SITE_URL}/what-to-watch/${platform.id}/${mood.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
    );

  let moviePages: MetadataRoute.Sitemap = [];
  let tvPages: MetadataRoute.Sitemap = [];

  try {
    const [movies, shows] = await Promise.all([
      fetchTopByPopularity("movie", CATALOG_LIMIT),
      fetchTopByPopularity("tv", CATALOG_LIMIT),
    ]);

    moviePages = movies.map((movie) => ({
      url: `${SITE_URL}/movie/${movie.id}/${movieSlug(movie.title)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    tvPages = shows.map((show) => ({
      url: `${SITE_URL}/tv/${show.id}/${movieSlug(show.title)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // TMDB may be unavailable at build time; keep static + landing URLs.
  }

  return [
    ...staticPages,
    ...providerBrowsePages,
    ...whatToWatchPages,
    ...moviePages,
    ...tvPages,
  ];
}
