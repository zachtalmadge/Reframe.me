import { useEffect, useRef } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { clearFormData } from "@/lib/formPersistence";
import { clearResults } from "@/lib/resultsPersistence";
import { shouldPreserveData, shouldRedirectToHome, getRedirectDestination } from "@/lib/routing";
import { NavigationGuardProvider } from "@/contexts/NavigationGuardContext";
import AppShell from "@/components/AppShell";
import Home from "@/pages/Home";
import Selection from "@/pages/Selection";
import Form from "@/pages/Form";
import Loading from "@/pages/loading";
import Results from "@/pages/Results";
import Faq from "@/pages/Faq";
import Donate from "@/pages/Donate";
import TermsPrivacy from "@/pages/TermsPrivacy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/selection" component={Selection} />
      <Route path="/form" component={Form} />
      <Route path="/loading" component={Loading} />
      <Route path="/results" component={Results} />
      <Route path="/faq" component={Faq} />
      <Route path="/donate" component={Donate} />
      <Route path="/terms-privacy" component={TermsPrivacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppInitializer({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    console.log('[AppInitializer] Running initialization on route:', location);

    // Determine data preservation based on route configuration
    const preserveData = shouldPreserveData(location);

    if (!preserveData) {
      console.log('[AppInitializer] Clearing form and results data');
      clearFormData();
      clearResults();
    } else {
      console.log('[AppInitializer] Preserving data (protected route)');
    }

    // Determine if redirect is needed
    if (shouldRedirectToHome(location)) {
      const destination = getRedirectDestination(location);
      console.log('[AppInitializer] Redirecting to:', destination);
      navigate(destination, { replace: true });
    }
  }, [location, navigate]);

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppInitializer>
          <NavigationGuardProvider>
            <AppShell>
              <Router />
            </AppShell>
          </NavigationGuardProvider>
        </AppInitializer>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
