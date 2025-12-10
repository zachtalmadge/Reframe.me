import { cn } from "@/lib/utils";

/**
 * Display clickable suggestion chips for form inputs
 * @param {Object} props
 * @param {string[]} props.suggestions - Array of suggestion strings (already filtered by parent)
 * @param {Function} props.onSelect - Callback when a suggestion is clicked: (value: string) => void
 * @param {string[]} props.selectedValues - Array of already-added values (for visual styling)
 * @param {string} props.label - Label text to display above chips
 * @param {string} props.className - Additional CSS classes
 */
export function SuggestionChips({
  suggestions,
  onSelect,
  selectedValues = [],
  label = "Suggestions",
  className = "",
}) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className={cn("mt-2", className)}>
        <p className="text-xs text-muted-foreground italic">
          No matching suggestions. You can still type anything you'd like.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2 mt-2", className)}>
      <p className="text-xs font-medium text-muted-foreground">
        {label}
        {suggestions.length < 20 && ` (${suggestions.length})`}
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item) => {
          const isSelected = selectedValues.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => !isSelected && onSelect(item)}
              disabled={isSelected}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-colors min-h-[36px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                isSelected
                  ? "bg-muted border-muted-foreground/30 text-muted-foreground cursor-default opacity-60"
                  : "bg-background border-border text-foreground hover:border-primary hover:bg-primary/5 active:bg-primary/10"
              )}
              aria-label={isSelected ? `${item} (already added)` : `Add ${item}`}
              aria-pressed={isSelected}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
