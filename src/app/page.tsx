import { FeaturedFreelancers } from "@/components/featured-freelancers/featured-freelancers";
import { Hero } from "@/components/hero/hero";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <FeaturedFreelancers />
    </main>
  );
}
