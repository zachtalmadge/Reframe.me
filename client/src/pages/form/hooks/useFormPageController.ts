import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { FormState, ToolType } from "@/lib/formState";
import { saveFormData, loadFormData } from "@/lib/formPersistence";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { toolInfo } from "../data/toolInfo";
import { FileText } from "lucide-react";

export function useFormPageController() {
  // Register this page as protected from navigation
  useProtectedPage();

  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const toolParam = params.get("tool") as ToolType | null;

  const [restoredState, setRestoredState] = useState<FormState | undefined>(undefined);
  const [isRestoring, setIsRestoring] = useState(true);

  const tool = toolParam && toolInfo[toolParam] ? toolParam : "narrative";
  const { title, description, icon: Icon } = toolInfo[tool];

  useEffect(() => {
    const persisted = loadFormData();
    if (persisted && persisted.tool === tool) {
      const restoredFormState: FormState = {
        ...persisted.formState,
        errors: {},
      };
      setRestoredState(restoredFormState);
    }
    setIsRestoring(false);
  }, [tool]);

  const handleFormComplete = (data: FormState) => {
    saveFormData(data, tool);
    window.scrollTo(0, 0);
    navigate(`/loading?tool=${tool}`);
  };

  return {
    tool,
    title,
    description,
    Icon,
    restoredState,
    isRestoring,
    handleFormComplete,
  };
}
