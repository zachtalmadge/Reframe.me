import { Label } from "@/components/ui/label";
import { CharacterCountTextarea } from "../CharacterCountTextarea";
import { FormState, FormAction } from "@/lib/formState";

interface Step7LessonsLearnedProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

export function Step7LessonsLearned({
  state,
  dispatch,
  errors,
}: Step7LessonsLearnedProps) {
  const handleChange = (value: string) => {
    dispatch({ type: "SET_FIELD", field: "lessonsLearned", value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Lessons Learned
        </h2>
        <p className="text-muted-foreground">
          Sharing what you've learned shows growth and forward progress. This is
          the final part of the O.I.L. framework.
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
              <span className="font-medium text-muted-foreground">I</span>mpact
              - Understanding consequences
            </li>
            <li>
              <span className="font-medium text-foreground">L</span>essons -
              What you've learned
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="lessons-learned" className="text-base font-medium">
              What have you learned from this experience?
            </Label>
            <p className="text-sm text-muted-foreground">
              Describe the personal growth and insights you've gained.
            </p>
          </div>
          <CharacterCountTextarea
            id="lessons-learned"
            value={state.lessonsLearned}
            onChange={handleChange}
            maxLength={500}
            placeholder="For example: I've learned the importance of making better choices and considering consequences before acting. I've developed better coping mechanisms..."
            rows={5}
            data-testid="textarea-lessons-learned"
          />
          {errors.lessonsLearned && (
            <p className="text-sm text-destructive">{errors.lessonsLearned}</p>
          )}
        </div>

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">Tip:</span> Be specific about what
            you've learned and how you've changed. Vague statements are less
            convincing than concrete examples of growth.
          </p>
        </div>
      </div>
    </div>
  );
}
