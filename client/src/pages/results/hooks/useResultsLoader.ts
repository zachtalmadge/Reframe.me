import { useState, useEffect } from "react";
import { loadResults, NarrativeItem, ResponseLetter, GenerationResult, DocumentError } from "@/lib/resultsPersistence";
import { loadRegenerationCounts, RegenerationCounts } from "@/lib/regenerationPersistence";
import { DocumentTab } from "@/components/results/DocumentSwitcher";
import { ToolType } from "@/lib/formState";

export interface UseResultsLoaderParams {
  tool: ToolType;
  navigate: (to: string) => void;
}

export interface UseResultsLoaderReturn {
  isLoading: boolean;
  loadAttempts: number;
  narratives: NarrativeItem[];
  responseLetter: ResponseLetter | null;
  status: GenerationResult["status"];
  errors: DocumentError[];
  sessionId: string;
  regenCounts: RegenerationCounts;
  activeTab: DocumentTab;
  setActiveTab: (tab: DocumentTab) => void;
  setNarratives: (narratives: NarrativeItem[]) => void;
  setResponseLetter: (letter: ResponseLetter | null) => void;
  setStatus: (status: GenerationResult["status"]) => void;
  setErrors: (errors: DocumentError[]) => void;
  setRegenCounts: (counts: RegenerationCounts) => void;
}

/**
 * Determines the default active tab based on tool param and available data.
 * Priority: URL tool param > data availability > fallback to narratives
 */
function determineDefaultTab(tool: ToolType, hasNarratives: boolean, hasLetter: boolean): DocumentTab {
  // If tool requests only narratives and they exist, show narratives
  if (tool === "narrative" && hasNarratives) {
    return "narratives";
  }

  // If tool requests only letter and it exists, show letter
  if (tool === "responseLetter" && hasLetter) {
    return "letter";
  }

  // If tool is "both", prefer narratives if available, else letter
  if (tool === "both") {
    if (hasNarratives) {
      return "narratives";
    }
    if (hasLetter) {
      return "letter";
    }
  }

  // If requested type doesn't exist, fallback to first available
  if (hasNarratives) {
    return "narratives";
  }
  if (hasLetter) {
    return "letter";
  }

  // Ultimate fallback
  return "narratives";
}

export function useResultsLoader({ tool, navigate }: UseResultsLoaderParams): UseResultsLoaderReturn {
  const [narratives, setNarratives] = useState<NarrativeItem[]>([]);
  const [responseLetter, setResponseLetter] = useState<ResponseLetter | null>(null);
  const [status, setStatus] = useState<GenerationResult["status"]>("success");
  const [errors, setErrors] = useState<DocumentError[]>([]);
  const [activeTab, setActiveTab] = useState<DocumentTab>("narratives");
  const [sessionId, setSessionId] = useState<string>("");
  const [regenCounts, setRegenCounts] = useState<RegenerationCounts>({
    sessionId: "",
    narratives: {
      justice_focused_org: 0,
      general_employer: 0,
      minimal_disclosure: 0,
      transformation_focused: 0,
      skills_focused: 0,
    },
    letter: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    const MAX_ATTEMPTS = 5;
    const RETRY_DELAY = 150; // ms

    console.log('[Results] Starting load with retry logic, tool:', tool);

    const loadWithRetry = async () => {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
          console.log(`[Results] Load attempt ${attempt + 1}/${MAX_ATTEMPTS}`);
          const persisted = loadResults();

          if (persisted) {
            console.log('[Results] Data loaded successfully:', {
              persistedTool: persisted.tool,
              urlTool: tool,
              narrativesCount: persisted.result.narratives.length,
              hasLetter: persisted.result.responseLetter !== null,
            });

            // Set all data
            setNarratives(persisted.result.narratives);
            setResponseLetter(persisted.result.responseLetter);
            setStatus(persisted.result.status);
            setErrors(persisted.result.errors || []);
            setSessionId(persisted.sessionId);

            // Load regeneration counts with automatic fallback to empty structure
            // loadRegenerationCounts always returns a fully-shaped RegenerationCounts
            const counts = loadRegenerationCounts(persisted.sessionId);
            setRegenCounts(counts);

            // Determine default tab based on tool param and available data
            const hasNarratives = persisted.result.narratives.length > 0;
            const hasLetter = persisted.result.responseLetter !== null;
            const defaultTab = determineDefaultTab(tool, hasNarratives, hasLetter);
            setActiveTab(defaultTab);

            setIsLoading(false);
            return;
          }

          // Retry with exponential backoff
          const delay = RETRY_DELAY * Math.pow(1.5, attempt);
          console.log(`[Results] No data found, retrying in ${Math.round(delay)}ms...`);
          setLoadAttempts(attempt + 1);
          if (attempt < MAX_ATTEMPTS - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (e) {
          console.error(`[Results] Load attempt ${attempt + 1} failed:`, e);
        }
      }

      // All retries exhausted - redirect
      console.error('[Results] FAILED to load results after maximum attempts, redirecting to home');
      navigate("/");
    };

    loadWithRetry();
  }, [tool, navigate]);

  return {
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
  };
}
