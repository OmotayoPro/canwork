import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

const categories = [
  ["Website Design", "Mobile Apps", "Android Apps", "iPhone Apps", "Software Architecture", "Graphic Design"],
  ["Research Writing", "Article Writing", "Web Scraping", "HTML", "CSS", "HTML 5"],
  ["Data Entry", "Content Writing", "Marketing", "Excel", "Ghostwriting", "Copywriting"],
];

const menus = [
  { title: "Website", links: ["Quick Escrow", "Register", "Sign In", "Job Board", "Blog"] },
  { title: "Company", links: ["Contact Us", "FAQs", "Help & Support", "Join Community"] },
];

const legal = ["Privacy Policy", "Terms of Service", "Cookies Settings"];

const socials = [
  { label: "Facebook", icon: "/icons/social-facebook.svg" },
  { label: "Instagram", icon: "/icons/social-instagram.svg" },
  { label: "X", icon: "/icons/social-x.svg" },
  { label: "LinkedIn", icon: "/icons/social-linkedin.svg" },
  { label: "YouTube", icon: "/icons/social-youtube.svg" },
];

const linkClass = "text-[14px] leading-10 text-g700 transition-colors hover:text-g900";

export function Footer() {
  return (
    <footer className="border-t border-g300 bg-g0 px-4 py-20 md:px-16">
      <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-20">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex flex-1 flex-col items-start gap-6">
            <Link href="/" aria-label="CanWork home" className="relative block h-10 w-[140px] shrink-0">
              {/* Logo artwork sits inset 16.25% / 6% inside a 140×40 frame, as in Figma */}
              <Image
                src="/icons/footer-logo.svg"
                alt="CanWork"
                width={123}
                height={27}
                className="absolute top-[16.25%] left-[6.07%] h-[67.5%] w-[87.92%]"
              />
            </Link>
            <ButtonLink href="#" variant="secondary" size="md" className="text-g800">
              Post a job request
            </ButtonLink>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-start gap-x-12 gap-y-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-[16px] leading-[1.5] font-medium text-g900">Categories</h2>
              <div className="flex flex-wrap gap-x-12">
                {categories.map((column, i) => (
                  <ul key={i}>
                    {column.map((label) => (
                      <li key={label}>
                        <Link href="#" className={linkClass}>
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            {menus.map((menu) => (
              <div key={menu.title} className="flex flex-col gap-4">
                <h2 className="text-[16px] leading-[1.5] font-medium text-g900">{menu.title}</h2>
                <ul>
                  {menu.links.map((label) => (
                    <li key={label}>
                      <Link href="#" className={linkClass}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-8">
          <div className="h-px w-full bg-g300" />
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
            <div className="flex flex-col gap-4 text-[14px] leading-4 text-g700 md:flex-row md:items-center md:gap-6">
              <p>© 2023 CanWork.io. All rights reserved.</p>
              <ul className="flex flex-wrap gap-6">
                {legal.map((label) => (
                  <li key={label}>
                    <Link href="#" className="underline transition-colors hover:text-g900">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="flex gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <Link href="#" aria-label={s.label} className="block transition-opacity hover:opacity-70">
                    <Image src={s.icon} alt="" width={24} height={24} className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
