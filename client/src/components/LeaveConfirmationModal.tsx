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

        @keyframes gentle-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.3);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 0 0 6px rgba(20, 184, 166, 0);
          }
        }

        @keyframes shimmer-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .backdrop-animated {
          animation: backdrop-fade 0.2s ease-out;
        }

        .modal-animated {
          animation: modal-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .shimmer-border {
          background-size: 200% 100%;
          animation: shimmer-border 3s ease infinite;
        }
      `}</style>

      <div
        className="backdrop-animated fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: 'rgba(13, 148, 136, 0.15)',
          backdropFilter: 'blur(12px)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-modal-title"
        data-testid="modal-leave-confirmation"
      >
        <div
          className="modal-animated max-w-md w-full mx-4 rounded-2xl overflow-hidden bg-white"
          style={{
            boxShadow: '0 25px 50px rgba(13, 148, 136, 0.2), 0 0 0 1px rgba(20, 184, 166, 0.15)',
          }}
        >
          {/* Decorative top border with shimmer */}
          <div
            className="h-1 shimmer-border"
            style={{
              background: 'linear-gradient(90deg, #14b8a6 0%, #f97316 50%, #14b8a6 100%)',
            }}
            aria-hidden="true"
          />

          <div className="p-8 space-y-6">
            {/* Icon and Title Section */}
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center"
                style={{
                  animation: 'gentle-pulse 2.5s ease-in-out infinite',
                  boxShadow: '0 8px 16px rgba(20, 184, 166, 0.25)',
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
            <div className="p-4 rounded-xl bg-teal-50 border-2 border-teal-100">
              <p className="text-sm text-teal-900 font-medium">
                {warning}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onCancel}
                className="h-11 px-6 font-semibold border-2 border-teal-200 text-teal-700 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200"
                data-testid="button-stay-here"
              >
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                className="h-11 px-6 font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
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
