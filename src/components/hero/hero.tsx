"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { TagButton } from "@/components/ui/tag";
import { GradientShader, type GradientShaderHandle } from "./gradient-shader";
import { ShaderControls } from "./shader-controls";
import { DEFAULT_SHADER_SETTINGS, type ShaderSettings } from "./shader-settings";

const suggestions = ["Web design", "UI/UX Design", "Front End", "Copyrighting", "Angular", "Java Script"];

/** How long the ripple plays before we move on to the results page. */
const NAVIGATE_AFTER_MS = 900;
const SETTINGS_KEY = "canwork:hero-shader";

/** Shader settings, tweakable via the controls panel (shown in dev, or with ?shader in the URL). */
function useShaderSettings() {
  const [settings, setSettings] = useState<ShaderSettings>(DEFAULT_SHADER_SETTINGS);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const enabled =
      process.env.NODE_ENV === "development" || new URLSearchParams(window.location.search).has("shader");
    if (!enabled) return;
    let saved: ShaderSettings | null = null;
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) saved = { ...DEFAULT_SHADER_SETTINGS, ...JSON.parse(raw) };
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only state after mount
    setShowControls(true);
    if (saved) setSettings(saved);
  }, []);

  const update = (next: ShaderSettings) => {
    setSettings(next);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  return { settings, update, showControls };
}

export function Hero() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shaderRef = useRef<GradientShaderHandle>(null);
  const [query, setQuery] = useState("");
  // A ref, not state: the button must never look disabled, and Next keeps this page's state
  // alive on back-navigation — so the guard is cleared whenever the hero is hidden/unmounted.
  const searchingRef = useRef(false);
  const navTimer = useRef<number>(undefined);
  useEffect(
    () => () => {
      searchingRef.current = false;
      window.clearTimeout(navTimer.current);
    },
    [],
  );
  const shader = useShaderSettings();

  function search(term: string, origin: Element | null) {
    const q = term.trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }
    if (searchingRef.current) return;

    const url = `/search?q=${encodeURIComponent(q)}`;
    router.prefetch(url);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    if (!reduceMotion && section && origin) {
      const s = section.getBoundingClientRect();
      const o = origin.getBoundingClientRect();
      shaderRef.current?.ripple(o.left + o.width / 2 - s.left, o.top + o.height / 2 - s.top);
    }

    searchingRef.current = true;
    navTimer.current = window.setTimeout(() => router.push(url), reduceMotion ? 0 : NAVIGATE_AFTER_MS);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    search(query, barRef.current);
  }

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden lg:h-[654px]">
      <GradientShader ref={shaderRef} settings={shader.settings} className="absolute inset-0 -z-10" />
      {shader.showControls && <ShaderControls settings={shader.settings} onChange={shader.update} />}

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

          <div className="flex w-full flex-col items-center gap-6">
            <form role="search" onSubmit={onSubmit} className="w-full">
              <div ref={barRef} className="flex w-full items-center">
                <label className="-mr-4 flex min-w-0 flex-1 items-center rounded-[10px] bg-g0 py-2.5 pr-8 pl-4 sm:pr-20 sm:pl-10">
                  <span className="sr-only">Search for freelancers</span>
                  <input
                    ref={inputRef}
                    type="search"
                    name="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for freelancers, skills or categories e.g software developer"
                    autoComplete="off"
                    enterKeyHint="search"
                    className="w-full min-w-0 bg-transparent text-[16px] leading-6 text-g900 outline-none placeholder:text-g500 [&::-webkit-search-cancel-button]:hidden"
                  />
                </label>
                <Button type="submit" size="md" className="relative px-6 sm:px-10">
                  Search
                </Button>
              </div>
            </form>

            <ul className="flex flex-wrap items-start justify-center gap-2" aria-label="Popular searches">
              {suggestions.map((tag) => (
                <li key={tag}>
                  <TagButton
                    onClick={(e) => {
                      setQuery(tag);
                      search(tag, e.currentTarget);
                    }}
                  >
                    {tag}
                  </TagButton>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
