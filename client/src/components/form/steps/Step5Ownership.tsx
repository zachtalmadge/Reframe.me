import { Label } from "@/components/ui/label";
import { CharacterCountTextarea } from "../CharacterCountTextarea";
import { FormState, FormAction } from "@/lib/formState";

interface Step5OwnershipProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

export function Step5Ownership({
  state,
  dispatch,
  errors,
}: Step5OwnershipProps) {
  const handleChange = (value: string) => {
    dispatch({ type: "SET_FIELD", field: "ownership", value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Ownership</h2>
        <p className="text-muted-foreground">
          Taking ownership shows employers you accept responsibility for your
          past. This is the first part of the O.I.L. framework.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
          <p className="text-sm font-medium text-foreground">
            O.I.L. Framework
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <span className="font-medium text-foreground">O</span>wnership -
              Taking responsibility
            </li>
            <li>
              <span className="font-medium text-muted-foreground">I</span>mpact
              - Understanding consequences
            </li>
            <li>
              <span className="font-medium text-muted-foreground">L</span>essons
              - What you've learned
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="ownership" className="text-base font-medium">
              How do you take ownership of your past?
            </Label>
            <p className="text-sm text-muted-foreground">
              Describe how you accept responsibility without making excuses.
            </p>
          </div>
          <CharacterCountTextarea
            id="ownership"
            value={state.ownership}
            onChange={handleChange}
            maxLength={500}
            placeholder="For example: I take full responsibility for my actions. I understand that my choices led to consequences that affected others..."
            rows={5}
            data-testid="textarea-ownership"
          />
          {errors.ownership && (
            <p className="text-sm text-destructive">{errors.ownership}</p>
          )}
        </div>

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">Tip:</span> Be honest and direct.
            Avoid blaming circumstances or others. Employers appreciate
            authenticity and accountability.
          </p>
        </div>
      </div>
    </div>
  );
}
