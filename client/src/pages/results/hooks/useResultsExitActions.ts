import { useState } from "react";
import { useLocation } from "wouter";
import { clearFormData } from "@/lib/formPersistence";
import { clearResults } from "@/lib/resultsPersistence";
import { clearRegenerationCounts } from "@/lib/regenerationPersistence";

export interface UseResultsExitActionsReturn {
  exitModalOpen: boolean;
  exitDestination: "home" | "faq" | null;
  handleStartOver: () => void;
  handleLearnMoreClick: () => void;
  handleConfirmExit: () => void;
  handleCancelExit: () => void;
}

export function useResultsExitActions(): UseResultsExitActionsReturn {
  const [, navigate] = useLocation();
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [exitDestination, setExitDestination] = useState<"home" | "faq" | null>(null);

  const handleStartOver = () => {
    clearFormData();
    clearResults();
    clearRegenerationCounts();
    navigate("/");
  };

  const handleLearnMoreClick = () => {
    setExitDestination("faq");
    setExitModalOpen(true);
  };

  const handleConfirmExit = () => {
    setExitModalOpen(false);
    clearFormData();
    clearResults();
    clearRegenerationCounts();
    if (exitDestination === "home") {
      navigate("/");
    } else if (exitDestination === "faq") {
      navigate("/faq");
    }
  };

  const handleCancelExit = () => {
    setExitModalOpen(false);
    setExitDestination(null);
  };

  return {
    exitModalOpen,
    exitDestination,
    handleStartOver,
    handleLearnMoreClick,
    handleConfirmExit,
    handleCancelExit,
  };
}
