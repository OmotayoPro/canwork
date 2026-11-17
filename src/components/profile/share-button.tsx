"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

/** Shares the profile URL with the native share sheet, falling back to copying it. */
export function ShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${name} on CanWork`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* share sheet dismissed or clipboard blocked */
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={share}
        aria-label="Share profile"
        className={cn(
          "flex cursor-pointer items-center justify-center rounded-lg border border-g300 bg-g0 p-1.5 shadow-btn",
          "transition-[background-color,transform] duration-150 ease-out hover:bg-g100 active:scale-[0.94]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-c500",
        )}
      >
        <Image src="/icons/profile/share.svg" alt="" width={20} height={20} className="size-5" />
      </button>
      <span
        role="status"
        className={cn(
          "pointer-events-none absolute top-full right-0 mt-2 rounded-md bg-g900 px-2 py-1 text-[12px] leading-4 whitespace-nowrap text-g0",
          "transition-[opacity,transform] duration-150 ease-out",
          copied ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
      >
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}
