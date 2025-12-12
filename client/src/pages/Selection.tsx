import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Mail, ArrowLeft, ArrowRight, Files, Check, Shield } from "lucide-react";
import Layout from "@/components/Layout";

type ToolSelection = "narrative" | "responseLetter" | "both" | null;

interface SelectionOption {
  id: ToolSelection;
  title: string;
  description: string;
  icon: typeof FileText;
  iconBgClass: string;
  iconColorClass: string;
}

const options: SelectionOption[] = [
  {
    id: "narrative",
    title: "Disclosure Narratives",
    description: "Generate five personalized ways to discuss your background during interviews or on job applications.",
    icon: FileText,
    iconBgClass: "bg-primary/10",
    iconColorClass: "text-primary",
  },
  {
    id: "responseLetter",
    title: "Response Letter",
    description: "Create a professional response to a pre-adverse action notice from a potential employer.",
    icon: Mail,
    iconBgClass: "bg-chart-2/10",
    iconColorClass: "text-chart-2",
  },
  {
    id: "both",
    title: "Both Documents",
    description: "Get both the disclosure narratives and the response letter to be fully prepared for your job search.",
    icon: Files,
    iconBgClass: "bg-primary/10",
    iconColorClass: "text-primary",
  },
];

export default function Selection() {
  const [selected, setSelected] = useState<ToolSelection>(null);
  const [hasMadeSelection, setHasMadeSelection] = useState(false);
  const [, navigate] = useLocation();

  const handleContinue = () => {
    if (selected) {
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
    <Layout>
      <section
        className="py-8 md:py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-primary/5 via-slate-50 to-primary/10 dark:from-primary/10 dark:via-slate-900 dark:to-primary/5"
        aria-labelledby="selection-heading"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-200 group"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-5 mb-10 md:mb-14">
            <h1
              id="selection-heading"
              className="text-4xl md:text-5xl font-bold leading-tight text-foreground"
            >
              What would you like to create?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the tool that best fits your current needs. You can always come back and use the other one later.
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Select document type"
            className="space-y-5"
          >
            {options.map((option) => {
              const isSelected = selected === option.id;
              const Icon = option.icon;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelect(option.id)}
                  onKeyDown={(e) => handleKeyDown(e, option.id)}
                  className={`
                    group relative w-full text-left rounded-2xl p-6 md:p-8 transition-all duration-300 ease-out
                    border-2 bg-card overflow-hidden
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                    ${isSelected
                      ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-xl scale-[1.02] -translate-y-1"
                      : "border-border/50 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01]"
                    }
                  `}
                  data-testid={`option-${option.id}`}
                >
                  {/* Decorative corner element */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                  } ${option.id === 'responseLetter' ? 'bg-chart-2/10' : 'bg-primary/10'}`} aria-hidden="true" />

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" aria-hidden="true" />

                  <div className="flex items-start gap-5 relative z-10">
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md
                      transition-all duration-300 ease-out
                      ${isSelected
                        ? 'scale-110 rotate-3'
                        : 'group-hover:scale-105 group-hover:rotate-2'
                      }
                      ${option.id === 'responseLetter'
                        ? 'bg-gradient-to-br from-chart-2/20 to-chart-2/10'
                        : 'bg-gradient-to-br from-primary/20 to-primary/10'
                      }
                    `}>
                      <Icon className={`w-8 h-8 ${option.iconColorClass}`} aria-hidden="true" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">
                          {option.title}
                        </h2>
                        <div className={`
                          w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          transition-all duration-300 ease-out shadow-sm
                          ${isSelected
                            ? "border-primary bg-primary scale-110"
                            : "border-muted-foreground/30 group-hover:border-primary/50 group-hover:scale-105"
                          }
                        `}>
                          {isSelected && (
                            <Check className="w-5 h-5 text-primary-foreground animate-in zoom-in duration-200" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 md:mt-14 space-y-5">
            <Button
              size="lg"
              className="group relative w-full min-h-[56px] text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl"
              disabled={!selected}
              onClick={handleContinue}
              data-testid="button-continue"
            >
              {/* Animated gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

              <span className="relative z-10 flex items-center justify-center">
                Continue
                <ArrowRight className="w-6 h-6 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Button>

            <div
              className={`
                rounded-xl border-2 px-5 py-4 transition-all duration-500 shadow-sm
                border-amber-400/50 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20
                ${hasMadeSelection
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none h-0 p-0 m-0 overflow-hidden border-0"
                }
              `}
              data-testid="alert-privacy-warning"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-200/50 dark:bg-amber-800/30 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                </div>
                <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                  <span className="font-semibold">We take your privacy seriously.</span>{" "}
                  If you refresh the page at any point, your information will be cleared and you'll need to start over.
                </p>
              </div>
            </div>

            <p className="text-center text-base text-muted-foreground font-medium">
              Your information stays private and is not stored after your session.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
