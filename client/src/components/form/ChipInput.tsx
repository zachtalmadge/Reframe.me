import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChipInputProps {
  chips: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
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
  onInputChange,
  placeholder = "Type and press Enter to add",
  helperText = "Type an item and press Enter or tap 'Add' to save it.",
  maxChips,
  className,
  inputClassName,
  id,
  "data-testid": testId,
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("");

  const isMaxReached = maxChips !== undefined && chips.length >= maxChips;
  const canAdd = inputValue.trim().length > 0 && !isMaxReached;

  const handleAdd = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) return;
    if (chips.includes(trimmedValue)) return;
    if (maxChips && chips.length >= maxChips) return;

    onAdd(trimmedValue);
    setInputValue("");
    onInputChange?.("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }

    if (e.key === "Backspace" && !inputValue && chips.length > 0) {
      onRemove(chips.length - 1);
    }
  };

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
      
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onInputChange?.(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={isMaxReached ? `Maximum ${maxChips} items reached` : placeholder}
          disabled={isMaxReached}
          className={cn("pr-20", inputClassName)}
          data-testid={testId ? `${testId}-input` : "chip-input"}
          aria-describedby={`${id}-helper`}
        />
        <div className="absolute inset-y-0 right-1 flex items-center">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={cn(
              "h-7 px-2 text-xs font-medium rounded-md transition-colors flex items-center",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1",
              canAdd
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-purple-500/40 text-white/70 cursor-not-allowed"
            )}
            aria-label="Add item"
            data-testid={testId ? `${testId}-add-button` : "chip-add-button"}
          >
            <Plus className="w-3 h-3 mr-1" aria-hidden="true" />
            Add
          </button>
        </div>
      </div>
      
      <p 
        id={`${id}-helper`}
        className="text-xs text-muted-foreground"
      >
        {isMaxReached ? `Maximum ${maxChips} items reached.` : helperText}
      </p>
    </div>
  );
}
