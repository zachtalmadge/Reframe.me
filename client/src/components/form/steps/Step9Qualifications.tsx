import { Label } from "@/components/ui/label";
import { CharacterCountTextarea } from "../CharacterCountTextarea";
import { FormState, FormAction } from "@/lib/formState";

interface Step9QualificationsProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

export function Step9Qualifications({
  state,
  dispatch,
  errors,
}: Step9QualificationsProps) {
  const handleChange = (value: string) => {
    dispatch({ type: "SET_FIELD", field: "qualifications", value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Reinforcing Your Qualifications
        </h2>
        <p className="text-muted-foreground">
          End on a strong note by highlighting why you're the right person for
          this job.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="qualifications" className="text-base font-medium">
              Why are you qualified for this position?
            </Label>
            <p className="text-sm text-muted-foreground">
              Highlight your relevant skills, experience, and what you bring to
              this role.
            </p>
          </div>
          <CharacterCountTextarea
            id="qualifications"
            value={state.qualifications}
            onChange={handleChange}
            maxLength={500}
            placeholder="For example: I have 3 years of customer service experience and am known for my reliability and work ethic. I completed vocational training in [field] and am excited to apply these skills..."
            rows={5}
            data-testid="textarea-qualifications"
          />
          {errors.qualifications && (
            <p className="text-sm text-destructive">{errors.qualifications}</p>
          )}
        </div>

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">Tip:</span> Connect your skills and
            programs from earlier to this specific job. Show how your growth and
            experience make you a great candidate.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Almost there!</span>{" "}
            After this step, we'll generate your personalized response letter
            based on everything you've shared.
          </p>
        </div>
      </div>
    </div>
  );
}
