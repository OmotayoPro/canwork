import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Classic Canwork button. Not the Escrow button — different radii, padding and weights.
 *
 * variant
 *  - primary:   G900 fill, white label
 *  - secondary: white fill, G300 border, button shadow
 *  - ghost:     text-only (navbar links) — label colour inherits
 * size
 *  - sm: 14/16 label, 24×12 padding (navbar)
 *  - md: 16/24 label, 40×10 padding (hero search, section CTAs)
 */
type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium select-none " +
  "transition-[background-color,box-shadow,transform,opacity] duration-150 ease-out " +
  "active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-c500 " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "rounded-[12px] bg-g900 text-g0 hover:bg-g800",
  secondary: "rounded-[12px] border border-g300 bg-g0 text-g900 shadow-btn hover:bg-g100",
  ghost: "py-1 hover:opacity-75",
};

const sizes: Record<Size, string> = {
  sm: "text-[14px] leading-4",
  md: "text-[16px] leading-6",
};

const padding: Record<Size, string> = {
  sm: "px-6 py-3",
  md: "px-10 py-2.5",
};

function classes(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], variant !== "ghost" && padding[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return <button className={classes(variant, size, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ButtonLinkProps) {
  return <Link className={classes(variant, size, className)} {...props} />;
}
