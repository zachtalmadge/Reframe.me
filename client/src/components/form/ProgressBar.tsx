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
    <div className={cn("space-y-4 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 p-6 rounded-2xl border border-primary/10", className)}>
      <div className="flex items-center justify-between gap-4">
        <span
          className="text-base font-semibold text-foreground"
          data-testid="text-step-indicator"
        >
          Step {currentStep} of {totalSteps}
        </span>
        {stepTitle && (
          <span
            className="text-sm font-medium text-muted-foreground truncate bg-muted/30 px-3 py-1 rounded-full"
            data-testid="text-step-title"
          >
            {stepTitle}
          </span>
        )}
      </div>
      <Progress
        value={progress}
        className="h-3 shadow-sm"
        aria-label={`Progress: step ${currentStep} of ${totalSteps}`}
        data-testid="progress-bar"
      />
    </div>
  );
}
