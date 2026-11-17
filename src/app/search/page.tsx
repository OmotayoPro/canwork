import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { SearchQuery } from "./search-query";

// Placeholder — the results page will be designed separately.
export default function SearchPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="bg-[linear-gradient(180deg,#0466c6_0%,#0d8fe0_100%)] pb-16">
        <Navbar />
        <div className="px-4 pt-16 md:px-16">
          <Suspense fallback={<h1 className="text-[40px] leading-[1.2] font-medium text-g0">Search results</h1>}>
            <SearchQuery />
          </Suspense>
        </div>
      </div>
      <p className="px-4 py-16 text-[16px] leading-6 text-g500 md:px-16">Results page coming soon.</p>
    </main>
  );
}
