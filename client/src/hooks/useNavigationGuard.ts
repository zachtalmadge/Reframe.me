import { useContext } from "react";
import { NavigationGuardContext, NavigationGuardContextValue } from "@/contexts/NavigationGuardContext";

/**
 * Hook to access navigation guard context
 *
 * Provides access to navigation guard state and methods.
 * Used by AppShell to intercept link clicks.
 *
 * @throws Error if used outside NavigationGuardProvider
 * @returns Navigation guard context value
 *
 * @example
 * ```tsx
 * function AppShell() {
 *   const { requestNavigation } = useNavigationGuard();
 *
 *   return (
 *     <a href="/" onClick={(e) => {
 *       e.preventDefault();
 *       requestNavigation("/");
 *     }}>
 *       Home
 *     </a>
 *   );
 * }
 * ```
 */
export function useNavigationGuard(): NavigationGuardContextValue {
  const context = useContext(NavigationGuardContext);

  if (!context) {
    throw new Error(
      "useNavigationGuard must be used within NavigationGuardProvider. " +
      "Make sure App.tsx wraps AppShell with <NavigationGuardProvider>."
    );
  }

  return context;
}
