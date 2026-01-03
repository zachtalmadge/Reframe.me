import { LucideIcon } from "lucide-react";

/**
 * Content block types for flexible article content rendering
 */

export type ContentBlock =
  | ParagraphBlock
  | SubsectionBlock
  | CalloutBlock
  | ListBlock
  | GridBlock;

export interface ParagraphBlock {
  type: "paragraph";
  text: string;
  className?: string;
}

export interface SubsectionBlock {
  type: "subsection";
  heading: string;
  bulletColor?: string;
  content: ContentBlock[];
  hasDivider?: boolean;
}

export interface CalloutBlock {
  type: "callout";
  variant: "info" | "warning" | "success";
  title?: string;
  content: string;
  link?: {
    text: string;
    url: string;
  };
  items?: string[];
}

export interface ListBlock {
  type: "list";
  variant: "bullet" | "numbered" | "arrow";
  items: string[];
}

export interface GridBlock {
  type: "grid";
  columns: GridColumn[];
}

export interface GridColumn {
  heading: string;
  headingColor: string;
  bgGradient: string;
  borderColor: string;
  icon: string;
  iconColor: string;
  items: string[];
}

/**
 * Article section configuration
 */
export interface ArticleSection {
  id: string;
  sectionNumber: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  heading: string;
  content: ContentBlock[];
}

/**
 * Final statement configuration
 */
export interface FinalStatement {
  icon: LucideIcon;
  heading: string;
  description: string;
}
