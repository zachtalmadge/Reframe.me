import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeaveConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  warning?: string;
  confirmText?: string;
  cancelText?: string;
}

export function LeaveConfirmationModal({
  open,
  onConfirm,
  onCancel,
  title = "Leave and lose your information?",
  description = "If you go back to the home page now, your information will be cleared and you will need to start over.",
  warning = "⚠️ This action cannot be undone. All your progress will be lost.",
  confirmText = "Leave & clear data",
  cancelText = "Stay here",
}: LeaveConfirmationModalProps) {
  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes backdrop-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modal-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse-warning {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 8px rgba(245, 158, 11, 0);
          }
        }

        .backdrop-animated {
          animation: backdrop-fade 0.2s ease-out;
        }

        .modal-animated {
          animation: modal-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div
        className="backdrop-animated fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-modal-title"
        data-testid="modal-leave-confirmation"
      >
        <div
          className="modal-animated max-w-md w-full mx-4 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(245, 158, 11, 0.1)',
          }}
        >
          {/* Decorative top border */}
          <div
            className="h-1"
            style={{
              background: 'linear-gradient(90deg, #f59e0b 0%, #fb923c 100%)',
            }}
            aria-hidden="true"
          />

          <div className="p-8 space-y-6">
            {/* Icon and Title Section */}
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
                style={{
                  animation: 'pulse-warning 2s ease-in-out infinite',
                  boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)',
                }}
              >
                <AlertTriangle
                  className="w-7 h-7 text-white"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </div>

              <div className="flex-1 space-y-2">
                <h2
                  id="leave-modal-title"
                  className="text-xl font-bold text-gray-900"
                  style={{
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {title}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* Warning Box */}
            <div className="p-4 rounded-xl bg-amber-50/50 border-2 border-amber-100">
              <p className="text-sm text-amber-900 font-medium">
                {warning}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onCancel}
                className="h-11 px-6 font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                data-testid="button-stay-here"
              >
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                className="h-11 px-6 font-semibold transition-all duration-300 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                }}
                data-testid="button-leave-clear"
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
