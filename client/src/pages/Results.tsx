import { useEffect, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Download, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    clearFormData();
    clearResults();
    clearRegenerationCounts();
    navigate("/");
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
    <Layout onLogoClick={handleLogoClick}>
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
              <Button
                variant="outline"
                onClick={handleStartOver}
                data-testid="button-start-over"
              >
                <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
