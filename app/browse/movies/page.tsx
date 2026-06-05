import { BrowseGrid } from "@/components/browse/BrowseGrid";

export const metadata = {
  title: "Movies | FlixPick",
  description: "Browse movies by genre and popularity on FlixPick.",
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
