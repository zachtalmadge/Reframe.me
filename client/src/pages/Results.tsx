import { useEffect, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Download, Home, AlertTriangle, BookOpen, MessageCircle, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { LeaveConfirmationModal } from "@/components/LeaveConfirmationModal";
import { ToolType } from "@/lib/formState";
import { loadResults, NarrativeItem, ResponseLetter, clearResults, GenerationResult, updateResults } from "@/lib/resultsPersistence";
import { loadFormData, clearFormData } from "@/lib/formPersistence";
import { useDocumentActions } from "@/hooks/useDocumentActions";
import { NarrativeCarousel } from "@/components/results/NarrativeCarousel";
import { ResponseLetterPanel } from "@/components/results/ResponseLetterPanel";
import { DocumentSwitcher, DocumentTab } from "@/components/results/DocumentSwitcher";
import { PartialFailureAlert } from "@/components/results/PartialFailureAlert";
import { useToast } from "@/hooks/use-toast";
import { regenerateNarrative, regenerateLetter } from "@/lib/api";
import {
  loadRegenerationCounts,
  saveRegenerationCounts,
  clearRegenerationCounts,
  incrementNarrativeCount,
  incrementLetterCount,
  RegenerationCounts,
  NarrativeType,
} from "@/lib/regenerationPersistence";

function ResultsGuidanceSection({ 
  hasNarratives, 
  hasLetter, 
  activeResultType 
}: { 
  hasNarratives: boolean; 
  hasLetter: boolean;
  activeResultType: "narratives" | "letter";
}) {
  if (!hasNarratives && !hasLetter) return null;

  const showNarrativesGuidance = hasNarratives && (!hasLetter || activeResultType === "narratives");
  const showLetterGuidance = hasLetter && (!hasNarratives || activeResultType === "letter");

  return (
    <section
      className="mt-10 pt-10 border-t-2 border-border/50"
      aria-labelledby="guidance-heading"
      data-testid="section-guidance"
    >
      <div className="space-y-8">
        <div className="text-center space-y-3 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 py-6 rounded-2xl">
          <h2
            id="guidance-heading"
            className="text-2xl sm:text-3xl font-bold text-foreground"
          >
            How to use what you just created
          </h2>
          <p className="text-base text-muted-foreground">
            A few ideas to help you put these materials to work.
          </p>
        </div>

        {showNarrativesGuidance && (
          <div
            className="space-y-4"
            role="tabpanel"
            aria-labelledby="guidance-heading"
            data-testid="guidance-narratives"
          >
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 md:p-8 border-2 border-primary/20 shadow-lg space-y-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                Getting comfortable with your narratives
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-4 bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">1</span>
                  <span><strong className="text-foreground">Practice out loud.</strong> Reading silently is different from speaking. Try saying one version a few times until it feels natural.</span>
                </li>
                <li className="flex gap-4 bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">2</span>
                  <span><strong className="text-foreground">Pick your anchor sentences.</strong> You don't need to memorize everything. Choose 1-2 sentences that feel most true to you.</span>
                </li>
                <li className="flex gap-4 bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">3</span>
                  <span><strong className="text-foreground">Make it your own.</strong> Edit the wording so it sounds like you. These are starting points, not scripts.</span>
                </li>
                <li className="flex gap-4 bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">4</span>
                  <span><strong className="text-foreground">Share with someone you trust.</strong> If it helps, practice with a friend, mentor, or counselor who can give you honest feedback.</span>
                </li>
              </ul>
              <p className="text-sm text-foreground/80 italic border-l-4 border-primary/50 pl-4 py-2 bg-white/40 dark:bg-slate-900/30 rounded">
                Take your time. There's no rush to use these right away. When you're ready, you'll have words that feel prepared, not panicked.
              </p>
            </div>
          </div>
        )}

        {showLetterGuidance && (
          <div className="bg-gradient-to-br from-chart-2/5 to-chart-2/10 rounded-2xl p-6 md:p-8 border-2 border-chart-2/20 shadow-lg space-y-5">
  <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-chart-2/20 flex items-center justify-center">
      <FileText className="w-5 h-5 text-chart-2" aria-hidden="true" />
    </div>
    Before you send your letter
  </h3>
  <ul className="space-y-4 text-sm text-muted-foreground">
    <li className="flex gap-4 bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-chart-2 text-white text-sm font-bold flex items-center justify-center shadow-md">
        1
      </span>
      <span>
        <strong className="text-foreground">Add anything that feels important. </strong>
        If you like this letter but want to say more or adjust the wording, copy it into a word-processing document or another AI tool and add your own details in your voice.
      </span>
    </li>
    <li className="flex gap-4 bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-chart-2 text-white text-sm font-bold flex items-center justify-center shadow-md">
        2
      </span>
      <span>
        <strong className="text-foreground">Check for accuracy.</strong> Review dates, names, charges, and employer details. Small errors can undermine your message.
      </span>
    </li>
    <li className="flex gap-4 bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-chart-2 text-white text-sm font-bold flex items-center justify-center shadow-md">
        3
      </span>
      <span>
        <strong className="text-foreground">Make sure it feels honest.</strong> If anything doesn't sit right with you, edit it. You should feel comfortable with every word.
      </span>
    </li>
    <li className="flex gap-4 bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-chart-2 text-white text-sm font-bold flex items-center justify-center shadow-md">
        4
      </span>
      <span>
        <strong className="text-foreground">Get a second opinion if you can.</strong> Consider sharing it with a trusted friend, reentry counselor, or legal aid organization before sending.
      </span>
    </li>
    <li className="flex gap-4 bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-chart-2 text-white text-sm font-bold flex items-center justify-center shadow-md">
        5
      </span>
      <span>
        <strong className="text-foreground">Know your timeline.</strong> Pre-adverse action notices usually give you a window to respond. Check the deadline on your notice.
      </span>
    </li>
  </ul>
  <p className="text-sm text-foreground/80 italic border-l-4 border-chart-2/50 pl-4 py-2 bg-white/40 dark:bg-slate-900/30 rounded">
    This letter is a tool to help you respond thoughtfully. You deserve to be heard, and taking time to get it right is a sign of strength.
  </p>
</div>

        )}
      </div>
    </section>
  );
}

export default function Results() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = (params.get("tool") as ToolType) || "narrative";

  const [narratives, setNarratives] = useState<NarrativeItem[]>([]);
  const [responseLetter, setResponseLetter] = useState<ResponseLetter | null>(null);
  const [status, setStatus] = useState<GenerationResult["status"]>("success");
  const [errors, setErrors] = useState<GenerationResult["errors"]>([]);
  const [activeTab, setActiveTab] = useState<DocumentTab>("narratives");
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const [sessionId, setSessionId] = useState<string>("");
  const [regenCounts, setRegenCounts] = useState<RegenerationCounts | null>(null);
  const [regeneratingType, setRegeneratingType] = useState<NarrativeType | null>(null);
  const [isLetterRegenerating, setIsLetterRegenerating] = useState(false);
  const [narrativeErrors, setNarrativeErrors] = useState<Record<NarrativeType, string | null>>({
    justice_focused_org: null,
    general_employer: null,
    minimal_disclosure: null,
    transformation_focused: null,
    skills_focused: null,
  });
  const [letterError, setLetterError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);

  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [exitDestination, setExitDestination] = useState<"home" | "faq" | null>(null);

  const {
    handleCopyNarrative,
    handleCopyLetter,
    handleDownloadNarrative,
    handleDownloadLetter,
    handleDownloadAll,
  } = useDocumentActions();

  useEffect(() => {
    const MAX_ATTEMPTS = 5;
    const RETRY_DELAY = 150; // ms

    const loadWithRetry = async () => {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
          const persisted = loadResults();

          if (persisted) {
            // Success - set all data
            setNarratives(persisted.result.narratives);
            setResponseLetter(persisted.result.responseLetter);
            setStatus(persisted.result.status);
            setErrors(persisted.result.errors || []);
            setSessionId(persisted.sessionId);

            const counts = loadRegenerationCounts(persisted.sessionId);
            setRegenCounts(counts);

            if (persisted.tool === "responseLetter" ||
                (persisted.tool === "both" &&
                 persisted.result.narratives.length === 0 &&
                 persisted.result.responseLetter)) {
              setActiveTab("letter");
            }

            setIsLoading(false);
            return;
          }

          // Retry with exponential backoff
          setLoadAttempts(attempt + 1);
          if (attempt < MAX_ATTEMPTS - 1) {
            await new Promise(resolve =>
              setTimeout(resolve, RETRY_DELAY * Math.pow(1.5, attempt))
            );
          }
        } catch (e) {
          console.error(`Load attempt ${attempt + 1} failed:`, e);
        }
      }

      // All retries exhausted - redirect
      console.error('Failed to load results after maximum attempts');
      navigate("/");
    };

    loadWithRetry();
  }, [navigate]);

  const showNarratives = tool === "narrative" || tool === "both";
  const showResponseLetter = tool === "responseLetter" || tool === "both";
  const hasNarratives = showNarratives && narratives.length > 0;
  const hasLetter = showResponseLetter && responseLetter !== null;
  const hasBoth = hasNarratives && hasLetter;

  const handleStartOver = () => {
    clearFormData();
    clearResults();
    clearRegenerationCounts();
    navigate("/");
  };

  const handleLogoClick = () => {
    setExitDestination("home");
    setExitModalOpen(true);
  };

  const handleFaqClick = () => {
    setExitDestination("faq");
    setExitModalOpen(true);
  };

  const handleLearnMoreClick = () => {
    setExitDestination("faq");
    setExitModalOpen(true);
  };

  const handleConfirmExit = () => {
    setExitModalOpen(false);
    clearFormData();
    clearResults();
    clearRegenerationCounts();
    if (exitDestination === "home") {
      navigate("/");
    } else if (exitDestination === "faq") {
      navigate("/faq");
    }
  };

  const handleCancelExit = () => {
    setExitModalOpen(false);
    setExitDestination(null);
  };

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

  const handleRegenerateNarrative = async (narrativeType: NarrativeType) => {
    const formData = loadFormData();
    if (!formData) {
      toast({
        title: "Unable to regenerate",
        description: "Form data is no longer available. Please start over.",
        variant: "destructive",
      });
      return;
    }

    setRegeneratingType(narrativeType);
    setNarrativeErrors(prev => ({ ...prev, [narrativeType]: null }));

    const { currentStep, errors: _errors, ...cleanFormData } = formData.formState;
    const response = await regenerateNarrative(narrativeType, cleanFormData);

    if (response.error) {
      setNarrativeErrors(prev => ({ ...prev, [narrativeType]: response.error! }));
      setRegeneratingType(null);
      return;
    }

    if (response.narrative) {
      const updatedNarratives = narratives.map(n => 
        n.type === narrativeType ? response.narrative! : n
      );
      setNarratives(updatedNarratives);

      const updatedResult: GenerationResult = {
        status,
        narratives: updatedNarratives,
        responseLetter,
        errors,
      };
      updateResults(updatedResult);

      const currentCounts = regenCounts || loadRegenerationCounts(sessionId);
      const newCounts = incrementNarrativeCount(currentCounts, narrativeType);
      setRegenCounts(newCounts);
      saveRegenerationCounts(newCounts);

      toast({
        title: "Narrative regenerated",
        description: "Your narrative has been updated with a fresh version.",
      });
    }

    setRegeneratingType(null);
  };

  const handleRegenerateLetter = async () => {
    const formData = loadFormData();
    if (!formData) {
      toast({
        title: "Unable to regenerate",
        description: "Form data is no longer available. Please start over.",
        variant: "destructive",
      });
      return;
    }

    setIsLetterRegenerating(true);
    setLetterError(null);

    const { currentStep, errors: _errors, ...cleanFormData } = formData.formState;
    const response = await regenerateLetter(cleanFormData);

    if (response.error) {
      setLetterError(response.error);
      setIsLetterRegenerating(false);
      return;
    }

    if (response.letter) {
      setResponseLetter(response.letter);

      const updatedResult: GenerationResult = {
        status,
        narratives,
        responseLetter: response.letter,
        errors,
      };
      updateResults(updatedResult);

      const currentCounts = regenCounts || loadRegenerationCounts(sessionId);
      const newCounts = incrementLetterCount(currentCounts);
      setRegenCounts(newCounts);
      saveRegenerationCounts(newCounts);

      toast({
        title: "Letter regenerated",
        description: "Your response letter has been updated with a fresh version.",
      });
    }

    setIsLetterRegenerating(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">
              Loading your results{loadAttempts > 0 ? ` (attempt ${loadAttempts + 1})` : ''}...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onLogoClick={handleLogoClick} onFaqClick={handleFaqClick}>
      <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-white via-primary/5 to-slate-100/50 dark:from-slate-950 dark:via-primary/10 dark:to-slate-900 relative overflow-hidden"
        aria-labelledby="results-heading"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-chart-2/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <Card className="border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-amber-200/50 dark:bg-amber-800/30 flex items-center justify-center">
                    <AlertTriangle
                      className="w-6 h-6 text-amber-700 dark:text-amber-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">
                    Important Disclaimer
                  </h2>
                  <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                    These documents are personalized tools to help you prepare
                    for employment conversations. They are not legal advice.
                    Please review and customize them to reflect your personal
                    situation before using them with potential employers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {status === "partial_fail" && errors.length > 0 && (
            <PartialFailureAlert
              errors={errors}
              onRetry={handleRetryFailed}
              isRetrying={isRetrying}
            />
          )}

          <div className="text-center space-y-5 py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg ring-2 ring-primary/20 ring-offset-2 mx-auto">
              <FileText className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
            <h1
              id="results-heading"
              className="text-3xl md:text-4xl font-bold text-foreground"
            >
              Your Documents Are Ready
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Review and download your personalized documents below.
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
              <div data-testid="section-narratives">
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
              <div data-testid="section-letter">
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

          <div className="pt-8 border-t-2 border-border/50 space-y-6">
            {(hasNarratives || hasLetter) && (
              <Button
                size="lg"
                className="w-full group shadow-lg hover:shadow-xl transition-all"
                onClick={handleDownloadAllDocuments}
                data-testid="button-download-all"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" aria-hidden="true" />
                Download All Documents
              </Button>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-muted/30 p-6 rounded-2xl border border-border/50">
              <p className="text-sm font-medium text-muted-foreground text-center sm:text-left">
                Need to make changes? You can start over anytime.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleStartOver}
                  className="group border-2"
                  data-testid="button-start-over"
                >
                  <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  Start Over
                </Button>
                <Button
                  className="bg-chart-2 hover:bg-chart-2/90 text-white shadow-md hover:shadow-lg transition-all group"
                  onClick={handleLearnMoreClick}
                  data-testid="button-learn-more-results"
                >
                  <BookOpen className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          <ResultsGuidanceSection 
            hasNarratives={hasNarratives} 
            hasLetter={hasLetter}
            activeResultType={activeTab}
          />
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
    </Layout>
  );
}
