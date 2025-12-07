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
import { saveResults, GenerationResult } from "@/lib/resultsPersistence";
import { DisclaimerModal } from "@/components/disclaimer/DisclaimerModal";
import { LeaveConfirmationModal } from "@/components/LeaveConfirmationModal";

const loadingMessages = [
  "Analyzing your information...",
  "Crafting your personalized narrative...",
  "Preparing your documents...",
  "Almost there...",
];

const motivationalQuotes = [
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "I can be changed by what happens to me. But I refuse to be reduced by it.", author: "Maya Angelou" },
  { text: "Stumbling is not falling.", author: "Malcolm X" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "There is no future without forgiveness.", author: "Desmond Tutu" },
  { text: "Failure is an important part of your growth and developing resilience.", author: "Michelle Obama" },
  { text: "If there is no struggle, there is no progress.", author: "Frederick Douglass" },
];

async function generateDocuments(
  selection: ToolType,
  formData: Record<string, unknown>
): Promise<GenerationResult> {
  const response = await fetch("/api/generate-documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selection,
      formData,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.errors?.[0]?.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

export default function Loading() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = (params.get("tool") as ToolType) || "narrative";

  const [generationState, setGenerationState] = useState<GenerationState>(initialGenerationState);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [showQuotes, setShowQuotes] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [pendingNavTarget, setPendingNavTarget] = useState<string>("/");

  useEffect(() => {
    if (generationState.status !== "loading") return;

    if (messageIndex >= loadingMessages.length - 1) {
      setShowQuotes(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsMessageVisible(false);
      
      setTimeout(() => {
        setMessageIndex((prev) => prev + 1);
        setIsMessageVisible(true);
      }, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [generationState.status, messageIndex]);

  useEffect(() => {
    if (!showQuotes || generationState.status !== "loading") return;

    const timer = setInterval(() => {
      setIsQuoteVisible(false);
      
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
        setIsQuoteVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(timer);
  }, [showQuotes, generationState.status]);

  const startGeneration = useCallback(async () => {
    const persistedData = loadFormData();
    if (!persistedData) {
      navigate(`/form?tool=${tool}`);
      return;
    }

    setGenerationState((prev) => ({
      ...prev,
      status: "loading",
      error: null,
    }));

    try {
      const result = await generateDocuments(tool, persistedData.formState);
      
      if (result.status === "total_fail") {
        throw new Error(result.errors[0]?.detail || "Failed to generate documents");
      }

      saveResults(result, tool);
      clearFormData();
      
      setGenerationState((prev) => ({
        ...prev,
        status: "success",
      }));
      setShowDisclaimer(true);
    } catch (err) {
      let errorType: GenerationErrorType = "unknown";
      
      if (err instanceof Error) {
        if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Failed to fetch")) {
          errorType = "network";
        } else if (err.message.includes("timeout")) {
          errorType = "timeout";
        } else if (err.message.includes("500") || err.message.includes("server") || err.message.includes("Server error")) {
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
    setIsMessageVisible(true);
    setShowQuotes(false);
    setQuoteIndex(0);
    setIsQuoteVisible(true);
    startGeneration();
  }, [startGeneration]);

  const handleGoBack = useCallback(() => {
    navigate(`/form?tool=${tool}`);
  }, [navigate, tool]);

  const handleDisclaimerContinue = useCallback(() => {
    navigate(`/results?tool=${tool}`);
  }, [navigate, tool]);

  const handleLogoClick = useCallback(() => {
    setPendingNavTarget("/");
    setShowLeaveAlert(true);
  }, []);

  const handleFaqClick = useCallback(() => {
    setPendingNavTarget("/faq");
    setShowLeaveAlert(true);
  }, []);

  const handleConfirmLeave = useCallback(() => {
    clearFormData();
    navigate(pendingNavTarget);
  }, [navigate, pendingNavTarget]);

  const handleCancelLeave = useCallback(() => {
    setShowLeaveAlert(false);
  }, []);

  if (generationState.status === "error") {
    return (
      <Layout onLogoClick={handleLogoClick} onFaqClick={handleFaqClick}>
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
        <LeaveConfirmationModal
          open={showLeaveAlert}
          onConfirm={handleConfirmLeave}
          onCancel={handleCancelLeave}
        />
      </Layout>
    );
  }

  return (
    <Layout onLogoClick={handleLogoClick} onFaqClick={handleFaqClick}>
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
              className={`text-lg text-muted-foreground transition-opacity duration-300 ${
                isMessageVisible ? "opacity-100" : "opacity-0"
              }`}
              data-testid="text-loading-message"
              aria-live="polite"
            >
              {loadingMessages[messageIndex]}
            </p>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showQuotes ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
            aria-hidden="true"
          >
            <div className="pt-2 pb-4">
              <p
                className={`text-base italic text-foreground/80 transition-opacity duration-300 ${
                  isQuoteVisible ? "opacity-100" : "opacity-0"
                }`}
                data-testid="text-motivational-quote"
              >
                "{motivationalQuotes[quoteIndex].text}"
              </p>
              <p
                className={`text-sm text-muted-foreground mt-2 transition-opacity duration-300 ${
                  isQuoteVisible ? "opacity-100" : "opacity-0"
                }`}
                data-testid="text-quote-author"
              >
                — {motivationalQuotes[quoteIndex].author}
              </p>
            </div>
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

      <LeaveConfirmationModal
        open={showLeaveAlert}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
    </Layout>
  );
}
