export type Freelancer = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: 4 | 5;
  jobs: number;
  topSkill: string;
  otherSkills: number;
  location: string;
  rate: string;
  accent: "yellow" | "teal" | "cyan" | "blue";
};

// Placeholder content from the Figma file until the API is wired up.
export const featuredFreelancers: Freelancer[] = [
  { id: "1", name: "Devon Lane", title: "Nursing Assistant", avatar: "/images/freelancers/pfp-1.png", rating: 5, jobs: 24, topSkill: "One Skill", otherSkills: 6, location: "Lagos | Nigeria", rate: "$50/hr", accent: "yellow" },
  { id: "2", name: "Albert Flores", title: "President of Sales", avatar: "/images/freelancers/pfp-2.png", rating: 4, jobs: 24, topSkill: "One Skill", otherSkills: 6, location: "Lagos | Nigeria", rate: "$50/hr", accent: "teal" },
  { id: "3", name: "Eleanor Pena", title: "Dog Trainer", avatar: "/images/freelancers/pfp-3.png", rating: 5, jobs: 24, topSkill: "One Skill", otherSkills: 6, location: "Lagos | Nigeria", rate: "$50/hr", accent: "cyan" },
  { id: "4", name: "Omotayo WarDaddy", title: "Product Designer & Digital Illustrator", avatar: "/images/freelancers/pfp-4.png", rating: 5, jobs: 24, topSkill: "One Skill", otherSkills: 6, location: "Lagos | Nigeria", rate: "$50/hr", accent: "yellow" },
  { id: "5", name: "Bessie Cooper", title: "President of Sales", avatar: "/images/freelancers/pfp-5.png", rating: 5, jobs: 24, topSkill: "One Skill", otherSkills: 6, location: "Lagos | Nigeria", rate: "$50/hr", accent: "teal" },
  { id: "6", name: "Kathryn Murphy", title: "Web Designer", avatar: "/images/freelancers/pfp-6.png", rating: 5, jobs: 24, topSkill: "One Skill", otherSkills: 6, location: "Lagos | Nigeria", rate: "$50/hr", accent: "cyan" },
];
