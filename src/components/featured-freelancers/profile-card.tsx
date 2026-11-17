import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import { profileHref, type Freelancer } from "@/data/freelancers";
import { cn } from "@/lib/cn";

const accents: Record<Freelancer["accent"], string> = {
  yellow: "bg-accent-yellow",
  teal: "bg-accent-teal",
  cyan: "bg-brand-c500",
  blue: "bg-accent-blue",
};

/**
 * Freelancer profile card.
 *  - featured: homepage carousel — fixed 304px, G100 fill, 16px footer
 *  - result:   search results grid — fluid width, white fill with G200 border, compact 14px footer
 */
export function ProfileCard({
  freelancer,
  variant = "featured",
  className,
}: {
  freelancer: Freelancer;
  variant?: "featured" | "result";
  className?: string;
}) {
  const { id, name, title, avatar, rating, jobs, topSkill, otherSkills, location, rate, accent } = freelancer;
  const result = variant === "result";

  return (
    <article
      className={cn(
        "group/card relative isolate flex shrink-0 flex-col items-center justify-center gap-6 overflow-hidden rounded-xl px-6 py-8",
        "transition-shadow duration-200 ease-out has-[a:hover]:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.18)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-brand-c500",
        result ? "w-full border border-g200 bg-g0" : "w-[304px] bg-g100",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          // Behind the (static) content, so the name's stretched link can cover the whole card.
          "absolute -z-10 h-[85.77px]",
          result ? "-inset-x-[2.1px] top-[-4.42px]" : "top-[-3.42px] left-1/2 w-[308.21px] -translate-x-1/2",
          accents[accent],
        )}
      />

      <div className="flex max-w-full flex-col items-center gap-6">
        <div className="relative size-[120px]">
          {/* Avatar artwork includes its white ring, so it bleeds 3.68% past the 120px frame */}
          <Image src={avatar} alt="" width={129} height={129} className="absolute inset-[-3.68%] size-[128.82px] max-w-none" />
          <Image
            // The tick's inner ring matches the card fill.
            src={result ? "/icons/verified-tick-white.svg" : "/icons/verified-tick.svg"}
            alt="Verified"
            width={35}
            height={35}
            className="absolute right-0 bottom-0 size-[35.29px]"
          />
        </div>

        <div className="flex max-w-full flex-col items-center gap-2 text-center">
          <h3 className="max-w-full truncate text-[20px] leading-6 font-medium text-g800">
            {/* Stretched link: the whole card is clickable, but only the name is announced. */}
            <Link href={profileHref(id)} className="outline-none after:absolute after:inset-0 after:content-['']">
              {name}
            </Link>
          </h3>
          <p className="max-w-full truncate text-[14px] leading-4 font-medium text-g600">{title}</p>
          <div className="flex items-center justify-center gap-2">
            <Image
              src={rating === 5 ? "/icons/stars-5.svg" : "/icons/stars-4.svg"}
              alt={`Rated ${rating} out of 5`}
              width={127}
              height={20}
              className="h-5 w-[126.67px]"
            />
            <span className="text-[14px] leading-[1.5] font-medium whitespace-nowrap text-g700">({jobs} Jobs)</span>
          </div>
        </div>

        <div className="flex max-w-full items-center gap-2">
          <Tag className="min-w-0 truncate">{topSkill}</Tag>
          {otherSkills > 0 && <Tag>+{otherSkills} Others</Tag>}
        </div>
      </div>

      {result ? (
        <div className="flex w-full items-center justify-between gap-4 text-[14px] leading-5 font-medium whitespace-nowrap text-g500">
          <span className="flex min-w-0 items-start gap-2" title={location}>
            <Image src="/icons/location-sm.svg" alt="" width={20} height={20} className="size-5 shrink-0" />
            <span className="truncate">{location}</span>
          </span>
          <span className="flex shrink-0 items-start gap-2">
            {/* u:bitcoin glyph sits inset 8.33% in a 20px frame */}
            <span className="pointer-events-none relative size-5 shrink-0 overflow-hidden">
              <Image src="/icons/bitcoin-sm.svg" alt="" width={17} height={17} className="absolute inset-[8.33%] size-[83.34%]" />
            </span>
            {rate}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-6 text-[16px] leading-6 font-medium whitespace-nowrap text-g500">
          <span className="flex items-start gap-2">
            <Image src="/icons/location.svg" alt="" width={24} height={24} className="size-6" />
            {location}
          </span>
          <span className="flex items-start gap-2">
            {/* u:bitcoin glyph sits inset 8.33% in a 24px frame */}
            <span className="pointer-events-none relative size-6 shrink-0 overflow-hidden">
              <Image src="/icons/bitcoin.svg" alt="" width={20} height={20} className="absolute inset-[8.33%] size-[83.34%]" />
            </span>
            {rate}
          </span>
        </div>
      )}
    </article>
  );
}
