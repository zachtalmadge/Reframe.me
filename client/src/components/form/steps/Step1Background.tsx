import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorMessage } from "@/components/ui/error-message";
import { ChipInput } from "../ChipInput";
import { SuggestionChips } from "../SuggestionChips";
import { TypeChips } from "../TypeChips";
import { FormState, FormAction, Offense } from "@/lib/formState";
import { calculateTimeSinceRelease } from "@/lib/utils";
import {
  OFFENSE_DESCRIPTION_SUGGESTIONS,
  OFFENSE_PROGRAM_SUGGESTIONS,
  CURATED_OFFENSE_DESCRIPTIONS,
  CURATED_OFFENSE_PROGRAMS,
  filterSuggestions,
} from "@/lib/suggestionData";
import { CHIP_INPUT_HELPERS, CHIP_SUGGESTION_LABELS } from "@/lib/chipMicrocopy";

const MAX_OFFENSES = 5;

function isOffenseEntryValid(offense: Offense): boolean {
  return offense.type.trim() !== "" && offense.description.trim() !== "";
}

interface Step1BackgroundProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

export function Step1Background({
  state,
  dispatch,
  errors,
}: Step1BackgroundProps) {
  // Track input values for per-offense program ChipInputs (for filtering suggestions)
  const [programInputs, setProgramInputs] = useState<Record<string, string>>({});

  // Track "Show all" state for suggestion lists
  const [showAllOffenseDescriptions, setShowAllOffenseDescriptions] = useState(false);
  const [showAllOffensePrograms, setShowAllOffensePrograms] = useState(false);

  const timeSinceRelease = calculateTimeSinceRelease(
    state.releaseMonth,
    state.releaseYear
  );

  const lastOffense = state.offenses[state.offenses.length - 1];
  const canAddAnother =
    state.offenses.length < MAX_OFFENSES &&
    lastOffense &&
    isOffenseEntryValid(lastOffense);

  const handleAddOffense = () => {
    if (!canAddAnother) return;
    dispatch({ type: "ADD_OFFENSE" });
  };

  const handleRemoveOffense = (id: string) => {
    dispatch({ type: "REMOVE_OFFENSE", id });
  };

  const handleUpdateOffense = (
    id: string,
    field: keyof Offense,
    value: string
  ) => {
    dispatch({ type: "UPDATE_OFFENSE", id, field, value });
  };

  const handleAddOffenseProgram = (offenseId: string, program: string) => {
    dispatch({ type: "ADD_OFFENSE_PROGRAM", offenseId, program });
  };

  const handleRemoveOffenseProgram = (offenseId: string, index: number) => {
    dispatch({ type: "REMOVE_OFFENSE_PROGRAM", offenseId, index });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Background Information
        </h2>
        <p className="text-muted-foreground">
          Tell us about your background so we can help craft your narrative.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Label className="text-base font-medium">Your Background</Label>
            <div className="flex flex-col items-end gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOffense}
                disabled={!canAddAnother}
                data-testid="button-add-offense"
              >
                <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                Add Another
              </Button>
              {state.offenses.length >= MAX_OFFENSES && (
                <p className="text-xs text-muted-foreground" data-testid="text-max-entries-reached">
                  You can add up to {MAX_OFFENSES} entries.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {state.offenses.map((offense, index) => (
              <div
                key={offense.id}
                className="p-4 rounded-lg border border-border bg-muted/30 space-y-4"
                data-testid={`offense-card-${index}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    Entry {index + 1}
                  </span>
                  {state.offenses.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOffense(offense.id)}
                      className="text-muted-foreground hover:text-destructive"
                      data-testid={`button-remove-offense-${index}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                      <span className="sr-only">Remove entry {index + 1}</span>
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label id={`offense-type-label-${offense.id}`}>
                      Type
                    </Label>
                    <TypeChips
                      value={offense.type}
                      onChange={(value) =>
                        handleUpdateOffense(offense.id, "type", value)
                      }
                      error={!!errors[`offense-${offense.id}-type`]}
                      offenseId={offense.id}
                    />
                    <ErrorMessage message={errors[`offense-${offense.id}-type`]} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`offense-description-${offense.id}`}>
                      Brief Description
                    </Label>
                    <Input
                      id={`offense-description-${offense.id}`}
                      value={offense.description}
                      onChange={(e) =>
                        handleUpdateOffense(
                          offense.id,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Theft, DUI, etc."
                      data-testid={`input-offense-description-${index}`}
                    />
                    {(() => {
                      const hasFilter = offense.description.trim().length > 0;
                      const baseOptions = hasFilter
                        ? OFFENSE_DESCRIPTION_SUGGESTIONS
                        : showAllOffenseDescriptions
                          ? OFFENSE_DESCRIPTION_SUGGESTIONS
                          : CURATED_OFFENSE_DESCRIPTIONS;
                      const filteredOptions = filterSuggestions(baseOptions, offense.description);

                      return (
                        <>
                          {!hasFilter &&
                            OFFENSE_DESCRIPTION_SUGGESTIONS.length > CURATED_OFFENSE_DESCRIPTIONS.length && (
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-muted-foreground">
                                  Tap to fill, or type your own
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setShowAllOffenseDescriptions((prev) => !prev)}
                                  className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                                >
                                  {showAllOffenseDescriptions
                                    ? "Show fewer"
                                    : `Show all (${OFFENSE_DESCRIPTION_SUGGESTIONS.length})`}
                                </button>
                              </div>
                            )}
                          <SuggestionChips
                            suggestions={filteredOptions}
                            onSelect={(value) =>
                              handleUpdateOffense(offense.id, "description", value)
                            }
                            selectedValues={[]}
                            label="Common descriptions"
                          />
                        </>
                      );
                    })()}
                    <ErrorMessage message={errors[`offense-${offense.id}-description`]} />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Programs completed for this{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <ChipInput
                      chips={offense.programs}
                      onAdd={(program) =>
                        handleAddOffenseProgram(offense.id, program)
                      }
                      onRemove={(index) =>
                        handleRemoveOffenseProgram(offense.id, index)
                      }
                      onInputChange={(value) =>
                        setProgramInputs((prev) => ({ ...prev, [offense.id]: value }))
                      }
                      placeholder="e.g., Anger management, AA meetings"
                      helperText={CHIP_INPUT_HELPERS.offensePrograms}
                      data-testid={`chip-input-offense-programs-${index}`}
                    />
                    {(() => {
                      const inputValue = programInputs[offense.id] || "";
                      const hasFilter = inputValue.trim().length > 0;
                      const baseOptions = hasFilter
                        ? OFFENSE_PROGRAM_SUGGESTIONS
                        : showAllOffensePrograms
                          ? OFFENSE_PROGRAM_SUGGESTIONS
                          : CURATED_OFFENSE_PROGRAMS;
                      const filteredOptions = filterSuggestions(baseOptions, inputValue);

                      return (
                        <>
                          {!hasFilter &&
                            OFFENSE_PROGRAM_SUGGESTIONS.length > CURATED_OFFENSE_PROGRAMS.length && (
                              <div className="flex justify-end mt-1">
                                <button
                                  type="button"
                                  onClick={() => setShowAllOffensePrograms((prev) => !prev)}
                                  className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                                >
                                  {showAllOffensePrograms
                                    ? "Show fewer"
                                    : `Show all (${OFFENSE_PROGRAM_SUGGESTIONS.length})`}
                                </button>
                              </div>
                            )}
                          <p className="mt-3 text-xs font-medium text-muted-foreground">
                            {CHIP_SUGGESTION_LABELS.offensePrograms}
                          </p>
                          <SuggestionChips
                            suggestions={filteredOptions}
                            selectedValues={offense.programs}
                            onSelect={(value) => {
                              if (!offense.programs.includes(value)) {
                                handleAddOffenseProgram(offense.id, value);
                              }
                            }}
                          />
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">Release Date</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="release-month" className="sr-only">
                Month
              </Label>
              <Select
                value={state.releaseMonth}
                onValueChange={(value) =>
                  dispatch({ type: "SET_FIELD", field: "releaseMonth", value })
                }
              >
                <SelectTrigger id="release-month" data-testid="select-release-month">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="release-year" className="sr-only">
                Year
              </Label>
              <Select
                value={state.releaseYear}
                onValueChange={(value) =>
                  dispatch({ type: "SET_FIELD", field: "releaseYear", value })
                }
              >
                <SelectTrigger id="release-year" data-testid="select-release-year">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <ErrorMessage message={errors.releaseMonth || errors.releaseYear} />
          {timeSinceRelease && (
            <p
              className="text-sm text-primary font-medium"
              data-testid="text-time-since-release"
            >
              {timeSinceRelease}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
