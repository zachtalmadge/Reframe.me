import { useEffect, useState, useCallback } from "react";
import { useSearch, useLocation } from "wouter";
import { Loader2, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  ToolType,
  FormState,
  GenerationState,
  initialGenerationState,
  getErrorMessage,
  GenerationErrorType,
} from "@/lib/formState";
import { loadFormData, clearFormData } from "@/lib/formPersistence";
import { saveResults, loadResults, GenerationResult } from "@/lib/resultsPersistence";
import { DisclaimerModal } from "@/components/disclaimer/DisclaimerModal";
import { LeaveConfirmationModal } from "@/components/LeaveConfirmationModal";

const loadingMessages = [
  "Analyzing your information...",
  "Preparing your documents...",
  "Almost there...",
];

const motivationalQuotes = [
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "I can be changed by what happens to me. But I refuse to be reduced by it.", author: "Maya Angelou" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Challenges are what make life interesting; overcoming them is what makes life meaningful.", author: "Joshua J. Marine" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
];

async function generateDocuments(
  selection: ToolType,
  formData: FormState,
  timeoutMs: number = 60000 // 60 seconds
): Promise<GenerationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("/api/generate-documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selection,
        formData,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0]?.detail || `Server error: ${response.status}`);
    }

    return response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw err;
  }
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
    // Detect mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    console.log('[Loading] Starting generation', { tool, isMobile });

    const persistedData = loadFormData();
    if (!persistedData) {
      console.error('[Loading] No persisted form data found, redirecting to form');
      navigate(`/form?tool=${tool}`);
      return;
    }

    console.log('[Loading] Form data loaded successfully');

    setGenerationState((prev) => ({
      ...prev,
      status: "loading",
      error: null,
    }));

    /**
     * WORKAROUND: Automatic silent retry on mobile
     *
     * Problem: On mobile browsers (especially iOS Safari), document generation fails on first
     * attempt but succeeds on second attempt. Root cause appears to be race condition with
     * sessionStorage writes or network/API initialization timing issues on mobile.
     *
     * Solution: Automatically retry once on mobile without showing error to user. This makes
     * the failure invisible - user sees continuous loading animation while we retry in background.
     *
     * TODO: Remove this workaround once root cause is identified and fixed. Possible fixes:
     * - Investigate sessionStorage write delays on mobile Safari
     * - Check for API/network initialization issues on mobile
     * - Review AppInitializer timing and route protection logic
     * - Consider using alternative storage mechanism that doesn't have mobile timing issues
     *
     * To test if this is still needed: Set maxAttempts to 1 for mobile and test on iPhone Safari
     */
    const maxAttempts = isMobile ? 2 : 1;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`[Loading] WORKAROUND: Silent retry attempt ${attempt}/${maxAttempts} on mobile`);
          // Small delay before retry to let any timing issues resolve
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        const timeout = isMobile ? 90000 : 60000; // 90s mobile, 60s desktop
        console.log('[Loading] Calling generateDocuments with timeout:', timeout);

        const result = await generateDocuments(tool, persistedData.formState, timeout);
        console.log('[Loading] Generation result:', result.status);

        if (result.status === "total_fail") {
          throw new Error(result.errors[0]?.detail || "Failed to generate documents");
        }

        console.log('[Loading] Saving results to sessionStorage');
        const saveResult = saveResults(result, tool);
        if (!saveResult.success) {
          console.error('[Loading] Failed to save results:', saveResult.error);
          // Still continue to show disclaimer - data is in memory
        } else {
          console.log('[Loading] Results saved successfully');
        }

        // On mobile, add delay and verify save completed before proceeding
        if (isMobile) {
          console.log('[Loading] Mobile detected, waiting 150ms for storage stabilization');
          await new Promise(resolve => setTimeout(resolve, 150));

          // Verify the save actually worked
          const verification = loadResults();
          if (!verification) {
            console.error('[Loading] Save verification FAILED on mobile, retrying save...');
            saveResults(result, tool);
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify again
            const secondVerification = loadResults();
            if (!secondVerification) {
              console.error('[Loading] Second save verification FAILED! Data may be lost.');
            } else {
              console.log('[Loading] Second save successful');
            }
          } else {
            console.log('[Loading] Save verification successful');
          }
        }

        console.log('[Loading] Setting success state and showing disclaimer');
        setGenerationState((prev) => ({
          ...prev,
          status: "success",
        }));
        setShowDisclaimer(true);

        // SUCCESS - break out of retry loop
        return;

      } catch (err) {
        console.error(`[Loading] Generation error on attempt ${attempt}/${maxAttempts}:`, err);
        lastError = err as Error;

        // If this was our last attempt, show the error
        if (attempt === maxAttempts) {
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
        // If not last attempt, continue loop for silent retry
      }
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
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-red-50/50 via-slate-50 to-slate-100/50 dark:from-red-950/20 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden"
          aria-labelledby="error-heading"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-red-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-red-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="max-w-lg mx-auto text-center space-y-8 relative z-10">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-destructive/20 rounded-full animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center shadow-xl ring-4 ring-destructive/20">
                <AlertCircle
                  className="w-12 h-12 text-destructive"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h1
                id="error-heading"
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                We couldn't generate your documents right now
              </h1>
              <p
                className="text-lg md:text-xl text-muted-foreground"
                data-testid="text-error-message"
              >
                {generationState.error?.message}
              </p>
            </div>

            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-6 border-2 border-border/50 shadow-lg">
              <p className="text-base text-muted-foreground font-medium">
                Nothing you entered was lost. Your information is safely saved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={handleRetry}
                size="lg"
                className="group shadow-lg hover:shadow-xl transition-all"
                data-testid="button-retry"
              >
                <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" aria-hidden="true" />
                Try Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleGoBack}
                className="group border-2"
                data-testid="button-go-back"
              >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
                Go back to form
              </Button>
            </div>

            {generationState.retryCount > 2 && (
              <p className="text-sm text-muted-foreground pt-4 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
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
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden bg-gradient-to-b from-teal-50/30 via-white to-orange-50/20"
        aria-labelledby="loading-heading"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

          .loading-heading {
            font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
            letter-spacing: -0.03em;
          }

          @keyframes gentle-pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.08);
              opacity: 0.7;
            }
          }

          @keyframes soft-breathe {
            0%, 100% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.9;
            }
          }

          @keyframes ripple {
            0% {
              transform: scale(0.8);
              opacity: 0.6;
            }
            70% {
              transform: scale(1.8);
              opacity: 0.15;
            }
            100% {
              transform: scale(2.2);
              opacity: 0;
            }
          }

          @keyframes fade-in-out {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.05; }
          }
        `}</style>

        {/* Subtle background accent - single calm orb */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(13, 148, 136, 0.08) 0%, transparent 70%)',
              animation: 'fade-in-out 8s ease-in-out infinite'
            }}
          />
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-12 relative z-10">
          {/* Simplified calm loader - concentric breathing circles */}
          <div className="relative w-32 h-32 mx-auto">
            {/* Outer ripple rings - like sonar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-full h-full rounded-full border-2 border-teal-300"
                style={{
                  animation: 'ripple 6s ease-out infinite'
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-full h-full rounded-full border-2 border-teal-300"
                style={{
                  animation: 'ripple 6s ease-out infinite 2s'
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-full h-full rounded-full border-2 border-teal-300"
                style={{
                  animation: 'ripple 6s ease-out infinite 4s'
                }}
              />
            </div>

            {/* Central breathing circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400/40 to-teal-500/40 backdrop-blur-sm flex items-center justify-center shadow-lg"
                style={{
                  animation: 'soft-breathe 5s ease-in-out infinite'
                }}
              >
                <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-teal-500"
                    style={{
                      animation: 'gentle-pulse 3s ease-in-out infinite'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h1
              id="loading-heading"
              className="loading-heading text-3xl md:text-4xl font-bold text-gray-800"
            >
              Generating Your Documents
            </h1>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-teal-100/50 shadow-sm">
              <p
                className={`text-lg md:text-xl text-gray-700 transition-opacity duration-500 ${
                  isMessageVisible ? "opacity-100" : "opacity-0"
                }`}
                data-testid="text-loading-message"
                aria-live="polite"
              >
                {loadingMessages[messageIndex]}
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-700 ease-in-out overflow-hidden ${
              showQuotes ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
            }`}
            aria-hidden="true"
          >
            <div className="bg-gradient-to-br from-white/80 to-teal-50/40 backdrop-blur-sm rounded-2xl p-10 border border-teal-100/30 shadow-sm">
              <div className="relative space-y-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent mx-auto" />
                <p
                  className={`text-lg md:text-xl text-gray-700 leading-relaxed transition-opacity duration-500 ${
                    isQuoteVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}
                  data-testid="text-motivational-quote"
                >
                  {motivationalQuotes[quoteIndex].text}
                </p>
                <p
                  className={`text-sm text-gray-500 font-medium transition-opacity duration-500 ${
                    isQuoteVisible ? "opacity-100" : "opacity-0"
                  }`}
                  data-testid="text-quote-author"
                >
                  — {motivationalQuotes[quoteIndex].author}
                </p>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent mx-auto" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-500">
              This usually takes just a few seconds
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
