import { useState } from "react";
import { useSearch, useLocation, Link } from "wouter";
import { Download, Home, BookOpen, FileText, Loader2, Heart } from "lucide-react";
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

          {/* Hero Section - Editorial Style */}
          <div className="text-center space-y-6 py-8 animate-fadeInUp delay-100 opacity-0">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-lg ring-1 ring-primary/10 mx-auto paper-card">
              <FileText className="w-10 h-10 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-3 accent-line pb-4">
              <h1
                id="results-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-fraunces tracking-tight"
              >
                Your Documents
                <br />
                <span className="text-primary italic">Are Ready</span>
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-manrope leading-relaxed">
              Review and download your personalized documents below. Take your time—these are yours to refine and use when you're ready.
            </p>
          </div>

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

          <div className="pt-8 border-t border-border/30 space-y-6 animate-fadeInUp delay-300 opacity-0">
            {(hasNarratives || hasLetter) && (
              <Button
                size="lg"
                className="w-full group shadow-md hover:shadow-lg transition-all font-manrope"
                onClick={handleDownloadAllDocuments}
                data-testid="button-download-all"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" aria-hidden="true" />
                Download All Documents
              </Button>
            )}

            <div className="paper-card flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-border/30">
              <p className="text-sm font-medium text-muted-foreground text-center sm:text-left font-manrope">
                Need to make changes? You can start over anytime.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleStartOver}
                  className="group border font-manrope"
                  data-testid="button-start-over"
                >
                  <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  Start Over
                </Button>
                <Button
                  className="bg-chart-2 hover:bg-chart-2/90 text-white shadow-md hover:shadow-lg transition-all group font-manrope"
                  onClick={handleLearnMoreClick}
                  data-testid="button-learn-more-results"
                >
                  <BookOpen className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout on desktop: "How to use what you created" and "Did this help you?" */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12 mb-8">
            <ResultsGuidanceSection
              hasNarratives={hasNarratives}
              hasLetter={hasLetter}
              activeResultType={activeTab}
            />

            {/* Donation CTA Section - Refined Editorial */}
            <section className="animate-fadeInUp delay-400 opacity-0">
              <div className="paper-card donate-card rounded-3xl border-2 border-orange-100 dark:border-orange-900/30 overflow-hidden h-full flex flex-col">
                {/* Decorative top border accent */}
                <div className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

                <div className="px-6 py-8 md:px-8 md:py-10 flex-1 flex flex-col">
                  <div className="max-w-2xl mx-auto text-center space-y-6 flex-1 flex flex-col justify-center">
                    {/* Heart icon - subtle and refined */}
                    <div className="inline-flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center ring-1 ring-orange-200 dark:ring-orange-800/50">
                        <Heart
                          className="w-8 h-8 text-orange-600 dark:text-orange-500"
                          fill="currentColor"
                          style={{ animation: 'gentle-pulse 3s ease-in-out infinite' }}
                        />
                      </div>
                    </div>

                    {/* Heading - Editorial typography */}
                    <div className="space-y-3">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-fraunces leading-tight tracking-tight">
                        <span className="italic">Did this help you?</span>
                      </h2>
                      <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-manrope font-medium">
                        Help us keep Reframe.me{' '}
                        <span className="font-bold text-orange-600 dark:text-orange-500">free and private</span>{' '}
                        for the next person.
                      </p>
                    </div>

                    {/* Description */}
                    <div className="max-w-xl mx-auto border-l-2 border-orange-200 dark:border-orange-800/50 pl-4">
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-manrope text-left">
                        Your support covers AI costs, hosting, and development time—so people with records
                        can keep using this tool without ads, tracking, or paywalls.
                      </p>
                    </div>

                    {/* CTA Button - Clean and bold */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                      <Link href="/donate">
                        <button
                          className="donate-button group px-8 py-4 rounded-xl text-white font-bold text-base shadow-lg overflow-hidden min-w-[220px] font-manrope"
                        >
                          <span className="flex items-center justify-center gap-3">
                            <Heart className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" />
                            Support Reframe.me
                          </span>
                        </button>
                      </Link>
                    </div>

                    {/* Subtle reassurance */}
                    <div className="pt-1">
                      <p className="text-xs text-muted-foreground italic font-manrope">
                        Whether you can donate or not, this tool is here for you.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative bottom border accent */}
                <div className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              </div>
            </section>
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
