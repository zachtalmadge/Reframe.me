import { useReducer, useCallback } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
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
      if (tool !== "narrative") {
        if (!state.ownership.trim()) {
          errors.ownership = "Please describe how you take ownership";
        }
      }
      break;

    case 6:
      if (tool !== "narrative") {
        if (!state.impact.trim()) {
          errors.impact = "Please describe your understanding of the impact";
        }
      }
      break;

    case 7:
      if (tool !== "narrative") {
        if (!state.lessonsLearned.trim()) {
          errors.lessonsLearned = "Please describe what you've learned";
        }
      }
      break;

    case 8:
      if (tool !== "narrative" && state.clarifyingRelevanceEnabled) {
        if (!state.clarifyingRelevance.trim()) {
          errors.clarifyingRelevance =
            "Please explain relevance or turn off this section";
        }
      }
      break;

    case 9:
      if (tool !== "narrative") {
        if (!state.qualifications.trim()) {
          errors.qualifications = "Please describe your qualifications";
        }
      }
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function FormWizard({ tool, onComplete }: FormWizardProps) {
  const [, navigate] = useLocation();
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const totalSteps = getTotalSteps(tool);
  const stepTitle = getStepTitle(state.currentStep, tool);

  const handleBack = useCallback(() => {
    if (state.currentStep === 1) {
      navigate("/selection");
    } else {
      dispatch({ type: "PREV_STEP" });
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

      <div className="min-h-[400px]">{renderStep()}</div>

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          data-testid="button-form-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          {state.currentStep === 1 ? "Back to Selection" : "Back"}
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          data-testid="button-form-next"
        >
          {isLastStep ? "Generate Documents" : "Continue"}
          {!isLastStep && (
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}
