import { ReactNode, MouseEvent, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
  onLogoClick?: () => void;
}

export default function Layout({ children, onLogoClick }: LayoutProps) {
  const [location] = useLocation();
  const [showSweep, setShowSweep] = useState(false);
  const isHome = location === "/";

  useEffect(() => {
    if (isHome) {
      const timer = setTimeout(() => setShowSweep(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowSweep(false);
    }
  }, [isHome]);

  const handleLogoClick = (e: MouseEvent) => {
    if (onLogoClick) {
      e.preventDefault();
      onLogoClick();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link 
              href="/" 
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
              data-testid="link-home"
              onClick={handleLogoClick}
              aria-label="Reframe.me home"
            >
              <span className="relative text-xl font-semibold text-primary tracking-tight overflow-hidden">
                Reframe.me
                {isHome && (
                  <span 
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full motion-reduce:hidden ${
                      showSweep ? "animate-logo-sweep" : ""
                    }`}
                    aria-hidden="true"
                  />
                )}
              </span>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t border-border py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground text-center">
            Free to use. No account required.
          </p>
        </div>
      </footer>
    </div>
  );
}
