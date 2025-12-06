import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeaveConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LeaveConfirmationModal({
  open,
  onConfirm,
  onCancel,
}: LeaveConfirmationModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-modal-title"
      data-testid="modal-leave-confirmation"
    >
      <div className="bg-background rounded-lg shadow-lg max-w-sm w-full mx-4 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle
              className="w-5 h-5 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
          </div>
          <div className="space-y-2">
            <h2
              id="leave-modal-title"
              className="text-lg font-semibold text-foreground"
            >
              Leave and lose your information?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you go back to the home page now, your information will be
              cleared and you will need to start over.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            data-testid="button-stay-here"
          >
            Stay here
          </Button>
          <Button
            onClick={onConfirm}
            data-testid="button-leave-clear"
          >
            Leave & clear data
          </Button>
        </div>
      </div>
    </div>
  );
}
