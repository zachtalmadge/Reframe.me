import { useEffect, useState, useCallback } from "react";
import { useSearch, useLocation } from "wouter";
import { Loader2, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  ToolType,
  GenerationState,
  initialGenerationState,
  getErrorMessage,
  GenerationErrorType,
} from "@/lib/formState";
import { loadFormData, clearFormData } from "@/lib/formPersistence";
import { DisclaimerModal } from "@/components/disclaimer/DisclaimerModal";
import { generateDocuments } from "@/lib/api";
import { saveResults } from "@/lib/resultsPersistence";
import { formDataSchema } from "@shared/schema";

const loadingMessages = [
  "Analyzing your information...",
  "Crafting your personalized narrative...",
  "Preparing your documents...",
  "Almost there...",
];

export default function Loading() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = (params.get("tool") as ToolType) || "narrative";

  const [generationState, setGenerationState] = useState<GenerationState>(initialGenerationState);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    if (generationState.status !== "loading") return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [generationState.status]);

  const startGeneration = useCallback(async () => {
    const persistedData = loadFormData();
    if (!persistedData) {
      navigate(`/form?tool=${tool}`);
      return;
    }

    const { formState } = persistedData;
    
    const apiFormData = {
      offenses: formState.offenses,
      releaseMonth: formState.releaseMonth,
      releaseYear: formState.releaseYear,
      programs: formState.programs,
      skills: formState.skills,
      additionalContext: formState.additionalContext,
      jobTitle: formState.jobTitle || undefined,
      employerName: formState.employerName || undefined,
      ownership: formState.ownership || undefined,
      impact: formState.impact || undefined,
      lessonsLearned: formState.lessonsLearned || undefined,
      clarifyingRelevance: formState.clarifyingRelevance || undefined,
      qualifications: formState.qualifications || undefined,
    };

    const parseResult = formDataSchema.safeParse(apiFormData);
    if (!parseResult.success) {
      console.error("Form data validation failed:", parseResult.error.flatten());
      navigate(`/form?tool=${tool}`);
      return;
    }

    setGenerationState((prev) => ({
      ...prev,
      status: "loading",
      error: null,
    }));

    try {
      const response = await generateDocuments({
        tool,
        formData: parseResult.data,
      });
      
      if (response.status === "total_fail") {
        throw new Error("server");
      }
      
      saveResults(response);
      setGenerationState((prev) => ({
        ...prev,
        status: "success",
      }));
      clearFormData();
      setShowDisclaimer(true);
    } catch (err) {
      let errorType: GenerationErrorType = "unknown";
      
      if (err instanceof Error) {
        if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Failed to fetch")) {
          errorType = "network";
        } else if (err.message.includes("timeout")) {
          errorType = "timeout";
        } else if (err.message.includes("500") || err.message.includes("server")) {
          errorType = "server";
        }
      }

      setGenerationState((prev) => ({
        status: "error",
        error: {
          type: errorType,
          message: getErrorMessage(errorType),
        },
        retryCount: prev.retryCount + 1,
      }));
    }
  }, [navigate, tool]);

  useEffect(() => {
    startGeneration();
  }, []);

  const handleRetry = useCallback(() => {
    setMessageIndex(0);
    startGeneration();
  }, [startGeneration]);

  const handleGoBack = useCallback(() => {
    navigate(`/form?tool=${tool}`);
  }, [navigate, tool]);

  const handleDisclaimerContinue = useCallback(() => {
    navigate(`/results?tool=${tool}`);
  }, [navigate, tool]);

  if (generationState.status === "error") {
    return (
      <Layout>
        <section
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
          aria-labelledby="error-heading"
        >
          <div className="max-w-lg mx-auto text-center space-y-8">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle
                className="w-10 h-10 text-destructive"
                aria-hidden="true"
              />
            </div>

            <div className="space-y-4">
              <h1
                id="error-heading"
                className="text-2xl md:text-3xl font-bold text-foreground"
              >
                We couldn't generate your documents right now
              </h1>
              <p
                className="text-lg text-muted-foreground"
                data-testid="text-error-message"
              >
                {generationState.error?.message}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Nothing you entered was lost. Your information is safely saved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={handleRetry}
                data-testid="button-retry"
              >
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={handleGoBack}
                data-testid="button-go-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Go back to form
              </Button>
            </div>

            {generationState.retryCount > 2 && (
              <p className="text-sm text-muted-foreground pt-4">
                Still having trouble? Please try again later or contact support if the issue persists.
              </p>
            )}
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        aria-labelledby="loading-heading"
      >
        <div className="max-w-lg mx-auto text-center space-y-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Loader2
              className="w-10 h-10 text-primary animate-spin"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-4">
            <h1
              id="loading-heading"
              className="text-2xl md:text-3xl font-bold text-foreground"
            >
              Generating Your Documents
            </h1>
            <p
              className="text-lg text-muted-foreground transition-opacity duration-300"
              data-testid="text-loading-message"
              aria-live="polite"
            >
              {loadingMessages[messageIndex]}
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              This usually takes just a few seconds.
            </p>
          </div>
        </div>
      </section>

      <DisclaimerModal
        open={showDisclaimer}
        onContinue={handleDisclaimerContinue}
      />
    </Layout>
  );
}
