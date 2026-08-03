import { BrowseGrid } from "@/components/browse/BrowseGrid";

export const metadata = {
  title: "Browse Movies",
  description:
    "Browse thousands of movies by genre and popularity on flixpick.app. Filter, sort, and load more from the TMDB catalog.",
  alternates: {
    canonical: "https://flixpick.app/browse/movies",
  },
};

export default function BrowseMoviesPage() {
  return (
    <BrowseGrid
      mediaType="movie"
      title="Movies"
      apiPath="/api/browse/movies"
    />
  );
}
