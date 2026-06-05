import { BrowseGrid } from "@/components/browse/BrowseGrid";

export const metadata = {
  title: "TV Shows | FlixPick",
  description: "Browse TV shows by genre and popularity on FlixPick.",
};

export default function BrowseTVPage() {
  return (
    <BrowseGrid mediaType="tv" title="TV Shows" apiPath="/api/browse/tv" />
  );
}
