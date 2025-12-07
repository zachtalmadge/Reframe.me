import { useEffect, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Download, Home, AlertTriangle, BookOpen, MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Layout from "@/components/Layout";
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
      className="mt-8 pt-8 border-t border-border"
      aria-labelledby="guidance-heading"
      data-testid="section-guidance"
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 
            id="guidance-heading"
            className="text-xl sm:text-2xl font-bold text-foreground"
          >
            How to use what you just created
          </h2>
          <p className="text-sm text-muted-foreground">
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
            <div className="bg-muted/30 rounded-lg p-5 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                Getting comfortable with your narratives
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">1</span>
                  <span><strong className="text-foreground">Practice out loud.</strong> Reading silently is different from speaking. Try saying one version a few times until it feels natural.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">2</span>
                  <span><strong className="text-foreground">Pick your anchor sentences.</strong> You don't need to memorize everything. Choose 1-2 sentences that feel most true to you.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">3</span>
                  <span><strong className="text-foreground">Make it your own.</strong> Edit the wording so it sounds like you. These are starting points, not scripts.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">4</span>
                  <span><strong className="text-foreground">Share with someone you trust.</strong> If it helps, practice with a friend, mentor, or counselor who can give you honest feedback.</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                Take your time. There's no rush to use these right away. When you're ready, you'll have words that feel prepared, not panicked.
              </p>
            </div>
          </div>
        )}

        {showLetterGuidance && (
          <div 
            className="space-y-4"
            role="tabpanel"
            aria-labelledby="guidance-heading"
            data-testid="guidance-letter"
          >
            <div className="bg-muted/30 rounded-lg p-5 space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-chart-2" aria-hidden="true" />
                Before you send your letter
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-chart-2/10 text-chart-2 text-xs font-medium flex items-center justify-center">1</span>
                  <span><strong className="text-foreground">Check for accuracy.</strong> Review dates, names, charges, and employer details. Small errors can undermine your message.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-chart-2/10 text-chart-2 text-xs font-medium flex items-center justify-center">2</span>
                  <span><strong className="text-foreground">Make sure it feels honest.</strong> If anything doesn't sit right with you, edit it. You should feel comfortable with every word.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-chart-2/10 text-chart-2 text-xs font-medium flex items-center justify-center">3</span>
                  <span><strong className="text-foreground">Get a second opinion if you can.</strong> Consider sharing it with a trusted friend, reentry counselor, or legal aid organization before sending.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-chart-2/10 text-chart-2 text-xs font-medium flex items-center justify-center">4</span>
                  <span><strong className="text-foreground">Know your timeline.</strong> Pre-adverse action notices usually give you a window to respond. Check the deadline on your notice.</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground italic border-l-2 border-chart-2/30 pl-3">
                This letter is a tool to help you respond thoughtfully. You deserve to be heard, and taking time to get it right is a sign of strength.
              </p>
            </div>
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
    full_disclosure: null,
    skills_focused: null,
    growth_journey: null,
    minimal_disclosure: null,
    values_aligned: null,
  });
  const [letterError, setLetterError] = useState<string | null>(null);

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
    const persisted = loadResults();
    if (!persisted) {
      navigate("/");
      return;
    }

    setNarratives(persisted.result.narratives);
    setResponseLetter(persisted.result.responseLetter);
    setStatus(persisted.result.status);
    setErrors(persisted.result.errors || []);
    setSessionId(persisted.sessionId);

    const counts = loadRegenerationCounts(persisted.sessionId);
    setRegenCounts(counts);

    if (persisted.tool === "responseLetter" || 
        (persisted.tool === "both" && persisted.result.narratives.length === 0 && persisted.result.responseLetter)) {
      setActiveTab("letter");
    }
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

  return (
    <Layout onLogoClick={handleLogoClick} onFaqClick={handleFaqClick}>
      <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8"
        aria-labelledby="results-heading"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <AlertTriangle
                  className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="space-y-2">
                  <h2 className="font-semibold text-foreground">
                    Important Disclaimer
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
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

          <div className="text-center space-y-4">
            <h1
              id="results-heading"
              className="text-2xl md:text-3xl font-bold text-foreground"
            >
              Your Documents Are Ready
            </h1>
            <p className="text-muted-foreground">
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

          <div className="pt-4 border-t border-border space-y-4">
            {(hasNarratives || hasLetter) && (
              <Button
                className="w-full"
                onClick={handleDownloadAllDocuments}
                data-testid="button-download-all"
              >
                <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                Download All Documents
              </Button>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                Need to make changes? You can start over anytime.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleStartOver}
                  data-testid="button-start-over"
                >
                  <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                  Start Over
                </Button>
                <Button
                  className="bg-chart-2 hover:bg-chart-2/90 text-white"
                  onClick={handleLearnMoreClick}
                  data-testid="button-learn-more-results"
                >
                  <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
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

      <AlertDialog open={exitModalOpen} onOpenChange={setExitModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Before you leave this page</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Don't forget to copy or download your results before you leave. We don't want you to lose something important by accident.
              </p>
              <p>
                Once you leave this page, you'll need to start over to generate new narratives or letters.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelExit}
              data-testid="button-cancel-exit"
            >
              Stay on this page
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmExit}
              data-testid="button-confirm-exit"
            >
              Leave anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
