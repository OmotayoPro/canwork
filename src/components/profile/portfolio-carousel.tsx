"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PortfolioItem } from "@/data/profile";
import { cn } from "@/lib/cn";

const ITEM_W = 240;
const GAP = 16;

/** Horizontally scrolling portfolio strip with a next button, edge fade and position dots. */
export function PortfolioCarousel({ items }: { items: PortfolioItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setIndex(Math.round(track.scrollLeft / (ITEM_W + GAP)));
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  function scrollTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: i * (ITEM_W + GAP), behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section className="flex w-full flex-col gap-4 overflow-hidden rounded-xl border border-g200 bg-g0 py-6" aria-roledescription="carousel" aria-label="Portfolio">
      <h2 className="px-6 text-[20px] leading-7 font-medium text-g900 md:px-10">Portfolio</h2>

      <div className="relative">
        <ul
          ref={trackRef}
          className="flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 [scrollbar-width:none] md:scroll-px-10 md:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <li key={item.title} className="flex w-[240px] shrink-0 snap-start flex-col gap-4">
              <a
                href={item.href}
                className="group relative block h-40 w-[240px] overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-c500"
              >
                <Image src={item.image} alt="" fill sizes="240px" className="object-cover" style={{ objectPosition: item.focus }} />
                {/* Hover state from Figma: 30% black scrim with a "View Portfolio" pill. */}
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="rounded-[10px] border border-g200 bg-g0 px-4 py-1.5 text-[14px] leading-5 font-medium text-g900 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.1),0px_2px_2px_-1px_rgba(0,0,0,0.1),0px_4px_10px_-2px_rgba(0,0,0,0.05)]">
                    View Portfolio
                  </span>
                </span>
              </a>
              <p className="text-[16px] leading-6 font-medium text-g900">{item.title}</p>
            </li>
          ))}
          <li aria-hidden className="w-[1px] shrink-0" />
        </ul>

        <div
          className={cn(
            "pointer-events-none absolute top-0 right-0 flex size-[200px] items-center justify-end bg-[linear-gradient(89deg,rgba(248,250,252,0)_0.85%,rgb(248,250,252)_66.29%)] transition-opacity duration-200",
            atEnd && "opacity-0",
          )}
        >
          <button
            type="button"
            onClick={() => scrollTo(index + 1)}
            aria-label="Next project"
            tabIndex={atEnd ? -1 : 0}
            className="pointer-events-auto mr-2 cursor-pointer rounded-[56px] border border-g200 bg-g0 p-4 shadow-[5px_10px_15px_0px_rgba(141,157,165,0.15)] transition-transform duration-150 ease-out hover:scale-105 active:scale-95 md:mr-0"
          >
            <Image src="/icons/profile/chevron-right-lg.svg" alt="" width={40} height={40} className="size-10" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Show ${item.title}`}
            aria-current={i === index}
            className="flex size-6 cursor-pointer items-center justify-center -mx-[7px]"
          >
            <Image
              src={i === index ? "/icons/profile/dot-active.svg" : "/icons/profile/dot.svg"}
              alt=""
              width={10}
              height={10}
              className="size-2.5"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
