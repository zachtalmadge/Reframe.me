import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Mail, ArrowRight, Files, Check } from "lucide-react";
import BackToHomeRow from "./selection/sections/BackToHomeRow";
import BottomTagline from "./selection/sections/BottomTagline";
import SelectionHero from "./selection/sections/SelectionHero";
import PrivacyNotice from "./selection/sections/PrivacyNotice";
import ContinueCTA from "./selection/sections/ContinueCTA";
import QuickAnswersAccordion from "./selection/sections/QuickAnswersAccordion";

type ToolSelection = "narrative" | "responseLetter" | "both" | null;

interface SelectionOption {
  id: ToolSelection;
  title: string;
  description: string;
  detail: string;
  icon: typeof FileText;
  accentColor: string;
  number: string;
}

const options: SelectionOption[] = [
  {
    id: "narrative",
    title: "Disclosure Narratives",
    description: "Five personalized approaches to discuss your background with confidence and clarity.",
    detail: "Perfect for after you recieve an offer with potential employers",
    icon: FileText,
    accentColor: "teal",
    number: "01",
  },
  {
    id: "responseLetter",
    title: "Response Letter",
    description: "A professional response to pre-adverse action notices that highlights your growth.",
    detail: "Addresses background check concerns while showcasing your transformation",
    icon: Mail,
    accentColor: "orange",
    number: "02",
  },
  {
    id: "both",
    title: "Complete Package",
    description: "Everything you need to navigate the employment process with full preparation.",
    detail: "Both narratives and response letter for comprehensive readiness",
    icon: Files,
    accentColor: "purple",
    number: "03",
  },
];

export default function Selection() {
  const [selected, setSelected] = useState<ToolSelection>(null);
  const [hasMadeSelection, setHasMadeSelection] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string>("");
  const [hoveredCard, setHoveredCard] = useState<ToolSelection>(null);
  const [, navigate] = useLocation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContinue = () => {
    if (selected) {
      window.scrollTo(0, 0);
      navigate(`/form?tool=${selected}`);
    }
  };

  const handleSelect = (optionId: ToolSelection) => {
    setSelected(optionId);
    if (!hasMadeSelection) {
      setHasMadeSelection(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionId: ToolSelection) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(optionId);
    }
  };

  return (
    <>
      {/* Page-specific Selection animation utilities */}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.7s ease-out forwards;
        }

        .stagger-1 { animation-delay: 0.3s; }
        .stagger-2 { animation-delay: 0.5s; }
        .stagger-3 { animation-delay: 0.7s; }
        .stagger-4 { animation-delay: 0.9s; }
      `}</style>

      <section
        className="min-h-screen py-8 md:py-16 px-4 sm:px-6 lg:px-8 dot-pattern dark:dot-pattern-dark relative overflow-hidden"
        aria-labelledby="selection-heading"
      >
        {/* Paper texture overlay */}
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Subtle decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Back Button */}
          <BackToHomeRow />

          {/* Hero Section - Editorial Style */}
          <div className="mb-16 md:mb-24">
            <SelectionHero />

            {/* Quick Answers - Refined Design */}
            <QuickAnswersAccordion
              accordionValue={accordionValue}
              onAccordionChange={setAccordionValue}
            />
          </div>

          {/* Options Grid - Editorial Magazine Style */}
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
                  onClick={() => handleSelect(option.id)}
                  onKeyDown={(e) => handleKeyDown(e, option.id)}
                  onMouseEnter={() => setHoveredCard(option.id)}
                  onMouseLeave={() => setHoveredCard(null)}
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

          {/* CTA Section - Editorial Style */}
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Continue Button */}
            <ContinueCTA selected={selected} onContinue={handleContinue} />

            {/* Privacy Notice - Refined */}
            <PrivacyNotice hasMadeSelection={hasMadeSelection} />

            {/* Bottom tagline */}
            <BottomTagline />
          </div>

        </div>
      </section>
    </>
  );
}
