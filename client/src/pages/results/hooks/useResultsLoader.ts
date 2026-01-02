import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { loadResults, NarrativeItem, ResponseLetter, GenerationResult, DocumentError } from "@/lib/resultsPersistence";
import { loadRegenerationCounts, RegenerationCounts } from "@/lib/regenerationPersistence";
import { DocumentTab } from "@/components/results/DocumentSwitcher";

export interface UseResultsLoaderReturn {
  isLoading: boolean;
  loadAttempts: number;
  narratives: NarrativeItem[];
  responseLetter: ResponseLetter | null;
  status: GenerationResult["status"];
  errors: DocumentError[];
  sessionId: string;
  regenCounts: RegenerationCounts | null;
  activeTab: DocumentTab;
  setActiveTab: (tab: DocumentTab) => void;
  setNarratives: (narratives: NarrativeItem[]) => void;
  setResponseLetter: (letter: ResponseLetter | null) => void;
  setStatus: (status: GenerationResult["status"]) => void;
  setErrors: (errors: DocumentError[]) => void;
  setRegenCounts: (counts: RegenerationCounts | null) => void;
}

export function useResultsLoader(): UseResultsLoaderReturn {
  const [, navigate] = useLocation();

  const [narratives, setNarratives] = useState<NarrativeItem[]>([]);
  const [responseLetter, setResponseLetter] = useState<ResponseLetter | null>(null);
  const [status, setStatus] = useState<GenerationResult["status"]>("success");
  const [errors, setErrors] = useState<DocumentError[]>([]);
  const [activeTab, setActiveTab] = useState<DocumentTab>("narratives");
  const [sessionId, setSessionId] = useState<string>("");
  const [regenCounts, setRegenCounts] = useState<RegenerationCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    const MAX_ATTEMPTS = 5;
    const RETRY_DELAY = 150; // ms

    console.log('[Results] Starting load with retry logic');

    const loadWithRetry = async () => {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
          console.log(`[Results] Load attempt ${attempt + 1}/${MAX_ATTEMPTS}`);
          const persisted = loadResults();

          if (persisted) {
            console.log('[Results] Data loaded successfully:', { tool: persisted.tool, narrativesCount: persisted.result.narratives.length });
            // Success - set all data
            setNarratives(persisted.result.narratives);
            setResponseLetter(persisted.result.responseLetter);
            setStatus(persisted.result.status);
            setErrors(persisted.result.errors || []);
            setSessionId(persisted.sessionId);

            const counts = loadRegenerationCounts(persisted.sessionId);
            setRegenCounts(counts);

            if (persisted.tool === "responseLetter" ||
                (persisted.tool === "both" &&
                 persisted.result.narratives.length === 0 &&
                 persisted.result.responseLetter)) {
              setActiveTab("letter");
            }

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
  }, [navigate]);

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
