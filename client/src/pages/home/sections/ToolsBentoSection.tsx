import { FileText, Mail, ArrowRight, Shield } from "lucide-react";

export default function ToolsBentoSection() {
  return (
    <section
      className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-visible"
      aria-labelledby="tools-heading"
      style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #0d9488 25%, #134e4a 50%, #9a3412 75%, #7c2d12 100%)'
      }}
    >
      {/* Layered atmospheric background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base mesh gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 0%, rgba(20, 184, 166, 0.15), transparent),
              radial-gradient(ellipse 60% 40% at 0% 50%, rgba(14, 165, 233, 0.08), transparent),
              radial-gradient(ellipse 60% 40% at 100% 50%, rgba(249, 115, 22, 0.06), transparent)
            `
          }}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
          50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.6); }
        }

        .bento-card {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .bento-card:hover {
          transform: scale(1.03) translateY(-8px);
        }

        .bento-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .bento-card:hover::before {
          opacity: 1;
        }
      `}</style>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[800px] h-[800px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)',
            animation: 'float-card 15s ease-in-out infinite'
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #0d9488 0%, transparent 70%)',
            animation: 'float-card 20s ease-in-out infinite reverse'
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-block mb-6">
            <div
              className="h-1.5 w-32 rounded-full mx-auto"
              style={{
                background: 'linear-gradient(90deg, #14b8a6 0%, #0d9488 50%, #14b8a6 100%)',
                boxShadow: '0 0 20px rgba(20, 184, 166, 0.6)'
              }}
            />
          </div>
          <h2
            id="tools-heading"
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              letterSpacing: '-0.03em'
            }}
          >
            What <span className="italic" style={{ color: '#5eead4' }}>we offer</span>
          </h2>
          <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif' }}>
            Two free tools to help you prepare for employment conversations with confidence.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Card 1: 5 Disclosure Narratives - Large Featured */}
          <div
            className="bento-card lg:col-span-7 rounded-3xl p-8 md:p-12 overflow-hidden relative group"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(13, 148, 136, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(94, 234, 212, 0.2)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)'
            }}
            data-testid="card-disclosure-narratives"
          >
            {/* Decorative elements */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-700"
              style={{
                background: 'radial-gradient(circle, #5eead4 0%, transparent 70%)'
              }}
            />

            {/* Icon */}
            <div className="flex items-start justify-between mb-8">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500"
                style={{
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  boxShadow: '0 10px 30px rgba(20, 184, 166, 0.4)'
                }}
              >
                <FileText className="w-10 h-10 text-white" aria-hidden="true" />
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%)'
                  }}
                />
              </div>

              {/* Badge */}
              <div
                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  background: 'rgba(94, 234, 212, 0.2)',
                  color: '#5eead4',
                  border: '1px solid rgba(94, 234, 212, 0.3)'
                }}
              >
                Most Popular
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-5">
              <h3
                className="text-3xl md:text-4xl font-bold text-white leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}
              >
                5 Disclosure Narratives
              </h3>

              <p className="text-lg md:text-xl text-teal-100 leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif' }}>
                Generate five unique ways to talk about your background with employers—each narrative focuses on your growth, strengths, and who you are today, so you can speak with more confidence.
              </p>

              {/* Features list */}
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-3 text-teal-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-300 text-sm font-bold">✓</span>
                  </div>
                  <span style={{ fontFamily: 'Public Sans, sans-serif' }}>Tailored to your specific situation</span>
                </li>
                <li className="flex items-center gap-3 text-teal-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-300 text-sm font-bold">✓</span>
                  </div>
                  <span style={{ fontFamily: 'Public Sans, sans-serif' }}>Five different approaches to choose from</span>
                </li>
                <li className="flex items-center gap-3 text-teal-200">
                  <div className="w-6 h-6 rounded-full bg-teal-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-300 text-sm font-bold">✓</span>
                  </div>
                  <span style={{ fontFamily: 'Public Sans, sans-serif' }}>Practice until it feels natural</span>
                </li>
              </ul>

              {/* CTA */}
              <div className="pt-6">
                <div className="inline-flex items-center gap-2 text-teal-300 font-semibold group-hover:gap-4 transition-all" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <span>Show up prepared, not panicked</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Pre-Adverse Action Response - Medium */}
          <div
            className="bento-card lg:col-span-5 rounded-3xl p-8 md:p-10 overflow-hidden relative group"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(251, 146, 60, 0.2)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)'
            }}
            data-testid="card-pre-adverse-response"
          >
            {/* Decorative elements */}
            <div
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-700"
              style={{
                background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)'
              }}
            />

            {/* Icon */}
            <div className="mb-8">
              <div
                className="w-18 h-18 rounded-2xl flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  boxShadow: '0 10px 30px rgba(249, 115, 22, 0.4)'
                }}
              >
                <Mail className="w-9 h-9 text-white" aria-hidden="true" />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-5">
              <h3
                className="text-2xl md:text-3xl font-bold text-white leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}
              >
                Pre-Adverse Action Response
              </h3>

              <p className="text-base md:text-lg text-orange-100 leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif' }}>
                Get a strong, professional response letter you can send if you receive a pre-adverse action notice—one that adds context, highlights your growth, and helps the employer see the full picture.
              </p>

              {/* CTA */}
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 text-orange-300 font-semibold group-hover:gap-4 transition-all" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <span>Turn a scary letter into a grounded response</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Privacy - Full Width */}
          <div
            className="bento-card lg:col-span-12 rounded-3xl p-8 md:p-12 overflow-hidden relative group"
            style={{
              background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.15) 0%, rgba(71, 85, 105, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)'
            }}
            data-testid="card-privacy"
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
              {/* Icon */}
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500"
                style={{
                  background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  boxShadow: '0 10px 30px rgba(100, 116, 139, 0.4)'
                }}
              >
                <Shield className="w-12 h-12 text-white" aria-hidden="true" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-5">
                <h3
                  className="text-3xl md:text-4xl font-bold text-white leading-tight"
                  style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}
                >
                  A judgement-free space, built for your privacy
                </h3>

                <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl" style={{ fontFamily: 'Public Sans, sans-serif' }}>
                  We don't store what you write in this session. You decide what to share, and you can close this tab at any time.
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-slate-200">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <span className="font-semibold" style={{ fontFamily: 'Public Sans, sans-serif' }}>No account required</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <span className="font-semibold" style={{ fontFamily: 'Public Sans, sans-serif' }}>No tracking of your answers</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                  <div className="w-2 h-2 rounded-full bg-teal-400" />
                  <span className="font-semibold" style={{ fontFamily: 'Public Sans, sans-serif' }}>You control your data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
