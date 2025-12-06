import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { ChipInput } from "../ChipInput";
import { FormState, FormAction } from "@/lib/formState";

interface Step2ProgramsSkillsProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

export function Step2ProgramsSkills({
  state,
  dispatch,
  errors,
}: Step2ProgramsSkillsProps) {
  const handleAddProgram = (value: string) => {
    dispatch({ type: "ADD_CHIP", field: "programs", value });
  };

  const handleRemoveProgram = (index: number) => {
    dispatch({ type: "REMOVE_CHIP", field: "programs", index });
  };

  const handleAddSkill = (value: string) => {
    dispatch({ type: "ADD_CHIP", field: "skills", value });
  };

  const handleRemoveSkill = (index: number) => {
    dispatch({ type: "REMOVE_CHIP", field: "skills", index });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Programs & Skills
        </h2>
        <p className="text-muted-foreground">
          Share the programs you've completed and skills you've developed.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="programs-input" className="text-base font-medium">
              Rehabilitation Programs
            </Label>
            <p className="text-sm text-muted-foreground">
              List any programs, courses, or certifications you've completed.
            </p>
          </div>
          <ChipInput
            id="programs-input"
            chips={state.programs}
            onAdd={handleAddProgram}
            onRemove={handleRemoveProgram}
            placeholder="e.g., GED, Vocational training, Counseling"
            helperText="Type a program and press Enter or tap 'Add' to save it."
            data-testid="chip-input-programs"
          />
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="skills-input" className="text-base font-medium">
              Skills & Strengths
            </Label>
            <p className="text-sm text-muted-foreground">
              What skills have you developed? What are you good at?
            </p>
          </div>
          <ChipInput
            id="skills-input"
            chips={state.skills}
            onAdd={handleAddSkill}
            onRemove={handleRemoveSkill}
            placeholder="e.g., Communication, Leadership, Problem-solving"
            helperText="Type a skill or strength and press Enter or tap 'Add' to save it."
            data-testid="chip-input-skills"
          />
        </div>

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">Tip:</span> Include both hard skills
            (like computer skills, trades, certifications) and soft skills (like
            teamwork, reliability, communication). Employers value both!
          </p>
        </div>

        <ErrorMessage message={errors.programsSkills} data-testid="error-programs-skills" />
      </div>
    </div>
  );
}
