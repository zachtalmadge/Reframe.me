import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChipInputProps {
  chips: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
  maxChips?: number;
  className?: string;
  inputClassName?: string;
  id?: string;
  "data-testid"?: string;
}

export function ChipInput({
  chips,
  onAdd,
  onRemove,
  placeholder = "Type and press Enter to add",
  maxChips,
  className,
  inputClassName,
  id,
  "data-testid": testId,
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      
      if (!trimmedValue) return;
      if (chips.includes(trimmedValue)) return;
      if (maxChips && chips.length >= maxChips) return;

      onAdd(trimmedValue);
      setInputValue("");
    }

    if (e.key === "Backspace" && !inputValue && chips.length > 0) {
      onRemove(chips.length - 1);
    }
  };

  const isMaxReached = maxChips !== undefined && chips.length >= maxChips;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2" role="list" aria-label="Added items">
        {chips.map((chip, index) => (
          <Badge
            key={`${chip}-${index}`}
            variant="secondary"
            className="pl-3 pr-1 py-1 gap-1"
            data-testid={testId ? `${testId}-chip-${index}` : `chip-${index}`}
          >
            <span className="truncate max-w-[200px]">{chip}</span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
              aria-label={`Remove ${chip}`}
              data-testid={testId ? `${testId}-remove-${index}` : `remove-chip-${index}`}
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </button>
          </Badge>
        ))}
      </div>
      
      <Input
        id={id}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isMaxReached ? `Maximum ${maxChips} items reached` : placeholder}
        disabled={isMaxReached}
        className={inputClassName}
        data-testid={testId ? `${testId}-input` : "chip-input"}
        aria-describedby={isMaxReached ? "chip-limit-reached" : undefined}
      />
      
      {isMaxReached && (
        <p id="chip-limit-reached" className="sr-only">
          Maximum number of items reached
        </p>
      )}
    </div>
  );
}
