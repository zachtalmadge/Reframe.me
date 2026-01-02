import { FormWizard } from "@/components/form";
import { useFormPageController } from "./form/hooks/useFormPageController";
import { BackToSelectionRow } from "./form/sections/BackToSelectionRow";
import { FormToolHeader } from "./form/sections/FormToolHeader";
import "./form/styles/form.css";

export default function Form() {
  // Extract form configuration and state management from the controller hook
  // - tool: which document type to generate (narratives or response letter)
  // - title/description/Icon: display metadata for the selected tool
  // - restoredState: previously saved form data from localStorage
  // - isRestoring: loading state while retrieving saved data
  // - handleFormComplete: callback when user completes all form steps
  const { tool, title, description, Icon, restoredState, isRestoring, handleFormComplete } =
    useFormPageController();

  return (
    <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 min-h-screen dot-pattern dark:dot-pattern-dark relative overflow-hidden"
        aria-labelledby="form-heading"
      >
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Decorative corner accents for visual interest
            - Top-left corner: primary color with low opacity
            - Bottom-right corner: secondary color (chart-2) with low opacity
            - Both are pointer-events-none so they don't block clicks */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />

        {/* Content container with:
            - max-w-2xl: keeps form readable width on large screens
            - mx-auto: centers the form horizontally
            - relative z-10: ensures content appears above decorative elements */}
        <div className="max-w-2xl mx-auto relative z-10">
          {/* Navigation link back to tool selection page */}
          <BackToSelectionRow />

          {/* Form header showing tool name, description, and icon */}
          <FormToolHeader title={title} description={description} Icon={Icon} />

          {/* Only render form wizard once we've finished checking for saved state
              This prevents flickering when restored data loads */}
          {!isRestoring && (
            // Fade-in animation wrapper with delay for smooth entrance
            <div className="animate-fadeInUp delay-200 opacity-0">
              <FormWizard
                // Key prop forces React to remount when switching between
                // restored and fresh state, ensuring proper initialization
                key={restoredState ? "restored" : "fresh"}
                // Which document type to generate (narratives or letter)
                tool={tool}
                // Callback when user completes all form steps - navigates to results
                onComplete={handleFormComplete}
                // Pre-populated form data from localStorage, if available
                initialState={restoredState}
              />
            </div>
          )}
        </div>
      </section>
  );
}
