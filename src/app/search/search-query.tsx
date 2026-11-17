"use client";

import { useSearchParams } from "next/navigation";

export function SearchQuery() {
  const q = useSearchParams().get("q") ?? "";
  return (
    <h1 className="text-[40px] leading-[1.2] font-medium text-g0">
      Results for <span className="text-brand-c200">“{q}”</span>
    </h1>
  );
}
