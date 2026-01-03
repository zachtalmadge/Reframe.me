import { useEffect, useState } from "react";

export default function NotFoundHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  return (
    <section
      className="relative py-20 md:py-32 overflow-hidden"
      aria-labelledby="not-found-heading"
    >
      {/* Atmospheric background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radial glow - top right - Teal */}
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        {/* Radial glow - bottom left - Orange */}
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        {/* Center ambient light - mixed */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #14b8a6 0%, #f97316 50%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        {/* Floating geometric shapes */}
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-10 animate-float"
          style={{
            background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
            boxShadow: '0 0 60px rgba(20, 184, 166, 0.3)',
            animation: 'float 6s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 right-1/4 w-24 h-24 rounded-lg opacity-10 animate-float-delayed"
          style={{
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
            boxShadow: '0 0 60px rgba(249, 115, 22, 0.3)',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '2s',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-20 h-20 rounded-full opacity-10 animate-float"
          style={{
            background: 'linear-gradient(135deg, #14b8a6 0%, #f97316 100%)',
            boxShadow: '0 0 60px rgba(20, 184, 166, 0.3)',
            animation: 'float 7s ease-in-out infinite',
            animationDelay: '1s',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Large decorative "404" background text */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out ${
              mounted ? "opacity-5 scale-100" : "opacity-0 scale-95"
            }`}
            aria-hidden="true"
            style={{
              fontSize: 'clamp(12rem, 30vw, 24rem)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #14b8a6 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            404
          </div>

          {/* Main heading */}
          <h1
            id="not-found-heading"
            className={`relative text-5xl md:text-7xl font-bold text-white transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
            style={{
              textShadow: '0 2px 30px rgba(0, 0, 0, 0.4), 0 0 60px rgba(20, 184, 166, 0.15)',
            }}
          >
            Page Not Found
          </h1>

          {/* Supportive message */}
          <p
            className={`relative text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDelay: '200ms',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            Don't worry, this happens sometimes. The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(5deg);
          }
          66% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-float-delayed {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
