import { Suspense } from "react";
import { SearchClient } from "./SearchClient";

export const metadata = {
  title: "Search",
  description: "Search movies and TV shows on FlixPick.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-slate-400">
          Loading search…
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
