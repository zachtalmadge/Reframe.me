import { LoadingOrb } from "./LoadingOrb";
import { StatusMessageCard } from "./StatusMessageCard";
import { MotivationalQuoteCard } from "./MotivationalQuoteCard";
import { loadingMessages, motivationalQuotes } from "../data/loadingContent";

interface LoadingViewProps {
  messageIndex: number;
  isMessageVisible: boolean;
  quoteIndex: number;
  isQuoteVisible: boolean;
  showQuotes: boolean;
}

export function LoadingView({
  messageIndex,
  isMessageVisible,
  quoteIndex,
  isQuoteVisible,
  showQuotes
}: LoadingViewProps) {
  return (
    <section
      className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(165deg, #fdfcfb 0%, #fef9f3 30%, #fef6ee 60%, #fefaf8 100%)'
      }}
      aria-labelledby="loading-heading"
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat'
      }} />

      {/* Animated ink blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="ink-blob" />
        <div className="ink-blob" />
        <div className="ink-blob" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Main loading visualization - organic breathing orbs */}
        <LoadingOrb />

        {/* Content area with editorial spacing */}
        <div className="space-y-12 md:space-y-14">
          {/* Main heading */}
          <div className="text-center space-y-6">
            <h1
              id="loading-heading"
              className="loading-serif text-3xl md:text-5xl lg:text-6xl font-bold"
              style={{
                color: '#0f766e',
                lineHeight: '1.1',
                textShadow: '0 2px 4px rgba(13, 148, 136, 0.1)'
              }}
            >
              Crafting your{' '}
              <span style={{
                background: 'linear-gradient(135deg, #0d9488 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                story
              </span>
            </h1>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #0d9488 100%)'
                }}
              />
              <div className="w-2 h-2 rounded-full"
                style={{ background: '#f97316' }}
              />
              <div className="w-12 h-px"
                style={{
                  background: 'linear-gradient(90deg, #0d9488 0%, transparent 100%)'
                }}
              />
            </div>
          </div>

          {/* Status message card */}
          <StatusMessageCard
            message={loadingMessages[messageIndex]}
            isVisible={isMessageVisible}
          />

          {/* Motivational quotes section */}
          <MotivationalQuoteCard
            quote={motivationalQuotes[quoteIndex]}
            isVisible={isQuoteVisible}
            showQuotes={showQuotes}
          />

          {/* Subtle timing note */}
          <div className="text-center pt-4">
            <p className="loading-sans text-sm font-semibold tracking-wide"
              style={{
                color: '#64748b',
                opacity: 0.7
              }}
            >
              This usually takes just a few moments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
