import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useDocumentActions } from "@/hooks/useDocumentActions";
import { ToolType } from "@/lib/formState";
import { NarrativeItem, ResponseLetter, GenerationResult } from "@/lib/resultsPersistence";
import { NarrativeType } from "@/lib/regenerationPersistence";
import { getDocumentVisibility } from "@/lib/utils";
import { useResultsLoader } from "./useResultsLoader";
import { useResultsRegeneration } from "./useResultsRegeneration";
import { useResultsExitActions } from "./useResultsExitActions";
import { DocumentTab } from "@/components/results/DocumentSwitcher";

export interface UseResultsPageParams {
  tool: ToolType;
}

export interface UseResultsPageReturn {
  // UI state
  ui: {
    isLoading: boolean;
    loadAttempts: number;
    hasNarratives: boolean;
    hasLetter: boolean;
    hasBoth: boolean;
    activeTab: DocumentTab;
    setActiveTab: (tab: DocumentTab) => void;
    showNarratives: boolean;
    showResponseLetter: boolean;
  };

  // Data
  data: {
    narratives: NarrativeItem[];
    responseLetter: ResponseLetter | null;
    status: GenerationResult["status"];
    errors: GenerationResult["errors"];
    regenNarrativeCounts: Record<NarrativeType, number>;
    regenLetterCount: number;
  };

  // Actions
  actions: {
    // Document actions
    downloadAll: () => void;
    copyNarrative: (narrative: NarrativeItem) => Promise<boolean>;
    downloadNarrative: (narrative: NarrativeItem) => void;
    copyLetter: (letter: ResponseLetter) => Promise<boolean>;
    downloadLetter: (letter: ResponseLetter) => void;

    // Regeneration actions
    regenerateNarrative: (type: NarrativeType) => Promise<void>;
    regenerateLetter: () => Promise<void>;
    retryPartialFail: () => void;

    // Exit actions
    startOver: () => void;
    learnMore: () => void;
    confirmExit: () => void;
    cancelExit: () => void;
  };

  // Async operation states
  state: {
    regeneratingType: NarrativeType | null;
    narrativeErrors: Record<NarrativeType, string | null>;
    isLetterRegenerating: boolean;
    letterError: string | null;
    exitModalOpen: boolean;
    isRetrying: boolean;
  };
}

/**
 * Facade hook that composes all Results page logic.
 * Reduces hook noise in the page component by providing a single, clean API.
 *
 * @param params - Configuration object with validated tool type
 * @returns Grouped API surface for UI state, data, actions, and async states
 */
export function useResultsPage({ tool }: UseResultsPageParams): UseResultsPageReturn {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isRetrying, setIsRetrying] = useState(false);

  // Load results with retry logic
  const {
    isLoading,
    loadAttempts,
    narratives,
    responseLetter,
    status,
    errors,
    sessionId,
    regenCounts,
    activeTab,
    setActiveTab,
    setNarratives,
    setResponseLetter,
    setStatus,
    setErrors,
    setRegenCounts,
  } = useResultsLoader({ tool, navigate });

  // Regeneration logic
  const {
    handleRegenerateNarrative,
    regeneratingType,
    narrativeErrors,
    handleRegenerateLetter,
    isLetterRegenerating,
    letterError,
  } = useResultsRegeneration({
    sessionId,
    narratives,
    setNarratives,
    responseLetter,
    setResponseLetter,
    status,
    errors,
    regenCounts,
    setRegenCounts,
  });

  // Exit actions and modal state
  const {
    exitModalOpen,
    handleStartOver,
    handleLearnMoreClick,
    handleConfirmExit,
    handleCancelExit,
  } = useResultsExitActions();

  // Document actions (copy, download)
  const {
    handleCopyNarrative,
    handleCopyLetter,
    handleDownloadNarrative,
    handleDownloadLetter,
    handleDownloadAll,
  } = useDocumentActions();

  // Compute visibility flags
  const { showNarratives, showResponseLetter } = getDocumentVisibility(tool);
  const hasNarratives = showNarratives && narratives.length > 0;
  const hasLetter = showResponseLetter && responseLetter !== null;
  const hasBoth = hasNarratives && hasLetter;

  // Retry handler for partial failures
  const handleRetryFailed = () => {
    setIsRetrying(true);
    toast({
      title: "Retry not available yet",
      description: "Regeneration functionality will be added in a future update. Please start over to generate new documents.",
    });
    setTimeout(() => setIsRetrying(false), 1000);
  };

  // Download all documents handler
  const handleDownloadAllDocuments = () => {
    handleDownloadAll(narratives, responseLetter);
  };

  return {
    ui: {
      isLoading,
      loadAttempts,
      hasNarratives,
      hasLetter,
      hasBoth,
      activeTab,
      setActiveTab,
      showNarratives,
      showResponseLetter,
    },
    data: {
      narratives,
      responseLetter,
      status,
      errors,
      regenNarrativeCounts: regenCounts.narratives,
      regenLetterCount: regenCounts.letter,
    },
    actions: {
      downloadAll: handleDownloadAllDocuments,
      copyNarrative: handleCopyNarrative,
      downloadNarrative: handleDownloadNarrative,
      copyLetter: handleCopyLetter,
      downloadLetter: handleDownloadLetter,
      regenerateNarrative: handleRegenerateNarrative,
      regenerateLetter: handleRegenerateLetter,
      retryPartialFail: handleRetryFailed,
      startOver: handleStartOver,
      learnMore: handleLearnMoreClick,
      confirmExit: handleConfirmExit,
      cancelExit: handleCancelExit,
    },
    state: {
      regeneratingType,
      narrativeErrors,
      isLetterRegenerating,
      letterError,
      exitModalOpen,
      isRetrying,
    },
  };
}
