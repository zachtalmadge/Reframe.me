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
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #14b8a6 20%, #f97316 50%, #14b8a6 80%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .group:hover .logo-text::after {
          opacity: 0.6;
        }

        /* Tagline styling */
        .logo-tagline {
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
          font-weight: 500;
          font-size: 0.75rem;
          letter-spacing: 0.02em;
          color: #64748b;
          opacity: 0.7;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 4px;
        }

        .group:hover .logo-tagline {
          opacity: 1;
          color: #0d9488;
          letter-spacing: 0.03em;
        }

        /* Accent bar hover effect */
        .logo-accent {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .group:hover .logo-accent {
          height: 2.5rem;
          opacity: 1;
          box-shadow: 0 0 12px rgba(20, 184, 166, 0.3);
        }

        /* iOS Liquid Glass styling for FAQ button */
        .faq-button {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Non-iOS fallback */
        .faq-button {
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%);
          border: 1px solid rgba(20, 184, 166, 0.15);
        }

        .faq-button:hover {
          background: linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%);
          border-color: rgba(20, 184, 166, 0.3);
          box-shadow: 0 2px 8px rgba(20, 184, 166, 0.15);
          transform: translateY(-1px);
        }

        /* iOS Liquid Glass override */
        @supports (-webkit-touch-callout: none) {
          .faq-button {
            background: linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(14, 165, 233, 0.12) 100%);
            border: 1.5px solid rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow:
              0 4px 16px rgba(20, 184, 166, 0.2),
              inset 0 1px 2px rgba(255, 255, 255, 0.6),
              inset 0 -1px 2px rgba(0, 0, 0, 0.05);
          }

          .faq-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50%;
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(255, 255, 255, 0.1) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            border-radius: inherit;
            pointer-events: none;
            opacity: 0.8;
            z-index: 1;
          }

          .faq-button::after {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: inherit;
            background: radial-gradient(
              circle at 50% 50%,
              rgba(20, 184, 166, 0.4),
              rgba(14, 165, 233, 0.3)
            );
            filter: blur(10px);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: -1;
          }

          .faq-button:hover::after {
            opacity: 1;
          }

          .faq-button:active {
            transform: scale(0.96) translateZ(0);
            -webkit-transform: scale(0.96) translateZ(0);
          }
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

        /* iOS Liquid Glass styling for Donate button */
        .donate-button {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Non-iOS fallback */
        @keyframes gentle-pulse {
          0%, 100% {
            box-shadow: 0 2px 8px rgba(249, 115, 22, 0.25), 0 0 0 0 rgba(249, 115, 22, 0);
          }
          50% {
            box-shadow: 0 2px 8px rgba(249, 115, 22, 0.25), 0 0 0 4px rgba(249, 115, 22, 0.15);
          }
        }

        .donate-button {
          animation: gentle-pulse 4s ease-in-out infinite;
        }

        .donate-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
        }

        /* iOS Liquid Glass override */
        @supports (-webkit-touch-callout: none) {
          .donate-button {
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.85) 0%, rgba(251, 146, 60, 0.9) 100%) !important;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow:
              0 8px 32px rgba(249, 115, 22, 0.35),
              0 2px 8px rgba(0, 0, 0, 0.15),
              inset 0 1px 2px rgba(255, 255, 255, 0.4),
              inset 0 -2px 4px rgba(0, 0, 0, 0.1);
            animation: none;
          }

          .donate-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50%;
            background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(255, 255, 255, 0.1) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            border-radius: inherit;
            pointer-events: none;
            opacity: 0.8;
            z-index: 1;
          }

          .donate-button::after {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: inherit;
            background: radial-gradient(
              circle at 50% 50%,
              rgba(249, 115, 22, 0.6),
              rgba(251, 146, 60, 0.4)
            );
            filter: blur(12px);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: -1;
          }

          .donate-button:hover::after {
            opacity: 1;
          }

          .donate-button:hover {
            transform: translateY(-1px);
          }

          .donate-button:active {
            transform: scale(0.96) translateZ(0);
            -webkit-transform: scale(0.96) translateZ(0);
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.9) 0%, rgba(234, 88, 12, 0.95) 100%) !important;
            box-shadow:
              0 4px 16px rgba(249, 115, 22, 0.4),
              0 1px 4px rgba(0, 0, 0, 0.2),
              inset 0 1px 2px rgba(255, 255, 255, 0.3),
              inset 0 -1px 2px rgba(0, 0, 0, 0.15);
          }

          /* Shimmer effect on active */
          @keyframes ios-shimmer {
            0% {
              background-position: -200% center;
            }
            100% {
              background-position: 200% center;
            }
          }

          .donate-button:active::before {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            background-size: 200% 100%;
            animation: ios-shimmer 0.6s ease-out;
          }
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
                  className="logo-accent w-1 h-8 rounded-full bg-gradient-to-b from-teal-500 via-orange-400 to-teal-500 opacity-60"
                  aria-hidden="true"
                />

                <div className="flex flex-col">
                  <span className="logo-text text-2xl md:text-3xl">
                    Reframe.me
                  </span>
                  <span className="logo-tagline">
                    Privacy-first disclosure support.
                  </span>
                </div>
              </div>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/faq"
                className="faq-button text-sm font-medium text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-lg px-3 py-2 sm:px-4 relative overflow-hidden"
                data-testid="link-faq"
                onClick={handleFaqClick}
              >
                <span className="relative z-10">FAQ</span>
              </Link>
              <Link
                href="/donate"
                className="donate-button text-sm font-semibold px-3 py-2 sm:px-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 flex items-center justify-center"
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
                    Privacy-first disclosure support
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
              <div className="text-center space-y-3">
                <p className="text-xs text-gray-400 font-medium">
                  © {new Date().getFullYear()} Reframe.me • Your story matters
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="/terms-privacy">
                    <button className="text-xs text-gray-500 hover:text-teal-600 transition-colors duration-200 underline-offset-4 hover:underline font-medium">
                      Terms & Privacy
                    </button>
                  </Link>
                  <span className="text-gray-300" aria-hidden="true">•</span>
                  <p className="text-xs text-gray-400">
                    Educational information only, not legal advice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
