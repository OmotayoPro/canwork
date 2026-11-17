import { Button } from "@/components/ui/button";

const ART = "/illustrations/empty-search";

/** Card columns in the illustration (x offsets in the 504×215 artboard). */
const CARD_X = [1, 174.64, 347];
const CARD_W = 157.354;

/**
 * Three placeholder profile cards with a magnifying glass over them.
 * Drawn as one SVG so the whole illustration scales down cleanly on narrow screens.
 */
function EmptyIllustration() {
  return (
    <svg viewBox="0 0 504 215" className="h-auto w-full max-w-[504px]" aria-hidden>
      <defs>
        <clipPath id="empty-card-clip">
          <rect width={CARD_W} height="198.26" rx="6.294" />
        </clipPath>
      </defs>

      {CARD_X.map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <g clipPath="url(#empty-card-clip)">
            <rect width={CARD_W} height="198.26" fill="var(--color-g100)" />
            <rect width="159.452" height="57.786" fill="var(--color-g200)" />
          </g>
          <image href={`${ART}/avatar.svg`} x="43.01" y="20.981" width="71.334" height="71.334" />
          <image href={`${ART}/verified.svg`} x="93.36" y="71.33" width="20.981" height="20.98" />
          <rect x="53.76" y="104.9" width="49.829" height="10.49" rx="5.245" fill="var(--color-g300)" />
          <rect x="41.17" y="119.59" width="75.005" height="10.49" rx="5.245" fill="var(--color-g300)" />
          <rect x="45.9" y="134.27" width="65.564" height="5.245" rx="2.62" fill="var(--color-g200)" />
          <rect x="56.91" y="143.71" width="43.535" height="5.245" rx="2.62" fill="var(--color-g200)" />
          <rect x="49.3" y="169.94" width="27.799" height="7.343" rx="3.67" fill="var(--color-g300)" />
          <rect x="80.25" y="169.94" width="27.799" height="7.343" rx="3.67" fill="var(--color-g300)" />
        </g>
      ))}

      {/* Magnifier: joint and handle are rotated −60° about their own centres, as in Figma. */}
      <image
        href={`${ART}/magnifier-joint.svg`}
        x={360.02 - 8.121}
        y={143.84 - 13.978}
        width="16.242"
        height="27.956"
        transform="rotate(-60 360.02 143.84)"
      />
      <image
        href={`${ART}/magnifier-handle.svg`}
        x={406.53 - 12.488}
        y={171.06 - 42.98}
        width="24.976"
        height="85.961"
        transform="rotate(-60 406.53 171.06)"
      />
      <image href={`${ART}/magnifier-lens.svg`} x="250" y="53" width="115.398" height="115.398" />
    </svg>
  );
}

/** "No Result Found" state for the search results column. */
export function SearchEmptyState({ onSeeTop }: { onSeeTop: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[11px] py-6 text-center">
      <EmptyIllustration />
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[24px] leading-8 font-medium text-g800">No Result Found</p>
          <p className="text-[16px] leading-6 text-g700">
            We are unable to find result matching your search input.
            <br className="hidden sm:block" /> See top freelancers to continue
          </p>
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={onSeeTop}
          className="border-g200 px-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.1),0px_2px_2px_-1px_rgba(0,0,0,0.1),0px_4px_10px_-2px_rgba(0,0,0,0.05)]"
        >
          See Top Freelancers
        </Button>
      </div>
    </div>
  );
}
