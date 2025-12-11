import { useState } from "react";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { ChipInput } from "../ChipInput";
import { SuggestionChips } from "../SuggestionChips";
import { StepImportanceAlert } from "../StepImportanceAlert";
import { FormState, FormAction } from "@/lib/formState";
import {
  STEP2_PROGRAM_SUGGESTIONS,
  SKILL_SUGGESTIONS,
  CURATED_STEP2_PROGRAMS,
  CURATED_SKILLS,
  filterSuggestions,
} from "@/lib/suggestionData";
import { CHIP_INPUT_HELPERS, CHIP_SUGGESTION_LABELS } from "@/lib/chipMicrocopy";

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
  // Track input values for filtering suggestions
  const [programsInputValue, setProgramsInputValue] = useState("");
  const [skillsInputValue, setSkillsInputValue] = useState("");

  // Track "Show all" state for suggestion lists
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

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

      <StepImportanceAlert>
        Think about both technical skills (like computer skills, trades, certifications) and transferable skills (like staying calm under pressure, being dependable, or helping others). These are strengths employers value!
      </StepImportanceAlert>

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
            onInputChange={setProgramsInputValue}
            placeholder="e.g., GED, Vocational training, Counseling"
            helperText={CHIP_INPUT_HELPERS.rehabilitationPrograms}
            data-testid="chip-input-programs"
          />
          {(() => {
            const hasFilter = programsInputValue.trim().length > 0;
            const baseOptions = hasFilter
              ? STEP2_PROGRAM_SUGGESTIONS
              : showAllPrograms
                ? STEP2_PROGRAM_SUGGESTIONS
                : CURATED_STEP2_PROGRAMS;
            const filteredOptions = filterSuggestions(baseOptions, programsInputValue);

            return (
              <>
                {!hasFilter &&
                  STEP2_PROGRAM_SUGGESTIONS.length > CURATED_STEP2_PROGRAMS.length && (
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={() => setShowAllPrograms((prev) => !prev)}
                        className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                      >
                        {showAllPrograms
                          ? "Show fewer"
                          : `Show all (${STEP2_PROGRAM_SUGGESTIONS.length})`}
                      </button>
                    </div>
                  )}
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  {CHIP_SUGGESTION_LABELS.rehabilitationPrograms}
                </p>
                <SuggestionChips
                  suggestions={filteredOptions}
                  selectedValues={state.programs}
                  onSelect={(value) => {
                    if (!state.programs.includes(value)) {
                      handleAddProgram(value);
                    }
                  }}
                />
              </>
            );
          })()}
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
            onInputChange={setSkillsInputValue}
            placeholder="e.g., computer skills, forklift certified, staying focused, working well with others"
            helperText={CHIP_INPUT_HELPERS.skills}
            data-testid="chip-input-skills"
          />
          {(() => {
            const hasFilter = skillsInputValue.trim().length > 0;
            const baseOptions = hasFilter
              ? SKILL_SUGGESTIONS
              : showAllSkills
                ? SKILL_SUGGESTIONS
                : CURATED_SKILLS;
            const filteredOptions = filterSuggestions(baseOptions, skillsInputValue);

            return (
              <>
                {!hasFilter &&
                  SKILL_SUGGESTIONS.length > CURATED_SKILLS.length && (
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={() => setShowAllSkills((prev) => !prev)}
                        className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                      >
                        {showAllSkills
                          ? "Show fewer"
                          : `Show all (${SKILL_SUGGESTIONS.length})`}
                      </button>
                    </div>
                  )}
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  {CHIP_SUGGESTION_LABELS.skills}
                </p>
                <SuggestionChips
                  suggestions={filteredOptions}
                  selectedValues={state.skills}
                  onSelect={(value) => {
                    if (!state.skills.includes(value)) {
                      handleAddSkill(value);
                    }
                  }}
                />
              </>
            );
          })()}
        </div>

        <ErrorMessage message={errors.programsSkills} data-testid="error-programs-skills" />
      </div>
    </div>
  );
}
