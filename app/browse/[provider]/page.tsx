import { notFound } from "next/navigation";
import { ProviderBrowse } from "@/components/browse/ProviderBrowse";
import { enrichStreamingPlatforms } from "@/lib/tmdb-providers";

interface ProviderPageProps {
  params: Promise<{ provider: string }>;
}

export async function generateMetadata({ params }: ProviderPageProps) {
  const { provider: providerId } = await params;
  const platforms = await enrichStreamingPlatforms();
  const platform = platforms.find((p) => p.id === providerId);

  if (!platform) {
    return { title: "Platform Not Found | FlixPick" };
  }

  return {
    title: `${platform.name} | FlixPick`,
    description: `Browse movies and TV shows on ${platform.name}.`,
  };
}

export default async function ProviderBrowsePage({ params }: ProviderPageProps) {
  const { provider: providerId } = await params;
  const platforms = await enrichStreamingPlatforms();
  const platform = platforms.find((p) => p.id === providerId);

  if (!platform) {
    notFound();
  }

  return <ProviderBrowse platform={platform} />;
}
