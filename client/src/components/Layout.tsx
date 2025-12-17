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
          font-family: 'Fraunces', Georgia, serif;
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

      <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-xl border-b border-transparent relative">
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
        {/* Bold top border with gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, #14b8a6 0%, #f97316 50%, #14b8a6 100%)'
          }}
          aria-hidden="true"
        />

        <div
          className="relative py-16 md:py-20"
          style={{
            background: '#ffffff'
          }}
        >
          {/* Geometric background accents */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 left-0 w-64 h-64 opacity-5"
              style={{
                background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)'
              }}
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 right-0 w-80 h-80 opacity-5"
              style={{
                background: 'radial-gradient(circle, #f97316 0%, transparent 70%)'
              }}
              aria-hidden="true"
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">

              {/* Column 1: Brand & Mission */}
              <div className="space-y-6">
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-1.5 h-12 rounded-full"
                    style={{
                      background: 'linear-gradient(180deg, #14b8a6 0%, #f97316 100%)'
                    }}
                    aria-hidden="true"
                  />
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{
                        fontFamily: 'Fraunces, Georgia, serif',
                        letterSpacing: '-0.02em',
                        background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      Reframe.me
                    </div>
                    <div
                      className="text-xs font-bold tracking-wider uppercase mt-1"
                      style={{
                        color: '#64748b'
                      }}
                    >
                      Privacy-first disclosure support
                    </div>
                  </div>
                </div>

                {/* Mission Statement */}
                <p
                  className="text-sm leading-relaxed font-medium"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#475569'
                  }}
                >
                  Built with care to support your journey toward meaningful work and second chances.
                </p>

                {/* Badge */}
                <div
                  className="inline-block px-4 py-2 rounded-full border-2"
                  style={{
                    borderColor: '#14b8a6',
                    background: 'rgba(20, 184, 166, 0.05)'
                  }}
                >
                  <p
                    className="text-xs font-bold"
                    style={{
                      color: '#0d9488'
                    }}
                  >
                    Your story matters
                  </p>
                </div>
              </div>

              {/* Column 2: Features & Info */}
              <div className="space-y-6">
                <h3
                  className="text-sm font-bold tracking-wider uppercase mb-4"
                  style={{
                    color: '#0d9488',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                >
                  What We Offer
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2"
                      style={{ background: '#14b8a6' }}
                      aria-hidden="true"
                    />
                    <div>
                      <p
                        className="font-bold text-sm mb-1"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          color: '#0f172a'
                        }}
                      >
                        Free to use
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: '#64748b' }}
                      >
                        No account required
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2"
                      style={{ background: '#f97316' }}
                      aria-hidden="true"
                    />
                    <div>
                      <p
                        className="font-bold text-sm mb-1"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          color: '#0f172a'
                        }}
                      >
                        Privacy-focused
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: '#64748b' }}
                      >
                        No tracking of your answers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2"
                      style={{ background: '#8b5cf6' }}
                      aria-hidden="true"
                    />
                    <div>
                      <p
                        className="font-bold text-sm mb-1"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          color: '#0f172a'
                        }}
                      >
                        Built for you
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: '#64748b' }}
                      >
                        You control your data
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Legal & Support */}
              <div className="space-y-6">
                <h3
                  className="text-sm font-bold tracking-wider uppercase mb-4"
                  style={{
                    color: '#0d9488',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                >
                  Legal & Support
                </h3>

                <div className="space-y-4">
                  {/* FAQ Link */}
                  <Link href="/faq">
                    <button
                      className="text-sm font-bold hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#14b8a6'
                      }}
                    >
                      FAQ
                      <span
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </button>
                  </Link>

                  {/* Terms & Privacy Link */}
                  <Link href="/terms-privacy">
                    <button
                      className="text-sm font-bold hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#14b8a6'
                      }}
                    >
                      Terms & Privacy
                      <span
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </button>
                  </Link>

                  {/* Disclaimer */}
                  <div
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      background: 'rgba(249, 115, 22, 0.05)',
                      borderColor: '#f97316'
                    }}
                  >
                    <p
                      className="text-xs font-medium leading-relaxed"
                      style={{
                        color: '#64748b',
                        fontFamily: 'DM Sans, sans-serif'
                      }}
                    >
                      Educational information only, not legal advice
                    </p>
                  </div>

                  {/* Copyright */}
                  <div className="pt-2">
                    <p
                      className="text-xs font-medium"
                      style={{ color: '#94a3b8' }}
                    >
                      © {new Date().getFullYear()} Reframe.me
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: '#cbd5e1' }}
                    >
                      All rights reserved
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
