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
          Programs & Transferable Skills
        </h2>
        <p className="text-muted-foreground">
          Share the programs you've completed and the skills you can bring to a job.
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
              Skills & Transferable Strengths
            </Label>
            <p className="text-sm text-muted-foreground">
              What skills have you developed that you can bring to a job?
            </p>
          </div>
          <ChipInput
            id="skills-input"
            chips={state.skills}
            onAdd={handleAddSkill}
            onRemove={handleRemoveSkill}
            placeholder="e.g., staying focused, working well with different kinds of people, solving problems"
            helperText="Type a skill and press Enter or tap 'Add'. Think about things like patience, staying organized, or being dependable."
            data-testid="chip-input-skills"
          />
        </div>

        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">Tip:</span> Think about both technical skills
            (like computer skills, trades, certifications) and transferable skills (like
            staying calm under pressure, being dependable, or helping others). These are strengths employers value!
          </p>
        </div>

        <ErrorMessage message={errors.programsSkills} data-testid="error-programs-skills" />
      </div>
    </div>
  );
}
