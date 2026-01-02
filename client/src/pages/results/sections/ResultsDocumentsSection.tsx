import { Card, CardContent } from "@/components/ui/card";
import { NarrativeCarousel } from "@/components/results/NarrativeCarousel";
import { ResponseLetterPanel } from "@/components/results/ResponseLetterPanel";
import { DocumentSwitcher, DocumentTab } from "@/components/results/DocumentSwitcher";
import { NarrativeItem, ResponseLetter } from "@/lib/resultsPersistence";
import { NarrativeType, RegenerationCounts } from "@/lib/regenerationPersistence";

interface ResultsDocumentsSectionProps {
  // Display state
  hasBoth: boolean;
  hasNarratives: boolean;
  hasLetter: boolean;
  showNarratives: boolean;
  showResponseLetter: boolean;
  activeTab: DocumentTab;
  setActiveTab: (tab: DocumentTab) => void;

  // Data
  narratives: NarrativeItem[];
  responseLetter: ResponseLetter | null;

  // Narrative actions
  onCopyNarrative: (narrative: NarrativeItem) => void;
  onDownloadNarrative: (narrative: NarrativeItem) => void;
  onRegenerateNarrative: (type: NarrativeType) => Promise<void>;
  regeneratingType: NarrativeType | null;
  regenCounts: RegenerationCounts | null;
  narrativeErrors: Record<NarrativeType, string | null>;

  // Letter actions
  onCopyLetter: (letter: ResponseLetter) => void;
  onDownloadLetter: (letter: ResponseLetter) => void;
  onRegenerateLetter: () => Promise<void>;
  isLetterRegenerating: boolean;
  letterError: string | null;
}

export default function ResultsDocumentsSection({
  hasBoth,
  hasNarratives,
  hasLetter,
  showNarratives,
  showResponseLetter,
  activeTab,
  setActiveTab,
  narratives,
  responseLetter,
  onCopyNarrative,
  onDownloadNarrative,
  onRegenerateNarrative,
  regeneratingType,
  regenCounts,
  narrativeErrors,
  onCopyLetter,
  onDownloadLetter,
  onRegenerateLetter,
  isLetterRegenerating,
  letterError,
}: ResultsDocumentsSectionProps) {
  return (
    <>
      {hasBoth && (
        <div className="flex justify-center">
          <DocumentSwitcher
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasNarratives={hasNarratives}
            hasLetter={hasLetter}
          />
        </div>
      )}

      <div className="space-y-6">
        {(activeTab === "narratives" || !hasBoth) && hasNarratives && (
          <div data-testid="section-narratives" className="animate-fadeInUp delay-200 opacity-0">
            <NarrativeCarousel
              narratives={narratives}
              onCopy={onCopyNarrative}
              onDownload={onDownloadNarrative}
              onRegenerate={onRegenerateNarrative}
              regeneratingType={regeneratingType}
              regenCounts={regenCounts?.narratives || {} as Record<NarrativeType, number>}
              regenErrors={narrativeErrors}
            />
          </div>
        )}

        {(activeTab === "letter" || !hasBoth) && hasLetter && responseLetter && (
          <div data-testid="section-letter" className="animate-fadeInUp delay-200 opacity-0">
            <ResponseLetterPanel
              letter={responseLetter}
              onCopy={onCopyLetter}
              onDownload={onDownloadLetter}
              onRegenerate={onRegenerateLetter}
              isRegenerating={isLetterRegenerating}
              regenCount={regenCounts?.letter || 0}
              regenError={letterError}
            />
          </div>
        )}

        {showNarratives && narratives.length === 0 && !hasLetter && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No narratives were generated. Please try again.
              </p>
            </CardContent>
          </Card>
        )}

        {showResponseLetter && !responseLetter && !hasNarratives && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No response letter was generated. Please try again.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
