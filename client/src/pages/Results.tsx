import { useSearch } from "wouter";
import { Loader2 } from "lucide-react";
import { LeaveConfirmationModal } from "@/components/LeaveConfirmationModal";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { PartialFailureAlert } from "@/components/results/PartialFailureAlert";
import { validateToolParam } from "@/lib/utils";
import ResultsGuidanceSection from "./results/sections/ResultsGuidanceSection";
import ResultsDisclaimerCard from "./results/sections/ResultsDisclaimerCard";
import ResultsHero from "./results/sections/ResultsHero";
import ResultsDocumentsSection from "./results/sections/ResultsDocumentsSection";
import ResultsActionsPanel from "./results/sections/ResultsActionsPanel";
import ResultsDonateCTA from "./results/sections/ResultsDonateCTA";
import { useResultsPage } from "./results/hooks/useResultsPage";

export default function Results() {
  // Register this page as protected from navigation
  useProtectedPage();

  // Validate tool param from URL
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = validateToolParam(params.get("tool"));

  // Single facade hook that composes all results logic
  const results = useResultsPage({ tool });

  // Show loading state
  if (results.ui.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            Loading your results{results.ui.loadAttempts > 0 ? ` (attempt ${results.ui.loadAttempts + 1})` : ''}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 min-h-screen dot-pattern dark:dot-pattern-dark relative overflow-hidden"
        aria-labelledby="results-heading"
      >
        {/* Paper texture overlay */}
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Subtle decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <ResultsDisclaimerCard />

          {results.data.status === "partial_fail" && results.data.errors.length > 0 && (
            <PartialFailureAlert
              errors={results.data.errors}
              onRetry={results.actions.retryPartialFail}
              isRetrying={results.state.isRetrying}
            />
          )}

          <ResultsHero />

          <ResultsDocumentsSection
            hasBoth={results.ui.hasBoth}
            hasNarratives={results.ui.hasNarratives}
            hasLetter={results.ui.hasLetter}
            showNarratives={results.ui.showNarratives}
            showResponseLetter={results.ui.showResponseLetter}
            activeTab={results.ui.activeTab}
            setActiveTab={results.ui.setActiveTab}
            narratives={results.data.narratives}
            responseLetter={results.data.responseLetter}
            onCopyNarrative={results.actions.copyNarrative}
            onDownloadNarrative={results.actions.downloadNarrative}
            onRegenerateNarrative={results.actions.regenerateNarrative}
            regeneratingType={results.state.regeneratingType}
            regenNarrativeCounts={results.data.regenNarrativeCounts}
            narrativeErrors={results.state.narrativeErrors}
            onCopyLetter={results.actions.copyLetter}
            onDownloadLetter={results.actions.downloadLetter}
            onRegenerateLetter={results.actions.regenerateLetter}
            isLetterRegenerating={results.state.isLetterRegenerating}
            regenLetterCount={results.data.regenLetterCount}
            letterError={results.state.letterError}
          />

          <ResultsActionsPanel
            hasNarratives={results.ui.hasNarratives}
            hasLetter={results.ui.hasLetter}
            onDownloadAll={results.actions.downloadAll}
            onStartOver={results.actions.startOver}
            onLearnMore={results.actions.learnMore}
          />
        </div>

        {/* Two-column layout on desktop: "How to use what you created" and "Did this help you?" */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12 mb-8">
            <ResultsGuidanceSection
              hasNarratives={results.ui.hasNarratives}
              hasLetter={results.ui.hasLetter}
              activeResultType={results.ui.activeTab}
            />

            <ResultsDonateCTA />
          </div>
        </div>
      </section>

      <LeaveConfirmationModal
        open={results.state.exitModalOpen}
        onConfirm={results.actions.confirmExit}
        onCancel={results.actions.cancelExit}
        title="Before you leave this page"
        description="Don't forget to copy or download your results before you leave. We don't want you to lose something important by accident. Once you leave this page, you'll need to start over to generate new narratives or letters."
        warning="⚠️ Make sure you've saved your documents before leaving."
        confirmText="Leave anyway"
        cancelText="Stay on this page"
      />
    </>
  );
}
