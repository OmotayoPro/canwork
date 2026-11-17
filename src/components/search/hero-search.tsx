"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TagButton } from "@/components/ui/tag";

export const SEARCH_SUGGESTIONS = ["Web design", "UI/UX Design", "Front End", "Copyrighting", "Angular", "Java Script"];

/**
 * Search bar + popular-search tags that sit on the shader. Submitting a query (or clicking a tag)
 * navigates to /search.
 *
 * Remount it (via `key`) when the query in the URL changes so the input resets.
 */
export function HeroSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);

  function search(term: string) {
    const q = term.trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    search(query);
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <form role="search" onSubmit={onSubmit} className="w-full">
        <div className="flex w-full items-center">
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
              onClick={() => {
                setQuery(tag);
                search(tag);
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
