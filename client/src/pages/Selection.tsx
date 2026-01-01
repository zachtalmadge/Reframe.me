import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Mail, ArrowRight, Files, Check, Shield, MessageSquare, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BackToHomeRow from "./selection/sections/BackToHomeRow";
import BottomTagline from "./selection/sections/BottomTagline";

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
          <div className="mb-16 md:mb-24 max-w-4xl">
            <div className="flex items-start gap-4 md:gap-6 mb-6 opacity-0 animate-fade-in-up stagger-1">
              <div className="flex-shrink-0 w-1 h-16 md:h-20 bg-gradient-to-b from-teal-500 to-orange-500 rounded-full" aria-hidden="true" />
              <div>
                <div className="text-xs md:text-sm font-semibold tracking-wider text-teal-600 dark:text-teal-400 uppercase mb-3 md:mb-4">
                  Begin Your Journey
                </div>
                <h1
                  id="selection-heading"
                  className="text-4xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-foreground mb-4 md:mb-6"
                  style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                >
                  What would you
                  <br />
                  like to create<span className="text-teal-500">?</span>
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Choose the tool that aligns with your current needs. Each path is designed
                  to help you move forward with confidence and clarity.
                </p>
              </div>
            </div>

            {/* Quick Answers - Refined Design */}
            <div className="mt-10 md:mt-12 opacity-0 animate-fade-in-up stagger-2">
              <Accordion
                type="single"
                collapsible
                className="w-full"
                value={accordionValue}
                onValueChange={setAccordionValue}
              >
                <AccordionItem
                  value="quick-answers"
                  className="border-l-4 border-orange-500 rounded-r-2xl px-6 md:px-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl"
                >
                  <AccordionTrigger className="hover:no-underline py-5 group">
                    <div className="flex items-center gap-4 text-left w-full">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                        <MessageSquare className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm md:text-base font-bold text-foreground">
                          Have questions before you decide?
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                          Quick answers to help guide your choice
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-14 md:px-16 pb-6 pt-2 text-left">
                    <div className="space-y-6">
                      {/* Question 1 */}
                      <div className="space-y-2">
                        <h4 className="text-sm md:text-base font-semibold text-foreground flex items-start gap-2">
                          <span className="text-orange-600 dark:text-orange-500 flex-shrink-0">Q:</span>
                          <span>Why might I want different ways to talk about my record?</span>
                        </h4>
                        <div className="pl-5 space-y-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed text-left">
                          <p>
                            Different situations often call for different versions of your story. A quick form might only need a sentence, while a longer interview might give you space to share more context.
                          </p>
                          <p>
                            Having a few prepared versions can help you feel less caught off guard and more in control. You're not changing the facts—you're choosing how much to share and what to focus on for each moment.
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-orange-200/50 dark:border-orange-800/30" />

                      {/* Question 1b - Follow-up */}
                      <div className="space-y-2">
                        <h4 className="text-sm md:text-base font-semibold text-foreground flex items-start gap-2">
                          <span className="text-orange-600 dark:text-orange-500 flex-shrink-0">Q:</span>
                          <span>When should I use my disclosure narrative?</span>
                        </h4>
                        <div className="pl-5 space-y-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed text-left">
                          <p>
                            In most cases, it's best to wait until after you receive a job offer to discuss your record. During the interview process, focus on emphasizing your skills, experience, and what you bring to the role.
                          </p>
                          <p>
                            Once you have an offer and a background check is pending, that's typically when you'd use one of your prepared narratives to provide context about your record.
                          </p>
                          <p>
                            Having this prepared ahead of time means you won't be caught off guard trying to find the right words in a stressful moment.
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-orange-200/50 dark:border-orange-800/30" />

                      {/* Question 2 */}
                      <div className="space-y-2">
                        <h4 className="text-sm md:text-base font-semibold text-foreground flex items-start gap-2">
                          <span className="text-orange-600 dark:text-orange-500 flex-shrink-0">Q:</span>
                          <span>What is a pre-adverse action response letter, and when would I use one?</span>
                        </h4>
                        <div className="pl-5 space-y-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed text-left">
                          <p>
                            In some hiring processes, if something on your background check might lead an employer to change an offer or decide not to hire you, they may send you a "pre-adverse action" notice first.
                          </p>
                          <p>
                            A pre-adverse action response letter is your opportunity to correct any mistakes, share context about your record, and highlight the steps you've taken to grow.
                          </p>
                        </div>
                      </div>

                      {/* Link to full FAQ */}
                      <div className="pt-3 border-t border-orange-200/50 dark:border-orange-800/30">
                        <Link href="/faq">
                          <button className="text-xs md:text-sm text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-medium hover:underline underline-offset-4 transition-all duration-200 flex items-center gap-1.5 group">
                            <span>View all frequently asked questions</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                          </button>
                        </Link>
                      </div>

                      {/* Close button for mobile */}
                      <div className="pt-4 md:hidden">
                        <button
                          onClick={() => setAccordionValue("")}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-xl"
                          aria-label="Close quick answers"
                        >
                          <span>Close</span>
                          <ChevronDown className="w-4 h-4 rotate-180" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
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
            <Button
              size="lg"
              className={`
                group relative w-full min-h-[64px] md:min-h-[72px] text-lg md:text-xl font-bold rounded-2xl
                shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-xl
                ${selected ? 'scale-100' : 'scale-95'}
              `}
              disabled={!selected}
              onClick={handleContinue}
              data-testid="button-continue"
              style={{
                background: selected
                  ? 'linear-gradient(135deg, rgb(20 184 166) 0%, rgb(13 148 136) 100%)'
                  : undefined
              }}
            >
              {/* Animated shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" aria-hidden="true" />

              <span className="relative z-10 flex items-center justify-center gap-3">
                <span style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
                  {selected ? 'Continue to Form' : 'Select an Option to Continue'}
                </span>
                {selected && (
                  <ArrowRight className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-2" aria-hidden="true" />
                )}
              </span>
            </Button>

            {/* Privacy Notice - Refined */}
            <div
              className={`
                rounded-2xl border-l-4 px-6 md:px-8 py-5 transition-all duration-700 shadow-md
                border-amber-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm
                ${hasMadeSelection
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4 pointer-events-none h-0 p-0 m-0 overflow-hidden border-0"
                }
              `}
              data-testid="alert-privacy-warning"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Shield className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm md:text-base font-bold text-foreground">
                    Your Privacy Matters
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    If you refresh the page, your information will be cleared and you'll need to start over.
                    We don't store your data after your session ends.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom tagline */}
            <BottomTagline />
          </div>

        </div>
      </section>
    </>
  );
}
