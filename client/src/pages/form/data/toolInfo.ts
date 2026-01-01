import { FileText, Mail, Files } from "lucide-react";
import { ToolType } from "@/lib/formState";

export const toolInfo: Record<
  ToolType,
  { title: string; description: string; icon: typeof FileText }
> = {
  narrative: {
    title: "Disclosure Narratives",
    description: "You're creating five personalized disclosure narratives.",
    icon: FileText,
  },
  responseLetter: {
    title: "Response Letter",
    description: "You're creating a pre-adverse action response letter.",
    icon: Mail,
  },
  both: {
    title: "Both Documents",
    description: "You're creating disclosure narratives and a response letter.",
    icon: Files,
  },
};
