import { ReactNode } from "react";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import AppNavbar from "./app-shell/AppNavbar";
import AppFooter from "./app-shell/AppFooter";

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell - Global application layout orchestrator
 *
 * Provides consistent header, footer, and main content structure for all pages.
 * Uses navigation guard context to intercept navigation and show confirmation
 * modals when leaving protected pages (Form, Loading, Results).
 *
 * This component is the ONLY component that calls useNavigationGuard().
 * It passes the requestNavigation callback down to AppNavbar and AppFooter.
 */
export default function AppShell({ children }: AppShellProps) {
  const { requestNavigation } = useNavigationGuard();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavbar onNavigate={requestNavigation} />

      <main className="flex-1">
        {children}
      </main>

      <AppFooter onNavigate={requestNavigation} />
    </div>
  );
}
