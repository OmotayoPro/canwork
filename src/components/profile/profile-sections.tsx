"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Tag } from "@/components/ui/tag";
import type { FreelancerProfile, Testimonial, WorkHistoryItem } from "@/data/profile";
import { cn } from "@/lib/cn";

/* ---------- shared bits ---------- */

const card = "rounded-xl border border-g200 bg-g0";

/** Dated meta line: "Skillshare.com | 16th October 2020" with Figma's left-rule separator. */
function MetaLine({ items }: { items: string[] }) {
  return (
    <p className="flex flex-wrap items-start text-[14px] leading-5 text-g500">
      {items.map((item, i) => (
        <span key={item} className={cn(i > 0 && "ml-2 border-l border-g500 px-2")}>
          {item}
        </span>
      ))}
    </p>
  );
}

/** "See More ⌄" toggle used at the foot of sidebar and history lists. */
function SeeMoreToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="flex cursor-pointer items-center gap-2 py-1 text-[14px] leading-4 font-medium text-g800 transition-opacity hover:opacity-70"
    >
      {open ? "See Less" : "See More"}
      <Image
        src="/icons/profile/chevron.svg"
        alt=""
        width={16}
        height={16}
        className={cn("size-4 transition-transform duration-200 ease-out", !open && "rotate-180")}
      />
    </button>
  );
}

/** Inline cyan "See More" that expands clamped copy. */
function InlineMore({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="cursor-pointer font-medium text-brand-c500 transition-opacity hover:opacity-70"
    >
      {open ? "See Less" : "See More"}
    </button>
  );
}

/** Icon whose artwork sits inside a 24px frame at Figma's offsets. */
function FramedIcon({ src, width, height, left, top }: { src: string; width: number; height: number; left: number; top: number }) {
  return (
    <span className="relative size-6 shrink-0 overflow-hidden">
      <Image src={src} alt="" width={width} height={height} className="absolute max-w-none" style={{ left, top, width, height }} />
    </span>
  );
}

/* ---------- sidebar ---------- */

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex w-full flex-col items-start gap-4 border-t border-g200 p-6 first:border-t-0">
      <h2 className="text-[20px] leading-7 font-medium text-g800">{title}</h2>
      {children}
    </section>
  );
}

const CERTS_SHOWN = 3;

export function ProfileSidebar({ profile }: { profile: FreelancerProfile }) {
  const [allCerts, setAllCerts] = useState(false);
  const certs = allCerts ? profile.certifications : profile.certifications.slice(0, CERTS_SHOWN);

  return (
    <aside className={cn(card, "flex flex-col items-center overflow-hidden")}>
      <SidebarSection title="Skills">
        <ul className="flex w-full flex-wrap gap-2">
          {profile.skills.map((skill, i) => (
            <li key={`${skill}-${i}`}>
              <Tag>{skill}</Tag>
            </li>
          ))}
        </ul>
      </SidebarSection>

      <SidebarSection title="Certifications">
        <ul className="flex w-full flex-col gap-4">
          {certs.map((c) => (
            <li key={c.title} className="flex gap-4">
              <FramedIcon src="/icons/profile/certificate.svg" width={19.5} height={18.5} left={2.25} top={4.25} />
              <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                <p className="text-[16px] leading-6 text-black">{c.title}</p>
                <MetaLine items={[c.issuer, c.date]} />
                <a href="#" className="py-1 text-[14px] leading-5 font-medium text-brand-c400 transition-opacity hover:opacity-70">
                  Certificate
                </a>
              </div>
            </li>
          ))}
        </ul>
        {profile.certifications.length > CERTS_SHOWN && <SeeMoreToggle open={allCerts} onClick={() => setAllCerts((o) => !o)} />}
      </SidebarSection>

      <SidebarSection title="Education">
        <ul className="flex w-full flex-col gap-4">
          {profile.education.map((e) => (
            <li key={e.school} className="flex gap-4">
              <FramedIcon src="/icons/profile/school.svg" width={21.5} height={15.5} left={1.25} top={4.25} />
              <div className="flex min-w-0 flex-1 flex-col gap-2 text-g800">
                <p className="text-[16px] leading-6 font-medium">{e.school}</p>
                <p className="text-[16px] leading-6">{e.degree}</p>
                <p className="text-[14px] leading-5 text-g500">{e.dates}</p>
              </div>
            </li>
          ))}
        </ul>
      </SidebarSection>
    </aside>
  );
}

/* ---------- main column ---------- */

function MainCard({ title, aside, children, className }: { title: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn(card, "flex w-full flex-col items-start px-6 py-6 md:px-10", className)}>
      <div className="flex w-full items-center justify-between gap-4">
        <h2 className="text-[24px] leading-8 font-medium text-g900">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function AboutMe({ profile }: { profile: FreelancerProfile }) {
  const { intro, services, portfolioLink, outro } = profile.about;
  return (
    <MainCard title="About Me" className="gap-4">
      <div className="flex flex-col text-[16px] leading-6 text-g900">
        {intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="mt-6">Some of my current services include</p>
        <ul className="list-disc ps-6">
          {services.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p>
          Here&apos;s a link to my portfolio:{" "}
          <a href={portfolioLink} target="_blank" rel="noreferrer" className="break-all text-[#3aa0ff] underline">
            {portfolioLink}
          </a>
        </p>
        {outro.map((p, i) => (
          <p key={p} className={cn(i === 0 && "mt-6")}>
            {p}
          </p>
        ))}
      </div>
    </MainCard>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <Image
      src={rating === 5 ? "/icons/profile/stars-24.svg" : "/icons/stars-4.svg"}
      alt={`Rated ${rating} out of 5`}
      width={152}
      height={24}
      className="h-6 w-[152px] shrink-0"
    />
  );
}

/** Long testimonials collapse to three lines behind an inline "See More". */
const CLAMP_FROM = 180;

function TestimonialItem({ t }: { t: Testimonial }) {
  const [open, setOpen] = useState(false);
  const long = (t.body?.length ?? 0) > CLAMP_FROM;
  return (
    <li className="flex flex-col gap-2 border-b border-g200 py-4 last:border-b-0">
      <div className="flex flex-col-reverse items-start justify-between gap-2 sm:flex-row sm:gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="max-w-[560px] text-[20px] leading-7 font-medium text-g900">{t.project}</h3>
          <p className="text-[14px] leading-5 text-g500">{t.date}</p>
        </div>
        <Stars rating={t.rating} />
      </div>
      {t.body && (
        <div className="text-[16px] leading-6 text-g900">
          <p className={cn(long && !open && "line-clamp-3")}>{t.body}</p>
          {long && <InlineMore open={open} onClick={() => setOpen((o) => !o)} />}
        </div>
      )}
    </li>
  );
}

export function Testimonials({ profile }: { profile: FreelancerProfile }) {
  return (
    <MainCard
      title="Testimonials"
      aside={
        <div className="flex items-center gap-2">
          <Stars rating={profile.rating} />
          <span className="text-[16px] leading-6 font-medium text-g500">({profile.jobs})</span>
        </div>
      }
    >
      <ul className="w-full">
        {profile.testimonials.map((t) => (
          <TestimonialItem key={t.project} t={t} />
        ))}
      </ul>
    </MainCard>
  );
}

function WorkItem({ item }: { item: WorkHistoryItem }) {
  const [open, setOpen] = useState(false);
  const [first, second, ...rest] = item.highlights;
  const hasMore = rest.length > 0;
  return (
    <li className="flex flex-col gap-4 border-b border-g200 py-4 last:border-b-0">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden">
          <Image
            src={item.logo.src}
            alt=""
            width={item.logo.width}
            height={item.logo.height}
            style={{ width: item.logo.width, height: item.logo.height }}
            className="max-w-none"
          />
        </span>
        <div className="flex min-w-0 flex-col gap-2">
          <h3 className="text-[20px] leading-7 font-medium text-g900">
            {item.role} | {item.company}
          </h3>
          <MetaLine items={[item.dates, item.location]} />
        </div>
      </div>
      <ul className="max-w-[802px] list-disc ps-6 text-[16px] leading-6 text-g900">
        {first && <li>{first}</li>}
        {second && (
          <li>
            <span className={cn(hasMore && !open && "line-clamp-2")}>{second}</span>
            {!open && hasMore && <InlineMore open={false} onClick={() => setOpen(true)} />}
          </li>
        )}
        {open &&
          rest.map((h) => (
            <li key={h}>{h}</li>
          ))}
        {open && hasMore && (
          <li className="list-none">
            <InlineMore open onClick={() => setOpen(false)} />
          </li>
        )}
      </ul>
    </li>
  );
}

const JOBS_SHOWN = 3;

export function WorkHistory({ profile }: { profile: FreelancerProfile }) {
  const [all, setAll] = useState(false);
  const jobs = all ? profile.workHistory : profile.workHistory.slice(0, JOBS_SHOWN);
  return (
    <MainCard title="Work History">
      <ul className="w-full">
        {jobs.map((item) => (
          <WorkItem key={`${item.company}-${item.role}`} item={item} />
        ))}
      </ul>
      {profile.workHistory.length > JOBS_SHOWN && <SeeMoreToggle open={all} onClick={() => setAll((o) => !o)} />}
    </MainCard>
  );
}
