import { useEffect, useState, useCallback } from "react";
import { useSearch, useLocation } from "wouter";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { generateDocuments } from "./loading/utils/generateDocuments";
import { useMessageCycle } from "./loading/hooks/useMessageCycle";
import { useQuoteCycle } from "./loading/hooks/useQuoteCycle";
import { loadingMessages, motivationalQuotes } from "./loading/data/loadingContent";
import { LoadingOrb } from "./loading/sections/LoadingOrb";
import { StatusMessageCard } from "./loading/sections/StatusMessageCard";
import { MotivationalQuoteCard } from "./loading/sections/MotivationalQuoteCard";
import { ErrorView } from "./loading/sections/ErrorView";
import "./loading/styles/loading.css";
import "./loading/styles/error.css";

export default function Loading() {
  // Register this page as protected from navigation
  useProtectedPage();

  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = (params.get("tool") as ToolType) || "narrative";

  const [generationState, setGenerationState] = useState<GenerationState>(initialGenerationState);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Message cycling with proper timer cleanup
  const { messageIndex, isMessageVisible, showQuotes } = useMessageCycle(
    generationState.status === "loading",
    loadingMessages
  );

  // Quote cycling with proper timer cleanup
  const { quoteIndex, isQuoteVisible } = useQuoteCycle(
    showQuotes,
    generationState.status === "loading",
    motivationalQuotes.length
  );

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
     * WORKAROUND: Automatic silent retry on all devices
     *
     * Problem: Document generation fails on first attempt but succeeds on second attempt.
     * This happens on:
     * - Mobile browsers (especially iOS Safari) - sessionStorage writes or network/API initialization timing
     * - Desktop on first load after deployment - serverless cold start / OpenAI client initialization
     *
     * Solution: Automatically retry once without showing error to user. This makes the failure
     * invisible - user sees continuous loading animation while we retry in background.
     *
     * Root causes:
     * - Server side: OpenAI client lazy initialization on cold start (first request after deploy)
     * - Client side: sessionStorage timing issues on mobile Safari
     *
     * TODO: Fix root causes:
     * - Server: Pre-warm OpenAI client on server startup instead of lazy loading
     * - Client: Investigate sessionStorage write delays and consider alternative storage
     * - Review AppInitializer timing and route protection logic
     *
     * To test if still needed: Set maxAttempts to 1 and test on fresh deployment
     */
    const maxAttempts = 2; // Apply retry to all devices for cold-start resilience
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`[Loading] WORKAROUND: Silent retry attempt ${attempt}/${maxAttempts} (cold-start protection)`);
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

  const handleDisclaimerContinue = () => {
    navigate(`/results?tool=${tool}`);
  };

  if (generationState.status === "error") {
    return (
      <ErrorView
        errorMessage={generationState.error?.message}
        retryCount={generationState.retryCount}
        onRetry={handleRetry}
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <>
      <section
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, #fdfcfb 0%, #fef9f3 30%, #fef6ee 60%, #fefaf8 100%)'
        }}
        aria-labelledby="loading-heading"
      >
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} />

        {/* Animated ink blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="ink-blob" />
          <div className="ink-blob" />
          <div className="ink-blob" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Main loading visualization - organic breathing orbs */}
          <LoadingOrb />

          {/* Content area with editorial spacing */}
          <div className="space-y-12 md:space-y-14">
            {/* Main heading */}
            <div className="text-center space-y-6">
              <h1
                id="loading-heading"
                className="loading-serif text-3xl md:text-5xl lg:text-6xl font-bold"
                style={{
                  color: '#0f766e',
                  lineHeight: '1.1',
                  textShadow: '0 2px 4px rgba(13, 148, 136, 0.1)'
                }}
              >
                Crafting your{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  story
                </span>
              </h1>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, #0d9488 100%)'
                  }}
                />
                <div className="w-2 h-2 rounded-full"
                  style={{ background: '#f97316' }}
                />
                <div className="w-12 h-px"
                  style={{
                    background: 'linear-gradient(90deg, #0d9488 0%, transparent 100%)'
                  }}
                />
              </div>
            </div>

            {/* Status message card */}
            <StatusMessageCard
              message={loadingMessages[messageIndex]}
              isVisible={isMessageVisible}
            />

            {/* Motivational quotes section */}
            <MotivationalQuoteCard
              quote={motivationalQuotes[quoteIndex]}
              isVisible={isQuoteVisible}
              showQuotes={showQuotes}
            />

            {/* Subtle timing note */}
            <div className="text-center pt-4">
              <p className="loading-sans text-sm font-semibold tracking-wide"
                style={{
                  color: '#64748b',
                  opacity: 0.7
                }}
              >
                This usually takes just a few moments
              </p>
            </div>
          </div>
        </div>
      </section>

      <DisclaimerModal
        open={showDisclaimer}
        onContinue={handleDisclaimerContinue}
      />
    </>
  );
}
