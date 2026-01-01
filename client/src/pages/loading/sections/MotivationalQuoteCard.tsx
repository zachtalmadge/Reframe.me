interface MotivationalQuoteCardProps {
  quote: { text: string; author: string };
  isVisible: boolean;
  showQuotes: boolean;
}

export function MotivationalQuoteCard({ quote, isVisible, showQuotes }: MotivationalQuoteCardProps) {
  return (
    <div
      className={`transition-all duration-700 ease-in-out ${
        showQuotes ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}
      aria-hidden="true"
    >
      <div className="relative rounded-3xl overflow-hidden p-10 md:p-14"
        style={{
          background: 'linear-gradient(135deg, rgba(254,252,232,0.5) 0%, rgba(255,255,255,0.8) 50%, rgba(254,243,199,0.4) 100%)',
          border: '1.5px solid rgba(249, 115, 22, 0.12)',
          boxShadow: '0 12px 40px rgba(249, 115, 22, 0.08)'
        }}
      >
        {/* Quote marks decoration */}
        <div className="absolute top-6 left-6 text-6xl md:text-7xl opacity-10 loading-serif"
          style={{ color: '#ea580c' }}
        >
          "
        </div>

        <div className="relative space-y-8">
          <div className="w-20 h-0.5 mx-auto rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #f97316 50%, transparent 100%)'
            }}
          />

          <blockquote
            className={`loading-serif italic text-xl md:text-2xl lg:text-3xl leading-relaxed text-center transition-all duration-700 flex items-center justify-center ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              color: '#78350f',
              lineHeight: '1.6',
              minHeight: '140px'
            }}
            data-testid="text-motivational-quote"
          >
            <span>{quote.text}</span>
          </blockquote>

          <p
            className={`loading-sans text-base md:text-lg font-bold text-center transition-all duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              color: '#92400e',
              letterSpacing: '0.05em'
            }}
            data-testid="text-quote-author"
          >
            — {quote.author}
          </p>

          <div className="w-20 h-0.5 mx-auto rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #f97316 50%, transparent 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
