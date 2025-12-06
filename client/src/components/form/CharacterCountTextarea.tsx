import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CharacterCountTextareaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  className?: string;
  id?: string;
  rows?: number;
  "data-testid"?: string;
}

export function CharacterCountTextarea({
  value,
  onChange,
  maxLength,
  placeholder,
  className,
  id,
  rows = 4,
  "data-testid": testId,
}: CharacterCountTextareaProps) {
  // Ensure value is always a string to prevent "Cannot read properties of undefined" errors
  const safeValue = value ?? "";
  const remainingChars = maxLength - safeValue.length;
  const isNearLimit = remainingChars <= 50;
  const isOverLimit = remainingChars < 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Textarea
        id={id}
        value={safeValue}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          isOverLimit && "border-destructive focus-visible:ring-destructive"
        )}
        aria-describedby={`${id || "textarea"}-counter`}
        data-testid={testId || "character-count-textarea"}
      />
      <div
        id={`${id || "textarea"}-counter`}
        className={cn(
          "text-sm text-right",
          isOverLimit
            ? "text-destructive font-medium"
            : isNearLimit
            ? "text-amber-600 dark:text-amber-400"
            : "text-muted-foreground"
        )}
        aria-live="polite"
        data-testid={testId ? `${testId}-counter` : "character-counter"}
      >
        {safeValue.length}/{maxLength} characters
      </div>
    </div>
  );
}
