import type { FileText } from "lucide-react";

export type ToolSelection = "narrative" | "responseLetter" | "both" | null;

export interface SelectionOption {
  id: ToolSelection;
  title: string;
  description: string;
  detail: string;
  icon: typeof FileText;
  accentColor: string;
  number: string;
}
