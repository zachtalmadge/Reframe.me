import { Label } from "@/components/ui/label";
import { CharacterCountTextarea } from "../CharacterCountTextarea";
import { OilFrameworkInfo } from "../OilFrameworkInfo";
import { StepImportanceAlert } from "../StepImportanceAlert";
import { FormState, FormAction } from "@/lib/formState";

interface Step6ImpactProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

export function Step6Impact({ state, dispatch }: Step6ImpactProps) {
  const handleChange = (value: string) => {
    dispatch({ type: "SET_FIELD", field: "impact", value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Impact</h2>
        <p className="text-muted-foreground">
          This is the second part of the O.I.L. framework. Here, we acknowledge 
          how actions may have affected others or your community.
        </p>
      </div>

      <StepImportanceAlert>
        This is the <span className="font-semibold">Impact</span> part of the O.I.L. framework. We'll write this section based on what you've already shared. Adding a few of your own words about how your actions affected others can make your letter feel more personal and honest. Share anything you're comfortable with here, or leave it blank — we'll still take care of the wording for you.
      </StepImportanceAlert>

      <div className="space-y-6">
        <OilFrameworkInfo />

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="impact" className="text-base font-medium">
              Optional: Anything you'd like us to keep in mind?
            </Label>
            <p className="text-sm text-muted-foreground">
              If there's something about how you think about the impact of your 
              actions that you'd like us to include, you can share it here. This 
              is completely optional — feel free to skip this if you prefer.
            </p>
          </div>
          <CharacterCountTextarea
            id="impact"
            value={state.impact}
            onChange={handleChange}
            maxLength={500}
            placeholder="(Optional) Share anything you'd like us to know..."
            rows={4}
            data-testid="textarea-impact"
          />
        </div>
      </div>
    </div>
  );
}
