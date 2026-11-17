import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

const menu = [
  { label: "Job Board", href: "#" },
  { label: "Quick Escrow", href: "#" },
  { label: "Blog", href: "#" },
  { label: "FAQs", href: "#" },
];

/** Transparent navbar that sits on top of the hero shader. */
export function Navbar() {
  return (
    <header className="relative z-10 px-4 py-3 md:px-16">
      <nav className="relative flex h-10 items-center justify-between" aria-label="Main">
        <Link href="/" aria-label="CanWork home" className="relative block h-10 w-[140px] shrink-0">
          {/* Logo artwork sits inset 16.25% / 6% inside a 140×40 frame, as in Figma */}
          <Image
            src="/icons/logo.svg"
            alt="CanWork"
            width={123}
            height={27}
            priority
            className="absolute top-[16.25%] left-[6.07%] h-[67.5%] w-[87.92%]"
          />
        </Link>

        <ul className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-start gap-10 lg:flex">
          {menu.map((item) => (
            <li key={item.label}>
              <ButtonLink href={item.href} variant="ghost" size="sm" className="text-g0">
                {item.label}
              </ButtonLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {/* Visibility lives on wrappers so it doesn't fight the button's own `inline-flex`. */}
          <span className="hidden md:contents">
            <ButtonLink href="#" variant="ghost" size="sm" className="text-g0">
              Join as a Freelancer
            </ButtonLink>
          </span>
          <ButtonLink href="#" variant="secondary" size="sm">
            Login
          </ButtonLink>
          <span className="hidden sm:contents">
            <ButtonLink href="#" variant="primary" size="sm">
              Post a Job
            </ButtonLink>
          </span>
        </div>
      </nav>
    </header>
  );
}
