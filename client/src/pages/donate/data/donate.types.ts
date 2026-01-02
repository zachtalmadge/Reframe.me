import { LucideIcon } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TransparencyItem {
  title: string;
  desc: string;
  color: "teal" | "orange" | "purple";
}

export interface OtherWayItem {
  icon: LucideIcon;
  text: string;
  color: "teal" | "orange" | "purple";
}
