import { Label } from "@/components/ui/label";
import { OilFrameworkInfo } from "../OilFrameworkInfo";
import { StepImportanceAlert } from "../StepImportanceAlert";
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
  const handleSelect = (value: boolean) => {
    dispatch({
      type: "SET_FIELD",
      field: "clarifyingRelevanceEnabled",
      value,
    });
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-slide-in {
          animation: fadeSlideIn 0.4s ease-out;
        }
      `}</style>

      <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Clarifying Relevance to This Job
        </h2>
        <p className="text-muted-foreground">
          You can choose to include a brief section stating that your record does not
          affect your ability to do this job—but only if you believe that's honestly
          true based on what you've shared.
        </p>
      </div>

      <StepImportanceAlert>
        This choice helps shape your letter's approach. There's no wrong answer—choose
        what feels honest and appropriate for your situation.
      </StepImportanceAlert>

      <div className="space-y-4">
        <Label id="relevance-question" className="text-base font-medium">
          Do you want your letter to mention that your record doesn't relate to this job?
        </Label>

        <div
          className="flex gap-3 w-full"
          role="radiogroup"
          aria-labelledby="relevance-question"
        >
          <button
            type="button"
            onClick={() => handleSelect(true)}
            className={`
              flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all
              border-2 focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2
              ${state.clarifyingRelevanceEnabled === true
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-foreground border-border hover:border-primary/50"
              }
            `}
            aria-pressed={state.clarifyingRelevanceEnabled === true}
            data-testid="button-relevance-yes"
          >
            Yes
          </button>

          <button
            type="button"
            onClick={() => handleSelect(false)}
            className={`
              flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all
              border-2 focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2
              ${state.clarifyingRelevanceEnabled === false
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-foreground border-border hover:border-primary/50"
              }
            `}
            aria-pressed={state.clarifyingRelevanceEnabled === false}
            data-testid="button-relevance-no"
          >
            No
          </button>
        </div>

        {state.clarifyingRelevanceEnabled === true && (
          <p className="fade-slide-in text-sm text-muted-foreground leading-relaxed">
            You've chosen <span className="font-semibold">Yes</span>. If your record
            and the job responsibilities appear unrelated, we may include a calm, brief
            statement clarifying this. If they seem connected, we won't make that claim—instead,
            we'll focus on your growth and qualifications.
          </p>
        )}

        {state.clarifyingRelevanceEnabled === false && (
          <p className="fade-slide-in text-sm text-muted-foreground leading-relaxed">
            You've chosen <span className="font-semibold">No</span>. Your letter will
            not claim your record is unrelated to the job. Instead, it will acknowledge
            any potential concerns and emphasize your personal growth, the changes you've
            made, and your current reliability.
          </p>
        )}
      </div>

      <OilFrameworkInfo />
    </div>
    </>
  );
}
