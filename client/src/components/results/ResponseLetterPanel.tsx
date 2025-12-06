import { Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ResponseLetter } from "@/lib/resultsPersistence";
import { useState } from "react";

interface ResponseLetterPanelProps {
  letter: ResponseLetter;
  onCopy: (letter: ResponseLetter) => Promise<boolean> | boolean;
  onDownload: (letter: ResponseLetter) => void;
}

export function ResponseLetterPanel({ letter, onCopy, onDownload }: ResponseLetterPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await onCopy(letter);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card 
      className="h-full flex flex-col"
      data-testid="response-letter-panel"
    >
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
            data-testid="button-download-letter"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
