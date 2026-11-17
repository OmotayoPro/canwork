import Image from "next/image";
import { cn } from "@/lib/cn";

/** Pulse only for people who haven't asked for reduced motion. */
const pulse = "motion-safe:animate-pulse";

/** Loading placeholder matching the result card's footprint (Figma "Search Freelancers - Loading"). */
export function ResultCardSkeleton() {
  return (
    <div className={cn("relative flex w-full flex-col items-center gap-6 overflow-hidden rounded-xl bg-g100 px-6 py-8", pulse)}>
      <div aria-hidden className="absolute top-[-3.42px] -inset-x-[2.1px] h-[85.77px] bg-g200" />
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative size-[120px]">
          <Image src="/icons/skeleton-avatar.svg" alt="" width={129} height={129} className="absolute inset-[-3.68%] size-[128.82px] max-w-none" />
        </div>
        <div className="flex flex-col items-center gap-[10.85px]">
          <span className="h-[27.13px] w-[128.88px] rounded-full bg-g300" />
          <span className="h-[27.13px] w-[194px] max-w-full rounded-full bg-g300" />
          <span className="h-[13.57px] w-[169.58px] max-w-full rounded-full bg-g200" />
          <span className="h-[13.57px] w-[112.6px] rounded-full bg-g200" />
        </div>
      </div>
      <span className="relative h-6 w-full rounded-[40px] bg-g200" />
    </div>
  );
}

/** List-view counterpart (the list layout itself isn't in Figma; this mirrors ResultRow). */
export function ResultRowSkeleton() {
  return (
    <div className={cn("flex w-full items-center gap-4 rounded-xl bg-g100 p-4 sm:gap-6 sm:px-6", pulse)}>
      <span className="size-16 shrink-0 rounded-full bg-g200" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="h-4 w-40 max-w-full rounded-full bg-g300" />
        <span className="h-3 w-56 max-w-full rounded-full bg-g200" />
        <span className="h-3 w-24 rounded-full bg-g200" />
      </div>
      <span className="hidden h-6 w-[200px] rounded-[40px] bg-g200 sm:block" />
    </div>
  );
}
