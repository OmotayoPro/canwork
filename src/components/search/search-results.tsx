"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProfileCard } from "@/components/featured-freelancers/profile-card";
import { Tag } from "@/components/ui/tag";
import { EMPTY_FILTERS, filterResults, RATE_RANGES, searchResults, type SearchFilters, type SearchResult } from "@/data/search";
import { profileHref } from "@/data/profile";
import { cn } from "@/lib/cn";
import { FilterChip } from "./filter-chip";
import { Pagination } from "./pagination";
import { ResultCardSkeleton, ResultRowSkeleton } from "./result-skeleton";
import { SearchEmptyState } from "./search-empty-state";
import { SearchFiltersPanel } from "./search-filters";

const PAGE_SIZE = 12;
/** Placeholder latency so the loading state is visible until results come from the API. */
const FAKE_LATENCY_MS = 700;
type View = "grid" | "list";

/** One removable chip per active filter value, in sidebar order. */
function activeChips(f: SearchFilters, set: (next: SearchFilters) => void) {
  const without = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K][number]) => () =>
    set({ ...f, [key]: (f[key] as unknown[]).filter((v) => v !== value) });
  return [
    ...f.verifications.map((v) => ({ key: `v-${v}`, label: v, remove: without("verifications", v) })),
    ...f.locations.map((l) => ({ key: `l-${l}`, label: l, remove: without("locations", l) })),
    ...f.rates.map((r) => ({ key: `r-${r}`, label: RATE_RANGES.find((x) => x.id === r)?.label ?? r, remove: without("rates", r) })),
    ...f.skills.map((s) => ({ key: `s-${s}`, label: s, remove: without("skills", s) })),
    ...f.ratings.map((n) => ({ key: `st-${n}`, label: `${n} Star Rating`, remove: without("ratings", n) })),
  ];
}

export function SearchResults({ query }: { query: string }) {
  const [filters, setFiltersState] = useState<SearchFilters>(EMPTY_FILTERS);
  const [view, setView] = useState<View>("grid");
  // Page resets to 1 whenever the query or filters change.
  const [paging, setPaging] = useState({ query, filters, page: 1 });
  const page = paging.query === query && paging.filters === filters ? paging.page : 1;
  const topRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Every new query / filter combination "fetches" — show skeletons until it lands.
  const requestKey = `${query}\u0000${JSON.stringify(filters)}`;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loading = loadedKey !== requestKey;
  useEffect(() => {
    const t = window.setTimeout(() => setLoadedKey(requestKey), FAKE_LATENCY_MS);
    return () => window.clearTimeout(t);
  }, [requestKey]);

  const results = useMemo(() => filterResults(searchResults, query, filters), [query, filters]);
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const chips = activeChips(filters, setFiltersState);

  function goTo(next: number) {
    setPaging({ query, filters, page: next });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = topRef.current;
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function seeTopFreelancers() {
    setFiltersState(EMPTY_FILTERS);
    if (query) router.push("/search");
  }

  const heading = loading
    ? "Loading..."
    : query.trim()
    ? `${results.length} Result${results.length === 1 ? "" : "s"} for ${query.trim()}`
    : `${results.length} Freelancer${results.length === 1 ? "" : "s"}`;

  return (
    <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-4 py-10 md:px-16 lg:grid-cols-[328px_minmax(0,1fr)]">
      <SearchFiltersPanel filters={filters} onChange={setFiltersState} />

      <div ref={topRef} className="flex min-w-0 scroll-mt-6 flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[20px] leading-7 font-medium text-g700" aria-live="polite">
              {heading}
            </h2>
            <div className="flex shrink-0 gap-4" role="group" aria-label="Layout">
              <ViewButton icon="/icons/view-grid.svg" label="Grid view" active={view === "grid"} onClick={() => setView("grid")} />
              <ViewButton icon="/icons/view-list.svg" label="List view" active={view === "list"} onClick={() => setView("list")} />
            </div>
          </div>
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <FilterChip key={c.key} label={c.label} onRemove={c.remove} />
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <ul
            aria-busy
            aria-label="Loading results"
            className={cn(
              "grid gap-6",
              view === "grid" ? "grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))]" : "grid-cols-1 gap-4",
            )}
          >
            {Array.from({ length: PAGE_SIZE }, (_, i) => (
              <li key={i} className="flex">
                {view === "grid" ? <ResultCardSkeleton /> : <ResultRowSkeleton />}
              </li>
            ))}
          </ul>
        ) : visible.length ? (
          <ul
            className={cn(
              "grid gap-6",
              view === "grid" ? "grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))]" : "grid-cols-1 gap-4",
            )}
          >
            {visible.map((f) => (
              <li key={f.id} className="flex">
                {view === "grid" ? <ProfileCard freelancer={f} variant="result" /> : <ResultRow freelancer={f} />}
              </li>
            ))}
          </ul>
        ) : (
          <SearchEmptyState onSeeTop={seeTopFreelancers} />
        )}

        {(loading || visible.length > 0) && (
          <div className="pt-6">
            <Pagination page={current} total={pages} onChange={goTo} />
          </div>
        )}
      </div>
    </div>
  );
}

function ViewButton({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex size-8 cursor-pointer items-center justify-center rounded-[4px] transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.94]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-c500",
        active ? "bg-brand-c500 text-brand-c100" : "border border-g300 bg-g0 text-g300 hover:text-g500",
      )}
    >
      {/* Icon artwork is used as a mask so its colour follows the active state. */}
      <span aria-hidden className="size-6 bg-current" style={{ mask: `url(${icon}) center / contain no-repeat` }} />
    </button>
  );
}

/** Compact horizontal layout for the list view (not in the Figma file — derived from the card). */
function ResultRow({ freelancer }: { freelancer: SearchResult }) {
  const { id, name, title, avatar, rating, jobs, topSkill, otherSkills, location, rate } = freelancer;
  return (
    <article className="relative flex w-full transition-shadow duration-200 ease-out has-[a:hover]:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.18)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand-c500 flex-col gap-4 rounded-xl border border-g200 bg-g0 p-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="relative size-16 shrink-0">
          <Image src={avatar} alt="" width={69} height={69} className="absolute inset-[-3.68%] size-[68.7px] max-w-none" />
          <Image src="/icons/verified-tick-white.svg" alt="Verified" width={19} height={19} className="absolute right-0 bottom-0 size-[18.8px]" />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="truncate text-[18px] leading-6 font-medium text-g800">
            <Link href={profileHref(id)} className="outline-none after:absolute after:inset-0 after:content-['']">
              {name}
            </Link>
          </h3>
          <p className="truncate text-[14px] leading-4 font-medium text-g600">{title}</p>
          <div className="flex items-center gap-2">
            <Image
              src={rating === 5 ? "/icons/stars-5.svg" : "/icons/stars-4.svg"}
              alt={`Rated ${rating} out of 5`}
              width={127}
              height={20}
              className="h-4 w-[101.33px]"
            />
            <span className="text-[14px] leading-[1.5] font-medium whitespace-nowrap text-g700">({jobs} Jobs)</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Tag>{topSkill}</Tag>
        {otherSkills > 0 && <Tag>+{otherSkills} Others</Tag>}
      </div>
      <div className="flex shrink-0 items-center gap-6 text-[14px] leading-5 font-medium whitespace-nowrap text-g500 sm:w-[260px] sm:justify-end">
        <span className="flex min-w-0 items-start gap-2" title={location}>
          <Image src="/icons/location-sm.svg" alt="" width={20} height={20} className="size-5 shrink-0" />
          <span className="truncate">{location}</span>
        </span>
        <span className="flex shrink-0 items-start gap-2">
          <span className="relative size-5 shrink-0 overflow-hidden">
            <Image src="/icons/bitcoin-sm.svg" alt="" width={17} height={17} className="absolute inset-[8.33%] size-[83.34%]" />
          </span>
          {rate}
        </span>
      </div>
    </article>
  );
}
