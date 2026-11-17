import { featuredFreelancers, type Freelancer } from "./freelancers";
import { searchResults } from "./search";

export type Certification = { title: string; issuer: string; date: string };
export type Education = { school: string; degree: string; dates: string };
export type Testimonial = { project: string; date: string; rating: 4 | 5; body?: string };
/** `focus` is the CSS object-position that reproduces the Figma crop. */
export type PortfolioItem = { title: string; image: string; href: string; focus?: string };
export type WorkHistoryItem = {
  role: string;
  company: string;
  logo: { src: string; width: number; height: number };
  dates: string;
  location: string;
  highlights: string[];
};

export type FreelancerProfile = Freelancer & {
  bio: string;
  hoursPerWeek: string;
  available: boolean;
  skills: string[];
  certifications: Certification[];
  education: Education[];
  about: { intro: string[]; services: string[]; portfolioLink: string; outro: string[] };
  testimonials: Testimonial[];
  portfolio: PortfolioItem[];
  workHistory: WorkHistoryItem[];
};

// Placeholder profile body from the Figma "Profile Page - Public View" frame,
// shared by every freelancer until profiles come from the API.
const DETAILS: Omit<FreelancerProfile, keyof Freelancer> = {
  bio: "I'm a Product & Web Designer, Framer Developer and Illustrator | I design apps and websites that connect business goals to their customers' needs.",
  hoursPerWeek: "80hrs/Week",
  available: true,
  skills: [
    "Figma", "UI/UX", "Website", "Web Development", "No Code", "Shopify", "Figma", "Shopify", "Website", "hourly",
    "hourly", "Web Development", "expert", "expert", "Web Development", "UI/UX", "UI/UX", "Shopify", "No Code", "expert",
  ],
  certifications: [
    { title: "Imagination to Illustration: Advanced illustration rendering techniques", issuer: "Skillshare.com", date: "16th October 2020" },
    { title: "Crafting End-to-End User Experience: Advanced User Experience Approach", issuer: "Skillshare.com", date: "16th October 2020" },
    { title: "Advanced User Interface Design: Professional Masterclass course", issuer: "Skillshare.com", date: "16th October 2020" },
    { title: "Design Systems at Scale: Tokens, Components and Governance", issuer: "Skillshare.com", date: "2nd March 2021" },
  ],
  education: [
    { school: "Osun State University", degree: "Bachelor of Engineering (BEng), Electrical engineering", dates: "16th Oct. 2011 - 24th Dec. 2016" },
    { school: "Skillshare.com", degree: "Bachelor of Visual Communication Design, Product Design, UI/UX Design", dates: "16th Oct. 2011 - 24th Dec. 2016" },
  ],
  about: {
    intro: [
      "Hi and welcome to my profile. 👋",
      "I’m a professional Product (UI/UX) designer, Digital Vector Illustrator, and 3D artist. I’m constantly improving my skillset to deliver the best value to my clients.🏆",
    ],
    services: ["Website Design", "Web App Design", "Mobile App Design", "Digital Illustration", "Graphic Design", "Brand Identity"],
    portfolioLink: "https://linktr.ee/tywardaddy",
    outro: [
      "⭐️⭐️⭐️⭐️⭐️",
      "Feel free to reach out for more information or inquiries, I’ll be looking forward to work with you on your next exciting project. ✉️ Good to have you here.",
    ],
  },
  testimonials: [
    { project: "Crethy Mobile App", date: "16th October 2020", rating: 5, body: "Great Work. Nicely executed." },
    {
      project: "Project Title - Figma Expert & UI/UX Designer Needed. If job title gets too long we can break into two lines",
      date: "16th October 2020",
      rating: 5,
      body: "\"I always struggle to find designers, Usually they don't have the skill, sometimes it's hard to communicate with them. Omotayo is extremely talented, reliable and self driven. I've hired over 100 people. Omotayo is the real deal, and if you are considering him, I suggest you hire him before I hire him on our next project! We've worked together across three launches now and every handoff has been clean, documented and on time.\"",
    },
    {
      project: "Rethinkable Social Network",
      date: "16th October 2020",
      rating: 5,
      body: "\"I am thrilled to provide a glowing testimonial for Omotayo, a hardworking, reliable, and trustworthy UI/UX Designer. Their expertise in web and mobile app design, coupled with their exceptional skills in using Figma, has resulted in the creation of a full mobile and desktop application that our users absolutely love. Omotayo interpreted my designs and ideas better than I could have described them, and pushed back where it made the product better.\"",
    },
    { project: "CanWork", date: "16th October 2020", rating: 5 },
  ],
  portfolio: [
    { title: "Roboshard", image: "/images/portfolio/roboshard.png", href: "#", focus: "50% 29.7%" },
    { title: "Blockonnect", image: "/images/portfolio/blockonnect.png", href: "#" },
    { title: "Metamortals", image: "/images/portfolio/metamortals.png", href: "#" },
    { title: "CanWork", image: "/images/portfolio/canwork.png", href: "#" },
  ],
  workHistory: [
    {
      role: "Product Designer",
      company: "CanWork",
      logo: { src: "/images/companies/canwork.svg", width: 35.53, height: 40 },
      dates: "January 2020 - January 2023",
      location: "Brisbane, Australia",
      highlights: [
        "Lead designer for companies , creating visually appealing and functional web applications, mobile applications, and design systems",
        "Lead stakeholder meetings to establish user needs in a way that alights with the business goals and objective as well as defining success metrics for each release.",
        "Built and maintained the CanWork design system across web and mobile.",
      ],
    },
    {
      role: "UI/UX Designer",
      company: "Rethinkable",
      logo: { src: "/images/companies/rethinkable.png", width: 47.02, height: 48 },
      dates: "1st Jan. 2020 - 12th Jan. 2023",
      location: "Sydney, Australia",
      highlights: [
        "Lead designer for companies, creating visually appealing and functional web applications, mobile applications, and design systems",
        "Lead stakeholder meetings to establish user needs in a way that alights with the business goals and objective as well as defining success metrics for each release.",
      ],
    },
    {
      role: "Lead Designer",
      company: "StreamETH",
      logo: { src: "/images/companies/streameth.svg", width: 40.62, height: 35.85 },
      dates: "January 2011 - January 2014",
      location: "Sydney, Australia",
      highlights: [
        "Lead designer for companies, creating visually appealing and functional web applications, mobile applications, and design systems",
        "Lead stakeholder meetings to establish user needs in a way that alights with the business goals and objective as well as defining success metrics for each release.",
      ],
    },
  ],
};

const everyone: Freelancer[] = [...featuredFreelancers, ...searchResults];

/** Every freelancer id that has a profile page. */
export const profileIds = everyone.map((f) => f.id);

export function getFreelancerProfile(id: string): FreelancerProfile | null {
  const freelancer = everyone.find((f) => f.id === id);
  return freelancer ? { ...freelancer, ...DETAILS } : null;
}

export { profileHref } from "./freelancers";
