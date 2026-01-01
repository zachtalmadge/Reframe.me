import type { HowItWorksStep, Story, BeforeAfterPair } from "../types/home.types";

// How It Works section data
export const howItWorksSteps: HowItWorksStep[] = [
  {
    title: "Share your situation",
    description:
      "Answer a few questions about your background and the job you're applying for.",
  },
  {
    title: "We help reframe your story",
    description:
      "Our tool turns your answers into clear, employer-ready language.",
  },
  {
    title: "Leave with talking points & documents",
    description:
      "You'll get narratives and a response letter you can reuse and refine.",
  },
];

// Testimonials section data
export const stories: Story[] = [
  {
    role: "Job seeker, retail",
    quote:
      "I used to panic when employers asked about my record. Now I have three honest ways to respond.",
  },
  {
    role: "First-time applicant after reentry",
    quote: "I turned a terrifying letter into a clear, professional response.",
  },
  {
    role: "Job seeker, tech support",
    quote: "For the first time, I feel ready to explain my past and my growth.",
  },
  {
    role: "Retail candidate",
    quote:
      "Having words prepared made the difference between freezing up and feeling confident.",
  },
];

// Hero section before/after pairs
export const beforeAfterPairs: BeforeAfterPair[] = [
  {
    before: "I just got a conditional offer and I'm worried about the background check.",
    after: "Now I have language ready for if my record comes up in the hiring process.",
  },
  {
    before: "I'm worried my past will cost me the job once they see my background.",
    after: "I can explain what happened, what's changed, and the skills I bring today.",
  },
  {
    before: "I'm not sure how to respond to a pre-adverse action notice.",
    after: "I have a clear, structured response letter in my own voice.",
  },
  {
    before: "I feel like I'm facing this process alone.",
    after: "I have talking points I can practice and share with someone I trust.",
  },
];

// Hero animation timing constants
export const BEFORE_DELAY = 200;
export const AFTER_DELAY = 800;
export const VISIBLE_DURATION = 8000;  // ~8 seconds with both visible
export const GAP_DURATION = 1000;
