import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormState, FormAction } from "@/lib/formState";

interface Step4JobDetailsProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

export function Step4JobDetails({
  state,
  dispatch,
  errors,
}: Step4JobDetailsProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Job Application Details
        </h2>
        <p className="text-muted-foreground">
          Tell us about the position you applied for. This will help
          personalize your response letter.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="job-title" className="text-base font-medium">
            Job Title
          </Label>
          <Input
            id="job-title"
            value={state.jobTitle}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "jobTitle",
                value: e.target.value,
              })
            }
            placeholder="e.g., Warehouse Associate, Customer Service Representative"
            data-testid="input-job-title"
          />
          {errors.jobTitle && (
            <p className="text-sm text-destructive">{errors.jobTitle}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="employer-name" className="text-base font-medium">
            Employer Name
          </Label>
          <Input
            id="employer-name"
            value={state.employerName}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "employerName",
                value: e.target.value,
              })
            }
            placeholder="e.g., ABC Company, Local Grocery Store"
            data-testid="input-employer-name"
          />
          {errors.employerName && (
            <p className="text-sm text-destructive">{errors.employerName}</p>
          )}
        </div>

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">Why we ask:</span> Including the
            specific job title and employer name makes your response letter more
            professional and shows you're taking this opportunity seriously.
          </p>
        </div>
      </div>
    </div>
  );
}
