import { FaqCategory } from "../types/faq.types";

interface CategoryBadgeProps {
  category: FaqCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-br from-teal-50 via-teal-50/80 to-cyan-50 border border-teal-200/60 shadow-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-sm" aria-hidden="true" />
      <span className="text-sm font-medium text-teal-700 tracking-wide">
        {category}
      </span>
    </div>
  );
}
