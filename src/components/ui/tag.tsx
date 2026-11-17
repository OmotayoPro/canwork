import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Pill tag. `outline` is the white search-suggestion chip in the hero,
 * `tint` is the cyan skill tag on profile cards.
 */
type Variant = "outline" | "tint";

const variants: Record<Variant, string> = {
  outline: "border border-g300 bg-g0 text-g700",
  tint: "bg-brand-c500/10 text-brand-c800",
};

const base = "inline-flex items-center rounded-2xl px-4 py-1.5 text-[14px] leading-4 whitespace-nowrap";

export function Tag({ variant = "tint", className, ...props }: ComponentProps<"span"> & { variant?: Variant }) {
  return <span className={cn(base, variants[variant], className)} {...props} />;
}

export function TagButton({
  variant = "outline",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={cn(
        base,
        variants[variant],
        "cursor-pointer transition-[background-color,border-color,transform] duration-150 ease-out",
        "hover:border-g500 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-g0",
        className,
      )}
      {...props}
    />
  );
}
