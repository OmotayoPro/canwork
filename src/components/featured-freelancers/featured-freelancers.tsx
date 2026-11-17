import { ButtonLink } from "@/components/ui/button";
import { featuredFreelancers } from "@/data/freelancers";
import { FreelancerCarousel } from "./freelancer-carousel";

export function FeaturedFreelancers() {
  return (
    <section className="overflow-hidden bg-g0 py-20" aria-labelledby="featured-freelancers-heading">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-4 md:px-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-start gap-2 font-medium">
            <p className="text-[14px] leading-4 text-g500">Top Verified Professionals</p>
            <h2 id="featured-freelancers-heading" className="max-w-[410px] text-[32px] leading-[1.2] text-g800 md:text-[40px]">
              Meet Exceptional Freelancers
            </h2>
          </div>
          <div className="flex max-w-[430px] flex-col items-start gap-4">
            <p className="text-[16px] leading-6 font-medium text-g700">
              Select your preferred choice from the wide range of freelance professionals on CanWork from various
              categories.
            </p>
            <ButtonLink href="#" variant="secondary" size="md">
              Post a job Request
            </ButtonLink>
          </div>
        </div>

        <FreelancerCarousel freelancers={featuredFreelancers} />
      </div>
    </section>
  );
}
