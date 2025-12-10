import { cn } from "@/lib/utils";

interface TypeChipsProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  offenseId?: string;
}

/**
 * Chip-style radio group for selecting offense type (Felony/Misdemeanor)
 * Implements ARIA radio group pattern for accessibility
 */
export function TypeChips({
  value,
  onChange,
  error = false,
  offenseId,
}: TypeChipsProps) {
  const options = [
    { value: "felony", label: "Felony" },
    { value: "misdemeanor", label: "Misdemeanor" },
  ];

  return (
    <div
      role="radiogroup"
      aria-labelledby={offenseId ? `offense-type-label-${offenseId}` : undefined}
      className="flex gap-2"
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors min-h-[44px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isSelected
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-background border-border text-foreground hover:border-primary/50 hover:bg-primary/5",
              error && "border-destructive/50"
            )}
            tabIndex={isSelected ? 0 : -1}
            data-testid={`type-chip-${option.value}`}
            aria-label={option.label}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
