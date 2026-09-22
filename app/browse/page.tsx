import type { Metadata } from "next";
import { BrowseHubClient } from "@/components/browse/BrowseHubClient";
import { enrichStreamingPlatforms } from "@/lib/tmdb-providers";
import { getTrendingAll } from "@/lib/tmdb";
import { getRequestTmdbLanguage } from "@/lib/i18n/server";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Browse Movies & TV Shows",
  description:
    "Browse movies and TV shows by streaming platform on flixpick.app. Explore Netflix, Prime Video, Max, Disney+, and more — plus what's trending now.",
  alternates: {
    canonical: "https://flixpick.app/browse",
  },
  openGraph: {
    title: "Browse Movies & TV Shows | flixpick.app",
    description:
      "Explore streaming catalogs and trending titles across major platforms.",
    url: "https://flixpick.app/browse",
  },
};

export default async function BrowsePage() {
  const language = await getRequestTmdbLanguage();
  const [platforms, trending] = await Promise.all([
    enrichStreamingPlatforms(),
    getTrendingAll("day", language),
  ]);

  const trendingItems = trending.results.slice(0, 18);

  return (
    <BrowseHubClient platforms={platforms} trendingItems={trendingItems} />
  );
}
