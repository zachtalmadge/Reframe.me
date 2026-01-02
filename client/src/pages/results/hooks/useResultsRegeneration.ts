import { useState } from "react";
import { NarrativeItem, ResponseLetter, GenerationResult, DocumentError, updateResults } from "@/lib/resultsPersistence";
import { loadFormData } from "@/lib/formPersistence";
import { useToast } from "@/hooks/use-toast";
import { regenerateNarrative, regenerateLetter } from "@/lib/api";
import {
  loadRegenerationCounts,
  saveRegenerationCounts,
  incrementNarrativeCount,
  incrementLetterCount,
  RegenerationCounts,
  NarrativeType,
} from "@/lib/regenerationPersistence";

export interface UseResultsRegenerationParams {
  sessionId: string;
  narratives: NarrativeItem[];
  setNarratives: (narratives: NarrativeItem[]) => void;
  responseLetter: ResponseLetter | null;
  setResponseLetter: (letter: ResponseLetter | null) => void;
  status: GenerationResult["status"];
  errors: DocumentError[];
  regenCounts: RegenerationCounts;
  setRegenCounts: (counts: RegenerationCounts) => void;
}

export interface UseResultsRegenerationReturn {
  handleRegenerateNarrative: (narrativeType: NarrativeType) => Promise<void>;
  regeneratingType: NarrativeType | null;
  narrativeErrors: Record<NarrativeType, string | null>;
  handleRegenerateLetter: () => Promise<void>;
  isLetterRegenerating: boolean;
  letterError: string | null;
}

export function useResultsRegeneration({
  sessionId,
  narratives,
  setNarratives,
  responseLetter,
  setResponseLetter,
  status,
  errors,
  regenCounts,
  setRegenCounts,
}: UseResultsRegenerationParams): UseResultsRegenerationReturn {
  const { toast } = useToast();

  const [regeneratingType, setRegeneratingType] = useState<NarrativeType | null>(null);
  const [isLetterRegenerating, setIsLetterRegenerating] = useState(false);
  const [narrativeErrors, setNarrativeErrors] = useState<Record<NarrativeType, string | null>>({
    justice_focused_org: null,
    general_employer: null,
    minimal_disclosure: null,
    transformation_focused: null,
    skills_focused: null,
  });
  const [letterError, setLetterError] = useState<string | null>(null);

  const handleRegenerateNarrative = async (narrativeType: NarrativeType) => {
    const formData = loadFormData();
    if (!formData) {
      toast({
        title: "Unable to regenerate",
        description: "Form data is no longer available. Please start over.",
        variant: "destructive",
      });
      return;
    }

    setRegeneratingType(narrativeType);
    setNarrativeErrors(prev => ({ ...prev, [narrativeType]: null }));

    const { currentStep, errors: _errors, ...cleanFormData } = formData.formState;
    const response = await regenerateNarrative(narrativeType, cleanFormData);

    if (response.error) {
      setNarrativeErrors(prev => ({ ...prev, [narrativeType]: response.error! }));
      setRegeneratingType(null);
      return;
    }

    if (response.narrative) {
      const updatedNarratives = narratives.map(n =>
        n.type === narrativeType ? response.narrative! : n
      );
      setNarratives(updatedNarratives);

      const updatedResult: GenerationResult = {
        status,
        narratives: updatedNarratives,
        responseLetter,
        errors,
      };
      updateResults(updatedResult);

      const newCounts = incrementNarrativeCount(regenCounts, narrativeType);
      setRegenCounts(newCounts);
      saveRegenerationCounts(newCounts);

      toast({
        title: "Narrative regenerated",
        description: "Your narrative has been updated with a fresh version.",
      });
    }

    setRegeneratingType(null);
  };

  const handleRegenerateLetter = async () => {
    const formData = loadFormData();
    if (!formData) {
      toast({
        title: "Unable to regenerate",
        description: "Form data is no longer available. Please start over.",
        variant: "destructive",
      });
      return;
    }

    setIsLetterRegenerating(true);
    setLetterError(null);

    const { currentStep, errors: _errors, ...cleanFormData } = formData.formState;
    const response = await regenerateLetter(cleanFormData);

    if (response.error) {
      setLetterError(response.error);
      setIsLetterRegenerating(false);
      return;
    }

    if (response.letter) {
      setResponseLetter(response.letter);

      const updatedResult: GenerationResult = {
        status,
        narratives,
        responseLetter: response.letter,
        errors,
      };
      updateResults(updatedResult);

      const newCounts = incrementLetterCount(regenCounts);
      setRegenCounts(newCounts);
      saveRegenerationCounts(newCounts);

      toast({
        title: "Letter regenerated",
        description: "Your response letter has been updated with a fresh version.",
      });
    }

    setIsLetterRegenerating(false);
  };

  return {
    handleRegenerateNarrative,
    regeneratingType,
    narrativeErrors,
    handleRegenerateLetter,
    isLetterRegenerating,
    letterError,
  };
}
