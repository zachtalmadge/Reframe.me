import { Lightbulb } from "lucide-react";

interface StepImportanceAlertProps {
  children: React.ReactNode;
}

export function StepImportanceAlert({ children }: StepImportanceAlertProps) {
  return (
    <div 
      className="rounded-xl border border-orange-200 border-l-4 border-l-orange-400 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800 dark:border-l-orange-500 px-4 py-3"
      data-testid="alert-step-importance"
    >
      <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-semibold text-sm">
        <Lightbulb className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <span>Why this step matters</span>
      </div>
      <div className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
