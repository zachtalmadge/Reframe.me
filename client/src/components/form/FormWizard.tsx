import { useReducer, useCallback, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import {
  FormState,
  FormAction,
  ToolType,
  formReducer,
  initialFormState,
  getTotalSteps,
  getStepTitle,
} from "@/lib/formState";
import {
  Step1Background,
  Step2ProgramsSkills,
  Step3AdditionalContext,
  Step4JobDetails,
  Step5Ownership,
  Step6Impact,
  Step7LessonsLearned,
  Step8ClarifyingRelevance,
  Step9Qualifications,
} from "./steps";

interface FormWizardProps {
  tool: ToolType;
  onComplete: (data: FormState) => void;
  initialState?: FormState;
}

type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

function validateStep(
  step: number,
  state: FormState,
  tool: ToolType
): ValidationResult {
  const errors: Record<string, string> = {};

  switch (step) {
    case 1:
      state.offenses.forEach((offense) => {
        if (!offense.type) {
          errors[`offense-${offense.id}-type`] = "Please select a type";
        }
        if (!offense.description.trim()) {
          errors[`offense-${offense.id}-description`] =
            "Please provide a brief description";
        }
      });
      if (!state.releaseMonth) {
        errors.releaseMonth = "Please select a month";
      }
      if (!state.releaseYear) {
        errors.releaseYear = "Please select a year";
      }
      break;

    case 2:
      if (state.programs.length === 0 && state.skills.length === 0) {
        errors.programsSkills =
          "Please add at least one program or skill";
      }
      break;

    case 3:
      break;

    case 4:
      if (tool !== "narrative") {
        if (!state.jobTitle.trim()) {
          errors.jobTitle = "Please enter the job title";
        }
        if (!state.employerName.trim()) {
          errors.employerName = "Please enter the employer name";
        }
      }
      break;

    case 5:
      // O.I.L. Ownership step is optional - no validation required
      break;

    case 6:
      // O.I.L. Impact step is optional - no validation required
      break;

    case 7:
      // O.I.L. Lessons Learned step is optional - no validation required
      break;

    case 8:
      // No validation required - boolean choice only
      break;

    case 9:
      if (tool !== "narrative" && state.useResumeAndJobPosting) {
        if (!state.resumeText.trim()) {
          errors.resumeText = "Please paste your resume text to continue.";
        }
        if (!state.jobPostingText.trim()) {
          errors.jobPostingText = "Please paste the job posting text to continue.";
        }
      }
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function FormWizard({ tool, onComplete, initialState }: FormWizardProps) {
  const [, navigate] = useLocation();
  const [state, dispatch] = useReducer(formReducer, initialState || initialFormState);

  const [hasSeenEmotionalMessage, setHasSeenEmotionalMessage] = useState(false);
  const [showEmotionalMessage, setShowEmotionalMessage] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (state.currentStep === 1 && !hasSeenEmotionalMessage) {
      timeoutId = setTimeout(() => {
        setShowEmotionalMessage(true);
        setHasSeenEmotionalMessage(true);
      }, 5000);
    } else if (hasSeenEmotionalMessage) {
      setShowEmotionalMessage(true);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [state.currentStep, hasSeenEmotionalMessage]);

  const totalSteps = getTotalSteps(tool);
  const stepTitle = getStepTitle(state.currentStep, tool);

  const handleBack = useCallback(() => {
    if (state.currentStep === 1) {
      navigate("/selection");
    } else {
      dispatch({ type: "PREV_STEP" });
      window.scrollTo(0, 0);
    }
  }, [state.currentStep, navigate]);

  const handleNext = useCallback(() => {
    const { isValid, errors } = validateStep(state.currentStep, state, tool);

    if (!isValid) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }

    if (state.currentStep === totalSteps) {
      onComplete(state);
    } else {
      dispatch({ type: "NEXT_STEP" });
      window.scrollTo(0, 0);
    }
  }, [state, tool, totalSteps, onComplete]);

  const renderStep = () => {
    const stepProps = {
      state,
      dispatch: dispatch as React.Dispatch<FormAction>,
      errors: state.errors,
    };

    switch (state.currentStep) {
      case 1:
        return <Step1Background {...stepProps} />;
      case 2:
        return <Step2ProgramsSkills {...stepProps} />;
      case 3:
        return <Step3AdditionalContext {...stepProps} />;
      case 4:
        return <Step4JobDetails {...stepProps} />;
      case 5:
        return <Step5Ownership {...stepProps} />;
      case 6:
        return <Step6Impact {...stepProps} />;
      case 7:
        return <Step7LessonsLearned {...stepProps} />;
      case 8:
        return <Step8ClarifyingRelevance {...stepProps} />;
      case 9:
        return <Step9Qualifications {...stepProps} />;
      default:
        return null;
    }
  };

  const isLastStep = state.currentStep === totalSteps;

  return (
    <div className="space-y-8">
      <ProgressBar
        currentStep={state.currentStep}
        totalSteps={totalSteps}
        stepTitle={stepTitle}
      />

      <div className="min-h-[400px] bg-card/30 rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm">
        {renderStep()}
      </div>

      <div className="flex items-center justify-between gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="group hover:bg-muted/50 border-2"
          data-testid="button-form-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
          {state.currentStep === 1 ? "Back to Selection" : "Back"}
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          className={`group ${isLastStep ? 'min-w-[200px]' : ''}`}
          size={isLastStep ? "lg" : "default"}
          data-testid="button-form-next"
        >
          {isLastStep ? (
            "Generate Documents"
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>

      <div
        className={`rounded-xl border-2 border-chart-2/30 bg-gradient-to-br from-chart-2/5 to-chart-2/10 p-4 transition-all duration-500 ${
          showEmotionalMessage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
        data-testid="text-emotional-checkin"
      >
        <p className="text-sm text-center text-chart-2 dark:text-chart-2/90 leading-relaxed">
          <span className="font-semibold">A gentle reminder:</span> Talking about your past and your record can feel heavy. It's okay to pause, take a break, or talk this through with someone you trust.
        </p>
      </div>
    </div>
  );
}
