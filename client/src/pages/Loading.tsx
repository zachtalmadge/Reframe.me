import { useEffect, useCallback } from "react";
import { useSearch, useLocation } from "wouter";
import { ToolType } from "@/lib/formState";
import { DisclaimerModal } from "@/components/disclaimer/DisclaimerModal";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { useMessageCycle } from "./loading/hooks/useMessageCycle";
import { useQuoteCycle } from "./loading/hooks/useQuoteCycle";
import { useDocumentGeneration } from "./loading/hooks/useDocumentGeneration";
import { loadingMessages, motivationalQuotes } from "./loading/data/loadingContent";
import { LoadingOrb } from "./loading/sections/LoadingOrb";
import { StatusMessageCard } from "./loading/sections/StatusMessageCard";
import { MotivationalQuoteCard } from "./loading/sections/MotivationalQuoteCard";
import { ErrorView } from "./loading/sections/ErrorView";
import { LoadingView } from "./loading/sections/LoadingView";
import "./loading/styles/loading.css";
import "./loading/styles/error.css";

export default function Loading() {
  // Register this page as protected from navigation
  useProtectedPage();

  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = (params.get("tool") as ToolType) || "narrative";

  // Document generation with proper error handling and retry logic
  const { generationState, showDisclaimer, startGeneration, handleRetry } = useDocumentGeneration(tool);

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

  // Start generation on mount
  useEffect(() => {
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
