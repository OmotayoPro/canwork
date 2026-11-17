import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { SearchView, SearchViewFallback } from "@/components/search/search-view";

export const metadata: Metadata = {
  title: "Browse Top Freelancers — CanWork",
};

export default function SearchPage() {
  return (
    <>
      <main className="flex flex-1 flex-col bg-g50">
        <Suspense fallback={<SearchViewFallback />}>
          <SearchView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
