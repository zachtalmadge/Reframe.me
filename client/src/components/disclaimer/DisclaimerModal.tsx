import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { disclaimerContent } from "@/lib/disclaimerContent";
import { Shield, ChevronDown } from "lucide-react";

interface DisclaimerModalProps {
  open: boolean;
  onContinue: () => void;
}

export function DisclaimerModal({ open, onContinue }: DisclaimerModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleContinue = () => {
    if (acknowledged) {
      onContinue();
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrolled(target.scrollTop > 10);
  };

  return (
    <AlertDialog open={open}>
      <style>{`
        @keyframes modal-fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-icon {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }

        .modal-content-animated {
          animation: modal-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-section-animated {
          animation: slide-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .scroll-indicator {
          transition: opacity 0.3s ease;
        }
      `}</style>

      <AlertDialogContent
        className="modal-content-animated max-w-2xl max-h-[85vh] overflow-hidden flex flex-col gap-0 p-0 border-0"
        style={{
          background: 'linear-gradient(135deg, #f9fafb 0%, #f0fdfa 50%, #ecfdf5 100%)',
          boxShadow: '0 20px 60px rgba(13, 148, 136, 0.15)',
        }}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        data-testid="modal-disclaimer"
      >
        {/* Header with Icon */}
        <AlertDialogHeader className="px-8 pt-8 pb-6 relative overflow-hidden">
          {/* Decorative background element */}
          <div
            className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div className="relative flex items-start gap-4">
            <div
              className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg"
              style={{
                animation: 'pulse-icon 3s ease-in-out infinite',
              }}
            >
              <Shield className="w-7 h-7 text-white" />
            </div>

            <div className="flex-1 space-y-2">
              <AlertDialogTitle
                className="text-2xl font-bold text-gray-900"
                style={{
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  letterSpacing: '-0.02em',
                }}
                data-testid="text-disclaimer-title"
              >
                {disclaimerContent.title}
              </AlertDialogTitle>
              <p className="text-sm text-gray-600">
                Please read carefully before continuing
              </p>
            </div>
          </div>

          <AlertDialogDescription className="sr-only">
            Please read and acknowledge the disclaimer before continuing to use this tool.
          </AlertDialogDescription>

          {/* Shadow indicator when scrolled */}
          {scrolled && (
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(13, 148, 136, 0.2) 50%, transparent 100%)',
              }}
              aria-hidden="true"
            />
          )}
        </AlertDialogHeader>

        {/* Scrollable Content */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-8 relative"
          aria-label="Disclaimer content"
          data-testid="scroll-disclaimer-content"
          onScroll={handleScroll}
        >
          <div className="space-y-6 pb-6">
            {disclaimerContent.sections.map((section, index) => (
              <div
                key={index}
                className="modal-section-animated space-y-3 p-5 rounded-xl"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <h3
                  className="font-bold text-gray-900 text-base"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {section.heading}
                </h3>
                {"content" in section && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                )}
                {"points" in section && section.points && (
                  <ul className="space-y-2.5 text-sm text-gray-700">
                    {section.points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className="flex gap-3 leading-relaxed"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator at bottom */}
        <div
          className="scroll-indicator absolute left-1/2 -translate-x-1/2 bottom-32 pointer-events-none"
          style={{
            opacity: scrolled ? 0 : 1,
          }}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-2 text-teal-600">
            <span className="text-xs font-medium">Scroll to read all</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        {/* Footer with Checkbox and Button */}
        <div
          className="px-8 py-6 space-y-5"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 -10px 30px rgba(13, 148, 136, 0.05)',
          }}
        >
          <div
            className="flex items-start gap-4 p-4 rounded-xl"
            style={{
              background: 'rgba(240, 253, 250, 0.6)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Checkbox
              id="disclaimer-acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
              className="mt-1 border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              data-testid="checkbox-acknowledge"
              aria-describedby="acknowledge-label"
            />
            <label
              id="acknowledge-label"
              htmlFor="disclaimer-acknowledge"
              className="text-sm text-gray-800 leading-relaxed cursor-pointer select-none font-medium"
            >
              {disclaimerContent.checkboxLabel}
            </label>
          </div>

          <AlertDialogFooter className="sm:justify-stretch">
            <AlertDialogAction
              onClick={handleContinue}
              disabled={!acknowledged}
              className="w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: acknowledged
                  ? 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)'
                  : '#e5e7eb',
                color: acknowledged ? 'white' : '#9ca3af',
                boxShadow: acknowledged
                  ? '0 4px 12px rgba(13, 148, 136, 0.3)'
                  : 'none',
              }}
              data-testid="button-continue"
            >
              {disclaimerContent.buttonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
