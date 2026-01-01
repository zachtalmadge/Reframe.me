import { FormWizard } from "@/components/form";
import { useFormPageController } from "./form/hooks/useFormPageController";
import { BackToSelectionRow } from "./form/sections/BackToSelectionRow";

export default function Form() {
  const { tool, title, description, Icon, restoredState, isRestoring, handleFormComplete } =
    useFormPageController();

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
          <BackToSelectionRow />

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
