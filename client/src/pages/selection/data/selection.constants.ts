import { FileText, Mail, Files } from "lucide-react";
import type { SelectionOption } from "../types/selection.types";

export const options: SelectionOption[] = [
  {
    id: "narrative",
    title: "Disclosure Narratives",
    description: "Five personalized approaches to discuss your background with confidence and clarity.",
    detail: "Perfect for after you recieve an offer with potential employers",
    icon: FileText,
    accentColor: "teal",
    number: "01",
  },
  {
    id: "responseLetter",
    title: "Response Letter",
    description: "A professional response to pre-adverse action notices that highlights your growth.",
    detail: "Addresses background check concerns while showcasing your transformation",
    icon: Mail,
    accentColor: "orange",
    number: "02",
  },
  {
    id: "both",
    title: "Complete Package",
    description: "Everything you need to navigate the employment process with full preparation.",
    detail: "Both narratives and response letter for comprehensive readiness",
    icon: Files,
    accentColor: "purple",
    number: "03",
  },
];
