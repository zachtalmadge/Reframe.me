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

      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">We've got this covered.</span>{" "}
            Based on everything you've already shared, our tool will write this 
            part for you. The language will be honest, direct, and show that you 
            accept responsibility without making excuses.
          </p>
        </div>

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
      </div>
    </div>
  );
}
