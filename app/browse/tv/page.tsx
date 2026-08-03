import { BrowseGrid } from "@/components/browse/BrowseGrid";

export const metadata = {
  title: "Browse TV Shows",
  description:
    "Browse thousands of TV shows by genre and popularity on flixpick.app. Filter, sort, and load more from the TMDB catalog.",
  alternates: {
    canonical: "https://flixpick.app/browse/tv",
  },
};

export default function BrowseTVPage() {
  return (
    <BrowseGrid mediaType="tv" title="TV Shows" apiPath="/api/browse/tv" />
  );
}
