import { Label } from "@/components/ui/label";
import { CharacterCountTextarea } from "../CharacterCountTextarea";
import { OilFrameworkInfo } from "../OilFrameworkInfo";
import { StepImportanceAlert } from "../StepImportanceAlert";
import { FormState, FormAction } from "@/lib/formState";

interface Step5OwnershipProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
}

export function Step5Ownership({
  state,
  dispatch,
}: Step5OwnershipProps) {
  const handleChange = (value: string) => {
    dispatch({ type: "SET_FIELD", field: "ownership", value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Ownership</h2>
        <p className="text-muted-foreground">
          This is the first part of the O.I.L. framework. In this section, we'll 
          write about taking responsibility for what happened in a clear and 
          respectful way.
        </p>
      </div>

      <StepImportanceAlert>
        This is the <span className="font-semibold">Ownership</span> part of the O.I.L. framework. Our tool will take care of writing this section for you. The strongest narratives, though, usually include some of your own words about how you see things now. If there's anything you'd like us to highlight here, you can add it — and it's completely okay to leave it blank if you'd rather not. We'll still handle this part for you.
      </StepImportanceAlert>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="ownership" className="text-base font-medium">
              Optional: Anything you'd like us to keep in mind?
            </Label>
            <p className="text-sm text-muted-foreground">
              If there's something specific about how you see your past that you'd
              like us to include, you can share it here. This is completely optional
              — you can also skip this and move on.
            </p>
          </div>
          <CharacterCountTextarea
            id="ownership"
            value={state.ownership}
            onChange={handleChange}
            maxLength={500}
            placeholder="(Optional) Share anything you'd like us to know..."
            rows={4}
            data-testid="textarea-ownership"
          />
        </div>

        <OilFrameworkInfo />
      </div>
    </div>
  );
}
