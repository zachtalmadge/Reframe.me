import { createContext, useState, useCallback, useMemo, ReactNode } from "react";
import { useLocation } from "wouter";
import { LeaveConfirmationModal } from "@/components/LeaveConfirmationModal";
import { clearFormData } from "@/lib/formPersistence";
import { clearResults } from "@/lib/resultsPersistence";
import { clearRegenerationCounts } from "@/lib/regenerationPersistence";

/**
 * Navigation Guard Context
 *
 * Provides a system for pages to register themselves as "protected"
 * and intercept navigation attempts to show confirmation modals.
 *
 * Used by Form, Loading, and Results pages to prevent accidental
 * navigation away from pages with unsaved data.
 */

export interface NavigationGuardContextValue {
  /** Whether the current page is protected from navigation */
  isProtected: boolean;
  /** Register/unregister current page as protected */
  setProtected: (value: boolean) => void;
  /** Request navigation to a path (will show modal if protected) */
  requestNavigation: (path: string) => void;
  /** Confirm navigation (called by modal) */
  confirmNavigation: () => void;
  /** Cancel navigation (called by modal) */
  cancelNavigation: () => void;
  /** Whether the confirmation modal is currently shown */
  showModal: boolean;
  /** The destination path waiting for confirmation */
  pendingDestination: string | null;
}

export const NavigationGuardContext = createContext<NavigationGuardContextValue | null>(null);

interface NavigationGuardProviderProps {
  children: ReactNode;
}

export function NavigationGuardProvider({ children }: NavigationGuardProviderProps) {
  const [, navigate] = useLocation();

  // Track whether current page is protected
  const [isProtected, setIsProtected] = useState(false);

  // Track modal state
  const [showModal, setShowModal] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<string | null>(null);

  /**
   * Set whether current page is protected from navigation
   * Pages call this via useProtectedPage hook
   */
  const setProtected = useCallback((value: boolean) => {
    setIsProtected(value);
  }, []);

  /**
   * Request navigation to a path
   * If current page is protected, shows modal first
   * If not protected, navigates immediately
   */
  const requestNavigation = useCallback((path: string) => {
    if (isProtected) {
      // Page is protected - show confirmation modal
      setPendingDestination(path);
      setShowModal(true);
    } else {
      // Page is not protected - navigate immediately
      navigate(path);
    }
  }, [isProtected, navigate]);

  /**
   * User confirmed navigation in modal
   * Clear all data and navigate to pending destination
   */
  const confirmNavigation = useCallback(() => {
    // Clear form and results data
    clearFormData();
    clearResults();
    clearRegenerationCounts();

    // Navigate to pending destination
    if (pendingDestination) {
      navigate(pendingDestination);
    }

    // Close modal and reset state
    setShowModal(false);
    setPendingDestination(null);
  }, [pendingDestination, navigate]);

  /**
   * User cancelled navigation in modal
   * Just close the modal and stay on current page
   */
  const cancelNavigation = useCallback(() => {
    setShowModal(false);
    setPendingDestination(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<NavigationGuardContextValue>(
    () => ({
      isProtected,
      setProtected,
      requestNavigation,
      confirmNavigation,
      cancelNavigation,
      showModal,
      pendingDestination,
    }),
    [
      isProtected,
      setProtected,
      requestNavigation,
      confirmNavigation,
      cancelNavigation,
      showModal,
      pendingDestination,
    ]
  );

  return (
    <NavigationGuardContext.Provider value={contextValue}>
      {children}

      {/* Global leave confirmation modal */}
      <LeaveConfirmationModal
        open={showModal}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
        title="Before you leave this page"
        description="Don't forget to save your progress before you leave. We don't want you to lose something important by accident. Once you leave this page, your current data will be cleared."
        warning="⚠️ Your data will be cleared when you leave this page."
        confirmText="Leave & clear data"
        cancelText="Stay here"
      />
    </NavigationGuardContext.Provider>
  );
}
