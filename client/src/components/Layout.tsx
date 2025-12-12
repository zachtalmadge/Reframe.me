import { ReactNode, MouseEvent, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
  onLogoClick?: () => void;
  onFaqClick?: () => void;
}

export default function Layout({ children, onLogoClick, onFaqClick }: LayoutProps) {
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

  const handleFaqClick = (e: MouseEvent) => {
    if (onFaqClick) {
      e.preventDefault();
      onFaqClick();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&display=swap');

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes horizon-rise {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }

        .logo-text {
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
          font-weight: 700;
          background: linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0891b2 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
          letter-spacing: -0.03em;
        }

        .logo-text::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #14b8a6 20%, #f97316 50%, #14b8a6 80%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .logo-text:hover::after {
          opacity: 0.6;
        }

        .nav-link {
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 1.5px;
          background: linear-gradient(90deg, #14b8a6 0%, #f97316 100%);
          transition: width 0.3s ease, left 0.3s ease;
        }

        .nav-link:hover::before {
          width: 100%;
          left: 0;
        }

        .horizon-line {
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(20, 184, 166, 0.1) 10%,
            rgba(20, 184, 166, 0.2) 25%,
            rgba(249, 115, 22, 0.15) 50%,
            rgba(20, 184, 166, 0.2) 75%,
            rgba(20, 184, 166, 0.1) 90%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 8s ease-in-out infinite;
        }

        @keyframes gentle-pulse {
          0%, 100% {
            box-shadow: 0 2px 8px rgba(249, 115, 22, 0.25), 0 0 0 0 rgba(249, 115, 22, 0);
          }
          50% {
            box-shadow: 0 2px 8px rgba(249, 115, 22, 0.25), 0 0 0 4px rgba(249, 115, 22, 0.15);
          }
        }

        @keyframes subtle-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .donate-button {
          position: relative;
          overflow: hidden;
          animation: gentle-pulse 4s ease-in-out infinite;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .donate-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: subtle-shimmer 3s ease-in-out infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .donate-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35), 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .donate-button:hover::before {
          opacity: 1;
        }

        .donate-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.25);
        }
      `}</style>

      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-transparent relative">
        {/* Horizon gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px horizon-line" aria-hidden="true" />

        {/* Subtle top gradient glow */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(20, 184, 166, 0.03) 0%, transparent 100%)'
          }}
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative">
          <div className="flex h-20 items-center justify-between">
            <Link
              href="/"
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-lg px-2 -ml-2"
              data-testid="link-home"
              onClick={handleLogoClick}
              aria-label="Reframe.me home"
            >
              <div className="flex items-center gap-3">
                {/* Decorative accent mark */}
                <div
                  className="w-1 h-8 rounded-full bg-gradient-to-b from-teal-500 via-orange-400 to-teal-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />

                <div className="flex flex-col">
                  <span className="logo-text text-2xl md:text-3xl">
                    Reframe.me
                  </span>
                 
                </div>
              </div>
            </Link>

            <nav className="flex items-center gap-4">
              <Link
                href="/faq"
                className="nav-link text-sm font-medium text-gray-700 hover:text-teal-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-md px-3 py-2"
                data-testid="link-faq"
                onClick={handleFaqClick}
              >
                Learn More
              </Link>
              <Link
                href="/donate"
                className="donate-button text-sm font-semibold px-4 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                  color: 'white'
                }}
                data-testid="link-donate"
              >
                Donate
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="mt-auto relative overflow-hidden">
        {/* Decorative top border with gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(20, 184, 166, 0.3) 20%, rgba(249, 115, 22, 0.2) 50%, rgba(20, 184, 166, 0.3) 80%, transparent 100%)'
          }}
          aria-hidden="true"
        />

        <div
          className="relative py-12"
          style={{
            background: 'linear-gradient(180deg, #fafaf9 0%, #f0f9ff 100%)'
          }}
        >
          {/* Subtle background orb */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)'
            }}
            aria-hidden="true"
          />

          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative">
            <div className="flex flex-col items-center gap-8">
              {/* Logo/Brand section */}
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-10 rounded-full bg-gradient-to-b from-teal-500 via-orange-400 to-teal-500"
                  aria-hidden="true"
                />
                <div className="text-center">
                  <div
                    className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent"
                    style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.02em' }}
                  >
                    Reframe.me
                  </div>
                  <div className="text-xs text-gray-500 font-medium tracking-wider uppercase mt-0.5">
                    New Opportunities
                  </div>
                </div>
              </div>

              {/* Main message */}
              <div className="text-center max-w-2xl space-y-3">
                <p className="text-base font-semibold text-gray-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Free to use. No account required.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Built with care to support your journey toward meaningful work and second chances.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full max-w-xs">
                <div
                  className="h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(20, 184, 166, 0.2) 50%, transparent 100%)'
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Bottom info */}
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-400 font-medium">
                  © {new Date().getFullYear()} Reframe.me • Your story matters
                </p>
                <p className="text-xs text-gray-400">
                  This tool provides educational information only and is not legal advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
