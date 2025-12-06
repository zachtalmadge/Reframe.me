import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DocumentError } from "@/lib/resultsPersistence";

interface PartialFailureAlertProps {
  errors: DocumentError[];
  onRetry: () => void;
  isRetrying: boolean;
}

export function PartialFailureAlert({ errors, onRetry, isRetrying }: PartialFailureAlertProps) {
  if (errors.length === 0) {
    return null;
  }

  const narrativeErrors = errors.filter(e => e.documentType === "narrative");
  const letterErrors = errors.filter(e => e.documentType === "responseLetter");

  return (
    <Alert variant="destructive" className="mb-4" data-testid="alert-partial-failure">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Some documents couldn't be generated</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-1 text-sm">
          {narrativeErrors.length > 0 && (
            <p>Failed to generate {narrativeErrors.length} narrative{narrativeErrors.length > 1 ? "s" : ""}</p>
          )}
          {letterErrors.length > 0 && (
            <p>Failed to generate the response letter</p>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3"
          onClick={onRetry}
          disabled={isRetrying}
          data-testid="button-retry-generation"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? "animate-spin" : ""}`} />
          {isRetrying ? "Retrying..." : "Retry Failed Documents"}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
