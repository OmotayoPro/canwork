"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Freelancer } from "@/data/freelancers";
import { cn } from "@/lib/cn";
import { ProfileCard } from "./profile-card";

const CARD = 304;
const GAP = 24;
const STEP = CARD + GAP;
/** Left edge of the first fully-visible card, relative to the content container (matches Figma). */
const LEAD = 12;
const PAGES = 4;
const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;
/** Pointer travel (px) before a press counts as a drag rather than a click. */
const DRAG_SLOP = 6;

export function FreelancerCarousel({ freelancers }: { freelancers: Freelancer[] }) {
  const [page, setPage] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const startX = useRef(0);
  const dragged = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [lead, setLead] = useState(LEAD);

  // On narrow screens, centre the active card instead of using the desktop lead-in.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setLead(w < 2 * STEP ? (w - CARD) / 2 : LEAD);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = freelancers.length;
  // Three copies so there are always cards peeking in from both edges, at any viewport width.
  const looped = [...freelancers, ...freelancers, ...freelancers];
  const offset = lead - (n + page + 1) * STEP + (drag ?? 0);

  const go = (next: number) => setPage(((next % PAGES) + PAGES) % PAGES);

  useEffect(() => {
    if (paused || drag !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setPage((p) => (p + 1) % PAGES);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, drag, page]);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    dragged.current = false;
    setDrag(0);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (drag === null) return;
    const dx = e.clientX - startX.current;
    // Capture only once it's clearly a drag, so a plain click still reaches the card link.
    if (!dragged.current && Math.abs(dx) > DRAG_SLOP) {
      dragged.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    // Resist past the first/last page.
    const atEdge = (page === 0 && dx > 0) || (page === PAGES - 1 && dx < 0);
    setDrag(atEdge ? dx * 0.3 : dx);
  }

  function onPointerUp() {
    if (drag === null) return;
    if (drag < -SWIPE_THRESHOLD && page < PAGES - 1) go(page + 1);
    else if (drag > SWIPE_THRESHOLD && page > 0) go(page - 1);
    setDrag(null);
  }

  return (
    <div
      className="flex flex-col items-center gap-12"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured freelancers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={viewportRef}
        className="w-full cursor-grab touch-pan-y select-none active:cursor-grabbing [&_a]:[-webkit-user-drag:none] [&_img]:pointer-events-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          // A drag that ends over a card shouldn't open its profile.
          if (dragged.current) {
            e.preventDefault();
            e.stopPropagation();
            dragged.current = false;
          }
        }}
      >
        <div
          className={cn(
            "flex w-max gap-6 will-change-transform",
            drag === null && "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          )}
          style={{ transform: `translate3d(${offset}px,0,0)` }}
        >
          {looped.map((f, i) => {
            const isPrimary = i >= n && i < 2 * n;
            return (
              <div key={`${f.id}-${i}`} aria-hidden={!isPrimary} inert={!isPrimary} draggable={false}>
                <ProfileCard freelancer={f} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4" role="group" aria-label="Choose slide">
        {Array.from({ length: PAGES }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === page}
            onClick={() => go(i)}
            className={cn(
              "relative size-2.5 cursor-pointer rounded-full transition-colors duration-300 after:absolute after:-inset-2",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-c500",
              i === page ? "bg-g500" : "bg-g200 hover:bg-g300",
            )}
          />
        ))}
      </div>
    </div>
  );
}
