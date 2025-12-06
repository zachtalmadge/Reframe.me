import { Copy, Download, Check, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NarrativeItem } from "@/lib/resultsPersistence";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MAX_REGENERATIONS } from "@/lib/regenerationPersistence";

const narrativeTypeLabels: Record<string, string> = {
  full_disclosure: "Direct & Professional",
  skills_focused: "Skills-First Approach",
  growth_journey: "Growth-Focused",
  minimal_disclosure: "Brief & Confident",
  values_aligned: "Values-Aligned",
};

const narrativeTypeDescriptions: Record<string, string> = {
  full_disclosure: "Honest, straightforward acknowledgment with emphasis on accountability",
  skills_focused: "Leads with qualifications and abilities, briefly acknowledges background",
  growth_journey: "Emphasizes personal transformation and rehabilitation journey",
  minimal_disclosure: "Concise acknowledgment without over-explaining, projects confidence",
  values_aligned: "Connects personal values and growth to the organization's mission",
};

interface NarrativeCardProps {
  narrative: NarrativeItem;
  index: number;
  onCopy: (narrative: NarrativeItem) => Promise<boolean> | boolean;
  onDownload: (narrative: NarrativeItem) => void;
  onRegenerate?: (narrativeType: NarrativeItem["type"]) => void;
  isRegenerating?: boolean;
  regenCount?: number;
  regenError?: string | null;
}

export function NarrativeCard({ 
  narrative, 
  index, 
  onCopy, 
  onDownload,
  onRegenerate,
  isRegenerating = false,
  regenCount = 0,
  regenError = null,
}: NarrativeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await onCopy(narrative);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate && canRegenerate) {
      onRegenerate(narrative.type);
    }
  };

  const label = narrative.title || narrativeTypeLabels[narrative.type] || `Narrative ${index + 1}`;
  const description = narrativeTypeDescriptions[narrative.type] || "";
  const canRegenerate = regenCount < MAX_REGENERATIONS;
  const remainingRegens = MAX_REGENERATIONS - regenCount;

  const regenerateButton = (
    <Button
      variant="outline"
      size="sm"
      className="flex-1"
      onClick={handleRegenerate}
      disabled={!canRegenerate || isRegenerating || !onRegenerate}
      data-testid={`button-regenerate-narrative-${index + 1}`}
    >
      {isRegenerating ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <RefreshCw className="w-4 h-4 mr-2" />
      )}
      {isRegenerating ? "Regenerating..." : `Regenerate (${remainingRegens} left)`}
    </Button>
  );

  return (
    <Card 
      className="h-full flex flex-col relative"
      data-testid={`narrative-card-${index + 1}`}
    >
      {isRegenerating && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Generating new narrative...</span>
          </div>
        </div>
      )}
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-foreground">
            {label}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {regenError && (
          <Alert variant="destructive" className="mb-3">
            <AlertDescription className="text-sm">
              {regenError}
            </AlertDescription>
          </Alert>
        )}
        <div 
          className="flex-1 overflow-y-auto text-sm text-foreground leading-relaxed whitespace-pre-wrap pr-2 scrollbar-thin"
          style={{ maxHeight: "300px" }}
        >
          {narrative.content}
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t border-border flex-shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleCopy}
            disabled={isRegenerating}
            data-testid={`button-copy-narrative-${index + 1}`}
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onDownload(narrative)}
            disabled={isRegenerating}
            data-testid={`button-download-narrative-${index + 1}`}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {onRegenerate && (
            canRegenerate ? (
              regenerateButton
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex-1 inline-flex" tabIndex={0}>
                    {regenerateButton}
                  </span>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  collisionPadding={16}
                  className="max-w-xs text-center"
                >
                  <p>You've regenerated this narrative several times. For deeper edits, try copying it into an AI tool or working with a trusted helper for further refinement.</p>
                </TooltipContent>
              </Tooltip>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
