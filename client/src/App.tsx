import { useEffect, useRef } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { clearFormData } from "@/lib/formPersistence";
import { clearResults } from "@/lib/resultsPersistence";
import Home from "@/pages/Home";
import Selection from "@/pages/Selection";
import Form from "@/pages/Form";
import Loading from "@/pages/Loading";
import Results from "@/pages/Results";
import Faq from "@/pages/Faq";
import Donate from "@/pages/Donate";
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

    // Protected routes where data should be preserved
    const protectedRoutes = ['/loading', '/results'];
    const isProtectedRoute = protectedRoutes.includes(location);

    // Only clear data if NOT in generation flow
    if (!isProtectedRoute) {
      clearFormData();
      clearResults();
    }

    // Only redirect if not on home and not in protected flow
    if (location !== "/" && !isProtectedRoute) {
      navigate("/", { replace: true });
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
          <Router />
        </AppInitializer>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
