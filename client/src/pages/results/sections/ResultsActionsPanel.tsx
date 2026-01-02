import { Download, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsActionsPanelProps {
  hasNarratives: boolean;
  hasLetter: boolean;
  onDownloadAll: () => void;
  onStartOver: () => void;
  onLearnMore: () => void;
}

export default function ResultsActionsPanel({
  hasNarratives,
  hasLetter,
  onDownloadAll,
  onStartOver,
  onLearnMore,
}: ResultsActionsPanelProps) {
  return (
    <div className="pt-8 border-t border-border/30 space-y-6 animate-fadeInUp delay-300 opacity-0">
      {(hasNarratives || hasLetter) && (
        <Button
          size="lg"
          className="w-full group shadow-md hover:shadow-lg transition-all font-manrope"
          onClick={onDownloadAll}
          data-testid="button-download-all"
        >
          <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" aria-hidden="true" />
          Download All Documents
        </Button>
      )}

      <div className="paper-card flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-border/30">
        <p className="text-sm font-medium text-muted-foreground text-center sm:text-left font-manrope">
          Need to make changes? You can start over anytime.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={onStartOver}
            className="group border font-manrope"
            data-testid="button-start-over"
          >
            <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
            Start Over
          </Button>
          <Button
            className="bg-chart-2 hover:bg-chart-2/90 text-white shadow-md hover:shadow-lg transition-all group font-manrope"
            onClick={onLearnMore}
            data-testid="button-learn-more-results"
          >
            <BookOpen className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" aria-hidden="true" />
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
