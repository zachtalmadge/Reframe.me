import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { CharacterCountTextarea } from "../CharacterCountTextarea";
import { FormState, FormAction } from "@/lib/formState";

interface Step3AdditionalContextProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

export function Step3AdditionalContext({
  state,
  dispatch,
  errors,
}: Step3AdditionalContextProps) {
  const handleChange = (value: string) => {
    dispatch({ type: "SET_FIELD", field: "additionalContext", value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Additional Context
        </h2>
        <p className="text-muted-foreground">
          Is there anything else you'd like employers to know about your journey
          or growth?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label
              htmlFor="additional-context"
              className="text-base font-medium"
            >
              Your Story{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Share any personal growth, circumstances, or context that might
              help employers understand your situation better.
            </p>
          </div>
          <CharacterCountTextarea
            id="additional-context"
            value={state.additionalContext}
            onChange={handleChange}
            maxLength={300}
            placeholder="For example: circumstances that led to the situation, how you've changed, what you've learned..."
            rows={5}
            data-testid="textarea-additional-context"
          />
          <ErrorMessage message={errors.additionalContext} />
        </div>

        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Remember:</span> This
            is optional. Only share what you're comfortable with. Focus on
            growth and positive changes rather than dwelling on past mistakes.
          </p>
        </div>
      </div>
    </div>
  );
}
