import { useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LeaveConfirmationModal } from "@/components/LeaveConfirmationModal";
import { ToolType } from "@/lib/formState";
import { NarrativeItem, ResponseLetter, GenerationResult } from "@/lib/resultsPersistence";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { useDocumentActions } from "@/hooks/useDocumentActions";
import { NarrativeCarousel } from "@/components/results/NarrativeCarousel";
import { ResponseLetterPanel } from "@/components/results/ResponseLetterPanel";
import { DocumentSwitcher } from "@/components/results/DocumentSwitcher";
import { PartialFailureAlert } from "@/components/results/PartialFailureAlert";
import { useToast } from "@/hooks/use-toast";
import { NarrativeType } from "@/lib/regenerationPersistence";
import ResultsGuidanceSection from "./results/sections/ResultsGuidanceSection";
import ResultsDisclaimerCard from "./results/sections/ResultsDisclaimerCard";
import ResultsHero from "./results/sections/ResultsHero";
import ResultsActionsPanel from "./results/sections/ResultsActionsPanel";
import ResultsDonateCTA from "./results/sections/ResultsDonateCTA";
import { useResultsLoader } from "./results/hooks/useResultsLoader";
import { useResultsExitActions } from "./results/hooks/useResultsExitActions";
import { useResultsRegeneration } from "./results/hooks/useResultsRegeneration";

export default function Results() {
  // Register this page as protected from navigation
  useProtectedPage();

  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = (params.get("tool") as ToolType) || "narrative";

  // Load results with retry logic
  const {
    isLoading,
    loadAttempts,
    narratives,
    responseLetter,
    status,
    errors,
    sessionId,
    regenCounts,
    activeTab,
    setActiveTab,
    setNarratives,
    setResponseLetter,
    setStatus,
    setErrors,
    setRegenCounts,
  } = useResultsLoader();

  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  // Regeneration logic
  const {
    handleRegenerateNarrative,
    regeneratingType,
    narrativeErrors,
    handleRegenerateLetter,
    isLetterRegenerating,
    letterError,
  } = useResultsRegeneration({
    sessionId,
    narratives,
    setNarratives,
    responseLetter,
    setResponseLetter,
    status,
    errors,
    regenCounts,
    setRegenCounts,
  });

  // Exit actions and modal state
  const {
    exitModalOpen,
    exitDestination,
    handleStartOver,
    handleLearnMoreClick,
    handleConfirmExit,
    handleCancelExit,
  } = useResultsExitActions();

  const {
    handleCopyNarrative,
    handleCopyLetter,
    handleDownloadNarrative,
    handleDownloadLetter,
    handleDownloadAll,
  } = useDocumentActions();

  const showNarratives = tool === "narrative" || tool === "both";
  const showResponseLetter = tool === "responseLetter" || tool === "both";
  const hasNarratives = showNarratives && narratives.length > 0;
  const hasLetter = showResponseLetter && responseLetter !== null;
  const hasBoth = hasNarratives && hasLetter;

  const handleDownloadAllDocuments = () => {
    handleDownloadAll(narratives, responseLetter);
  };

  const handleRetryFailed = () => {
    setIsRetrying(true);
    toast({
      title: "Retry not available yet",
      description: "Regeneration functionality will be added in a future update. Please start over to generate new documents.",
    });
    setTimeout(() => setIsRetrying(false), 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            Loading your results{loadAttempts > 0 ? ` (attempt ${loadAttempts + 1})` : ''}...
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

          {status === "partial_fail" && errors.length > 0 && (
            <PartialFailureAlert
              errors={errors}
              onRetry={handleRetryFailed}
              isRetrying={isRetrying}
            />
          )}

          <ResultsHero />

          {hasBoth && (
            <div className="flex justify-center">
              <DocumentSwitcher
                activeTab={activeTab}
                onTabChange={setActiveTab}
                hasNarratives={hasNarratives}
                hasLetter={hasLetter}
              />
            </div>
          )}

          <div className="space-y-6">
            {(activeTab === "narratives" || !hasBoth) && hasNarratives && (
              <div data-testid="section-narratives" className="animate-fadeInUp delay-200 opacity-0">
                <NarrativeCarousel
                  narratives={narratives}
                  onCopy={handleCopyNarrative}
                  onDownload={handleDownloadNarrative}
                  onRegenerate={handleRegenerateNarrative}
                  regeneratingType={regeneratingType}
                  regenCounts={regenCounts?.narratives || {} as Record<NarrativeType, number>}
                  regenErrors={narrativeErrors}
                />
              </div>
            )}

            {(activeTab === "letter" || !hasBoth) && hasLetter && responseLetter && (
              <div data-testid="section-letter" className="animate-fadeInUp delay-200 opacity-0">
                <ResponseLetterPanel
                  letter={responseLetter}
                  onCopy={handleCopyLetter}
                  onDownload={handleDownloadLetter}
                  onRegenerate={handleRegenerateLetter}
                  isRegenerating={isLetterRegenerating}
                  regenCount={regenCounts?.letter || 0}
                  regenError={letterError}
                />
              </div>
            )}

            {showNarratives && narratives.length === 0 && !hasLetter && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No narratives were generated. Please try again.
                  </p>
                </CardContent>
              </Card>
            )}

            {showResponseLetter && !responseLetter && !hasNarratives && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No response letter was generated. Please try again.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <ResultsActionsPanel
            hasNarratives={hasNarratives}
            hasLetter={hasLetter}
            onDownloadAll={handleDownloadAllDocuments}
            onStartOver={handleStartOver}
            onLearnMore={handleLearnMoreClick}
          />
        </div>

        {/* Two-column layout on desktop: "How to use what you created" and "Did this help you?" */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12 mb-8">
            <ResultsGuidanceSection
              hasNarratives={hasNarratives}
              hasLetter={hasLetter}
              activeResultType={activeTab}
            />

            <ResultsDonateCTA />
          </div>
        </div>
      </section>

      <LeaveConfirmationModal
        open={exitModalOpen}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        title="Before you leave this page"
        description="Don't forget to copy or download your results before you leave. We don't want you to lose something important by accident. Once you leave this page, you'll need to start over to generate new narratives or letters."
        warning="⚠️ Make sure you've saved your documents before leaving."
        confirmText="Leave anyway"
        cancelText="Stay on this page"
      />
    </>
  );
}
