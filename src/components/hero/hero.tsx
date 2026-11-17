"use client";

import { useRef } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSearch } from "@/components/search/hero-search";
import { GradientShader, type GradientShaderHandle } from "./gradient-shader";
import { DEFAULT_SHADER_SETTINGS } from "./shader-settings";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shaderRef = useRef<GradientShaderHandle>(null);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden lg:h-[654px]">
      <GradientShader ref={shaderRef} settings={DEFAULT_SHADER_SETTINGS} className="absolute inset-0 -z-10" />

      <Navbar />

      <div className="flex flex-col items-center px-4 py-20 md:px-16 lg:py-[140px]">
        <div className="flex w-full max-w-[705px] flex-col items-center justify-center gap-10">
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h1 className="text-[36px] leading-[1.2] font-medium text-g0 sm:text-[56px]">
              Hire Top Web3
              <br />
              Freelancers with Crypto
            </h1>
            <p className="text-[18px] leading-7 text-g200 sm:text-[24px] sm:leading-8">
              Discover a new way to hire and pay freelancers
            </p>
          </div>

          <HeroSearch sectionRef={sectionRef} shaderRef={shaderRef} />
        </div>
      </div>
    </section>
  );
}
