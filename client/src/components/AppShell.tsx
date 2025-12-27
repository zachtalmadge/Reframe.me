import { ReactNode } from "react";
import { Link } from "wouter";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";

interface AppShellProps {
  children: ReactNode;
}

/**
 * AppShell - Global application layout
 *
 * Provides consistent header, footer, and main content structure for all pages.
 * Uses navigation guard context to intercept navigation and show confirmation
 * modals when leaving protected pages (Form, Loading, Results).
 *
 * All styles are defined in:
 * - Global CSS files (fonts.css, animations.css, backgrounds.css)
 * - Tailwind utility classes
 * - Component-specific CSS modules (if needed)
 */
export default function AppShell({ children }: AppShellProps) {
  const { requestNavigation } = useNavigationGuard();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
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
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                requestNavigation("/");
              }}
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-lg px-2 -ml-2 cursor-pointer"
              data-testid="link-home"
              aria-label="Reframe.me home"
            >
              <div className="flex items-center gap-3">
                {/* Decorative accent mark */}
                <div
                  className="logo-accent w-1 h-8 rounded-full bg-gradient-to-b from-teal-500 via-orange-400 to-teal-500 opacity-60"
                  aria-hidden="true"
                  style={{
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
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
            </a>

            <nav className="flex items-center gap-2 sm:gap-4">
              <a
                href="/faq"
                onClick={(e) => {
                  e.preventDefault();
                  requestNavigation("/faq");
                }}
                className="faq-button text-sm font-medium text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-lg px-3 py-2 sm:px-4 relative overflow-hidden cursor-pointer"
                data-testid="link-faq"
              >
                <span className="relative z-10">FAQ</span>
              </a>
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

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      requestNavigation("/faq");
                    }}
                    className="text-sm font-bold hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group cursor-pointer"
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

                  {/* Terms & Privacy Link */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      requestNavigation("/terms-privacy");
                    }}
                    className="text-sm font-bold hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group cursor-pointer"
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
