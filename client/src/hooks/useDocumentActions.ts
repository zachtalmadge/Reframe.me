import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { NarrativeItem, ResponseLetter } from "@/lib/resultsPersistence";
import {
  buildSingleNarrativePdf,
  buildAllNarrativesPdf,
  buildLetterPdf,
  downloadPdf,
} from "@/lib/pdfUtils";

const narrativeTypeLabels: Record<string, string> = {
  full_disclosure: "Direct & Professional",
  skills_focused: "Skills-First Approach",
  growth_journey: "Growth-Focused",
  minimal_disclosure: "Brief & Confident",
  values_aligned: "Values-Aligned",
};

export function useDocumentActions() {
  const { toast } = useToast();

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`,
      });
      return true;
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try selecting and copying the text manually.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const handleCopyNarrative = useCallback((narrative: NarrativeItem) => {
    const label = narrative.title || narrativeTypeLabels[narrative.type] || "Narrative";
    return copyToClipboard(narrative.content, label);
  }, [copyToClipboard]);

  const handleCopyLetter = useCallback((letter: ResponseLetter) => {
    return copyToClipboard(letter.content, "Response Letter");
  }, [copyToClipboard]);

  const handleDownloadNarrative = useCallback((narrative: NarrativeItem) => {
    try {
      const doc = buildSingleNarrativePdf(narrative);
      const filename = `narrative-${narrative.type}.pdf`;
      downloadPdf(doc, filename);
      toast({
        title: "Download started",
        description: `${filename} is being downloaded.`,
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "We couldn't create the PDF. Please try copying the text instead.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDownloadLetter = useCallback((letter: ResponseLetter) => {
    try {
      const doc = buildLetterPdf(letter);
      downloadPdf(doc, "response-letter.pdf");
      toast({
        title: "Download started",
        description: "response-letter.pdf is being downloaded.",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "We couldn't create the PDF. Please try copying the text instead.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDownloadAllNarratives = useCallback((narratives: NarrativeItem[]) => {
    if (narratives.length === 0) return;

    try {
      const doc = buildAllNarrativesPdf(narratives);
      downloadPdf(doc, "disclosure-narratives.pdf");
      toast({
        title: "Download started",
        description: "disclosure-narratives.pdf is being downloaded.",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "We couldn't create the PDF. Please try copying the text instead.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDownloadAll = useCallback((narratives: NarrativeItem[], letter: ResponseLetter | null) => {
    try {
      const doc = buildAllNarrativesPdf(narratives);
      downloadPdf(doc, "reflectme-documents.pdf");
      toast({
        title: "Download started",
        description: "reflectme-documents.pdf is being downloaded.",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: "We couldn't create the PDF. Please try copying the text instead.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    copyToClipboard,
    handleCopyNarrative,
    handleCopyLetter,
    handleDownloadNarrative,
    handleDownloadLetter,
    handleDownloadAllNarratives,
    handleDownloadAll,
    narrativeTypeLabels,
  };
}
