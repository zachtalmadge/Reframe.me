import { Label } from "@/components/ui/label";
import { CharacterCountTextarea } from "../CharacterCountTextarea";
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

      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">We'll write this for you.</span>{" "}
            Using the information you've already shared, our tool will craft 
            language that shows awareness and understanding of consequences 
            in a thoughtful way.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
          <p className="text-sm font-medium text-foreground">
            O.I.L. Framework
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <span className="font-medium text-muted-foreground">O</span>
              wnership - Taking responsibility
            </li>
            <li>
              <span className="font-medium text-foreground">I</span>mpact -
              Understanding consequences
            </li>
            <li>
              <span className="font-medium text-muted-foreground">L</span>essons
              - What you've learned
            </li>
          </ul>
        </div>

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
