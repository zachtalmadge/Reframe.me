import { Share2, MessageSquare, Briefcase } from "lucide-react";
import { FaqItem, TransparencyItem, OtherWayItem } from "./donate.types";

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do you sell or share my information?",
    answer:
      "No. Donations don't change how your data is handled. The goal is to keep this tool as safe and respectful as possible for people with records.",
  },
  {
    question: "Can organizations support this?",
    answer:
      "Yes. Re-entry programs, legal clinics, or employers who want to sponsor usage or collaborate can reach out for partnership options.",
  },
];

export const TRANSPARENCY_ITEMS: TransparencyItem[] = [
  {
    title: "AI and infrastructure costs",
    desc: "LLM subscription and tokens for generating narratives and letters, plus hosting and basic infrastructure.",
    color: "teal",
  },
  {
    title: "Ongoing development",
    desc: "Time spent improving prompts, fixing bugs, polishing the UI, and responding to feedback from people using the tool in real hiring situations.",
    color: "orange",
  },
  {
    title: "Creator time & sustainability",
    desc: "A portion supports my time working on Reframe.me so this project can keep going instead of burning out.",
    color: "purple",
  },
];

export const OTHER_WAYS_ITEMS: OtherWayItem[] = [
  {
    icon: Share2,
    text: "Share Reframe.me with a re-entry coach, legal aid group, or workforce program.",
    color: "teal",
  },
  {
    icon: MessageSquare,
    text: "Send feedback about what's confusing or what would make this more helpful.",
    color: "orange",
  },
  {
    icon: Briefcase,
    text: "If you work in hiring, consider how fair-chance practices and tools like this can be part of your process.",
    color: "purple",
  },
];
