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

    // Protected routes where data should be preserved
    const protectedRoutes = ['/loading', '/results'];
    const isProtectedRoute = protectedRoutes.includes(location);

    // Static/informational pages that should be accessible directly
    const staticPages = ['/faq', '/donate', '/terms-privacy'];
    const isStaticPage = staticPages.includes(location);

    console.log('[AppInitializer] Is protected route:', isProtectedRoute);

    // Only clear data if NOT in generation flow
    if (!isProtectedRoute) {
      console.log('[AppInitializer] Clearing form and results data');
      clearFormData();
      clearResults();
    } else {
      console.log('[AppInitializer] Skipping data clear (protected route)');
    }

    // Only redirect if not on home and not in protected flow or static page
    if (location !== "/" && !isProtectedRoute && !isStaticPage) {
      console.log('[AppInitializer] Redirecting to home from:', location);
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
