import { Label } from "@/components/ui/label";
import { CharacterCountTextarea } from "../CharacterCountTextarea";
import { OilFrameworkInfo } from "../OilFrameworkInfo";
import { StepImportanceAlert } from "../StepImportanceAlert";
import { FormState, FormAction } from "@/lib/formState";

interface Step7LessonsLearnedProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
}

export function Step7LessonsLearned({
  state,
  dispatch,
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
          This is the final part of the O.I.L. framework. In this section, we 
          focus on the growth and positive changes you've made since then.
        </p>
      </div>

      <StepImportanceAlert>
        This is the <span className="font-semibold">Lessons Learned</span> part of the O.I.L. framework, where we focus on your growth and the changes you've made. Our tool will handle this section even if you don't type anything. If you'd like to, you can add your own language about what's different now — your words can make this part even stronger. It's also okay to skip it; we'll still write it for you.
      </StepImportanceAlert>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="lessons-learned" className="text-base font-medium">
              Optional: Anything you'd like us to keep in mind?
            </Label>
            <p className="text-sm text-muted-foreground">
              If there's something specific about what you've learned or how
              you've changed that you'd like us to highlight, you can share it
              here. This is completely optional — you can skip this if you prefer.
            </p>
          </div>
          <CharacterCountTextarea
            id="lessons-learned"
            value={state.lessonsLearned}
            onChange={handleChange}
            maxLength={500}
            placeholder="(Optional) Share anything you'd like us to know..."
            rows={4}
            data-testid="textarea-lessons-learned"
          />
        </div>

        <OilFrameworkInfo />
      </div>
    </div>
  );
}
