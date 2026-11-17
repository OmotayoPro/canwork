import type { Freelancer } from "./freelancers";

/** A freelancer as returned by search — the card fields plus what the filters need. */
export type SearchResult = Freelancer & {
  city: string;
  country: string;
  hourlyRate: number;
  skills: string[];
  verifications: Verification[];
};

export const VERIFICATIONS = ["ID Verified", "Gitcoin Passport", "Galxe ID", "Blockchain Verified"] as const;
export type Verification = (typeof VERIFICATIONS)[number];

export const RATE_RANGES = [
  { id: "0-50", label: "$0 - $50", min: 0, max: 50 },
  { id: "50-100", label: "$50 - $100", min: 50, max: 100 },
  { id: "100-150", label: "$100 - $150", min: 100, max: 150 },
  { id: "200-250", label: "$200 - $250", min: 200, max: 250 },
  { id: "250-500", label: "$250 - $500", min: 250, max: 500 },
  { id: "500-1000", label: "$500 - $1000", min: 500, max: 1000 },
  { id: "2000+", label: "$2000>", min: 2000, max: Infinity },
] as const;

export const SKILLS = [
  "Web Design",
  "UI/UX Design",
  "User Research",
  "Journey Maps",
  "Angular",
  "NodeJs",
  "Content Writer",
  "Digital Marketing",
  "Power Point Presentation",
  "VueJs",
  "Front End",
  "JavaScript",
  "React",
  "Solidity",
  "Software Development",
  "Copywriting",
  "Graphic Design",
  "Smart Contracts",
  "Product Design",
  "Data Entry",
];

const PLACES: { city: string; country: string }[] = [
  { city: "Lagos", country: "Nigeria" },
  { city: "Lagos", country: "Nigeria" },
  { city: "New York", country: "United States" },
  { city: "San Francisco", country: "United States" },
  { city: "Amsterdam", country: "Netherlands" },
  { city: "Berlin", country: "Germany" },
  { city: "Sydney", country: "Australia" },
  { city: "Abuja", country: "Nigeria" },
  { city: "London", country: "United Kingdom" },
  { city: "Toronto", country: "Canada" },
  { city: "Rotterdam", country: "Netherlands" },
  { city: "Munich", country: "Germany" },
];

/** Every city and country in the data set, for the location filter's suggestions. */
export const LOCATIONS = [...new Set(PLACES.flatMap((p) => [p.country, p.city]))].sort();

// The twelve profiles shown in the Figma results grid, in order.
const PROFILES: Pick<Freelancer, "name" | "title" | "avatar" | "accent" | "rating">[] = [
  { name: "Omotayo WarDaddy", title: "Product Designer & Digital Illustrator", avatar: "/images/freelancers/pfp-7.png", accent: "teal", rating: 5 },
  { name: "Omotayo WarDaddy", title: "Product Designer & Digital Illustrator", avatar: "/images/freelancers/pfp-7.png", accent: "yellow", rating: 5 },
  { name: "Omotayo WarDaddy", title: "Product Designer & Digital Illustrator", avatar: "/images/freelancers/pfp-7.png", accent: "blue", rating: 5 },
  { name: "Albert Flores", title: "President of Sales", avatar: "/images/freelancers/pfp-2.png", accent: "teal", rating: 5 },
  { name: "Eleanor Pena", title: "Dog Trainer", avatar: "/images/freelancers/pfp-3.png", accent: "cyan", rating: 5 },
  { name: "Devon Lane", title: "Nursing Assistant", avatar: "/images/freelancers/pfp-1.png", accent: "yellow", rating: 5 },
  { name: "Kathryn Murphy", title: "Web Designer", avatar: "/images/freelancers/pfp-8.png", accent: "cyan", rating: 5 },
  { name: "Esther Howard", title: "Marketing Coordinator", avatar: "/images/freelancers/pfp-9.png", accent: "yellow", rating: 5 },
  { name: "Ralph Edwards", title: "Medical Assistant", avatar: "/images/freelancers/pfp-10.png", accent: "teal", rating: 4 },
  { name: "Annette Black", title: "Marketing Coordinator", avatar: "/images/freelancers/pfp-11.png", accent: "teal", rating: 5 },
  { name: "Devon Lane", title: "President of Sales", avatar: "/images/freelancers/pfp-12.png", accent: "cyan", rating: 4 },
  { name: "Dianne Russell", title: "Web Designer", avatar: "/images/freelancers/pfp-2.png", accent: "yellow", rating: 5 },
];

const RATES = [25, 50, 50, 75, 120, 220, 300, 650, 2500];

/** Small deterministic PRNG so the mock data is stable between server and client renders. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function pickSome<T>(pool: readonly T[], count: number, rand: () => number) {
  const copy = [...pool];
  const out: T[] = [];
  while (out.length < count && copy.length) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  return out;
}

// Placeholder data until the search API is wired up. 201 results, as in the design.
export const searchResults: SearchResult[] = Array.from({ length: 201 }, (_, i) => {
  const rand = seeded(i + 1);
  const profile = PROFILES[i % PROFILES.length];
  const place = PLACES[i % PLACES.length];
  const hourlyRate = i < PROFILES.length ? 50 : RATES[Math.floor(rand() * RATES.length)];
  const skills = pickSome(SKILLS, 4 + Math.floor(rand() * 4), rand);
  return {
    ...profile,
    id: `r${i + 1}`,
    jobs: i < PROFILES.length ? 24 : 3 + Math.floor(rand() * 60),
    city: place.city,
    country: place.country,
    location: `${place.city} | ${place.country}`,
    hourlyRate,
    rate: `$${hourlyRate}/hr`,
    skills,
    topSkill: skills[0],
    otherSkills: skills.length - 1,
    verifications: pickSome(VERIFICATIONS, 1 + Math.floor(rand() * 3), rand),
  };
});

export type SearchFilters = {
  verifications: Verification[];
  locations: string[];
  rates: string[];
  skills: string[];
  ratings: number[];
};

export const EMPTY_FILTERS: SearchFilters = { verifications: [], locations: [], rates: [], skills: [], ratings: [] };

const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Loose text match: the whole query (ignoring spaces and punctuation, so "Java Script"
 * finds "JavaScript"), or any word of 3+ letters, appearing in the name, title, skills or location.
 */
function matchesQuery(r: SearchResult, q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const haystack = [r.name, r.title, r.city, r.country, ...r.skills].join(" ").toLowerCase();
  if (squash(haystack).includes(squash(query))) return true;
  return query.split(/\s+/).some((word) => word.length >= 3 && haystack.includes(word));
}

/** Filters combine with AND across groups and OR within a group. */
export function filterResults(results: SearchResult[], q: string, f: SearchFilters) {
  const ranges = RATE_RANGES.filter((r) => f.rates.includes(r.id));
  return results.filter(
    (r) =>
      matchesQuery(r, q) &&
      (!f.verifications.length || f.verifications.some((v) => r.verifications.includes(v))) &&
      (!f.locations.length || f.locations.some((l) => l === r.city || l === r.country)) &&
      (!ranges.length || ranges.some((range) => r.hourlyRate >= range.min && r.hourlyRate <= range.max)) &&
      (!f.skills.length || f.skills.some((s) => r.skills.includes(s))) &&
      (!f.ratings.length || f.ratings.includes(r.rating)),
  );
}
