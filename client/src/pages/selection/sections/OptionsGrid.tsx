import { useState, useRef } from "react";
import { Check } from "lucide-react";
import type { ToolSelection, SelectionOption } from "../types/selection.types";

interface OptionsGridProps {
  options: SelectionOption[];
  selected: ToolSelection;
  onSelect: (optionId: ToolSelection) => void;
  onFirstSelection?: () => void;
}

export default function OptionsGrid({
  options,
  selected,
  onSelect,
  onFirstSelection,
}: OptionsGridProps) {
  // Internal state - no longer props
  const [hoveredCard, setHoveredCard] = useState<ToolSelection>(null);
  const hasCalledFirstSelection = useRef(false);

  // Internal keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent, optionId: ToolSelection) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelection(optionId);
    }
  };

  // Internal selection handler that calls parent + first-selection callback
  const handleSelection = (optionId: ToolSelection) => {
    onSelect(optionId);  // Always notify parent

    // Call onFirstSelection only once
    if (!hasCalledFirstSelection.current && onFirstSelection) {
      onFirstSelection();
      hasCalledFirstSelection.current = true;
    }
  };

  // Internal hover handlers
  const handleHoverEnter = (optionId: ToolSelection) => setHoveredCard(optionId);
  const handleHoverLeave = () => setHoveredCard(null);

  return (
    <div
      role="radiogroup"
      aria-label="Select document type"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-16"
    >
      {options.map((option, index) => {
        const isSelected = selected === option.id;
        const isHovered = hoveredCard === option.id;
        const Icon = option.icon;
        const isTeal = option.accentColor === "teal";
        const isOrange = option.accentColor === "orange";
        const isPurple = option.accentColor === "purple";

        // Get color values
        const getBorderColor = () => {
          if (isTeal) return 'rgb(20 184 166)';
          if (isOrange) return 'rgb(249 115 22)';
          if (isPurple) return 'rgb(139 92 246)';
        };

        const getRingColor = () => {
          if (isTeal) return 'focus-visible:ring-teal-500';
          if (isOrange) return 'focus-visible:ring-orange-500';
          if (isPurple) return 'focus-visible:ring-purple-500';
        };

        const getGradientBg = () => {
          if (isTeal) return 'bg-gradient-to-br from-teal-50/80 via-teal-50/40 to-transparent dark:from-teal-950/30 dark:via-teal-950/15 dark:to-transparent';
          if (isOrange) return 'bg-gradient-to-br from-orange-50/80 via-orange-50/40 to-transparent dark:from-orange-950/30 dark:via-orange-950/15 dark:to-transparent';
          if (isPurple) return 'bg-gradient-to-br from-purple-50/80 via-purple-50/40 to-transparent dark:from-purple-950/30 dark:via-purple-950/15 dark:to-transparent';
        };

        const getTextColor = () => {
          if (isTeal) return 'text-teal-500/30';
          if (isOrange) return 'text-orange-500/30';
          if (isPurple) return 'text-purple-500/30';
        };

        const getBgColor = () => {
          if (isTeal) return 'bg-teal-500';
          if (isOrange) return 'bg-orange-500';
          if (isPurple) return 'bg-purple-500';
        };

        const getIconGradient = () => {
          if (isTeal) return 'bg-gradient-to-br from-teal-500 to-teal-600';
          if (isOrange) return 'bg-gradient-to-br from-orange-500 to-orange-600';
          if (isPurple) return 'bg-gradient-to-br from-purple-500 to-purple-600';
        };

        const getAccentBarColor = () => {
          if (isTeal) return 'bg-teal-500';
          if (isOrange) return 'bg-orange-500';
          if (isPurple) return 'bg-purple-500';
        };

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelection(option.id)}
            onKeyDown={(e) => handleKeyDown(e, option.id)}
            onMouseEnter={() => handleHoverEnter(option.id)}
            onMouseLeave={handleHoverLeave}
            className={`
              group relative text-left rounded-3xl p-8 md:p-10 transition-all duration-500 ease-out
              bg-white dark:bg-slate-800 overflow-hidden
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              opacity-0 animate-fade-in-up stagger-${index + 1}
              ${isSelected
                ? `shadow-2xl scale-105 -translate-y-2 ${getRingColor()}`
                : "shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-102 focus-visible:ring-teal-500"
              }
            `}
            data-testid={`option-${option.id}`}
            style={{
              borderTop: isSelected
                ? `6px solid ${getBorderColor()}`
                : '6px solid transparent',
            }}
          >
            {/* Background gradient overlay */}
            <div
              className={`
                absolute inset-0 transition-opacity duration-500
                ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                ${getGradientBg()}
              `}
              aria-hidden="true"
            />

            {/* Decorative number */}
            <div className="relative z-10 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className={`
                  text-7xl md:text-8xl font-black leading-none tracking-tighter transition-all duration-500
                  ${isSelected || isHovered
                    ? getTextColor()
                    : 'text-slate-200 dark:text-slate-700'
                  }
                `}
                  style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                >
                  {option.number}
                </div>

                {/* Selection indicator */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  transition-all duration-500 ease-out
                  ${isSelected
                    ? `${getBgColor()} scale-110 shadow-lg`
                    : 'bg-slate-100 dark:bg-slate-700 group-hover:scale-105 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                  }
                `}>
                  {isSelected && (
                    <Check className="w-6 h-6 text-white animate-in zoom-in duration-200" aria-hidden="true" />
                  )}
                </div>
              </div>

              {/* Icon */}
              <div className={`
                inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                transition-all duration-500 shadow-md
                ${isSelected || isHovered
                  ? `${getIconGradient()} scale-110 rotate-3 shadow-xl`
                  : 'bg-slate-100 dark:bg-slate-700 group-hover:scale-105 group-hover:rotate-2'
                }
              `}>
                <Icon className={`
                  w-8 h-8 transition-colors duration-500
                  ${isSelected || isHovered
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-300'
                  }
                `} aria-hidden="true" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h2
                  className="text-2xl md:text-3xl font-bold text-foreground leading-tight"
                  style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                >
                  {option.title}
                </h2>
                <p className="text-base text-foreground/80 leading-relaxed font-medium">
                  {option.description}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {option.detail}
                </p>
              </div>
            </div>

            {/* Accent bar at bottom */}
            <div
              className={`
                absolute bottom-0 left-0 right-0 h-1 transition-all duration-500
                ${isSelected
                  ? `${getAccentBarColor()} opacity-100`
                  : 'bg-slate-200 dark:bg-slate-700 opacity-0 group-hover:opacity-100'
                }
              `}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
