"use client";

import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { GradientShader, type GradientShaderHandle } from "@/components/hero/gradient-shader";
import { DEFAULT_SHADER_SETTINGS } from "@/components/hero/shader-settings";
import { Navbar } from "@/components/navbar";
import { HeroSearch } from "./hero-search";
import { SearchResults } from "./search-results";

export function SearchView() {
  const query = useSearchParams().get("q") ?? "";
  const sectionRef = useRef<HTMLElement>(null);
  const shaderRef = useRef<GradientShaderHandle>(null);

  return (
    <>
      <section ref={sectionRef} className="relative isolate overflow-hidden">
        <GradientShader ref={shaderRef} settings={DEFAULT_SHADER_SETTINGS} className="absolute inset-0 -z-10" />
        <Navbar />
        <div className="flex flex-col items-center gap-6 px-4 py-16 md:px-16 lg:py-20">
          <h1 className="text-center text-[36px] leading-[1.2] font-medium text-g0 sm:text-[48px]">Browse Top Freelancers</h1>
          <div className="w-full max-w-[705px]">
            {/* Remount on a new query so the input mirrors the URL (incl. back/forward). */}
            <HeroSearch key={query} sectionRef={sectionRef} shaderRef={shaderRef} initialQuery={query} />
          </div>
        </div>
      </section>

      <SearchResults query={query} />
    </>
  );
}

/** Static stand-in rendered while search params resolve. */
export function SearchViewFallback() {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#0458be_0%,#3cc2f4_100%)]">
      <Navbar />
      <div className="flex flex-col items-center px-4 py-16 md:px-16 lg:py-20">
        <h1 className="text-center text-[36px] leading-[1.2] font-medium text-g0 sm:text-[48px]">Browse Top Freelancers</h1>
        <div className="h-24" />
      </div>
    </section>
  );
}
