import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { disclaimerContent } from "@/lib/disclaimerContent";

interface DisclaimerModalProps {
  open: boolean;
  onContinue: () => void;
}

export function DisclaimerModal({ open, onContinue }: DisclaimerModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  const handleContinue = () => {
    if (acknowledged) {
      onContinue();
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        className="max-w-lg max-h-[85vh] flex flex-col gap-0 p-0"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        data-testid="modal-disclaimer"
      >
        <AlertDialogHeader className="px-6 pt-6 pb-4">
          <AlertDialogTitle
            className="text-xl font-semibold text-foreground"
            data-testid="text-disclaimer-title"
          >
            {disclaimerContent.title}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <ScrollArea
          className="flex-1 px-6"
          aria-label="Disclaimer content"
          data-testid="scroll-disclaimer-content"
        >
          <div className="space-y-6 pb-4">
            {disclaimerContent.sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium text-foreground">
                  {section.heading}
                </h3>
                {"content" in section && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                )}
                {"points" in section && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {section.points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className="flex gap-2 leading-relaxed"
                      >
                        <span
                          className="text-primary mt-1 flex-shrink-0"
                          aria-hidden="true"
                        >
                          •
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t px-6 py-4 space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="disclaimer-acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
              className="mt-0.5"
              data-testid="checkbox-acknowledge"
              aria-describedby="acknowledge-label"
            />
            <label
              id="acknowledge-label"
              htmlFor="disclaimer-acknowledge"
              className="text-sm text-foreground leading-relaxed cursor-pointer select-none"
            >
              {disclaimerContent.checkboxLabel}
            </label>
          </div>

          <AlertDialogFooter className="sm:justify-stretch">
            <AlertDialogAction
              onClick={handleContinue}
              disabled={!acknowledged}
              className="w-full"
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
