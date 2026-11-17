import Image from "next/image";
import { GradientShader } from "@/components/hero/gradient-shader";
import { DEFAULT_SHADER_SETTINGS } from "@/components/hero/shader-settings";
import { Button } from "@/components/ui/button";
import type { FreelancerProfile } from "@/data/profile";
import { ShareButton } from "./share-button";

const socials = [
  { label: "Dribbble", icon: "/icons/profile/dribbble.svg" },
  { label: "Behance", icon: "/icons/profile/behance.svg" },
  { label: "Instagram", icon: "/icons/profile/instagram-dark.svg" },
  { label: "X", icon: "/icons/profile/x-dark.svg" },
  { label: "LinkedIn", icon: "/icons/profile/linkedin-dark.svg" },
  { label: "Website", icon: "/icons/profile/globe.svg" },
];

/** Same three-layer shadow the Figma file uses on the outlined "Invite to a job" button. */
const outlineShadow =
  "shadow-[0px_1px_1px_0px_rgba(0,0,0,0.1),0px_2px_2px_-1px_rgba(0,0,0,0.1),0px_4px_10px_-2px_rgba(0,0,0,0.05)]";

export function ProfileHeader({ profile }: { profile: FreelancerProfile }) {
  const { name, avatar, rating, jobs, bio, rate, hoursPerWeek, available, location } = profile;

  return (
    <section className="relative isolate overflow-hidden rounded-xl border border-g200 bg-g0 px-4 pt-[120px] pb-8 md:px-16 md:pb-10 lg:flex lg:h-[440px] lg:flex-col lg:justify-end">
      {/* Banner: the same liquid gradient as the hero, in place of Figma's static wave artwork. */}
      <GradientShader settings={DEFAULT_SHADER_SETTINGS} className="absolute inset-x-0 top-0 -z-10 h-[184px]" />

      <div className="flex flex-col gap-6">
        <div className="relative size-[140px]">
          <Image src={avatar} alt="" width={151} height={151} priority className="absolute inset-[-3.68%] size-[150.3px] max-w-none" />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <h1 className="flex items-center gap-2 text-[24px] leading-8 font-medium text-g800">
                {name}
                <Image src="/icons/profile/verified-tick.svg" alt="Verified" width={24} height={24} className="size-6" />
              </h1>
              <div className="flex items-center gap-[9.14px]">
                <Image
                  src={rating === 5 ? "/icons/profile/stars-lg.svg" : "/icons/stars-4.svg"}
                  alt={`Rated ${rating} out of 5`}
                  width={145}
                  height={23}
                  className="h-[22.86px] w-[144.76px]"
                />
                <span className="text-[16px] leading-[1.5] font-medium whitespace-nowrap text-g700">({jobs} Jobs)</span>
              </div>
            </div>

            <p className="max-w-[609px] text-[16px] leading-6 text-g900">{bio}</p>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[16px] leading-6 font-medium whitespace-nowrap text-g900">
              <li className="flex items-center gap-2">
                <Image src="/icons/profile/money-bill.svg" alt="" width={24} height={24} className="size-6" />
                <span className="sr-only">Rate: </span>
                {rate}
              </li>
              <li className="flex items-center gap-2">
                <Image src="/icons/profile/clock.svg" alt="" width={24} height={24} className="size-6" />
                {available && (
                  <span
                    title="Available now"
                    className="size-3 rounded-2xl border border-[rgba(31,136,61,0.2)] bg-[#02992d] shadow-[inset_2px_4px_4px_0px_rgba(97,255,0,0.5)]"
                  />
                )}
                <span className="sr-only">{available ? "Available, " : ""}</span>
                {hoursPerWeek}
              </li>
              <li className="flex items-center gap-2">
                <Image src="/icons/profile/location-pin.svg" alt="" width={24} height={24} className="size-6" />
                <span className="sr-only">Location: </span>
                {location}
              </li>
              <li>
                <ul className="flex items-start gap-3" aria-label="Links">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href="#" aria-label={s.label} className="block size-6 transition-opacity hover:opacity-60">
                        <Image src={s.icon} alt="" width={24} height={24} className="size-6" />
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4 lg:flex-col lg:items-end lg:justify-between lg:self-stretch">
            {/* Below lg the share button pins to the card's top-right, just under the banner. */}
            <div className="absolute top-[196px] right-4 md:right-16 lg:static">
              <ShareButton name={name} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="ghost" size="md" className="text-[#161b22]">
                Message
              </Button>
              <Button variant="secondary" size="md" className={`border-g200 px-6 ${outlineShadow}`}>
                Invite to a job
              </Button>
              <Button variant="primary" size="md" className="px-6">
                Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
