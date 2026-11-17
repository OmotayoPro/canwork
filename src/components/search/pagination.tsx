import Image from "next/image";
import { cn } from "@/lib/cn";

/** Page numbers to show: first three, last four and the current page's neighbours, with gaps as null. */
function pageList(page: number, total: number): (number | null)[] {
  if (total <= 8) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, 2, 3, total - 3, total - 2, total - 1, total, page - 1, page, page + 1]);
  const pages = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return pages.flatMap((p, i) => (i > 0 && p - pages[i - 1] > 1 ? [null, p] : [p]));
}

const box =
  "flex h-8 min-w-8 items-center justify-center rounded-[4px] border border-g300 bg-g0 p-2 text-[14px] leading-5 font-medium text-g700 " +
  "transition-[background-color,border-color,transform] duration-150 ease-out not-disabled:cursor-pointer not-disabled:hover:border-g500 " +
  "not-disabled:active:scale-[0.96] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-c500";

export function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  if (total <= 1) return null;
  const first = page === 1;
  const last = page === total;

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
      <button type="button" className={box} disabled={first} onClick={() => onChange(1)} aria-label="First page">
        <Image src="/icons/chevron-double.svg" alt="" width={24} height={24} className="size-6 -rotate-90" />
      </button>
      <button type="button" className={box} disabled={first} onClick={() => onChange(page - 1)}>
        PREV
      </button>

      {pageList(page, total).map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} aria-hidden className={cn(box, "text-g700")}>
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Page ${p}`}
            className={cn(box, p === page && "border-g700 bg-g700 text-g0 not-disabled:hover:border-g700")}
          >
            {p}
          </button>
        ),
      )}

      <button type="button" className={box} disabled={last} onClick={() => onChange(page + 1)}>
        NEXT
      </button>
      <button type="button" className={box} disabled={last} onClick={() => onChange(total)} aria-label="Last page">
        <Image src="/icons/chevron-double.svg" alt="" width={24} height={24} className="size-6 rotate-90" />
      </button>
    </nav>
  );
}
