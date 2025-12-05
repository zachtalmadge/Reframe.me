import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Mail, ArrowLeft, ArrowRight, Files, Check } from "lucide-react";
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
  const [, navigate] = useLocation();

  const handleContinue = () => {
    if (selected) {
      navigate(`/form?tool=${selected}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionId: ToolSelection) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected(optionId);
    }
  };

  return (
    <Layout>
      <section 
        className="py-8 md:py-16 px-4 sm:px-6 lg:px-8"
        aria-labelledby="selection-heading"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-4 mb-8 md:mb-12">
            <h1 
              id="selection-heading"
              className="text-3xl md:text-4xl font-bold leading-tight text-foreground"
            >
              What would you like to create?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the tool that best fits your current needs. You can always come back and use the other one later.
            </p>
          </div>

          <div 
            role="radiogroup" 
            aria-label="Select document type"
            className="space-y-4"
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
                  onClick={() => setSelected(option.id)}
                  onKeyDown={(e) => handleKeyDown(e, option.id)}
                  className={`
                    w-full text-left rounded-xl p-5 md:p-6 transition-all duration-150
                    border-2 bg-card
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                    ${isSelected 
                      ? "border-primary bg-primary/5 shadow-md" 
                      : "border-border hover-elevate"
                    }
                  `}
                  data-testid={`option-${option.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                      ${option.iconBgClass}
                    `}>
                      <Icon className={`w-6 h-6 ${option.iconColorClass}`} aria-hidden="true" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg md:text-xl font-semibold text-foreground">
                          {option.title}
                        </h2>
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          transition-colors duration-150
                          ${isSelected 
                            ? "border-primary bg-primary" 
                            : "border-muted-foreground/30"
                          }
                        `}>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                      <p className="mt-1 text-muted-foreground leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 md:mt-12 space-y-4">
            <Button 
              size="lg"
              className="w-full min-h-[48px] text-lg font-medium shadow-md"
              disabled={!selected}
              onClick={handleContinue}
              data-testid="button-continue"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Your information stays private and is not stored after your session.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
