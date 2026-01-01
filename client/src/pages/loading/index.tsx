import { useEffect, useCallback, useRef } from "react";
import { useSearch, useLocation } from "wouter";
import { ToolType } from "@/lib/formState";
import { DisclaimerModal } from "@/components/disclaimer/DisclaimerModal";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { useMessageCycle } from "./hooks/useMessageCycle";
import { useQuoteCycle } from "./hooks/useQuoteCycle";
import { useDocumentGeneration } from "./hooks/useDocumentGeneration";
import { loadingMessages, motivationalQuotes } from "./data/loadingContent";
import { validateToolParam } from "./utils/validateToolParam";
import { ErrorView } from "./sections/ErrorView";
import { LoadingView } from "./sections/LoadingView";
import "./styles/loading.css";
import "./styles/error.css";

export default function Loading() {
  // Register this page as protected from navigation
  useProtectedPage();

  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = validateToolParam(params.get("tool"));

  // Document generation with proper error handling and retry logic
  // Note: We need to pass the reset callback, but it depends on hooks defined below.
  // We'll use a ref pattern to avoid circular dependencies.
  const resetCallbackRef = useRef<(() => void) | null>(null);

  const { generationState, showDisclaimer, startGeneration, handleRetry } = useDocumentGeneration(
    tool,
    () => resetCallbackRef.current?.()
  );

  // Message cycling with proper timer cleanup
  const { messageIndex, isMessageVisible, showQuotes, reset: resetMessages } = useMessageCycle(
    generationState.status === "loading",
    loadingMessages
  );

  // Quote cycling with proper timer cleanup
  const { quoteIndex, isQuoteVisible, reset: resetQuotes } = useQuoteCycle(
    showQuotes,
    generationState.status === "loading",
    motivationalQuotes.length
  );

  // Set up the combined reset callback
  resetCallbackRef.current = useCallback(() => {
    resetMessages();
    resetQuotes();
  }, [resetMessages, resetQuotes]);

  // Start generation on mount (with strict mode protection)
  const hasStartedRef = useRef(false);
  useEffect(() => {
    // Prevent double-invoke in React 18 strict mode during development
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
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
      <LoadingView
        messageIndex={messageIndex}
        isMessageVisible={isMessageVisible}
        quoteIndex={quoteIndex}
        isQuoteVisible={isQuoteVisible}
        showQuotes={showQuotes}
      />
      <DisclaimerModal
        open={showDisclaimer}
        onContinue={handleDisclaimerContinue}
      />
    </>
  );
}
