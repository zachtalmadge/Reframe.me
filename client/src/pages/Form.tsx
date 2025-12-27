import { useState, useEffect } from "react";
import { Link, useSearch, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Mail, Files } from "lucide-react";
import { FormWizard } from "@/components/form";
import { FormState, ToolType } from "@/lib/formState";
import { saveFormData, loadFormData, clearFormData } from "@/lib/formPersistence";
import { useProtectedPage } from "@/hooks/useProtectedPage";

const toolInfo: Record<
  ToolType,
  { title: string; description: string; icon: typeof FileText }
> = {
  narrative: {
    title: "Disclosure Narratives",
    description: "You're creating five personalized disclosure narratives.",
    icon: FileText,
  },
  responseLetter: {
    title: "Response Letter",
    description: "You're creating a pre-adverse action response letter.",
    icon: Mail,
  },
  both: {
    title: "Both Documents",
    description: "You're creating disclosure narratives and a response letter.",
    icon: Files,
  },
};

export default function Form() {
  // Register this page as protected from navigation
  useProtectedPage();

  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const toolParam = params.get("tool") as ToolType | null;

  const [restoredState, setRestoredState] = useState<FormState | undefined>(undefined);
  const [isRestoring, setIsRestoring] = useState(true);

  const tool = toolParam && toolInfo[toolParam] ? toolParam : "narrative";
  const { title, description, icon: Icon } = toolInfo[tool];

  useEffect(() => {
    const persisted = loadFormData();
    if (persisted && persisted.tool === tool) {
      const restoredFormState: FormState = {
        ...persisted.formState,
        errors: {},
      };
      setRestoredState(restoredFormState);
    }
    setIsRestoring(false);
  }, [tool]);

  const handleFormComplete = (data: FormState) => {
    saveFormData(data, tool);
    window.scrollTo(0, 0);
    navigate(`/loading?tool=${tool}`);
  };

  return (
    <>
      {/* Page-specific Form styles */}
      <style>{`
        /* Typography */
        .font-fraunces {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
        }

        .font-manrope {
          font-family: 'Manrope', sans-serif;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 min-h-screen dot-pattern dark:dot-pattern-dark relative overflow-hidden"
        aria-labelledby="form-heading"
      >
        {/* Paper texture overlay */}
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Subtle decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="mb-6 animate-fadeInUp opacity-0">
            <Link href="/selection">
              <Button
                variant="outline"
                size="sm"
                className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-2 shadow-sm"
                data-testid="button-back-selection"
              >
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Back to Selection
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-5 mb-10 animate-fadeInUp delay-100 opacity-0">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mx-auto shadow-lg border-2 border-primary/20">
              <Icon className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>

            <div className="space-y-3">
              <h1
                id="form-heading"
                className="text-3xl md:text-4xl font-bold leading-tight text-foreground font-fraunces"
              >
                {title}
              </h1>
              <p
                className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-manrope"
                data-testid="text-tool-description"
              >
                {description}
              </p>
            </div>
          </div>

          {!isRestoring && (
            <div className="animate-fadeInUp delay-200 opacity-0">
              <FormWizard
                key={restoredState ? "restored" : "fresh"}
                tool={tool}
                onComplete={handleFormComplete}
                initialState={restoredState}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
