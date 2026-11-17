"use client";

import Image from "next/image";
import { useId, useState, type ReactNode } from "react";
import { EMPTY_FILTERS, LOCATIONS, RATE_RANGES, SKILLS, VERIFICATIONS, type SearchFilters } from "@/data/search";
import { cn } from "@/lib/cn";
import { FilterChip } from "./filter-chip";

const SKILLS_PREVIEW = 10;
const RATINGS = [5, 4, 3, 2, 1];
const STAR_WIDTHS: Record<number, number> = { 5: 126.667, 4: 100, 3: 73.333, 2: 46.667, 1: 20 };

export function filterCount(f: SearchFilters) {
  return f.verifications.length + f.locations.length + f.rates.length + f.skills.length + f.ratings.length;
}

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

export function SearchFiltersPanel({
  filters,
  onChange,
}: {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const total = filterCount(filters);
  const set = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => onChange({ ...filters, [key]: value });

  return (
    <aside className="flex flex-col self-start overflow-hidden rounded-xl border border-g200 bg-g0" aria-label="Filters">
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          className="flex cursor-pointer items-center gap-2 lg:pointer-events-none"
        >
          <span className="text-[16px] leading-6 font-medium text-g800">Filters</span>
          {total > 0 && <Badge className="bg-g500 text-g0">{total}</Badge>}
          <Chevron open={mobileOpen} className="lg:hidden" />
        </button>
        <TextButton onClick={() => onChange(EMPTY_FILTERS)} disabled={!total}>
          Clear All
        </TextButton>
      </div>

      <div className={cn(mobileOpen ? "flex" : "hidden", "flex-col lg:flex")}>
        <Section title="Verification" count={filters.verifications.length} onClear={() => set("verifications", [])}>
          <CheckList>
            {VERIFICATIONS.map((v) => (
              <Check key={v} checked={filters.verifications.includes(v)} onChange={() => set("verifications", toggle(filters.verifications, v))}>
                {v}
              </Check>
            ))}
          </CheckList>
        </Section>

        <Section title="Location" count={filters.locations.length} onClear={() => set("locations", [])} bodyClassName="px-4">
          <LocationPicker selected={filters.locations} onChange={(l) => set("locations", l)} />
        </Section>

        <Section title="Hourly Rate" count={filters.rates.length} onClear={() => set("rates", [])}>
          <CheckList>
            {RATE_RANGES.map((r) => (
              <Check key={r.id} checked={filters.rates.includes(r.id)} onChange={() => set("rates", toggle(filters.rates, r.id))}>
                {r.label}
              </Check>
            ))}
          </CheckList>
        </Section>

        <Section title="Skills" count={filters.skills.length} onClear={() => set("skills", [])}>
          <SkillPicker selected={filters.skills} onChange={(s) => set("skills", s)} />
        </Section>

        <Section title="Rating" count={filters.ratings.length} onClear={() => set("ratings", [])} last>
          <CheckList className="gap-2.5">
            {RATINGS.map((n) => (
              <Check
                key={n}
                checked={filters.ratings.includes(n)}
                onChange={() => set("ratings", toggle(filters.ratings, n))}
                label={`${n} star${n > 1 ? "s" : ""}`}
                gap="gap-4"
              >
                <Image
                  src={`/icons/rating-${n}.svg`}
                  alt=""
                  width={Math.round(STAR_WIDTHS[n])}
                  height={20}
                  className="h-5"
                  style={{ width: STAR_WIDTHS[n] }}
                />
              </Check>
            ))}
          </CheckList>
        </Section>
      </div>
    </aside>
  );
}

function LocationPicker({ selected, onChange }: { selected: string[]; onChange: (next: string[]) => void }) {
  const [text, setText] = useState("");
  const listId = useId();
  const options = LOCATIONS.filter((l) => !selected.includes(l));

  function add(value: string) {
    const match = LOCATIONS.find((l) => l.toLowerCase() === value.trim().toLowerCase());
    if (!match) return false;
    if (!selected.includes(match)) onChange([...selected, match]);
    setText("");
    return true;
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="search"
        list={listId}
        value={text}
        onChange={(e) => {
          // Picking a suggestion from the datalist fires a change with the full value.
          if (!add(e.target.value)) setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          const first = options.find((l) => l.toLowerCase().startsWith(text.trim().toLowerCase()));
          if (text.trim() && first) add(first);
        }}
        placeholder="Search location"
        aria-label="Search location"
        autoComplete="off"
        className={inputClass}
      />
      <datalist id={listId}>
        {options.map((l) => (
          <option key={l} value={l} />
        ))}
      </datalist>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((l) => (
            <FilterChip key={l} label={l} onRemove={() => onChange(selected.filter((s) => s !== l))} />
          ))}
        </div>
      )}
    </div>
  );
}

function SkillPicker({ selected, onChange }: { selected: string[]; onChange: (next: string[]) => void }) {
  const [text, setText] = useState("");
  const [expanded, setExpanded] = useState(false);
  const q = text.trim().toLowerCase();
  const matches = SKILLS.filter((s) => s.toLowerCase().includes(q));
  const visible = q || expanded ? matches : matches.slice(0, SKILLS_PREVIEW);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search Skill"
        aria-label="Search skill"
        autoComplete="off"
        className={cn(inputClass, "border-g200")}
      />
      {visible.map((s) => (
        <Check key={s} checked={selected.includes(s)} onChange={() => onChange(toggle(selected, s))} gap="gap-4">
          {s}
        </Check>
      ))}
      {q && !matches.length && <p className="text-[14px] leading-6 text-g500">No skills match “{text.trim()}”</p>}
      {!q && matches.length > SKILLS_PREVIEW && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="flex cursor-pointer items-center gap-2 self-start py-1 text-[14px] leading-5 font-medium text-g900 hover:opacity-75"
        >
          {expanded ? "See Less" : "See More"}
          <Image
            src="/icons/chevron-up-lg.svg"
            alt=""
            width={20}
            height={20}
            className={cn("size-5 transition-transform duration-200", !expanded && "rotate-180")}
          />
        </button>
      )}
    </div>
  );
}

const inputClass =
  "h-10 w-full rounded-xl border border-g300 bg-g100 px-4 text-[14px] leading-4 text-g700 outline-none " +
  "placeholder:text-g700 focus:border-g500 [&::-webkit-search-cancel-button]:hidden [&::-webkit-calendar-picker-indicator]:hidden";

function Section({
  title,
  count,
  onClear,
  children,
  bodyClassName = "px-6",
  last,
}: {
  title: string;
  count: number;
  onClear: () => void;
  children: ReactNode;
  bodyClassName?: string;
  last?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const bodyId = useId();

  return (
    <section className={cn("flex flex-col gap-4 border-t border-g200 py-4", last && "border-b lg:border-b-0")}>
      <div className="flex items-center justify-between px-4">
        <h3 className="flex items-center gap-2 text-[16px] leading-6 font-medium text-g800">
          {title}
          {count > 0 && <Badge className="bg-g200 text-g800">{count}</Badge>}
        </h3>
        <div className="flex items-center gap-2">
          <TextButton onClick={onClear} disabled={!count} className="leading-5">
            Clear
          </TextButton>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={bodyId}
            aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
            className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-g300 bg-g0 shadow-btn transition-[background-color,transform] duration-150 ease-out hover:bg-g100 active:scale-[0.94]"
          >
            <Chevron open={open} />
          </button>
        </div>
      </div>
      {open && (
        <div id={bodyId} className={bodyClassName}>
          {children}
        </div>
      )}
    </section>
  );
}

/** Points down while the section is open (as in Figma), right while it's collapsed. */
function Chevron({ open, className }: { open: boolean; className?: string }) {
  return (
    <Image
      src="/icons/chevron-up.svg"
      alt=""
      width={16}
      height={16}
      className={cn("size-4 transition-transform duration-200 ease-out", open ? "rotate-180" : "rotate-90", className)}
    />
  );
}

function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("flex h-4 min-w-6 items-center justify-center rounded-3xl px-1.5 text-[14px] leading-5 font-medium", className)}>
      {children}
    </span>
  );
}

function TextButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer py-1 text-[14px] leading-4 font-medium text-g900 transition-opacity hover:opacity-70 disabled:cursor-default disabled:text-g400 disabled:hover:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function CheckList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col items-start gap-2", className)}>{children}</div>;
}

function Check({
  checked,
  onChange,
  children,
  label,
  gap = "gap-2",
}: {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  label?: string;
  gap?: string;
}) {
  return (
    <label className={cn("group flex cursor-pointer items-center text-[16px] leading-6 text-g700", gap)}>
      <span className="relative flex size-4 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          aria-label={label}
          className={cn(
            "peer size-4 cursor-pointer appearance-none rounded-[2.667px] border border-g300 bg-g0 transition-colors duration-150",
            "group-hover:border-g500 checked:border-brand-c500 checked:bg-brand-c500 group-hover:checked:border-brand-c500",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-c500",
          )}
        />
        <svg
          viewBox="0 0 16 16"
          aria-hidden
          className="pointer-events-none absolute inset-0 size-4 scale-75 text-g0 opacity-0 transition-[opacity,scale] duration-150 peer-checked:scale-100 peer-checked:opacity-100"
        >
          <path d="M4 8.2 6.7 11 12 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </label>
  );
}
