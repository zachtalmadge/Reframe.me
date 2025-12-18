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
    <div className={cn("relative space-y-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-primary/20 shadow-sm overflow-hidden", className)}>
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          {/* Step number badge */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-teal-600 text-white font-bold text-sm shadow-lg">
            {currentStep}
          </div>
          <div className="flex flex-col">
            <span
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Progress
            </span>
            <span
              className="text-sm font-bold text-foreground font-manrope"
              data-testid="text-step-indicator"
            >
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>
        {stepTitle && (
          <span
            className="hidden md:inline text-xs font-semibold text-primary truncate bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm font-manrope"
            data-testid="text-step-title"
          >
            {stepTitle}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Progress
          value={progress}
          className="h-3"
          aria-label={`Progress: step ${currentStep} of ${totalSteps}`}
          data-testid="progress-bar"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-muted-foreground font-manrope">
            {Math.round(progress)}% Complete
          </span>
          <span className="text-xs font-medium text-primary font-manrope">
            {totalSteps - currentStep} {totalSteps - currentStep === 1 ? 'step' : 'steps'} remaining
          </span>
        </div>
      </div>
    </div>
  );
}
