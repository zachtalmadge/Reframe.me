import { Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NarrativeItem } from "@/lib/resultsPersistence";
import { useState } from "react";

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
}

export function NarrativeCard({ narrative, index, onCopy, onDownload }: NarrativeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await onCopy(narrative);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const label = narrative.title || narrativeTypeLabels[narrative.type] || `Narrative ${index + 1}`;
  const description = narrativeTypeDescriptions[narrative.type] || "";

  return (
    <Card 
      className="h-full flex flex-col"
      data-testid={`narrative-card-${index + 1}`}
    >
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
        <div 
          className="flex-1 overflow-y-auto text-sm text-foreground leading-relaxed whitespace-pre-wrap pr-2 scrollbar-thin"
          style={{ maxHeight: "300px" }}
        >
          {narrative.content}
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t border-border flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleCopy}
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
            data-testid={`button-download-narrative-${index + 1}`}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
