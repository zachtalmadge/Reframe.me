import { useEffect } from "react";
import { useNavigationGuard } from "./useNavigationGuard";

/**
 * Hook to register current page as protected from navigation
 *
 * Pages that call this hook will trigger a confirmation modal
 * when users attempt to navigate away via AppShell links.
 *
 * Automatically cleans up on unmount to unregister protection.
 *
 * @example
 * ```tsx
 * function Form() {
 *   useProtectedPage(); // That's it! Page is now protected
 *
 *   return <div>Form content...</div>;
 * }
 * ```
 *
 * Used by:
 * - Form.tsx - Protects multi-step form data
 * - Loading.tsx - Protects during document generation
 * - Results.tsx - Protects generated results
 */
export function useProtectedPage() {
  const { setProtected } = useNavigationGuard();

  useEffect(() => {
    // Register this page as protected on mount
    setProtected(true);

    // Unregister on unmount (cleanup)
    return () => {
      setProtected(false);
    };
  }, [setProtected]);
}
