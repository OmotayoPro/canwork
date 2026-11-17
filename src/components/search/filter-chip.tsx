import Image from "next/image";
import { cn } from "@/lib/cn";

/** Removable outline tag (active filter / selected location). */
export function FilterChip({ label, onRemove, className }: { label: string; onRemove: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${label}`}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-g300 bg-g0 py-1.5 pr-2 pl-4",
        "text-[14px] leading-4 whitespace-nowrap text-g700",
        "transition-[border-color,transform] duration-150 ease-out hover:border-g500 active:scale-[0.96]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-c500",
        className,
      )}
    >
      {label}
      <Image
        src="/icons/cancel.svg"
        alt=""
        width={16}
        height={16}
        className="size-4 transition-opacity group-hover:opacity-70"
      />
    </button>
  );
}
