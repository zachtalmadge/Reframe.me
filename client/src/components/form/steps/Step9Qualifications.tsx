import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ErrorMessage } from "@/components/ui/error-message";
import { CharacterCountTextarea } from "../CharacterCountTextarea";
import { FormState, FormAction } from "@/lib/formState";

interface Step9QualificationsProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

export function Step9Qualifications({
  state,
  dispatch,
  errors,
}: Step9QualificationsProps) {
  const handleToggle = (checked: boolean) => {
    dispatch({ type: "SET_FIELD", field: "useResumeAndJobPosting", value: checked });
  };

  const handleResumeChange = (value: string) => {
    dispatch({ type: "SET_FIELD", field: "resumeText", value });
  };

  const handleJobPostingChange = (value: string) => {
    dispatch({ type: "SET_FIELD", field: "jobPostingText", value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Reinforcing Your Qualifications (Optional)
        </h2>
        <p className="text-muted-foreground">
          Strengthen your letter by including your resume and the job posting.
          This helps us highlight why you're the right fit.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border border-border">
          <div className="space-y-1">
            <Label htmlFor="resume-toggle" className="text-base font-medium">
              Use my resume and job posting to strengthen this letter
            </Label>
            <p className="text-sm text-muted-foreground">
              When enabled, we'll use this information to better match your
              qualifications to the position.
            </p>
          </div>
          <Switch
            id="resume-toggle"
            checked={state.useResumeAndJobPosting}
            onCheckedChange={handleToggle}
            data-testid="switch-resume-job-posting"
          />
        </div>

        {state.useResumeAndJobPosting && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="resumeText" className="text-base font-medium">
                  Your Resume (Text Only)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Paste the text content of your resume. This helps us highlight
                  your relevant experience and skills.{" "}
                  <br/>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    Do not include any personal information.
                  </span>
                </p>
              </div>
              <CharacterCountTextarea
                id="resumeText"
                value={state.resumeText}
                onChange={handleResumeChange}
                maxLength={3000}
                placeholder="Paste your resume text here..."
                rows={6}
                data-testid="textarea-resume"
              />
              <ErrorMessage message={errors.resumeText} />
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="jobPostingText" className="text-base font-medium">
                  Job Posting
                </Label>
                <p className="text-sm text-muted-foreground">
                  Paste the job posting or description. This helps us align your
                  qualifications with what the employer is looking for.
                </p>
              </div>
              <CharacterCountTextarea
                id="jobPostingText"
                value={state.jobPostingText}
                onChange={handleJobPostingChange}
                maxLength={3000}
                placeholder="Paste the job posting or description here..."
                rows={5}
                data-testid="textarea-job-posting"
              />
              <ErrorMessage message={errors.jobPostingText} />
            </div>
          </div>
        )}

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">Tip:</span> Including your resume and
            job posting helps us create a more personalized letter that speaks
            directly to the employer's needs.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Almost there!</span>{" "}
            After this step, we'll generate your personalized response letter
            based on everything you've shared.
          </p>
        </div>
      </div>
    </div>
  );
}
