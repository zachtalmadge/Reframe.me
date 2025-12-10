import { NarrativeItem } from "./resultsPersistence";

export const MAX_REGENERATIONS = 3;

export type NarrativeType = NarrativeItem["type"];

export interface RegenerationCounts {
  sessionId: string;
  narratives: Record<NarrativeType, number>;
  letter: number;
}

const REGEN_COUNTS_KEY = "reflectme_regen_counts";

function createEmptyCounts(sessionId: string): RegenerationCounts {
  return {
    sessionId,
    narratives: {
      justice_focused_org: 0,
      general_employer: 0,
      minimal_disclosure: 0,
      transformation_focused: 0,
      skills_focused: 0,
    },
    letter: 0,
  };
}

export function saveRegenerationCounts(counts: RegenerationCounts): void {
  try {
    sessionStorage.setItem(REGEN_COUNTS_KEY, JSON.stringify(counts));
  } catch (e) {
    console.error("Failed to save regeneration counts:", e);
  }
}

export function loadRegenerationCounts(sessionId: string): RegenerationCounts {
  try {
    const stored = sessionStorage.getItem(REGEN_COUNTS_KEY);
    if (!stored) {
      return createEmptyCounts(sessionId);
    }

    const data: RegenerationCounts = JSON.parse(stored);
    
    if (data.sessionId !== sessionId) {
      return createEmptyCounts(sessionId);
    }

    return data;
  } catch (e) {
    console.error("Failed to load regeneration counts:", e);
    return createEmptyCounts(sessionId);
  }
}

export function clearRegenerationCounts(): void {
  try {
    sessionStorage.removeItem(REGEN_COUNTS_KEY);
  } catch (e) {
    console.error("Failed to clear regeneration counts:", e);
  }
}

export function incrementNarrativeCount(
  counts: RegenerationCounts,
  narrativeType: NarrativeType
): RegenerationCounts {
  return {
    ...counts,
    narratives: {
      ...counts.narratives,
      [narrativeType]: (counts.narratives[narrativeType] || 0) + 1,
    },
  };
}

export function incrementLetterCount(counts: RegenerationCounts): RegenerationCounts {
  return {
    ...counts,
    letter: counts.letter + 1,
  };
}

export function canRegenerateNarrative(
  counts: RegenerationCounts,
  narrativeType: NarrativeType
): boolean {
  return (counts.narratives[narrativeType] || 0) < MAX_REGENERATIONS;
}

export function canRegenerateLetter(counts: RegenerationCounts): boolean {
  return counts.letter < MAX_REGENERATIONS;
}

export function getRemainingNarrativeRegenerations(
  counts: RegenerationCounts,
  narrativeType: NarrativeType
): number {
  return Math.max(0, MAX_REGENERATIONS - (counts.narratives[narrativeType] || 0));
}

export function getRemainingLetterRegenerations(counts: RegenerationCounts): number {
  return Math.max(0, MAX_REGENERATIONS - counts.letter);
}
