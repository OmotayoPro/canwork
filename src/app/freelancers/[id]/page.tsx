import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { SignedInNavbar } from "@/components/navbar";
import { PortfolioCarousel } from "@/components/profile/portfolio-carousel";
import { ProfileHeader } from "@/components/profile/profile-header";
import { AboutMe, ProfileSidebar, Testimonials, WorkHistory } from "@/components/profile/profile-sections";
import { getFreelancerProfile, profileIds } from "@/data/profile";

export function generateStaticParams() {
  return profileIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const profile = getFreelancerProfile((await params).id);
  return profile ? { title: `${profile.name} — CanWork`, description: profile.bio } : { title: "Freelancer not found — CanWork" };
}

type Params = Promise<{ id: string }>;

export default function FreelancerProfilePage({ params }: { params: Params }) {
  return (
    <>
      <SignedInNavbar />
      <main className="bg-g50">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-6 md:px-16">
          {/* Params are URL data: read them inside a boundary so the shell can render instantly. */}
          <Suspense fallback={<ProfileFallback />}>
            <ProfileContent params={params} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

async function ProfileContent({ params }: { params: Params }) {
  const profile = getFreelancerProfile((await params).id);
  if (!profile) notFound();

  return (
    <>
      <ProfileHeader profile={profile} />
      <div className="grid items-start gap-4 lg:grid-cols-[350px_minmax(0,1fr)]">
        <ProfileSidebar profile={profile} />
        <div className="flex min-w-0 flex-col gap-4">
          <AboutMe profile={profile} />
          <Testimonials profile={profile} />
          <PortfolioCarousel items={profile.portfolio} />
          <WorkHistory profile={profile} />
        </div>
      </div>
    </>
  );
}

function ProfileFallback() {
  return (
    <div aria-busy aria-label="Loading profile" className="flex flex-col gap-4 motion-safe:animate-pulse">
      <div className="h-[440px] rounded-xl border border-g200 bg-g0" />
      <div className="grid gap-4 lg:grid-cols-[350px_minmax(0,1fr)]">
        <div className="h-[600px] rounded-xl bg-g100" />
        <div className="h-[600px] rounded-xl bg-g100" />
      </div>
    </div>
  );
}
