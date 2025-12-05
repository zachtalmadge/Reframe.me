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
import { ChipInput } from "../ChipInput";
import { FormState, FormAction, Offense } from "@/lib/formState";
import { calculateTimeSinceRelease } from "@/lib/utils";

interface Step1BackgroundProps {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  errors: Record<string, string>;
}

const offenseTypes = [
  { value: "misdemeanor", label: "Misdemeanor" },
  { value: "felony", label: "Felony" },
  { value: "infraction", label: "Infraction" },
  { value: "other", label: "Other" },
];

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
  const timeSinceRelease = calculateTimeSinceRelease(
    state.releaseMonth,
    state.releaseYear
  );

  const handleAddOffense = () => {
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
          <div className="flex items-center justify-between gap-4">
            <Label className="text-base font-medium">Your Background</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOffense}
              data-testid="button-add-offense"
            >
              <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
              Add Another
            </Button>
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
                    <Label htmlFor={`offense-type-${offense.id}`}>Type</Label>
                    <Select
                      value={offense.type}
                      onValueChange={(value) =>
                        handleUpdateOffense(offense.id, "type", value)
                      }
                    >
                      <SelectTrigger
                        id={`offense-type-${offense.id}`}
                        data-testid={`select-offense-type-${index}`}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {offenseTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[`offense-${offense.id}-type`] && (
                      <p className="text-sm text-destructive">
                        {errors[`offense-${offense.id}-type`]}
                      </p>
                    )}
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
                    {errors[`offense-${offense.id}-description`] && (
                      <p className="text-sm text-destructive">
                        {errors[`offense-${offense.id}-description`]}
                      </p>
                    )}
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
                      placeholder="e.g., Anger management, AA meetings"
                      data-testid={`chip-input-offense-programs-${index}`}
                    />
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
          {(errors.releaseMonth || errors.releaseYear) && (
            <p className="text-sm text-destructive">
              {errors.releaseMonth || errors.releaseYear}
            </p>
          )}
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
