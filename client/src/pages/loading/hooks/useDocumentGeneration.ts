import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  ToolType,
  GenerationState,
  initialGenerationState,
  getErrorMessage,
  GenerationErrorType,
} from "@/lib/formState";
import { loadFormData } from "@/lib/formPersistence";
import { saveResults, loadResults } from "@/lib/resultsPersistence";
import { generateDocuments } from "../utils/generateDocuments";

interface DocumentGenerationResult {
  generationState: GenerationState;
  showDisclaimer: boolean;
  startGeneration: () => Promise<void>;
  handleRetry: () => void;
}

export function useDocumentGeneration(
  tool: ToolType,
  onRetryReset?: () => void
): DocumentGenerationResult {
  const [, navigate] = useLocation();
  const [generationState, setGenerationState] = useState<GenerationState>(initialGenerationState);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

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

  const handleRetry = useCallback(() => {
    // Reset UI state (message/quote cycles) before restarting generation
    if (onRetryReset) {
      onRetryReset();
    }
    startGeneration();
  }, [startGeneration, onRetryReset]);

  return {
    generationState,
    showDisclaimer,
    startGeneration,
    handleRetry,
  };
}
