import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function DonateCTASection() {
  return (
    <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden dot-pattern dark:dot-pattern-dark"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Literata:ital,wght@0,400;0,600;0,700;1,400&display=swap');

        /* Dot pattern background */
        .dot-pattern {
          background-color: #FAFAF9;
          background-image: radial-gradient(circle, #0D9488 0.5px, transparent 0.5px);
          background-size: 24px 24px;
          background-position: 0 0, 12px 12px;
        }

        .dot-pattern-dark {
          background-color: #0f172a;
          background-image: radial-gradient(circle, rgba(13, 148, 136, 0.15) 0.5px, transparent 0.5px);
          background-size: 24px 24px;
        }

        /* Paper texture overlay */
        .paper-texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }
      `}</style>

      {/* Paper texture overlay */}
      <div className="paper-texture absolute inset-0 pointer-events-none" />

      {/* Subtle decorative corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="relative">
          {/* Main content card */}
          <div
            className="relative rounded-3xl p-10 md:p-16 text-center overflow-hidden bg-white dark:bg-slate-800 border-2 border-primary/20"
            style={{
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03), 0 8px 24px rgba(0, 0, 0, 0.02)'
            }}
          >

            {/* Heart icon with glow */}
            <div className="relative inline-block mb-8">
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-50"
                style={{
                  background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
                  transform: 'scale(1.5)'
                }}
              />
              <div
                className="relative w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                  boxShadow: '0 10px 30px rgba(249, 115, 22, 0.4)'
                }}
              >
                <Heart className="w-10 h-10 text-white" fill="currentColor" aria-hidden="true" />
              </div>
            </div>

            {/* Heading */}
            <h3
              className="text-3xl md:text-5xl font-bold mb-8 leading-snug md:leading-tight"
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                paddingBottom: '0.25rem'
              }}
            >
              Help keep this tool free and accessible
            </h3>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl leading-relaxed mb-10 max-w-3xl mx-auto" style={{ fontFamily: 'Public Sans, sans-serif', color: '#0f766e' }}>
              Every contribution helps cover the costs of keeping Reframe.me running—so more people can prepare for employment conversations with confidence, regardless of their ability to pay.
            </p>

            {/* Gift metaphor text */}
            <div
              className="max-w-2xl mx-auto mb-10 p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(240, 253, 250, 0.6) 0%, rgba(204, 251, 241, 0.4) 100%)',
                border: '2px dashed rgba(20, 184, 166, 0.4)'
              }}
            >
              <p className="text-lg italic leading-relaxed" style={{ fontFamily: 'Literata, Georgia, serif', color: '#115e59' }}>
                Your support is a gift that keeps on giving—helping others find their words, prepare their story, and move forward with confidence.
              </p>
            </div>

            {/* CTA Button */}
            <Link href="/donate">
              <Button
                size="lg"
                className="group relative px-6 py-5 md:px-12 md:py-7 text-base md:text-xl font-bold rounded-2xl transition-all duration-400 hover:scale-105 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
                  color: 'white',
                  boxShadow: '0 15px 40px rgba(249, 115, 22, 0.4)',
                  fontFamily: 'Public Sans, sans-serif'
                }}
              >
                <span className="relative z-10 flex items-center gap-2 md:gap-3">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110" fill="currentColor" aria-hidden="true" />
                  Give the Gift of Preparation
                </span>
                {/* Shimmer effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                    transform: 'translateX(-100%)',
                    animation: 'shimmer 2s infinite'
                  }}
                />
              </Button>
            </Link>

            {/* Compassionate note */}
            <p className="text-base mt-8 italic" style={{ fontFamily: 'Public Sans, sans-serif', color: '#475569' }}>
              Can't donate? <strong style={{ color: '#0d9488', fontWeight: 600 }}>You're still exactly who this tool is for.</strong>
            </p>

            {/* Decorative divider */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(20, 184, 166, 0.5) 100%)' }} />
              <Heart className="w-4 h-4 text-orange-500" fill="currentColor" aria-hidden="true" />
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.5) 0%, transparent 100%)' }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}
