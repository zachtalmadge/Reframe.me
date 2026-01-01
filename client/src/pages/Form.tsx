import { FormWizard } from "@/components/form";
import { useFormPageController } from "./form/hooks/useFormPageController";
import { BackToSelectionRow } from "./form/sections/BackToSelectionRow";
import { FormToolHeader } from "./form/sections/FormToolHeader";
import "./form/styles/form.css";

export default function Form() {
  const { tool, title, description, Icon, restoredState, isRestoring, handleFormComplete } =
    useFormPageController();

  return (
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
          <FormToolHeader title={title} description={description} Icon={Icon} />
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
  );
}
