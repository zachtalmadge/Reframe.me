import { ToolType } from "@/lib/formState";

const VALID_TOOL_TYPES: ToolType[] = ["narrative", "response-letter"];

export function validateToolParam(param: string | null): ToolType {
  if (param && VALID_TOOL_TYPES.includes(param as ToolType)) {
    return param as ToolType;
  }
  return "narrative";
}
