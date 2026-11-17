import Image from "next/image";
import { Tag } from "@/components/ui/tag";
import type { Freelancer } from "@/data/freelancers";
import { cn } from "@/lib/cn";

const accents: Record<Freelancer["accent"], string> = {
  yellow: "bg-accent-yellow",
  teal: "bg-accent-teal",
  cyan: "bg-brand-c500",
};

export function ProfileCard({ freelancer, className }: { freelancer: Freelancer; className?: string }) {
  const { name, title, avatar, rating, jobs, topSkill, otherSkills, location, rate, accent } = freelancer;

  return (
    <article
      className={cn(
        "relative flex w-[304px] shrink-0 flex-col items-center justify-center gap-6 overflow-hidden rounded-xl bg-g100 px-6 py-8",
        className,
      )}
    >
      <div aria-hidden className={cn("absolute top-[-3.42px] left-1/2 h-[85.77px] w-[308.21px] -translate-x-1/2", accents[accent])} />

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative size-[120px]">
          {/* Avatar artwork includes its white ring, so it bleeds 3.68% past the 120px frame */}
          <Image src={avatar} alt="" width={129} height={129} className="absolute inset-[-3.68%] size-[128.82px] max-w-none" />
          <Image
            src="/icons/verified-tick.svg"
            alt="Verified"
            width={35}
            height={35}
            className="absolute right-0 bottom-0 size-[35.29px]"
          />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-[20px] leading-6 font-medium whitespace-nowrap text-g800">{name}</h3>
          <p className="text-[14px] leading-4 font-medium whitespace-nowrap text-g600">{title}</p>
          <div className="flex items-center justify-center gap-2">
            <Image
              src={rating === 5 ? "/icons/stars-5.svg" : "/icons/stars-4.svg"}
              alt={`Rated ${rating} out of 5`}
              width={127}
              height={20}
              className="h-5 w-[126.67px]"
            />
            <span className="text-[14px] leading-[1.5] font-medium text-g700">({jobs} Jobs)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tag>{topSkill}</Tag>
          {otherSkills > 0 && <Tag>+{otherSkills} Others</Tag>}
        </div>
      </div>

      <div className="relative flex items-center gap-6 text-[16px] leading-6 font-medium whitespace-nowrap text-g500">
        <span className="flex items-start gap-2">
          <Image src="/icons/location.svg" alt="" width={24} height={24} className="size-6" />
          {location}
        </span>
        <span className="flex items-start gap-2">
          {/* u:bitcoin glyph sits inset 8.33% in a 24px frame */}
          <span className="relative size-6 shrink-0 overflow-hidden">
            <Image src="/icons/bitcoin.svg" alt="" width={20} height={20} className="absolute inset-[8.33%] size-[83.34%]" />
          </span>
          {rate}
        </span>
      </div>
    </article>
  );
}
