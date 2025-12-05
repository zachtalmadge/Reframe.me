import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitle?: string;
  className?: string;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  stepTitle,
  className,
}: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-4">
        <span
          className="text-sm font-medium text-foreground"
          data-testid="text-step-indicator"
        >
          Step {currentStep} of {totalSteps}
        </span>
        {stepTitle && (
          <span
            className="text-sm text-muted-foreground truncate"
            data-testid="text-step-title"
          >
            {stepTitle}
          </span>
        )}
      </div>
      <Progress
        value={progress}
        className="h-2"
        aria-label={`Progress: step ${currentStep} of ${totalSteps}`}
        data-testid="progress-bar"
      />
    </div>
  );
}
