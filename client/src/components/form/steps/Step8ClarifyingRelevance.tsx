import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ErrorMessage } from "@/components/ui/error-message";
import { CharacterCountTextarea } from "../CharacterCountTextarea";
import { OilFrameworkInfo } from "../OilFrameworkInfo";
import { FormState, FormAction } from "@/lib/formState";

interface Step8ClarifyingRelevanceProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

export function Step8ClarifyingRelevance({
  state,
  dispatch,
  errors,
}: Step8ClarifyingRelevanceProps) {
  const handleToggle = (checked: boolean) => {
    dispatch({
      type: "SET_FIELD",
      field: "clarifyingRelevanceEnabled",
      value: checked,
    });
  };

  const handleChange = (value: string) => {
    dispatch({ type: "SET_FIELD", field: "clarifyingRelevance", value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Clarifying Relevance
        </h2>
        <p className="text-muted-foreground">
          Sometimes, your background may not be directly related to the job
          you're applying for. This section is optional but can be powerful.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border">
          <div className="space-y-1">
            <Label
              htmlFor="clarifying-toggle"
              className="text-base font-medium"
            >
              Include relevance clarification?
            </Label>
            <p className="text-sm text-muted-foreground">
              Turn this on if you want to explain why your background isn't
              relevant to this position.
            </p>
          </div>
          <Switch
            id="clarifying-toggle"
            checked={state.clarifyingRelevanceEnabled}
            onCheckedChange={handleToggle}
            data-testid="switch-clarifying-relevance"
          />
        </div>

        {state.clarifyingRelevanceEnabled && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label
                htmlFor="clarifying-relevance"
                className="text-base font-medium"
              >
                How is your background not relevant to this job?
              </Label>
              <p className="text-sm text-muted-foreground">
                Explain why your past doesn't affect your ability to do this job
                well.
              </p>
            </div>
            <CharacterCountTextarea
              id="clarifying-relevance"
              value={state.clarifyingRelevance}
              onChange={handleChange}
              maxLength={400}
              placeholder="For example: The offense occurred over 10 years ago and was unrelated to any professional setting. This position doesn't involve the circumstances that led to my conviction..."
              rows={5}
              data-testid="textarea-clarifying-relevance"
            />
            <ErrorMessage message={errors.clarifyingRelevance} />
          </div>
        )}

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">When to use this:</span> This is
            especially helpful when there's a significant time gap since the
            offense, when the offense was unrelated to the job duties, or when
            you've completed rehabilitation programs.
          </p>
        </div>

        <OilFrameworkInfo />
      </div>
    </div>
  );
}
