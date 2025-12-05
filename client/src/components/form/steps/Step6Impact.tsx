import { Label } from "@/components/ui/label";
import { CharacterCountTextarea } from "../CharacterCountTextarea";
import { FormState, FormAction } from "@/lib/formState";

interface Step6ImpactProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

export function Step6Impact({ state, dispatch, errors }: Step6ImpactProps) {
  const handleChange = (value: string) => {
    dispatch({ type: "SET_FIELD", field: "impact", value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Impact</h2>
        <p className="text-muted-foreground">
          Showing you understand the impact demonstrates empathy and maturity.
          This is the second part of the O.I.L. framework.
        </p>
      </div>

      <div className="space-y-6">
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
              How do you understand the impact of your actions?
            </Label>
            <p className="text-sm text-muted-foreground">
              Reflect on how your actions affected others and the community.
            </p>
          </div>
          <CharacterCountTextarea
            id="impact"
            value={state.impact}
            onChange={handleChange}
            maxLength={500}
            placeholder="For example: I understand that my actions affected my family, my community, and the victims involved. I recognize the trust that was broken..."
            rows={5}
            data-testid="textarea-impact"
          />
          {errors.impact && (
            <p className="text-sm text-destructive">{errors.impact}</p>
          )}
        </div>

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">Tip:</span> Focus on genuine
            understanding, not just acknowledging what happened. Show that
            you've reflected on the real consequences.
          </p>
        </div>
      </div>
    </div>
  );
}
