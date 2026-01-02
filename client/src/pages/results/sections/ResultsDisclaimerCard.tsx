import { AlertTriangle } from "lucide-react";

export default function ResultsDisclaimerCard() {
  return (
    <div className="relative animate-fadeInUp opacity-0" style={{ animationDelay: '100ms' }}>
      {/* Subtle elevation shadow */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-200 via-orange-100 to-amber-200 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-amber-900/40 rounded-2xl blur-sm opacity-50" />

      {/* Main card with refined border treatment */}
      <div className="relative rounded-2xl border-l-4 border-amber-600 dark:border-amber-500 bg-gradient-to-br from-white via-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:via-amber-950/30 dark:to-orange-950/20 shadow-xl overflow-hidden">

        {/* Subtle grain texture for depth */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />

        {/* Top accent line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <div className="relative p-6 md:p-8">
          <div className="flex gap-5">
            {/* Elegant icon treatment */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center border border-amber-300/50 dark:border-amber-700/50 shadow-inner">
                <AlertTriangle
                  className="w-7 h-7 text-amber-700 dark:text-amber-400"
                  aria-hidden="true"
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Content with refined hierarchy */}
            <div className="flex-1 space-y-3 font-manrope">
              <div className="space-y-1.5">
                {/* Subtle label */}
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent dark:from-amber-700 dark:to-transparent max-w-[60px]" />
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    Please Note
                  </span>
                </div>

                {/* Heading with elegant serif */}
                <h2 className="text-xl md:text-2xl font-bold text-amber-900 dark:text-amber-100 tracking-tight" style={{ fontFamily: 'Fraunces, Georgia, serif', letterSpacing: '-0.01em' }}>
                  Important Disclaimer
                </h2>
              </div>

              {/* Body text with comfortable reading size */}
              <p className="text-sm md:text-base text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
                These documents are personalized tools to help you prepare
                for employment conversations. They are <span className="font-semibold border-b-2 border-amber-500/40 dark:border-amber-400/40">not legal advice</span>.
                Please review and customize them to reflect your personal
                situation before using them with potential employers.
              </p>
            </div>
          </div>
        </div>

        {/* Subtle bottom border */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-700 to-transparent" />
      </div>
    </div>
  );
}
