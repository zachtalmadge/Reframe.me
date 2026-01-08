import GuardedLink from "./GuardedLink";

interface AppNavbarProps {
  onNavigate: (to: string) => void;
}

/**
 * AppNavbar - Application header navigation
 *
 * Renders the sticky header with Reframe.me logo and navigation links (FAQ, Donate).
 * All navigation calls are routed through the onNavigate callback.
 */
export default function AppNavbar({ onNavigate }: AppNavbarProps) {
  return (
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
          <GuardedLink
            to="/"
            onNavigate={onNavigate}
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
          </GuardedLink>

          <nav className="flex items-center gap-2 sm:gap-4">
            <GuardedLink
              to="/faq"
              onNavigate={onNavigate}
              className="faq-button text-sm font-medium text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-lg px-3 py-2 sm:px-4 relative overflow-hidden cursor-pointer"
              data-testid="link-faq"
            >
              <span className="relative z-10">FAQ</span>
            </GuardedLink>
            <GuardedLink
              to="/donate"
              onNavigate={onNavigate}
              className="donate-button text-sm font-semibold px-3 py-2 sm:px-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 flex items-center justify-center cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                color: 'white'
              }}
              data-testid="link-donate"
            >
              Donate
            </GuardedLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
