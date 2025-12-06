import { Copy, Download, Check, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ResponseLetter } from "@/lib/resultsPersistence";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MAX_REGENERATIONS } from "@/lib/regenerationPersistence";

interface ResponseLetterPanelProps {
  letter: ResponseLetter;
  onCopy: (letter: ResponseLetter) => Promise<boolean> | boolean;
  onDownload: (letter: ResponseLetter) => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  regenCount?: number;
  regenError?: string | null;
}

export function ResponseLetterPanel({ 
  letter, 
  onCopy, 
  onDownload,
  onRegenerate,
  isRegenerating = false,
  regenCount = 0,
  regenError = null,
}: ResponseLetterPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await onCopy(letter);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate && canRegenerate) {
      onRegenerate();
    }
  };

  const canRegenerate = regenCount < MAX_REGENERATIONS;
  const remainingRegens = MAX_REGENERATIONS - regenCount;

  return (
    <Card 
      className="h-full flex flex-col relative"
      data-testid="response-letter-panel"
    >
      {isRegenerating && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Generating new letter...</span>
          </div>
        </div>
      )}
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-foreground">
            {letter.title || "Pre-Adverse Action Response Letter"}
          </h3>
          <p className="text-sm text-muted-foreground">
            A formal response to address concerns raised during the background check process
          </p>
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
          style={{ maxHeight: "350px" }}
          data-testid="text-letter-content"
        >
          {letter.content}
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t border-border flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleCopy}
            disabled={isRegenerating}
            data-testid="button-copy-letter"
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
            onClick={() => onDownload(letter)}
            disabled={isRegenerating}
            data-testid="button-download-letter"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
        {onRegenerate && (
          <div className="mt-2 flex-shrink-0">
            {canRegenerate ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleRegenerate}
                disabled={isRegenerating || !onRegenerate}
                data-testid="button-regenerate-letter"
              >
                {isRegenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isRegenerating ? "Regenerating..." : `Regenerate (${remainingRegens} left)`}
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="w-full inline-flex" tabIndex={0}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled
                      data-testid="button-regenerate-letter"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate (0 left)
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  collisionPadding={16}
                  className="max-w-xs text-center"
                >
                  <p>You've regenerated this letter several times. For deeper edits, try copying it into an AI tool or working with a trusted advisor.</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
