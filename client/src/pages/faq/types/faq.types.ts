import { LucideIcon } from "lucide-react";

/**
 * FAQ category labels
 */
export const FAQ_CATEGORIES = {
  YOUR_STORY: "Your Story",
  LETTERS_RESPONSES: "Letters & Responses",
  DISCLOSURE_TIMING: "Disclosure Timing",
  YOUR_RIGHTS: "Your Rights",
  EFFECTIVENESS: "Effectiveness",
  PRIVACY_SECURITY: "Privacy & Security",
  EXPECTATIONS: "Expectations",
  LEGAL_DISCLAIMER: "Legal Disclaimer",
  ABOUT_TOOL: "About This Tool",
  LEGAL_USE: "Legal Use",
  USAGE_TIPS: "Usage Tips",
} as const;

export type FaqCategory = typeof FAQ_CATEGORIES[keyof typeof FAQ_CATEGORIES];

/**
 * Individual FAQ item structure
 */
export interface FaqItem {
  id: string;
  question: string;
  icon: LucideIcon;
  category: FaqCategory;
  answer: React.ReactNode;
}

/**
 * Disclaimer text constants
 */
export const DISCLAIMER_TEXT = {
  NOT_LEGAL_ADVICE: "This is not legal advice.",
  CONSULT_ATTORNEY: "When possible, consult with a qualified attorney or legal aid organization about your specific circumstances.",
  NO_GUARANTEES: "We cannot guarantee hiring outcomes—every situation is unique, and employment laws vary by location and industry.",
  NOT_LAW_FIRM: "Reframe.me is not a law firm and does not provide legal advice.",
  EDUCATIONAL_ONLY: "The information here is for educational purposes only.",
  GENERAL_GUIDANCE: "This is general guidance, not legal advice",
  CONSULT_LEGAL_PROFESSIONAL: "consult with a legal professional if you have specific questions",
  EMPLOYMENT_LAWS_VARY: "employment laws vary by location and industry",
  RESULTS_VARY: "Results vary, and we make no guarantees.",
  SEEK_ATTORNEY: "If you have legal questions, seek help from a qualified attorney.",
} as const;
