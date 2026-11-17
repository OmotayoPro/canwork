"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import type { GradientShaderHandle } from "@/components/hero/gradient-shader";
import { Button } from "@/components/ui/button";
import { TagButton } from "@/components/ui/tag";

export const SEARCH_SUGGESTIONS = ["Web design", "UI/UX Design", "Front End", "Copyrighting", "Angular", "Java Script"];

/** How long the ripple plays before we move on to the results. */
const NAVIGATE_AFTER_MS = 900;

/**
 * Search bar + popular-search tags that sit on the shader. Submitting a query sends a ripple
 * across the shader from the bar (or the clicked tag), then navigates to /search.
 *
 * Remount it (via `key`) when the query in the URL changes so the input and guard reset.
 */
export function HeroSearch({
  sectionRef,
  shaderRef,
  initialQuery = "",
}: {
  sectionRef: RefObject<HTMLElement | null>;
  shaderRef: RefObject<GradientShaderHandle | null>;
  initialQuery?: string;
}) {
  const router = useRouter();
  const barRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  // A ref, not state: the button must never look disabled, and Next keeps page state
  // alive on back-navigation — so the guard is cleared whenever this is hidden/unmounted.
  const searchingRef = useRef(false);
  const navTimer = useRef<number>(undefined);
  useEffect(
    () => () => {
      searchingRef.current = false;
      window.clearTimeout(navTimer.current);
    },
    [],
  );

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
    navTimer.current = window.setTimeout(() => {
      router.push(url);
      // Same-route searches don't unmount us; let the next search through once we've navigated.
      searchingRef.current = false;
    }, reduceMotion ? 0 : NAVIGATE_AFTER_MS);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    search(query, barRef.current);
  }

  return (
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
        {SEARCH_SUGGESTIONS.map((tag) => (
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
  );
}
