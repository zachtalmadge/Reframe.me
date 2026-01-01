import { useState, useRef } from "react";
import { ChevronDown, Users, Search, TrendingUp, Target } from "lucide-react";

export default function WhyProcessMattersSection() {
  const [isThisForMeOpen, setIsThisForMeOpen] = useState(false);
  const isThisForMeRef = useRef<HTMLDivElement>(null);

  const handleCloseIsThisForMe = () => {
    setIsThisForMeOpen(false);
    // Scroll to top of section smoothly on mobile
    if (isThisForMeRef.current && window.innerWidth <= 768) {
      setTimeout(() => {
        isThisForMeRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };
  return (
    <section
      className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-visible"
      aria-labelledby="why-matters-heading"
      style={{
        background: 'linear-gradient(165deg, #f8fafc 0%, #e0f2fe 25%, #f0fdfa 50%, #fef3c7 75%, #fef2f2 100%)'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=Public+Sans:wght@400;500;600;700&display=swap');

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }

        .stat-card-hover {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .stat-card-hover:hover {
          transform: translateY(-12px) scale(1.02);
        }
      `}</style>

      {/* Atmospheric background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Organic blob shapes */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)',
            animation: 'float-gentle 20s ease-in-out infinite'
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
            animation: 'float-gentle 15s ease-in-out infinite reverse'
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
            animation: 'float-gentle 25s ease-in-out infinite'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Is This For Me - Premium Treatment */}
        <div ref={isThisForMeRef} className="max-w-5xl mx-auto mb-24" data-testid="section-is-this-for-me">
          <div
            className="relative rounded-3xl overflow-hidden backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 243, 199, 0.7) 100%)',
              boxShadow: '0 20px 60px rgba(249, 115, 22, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}
          >
            {/* Decorative top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: 'linear-gradient(90deg, #f97316 0%, #fbbf24 50%, #14b8a6 100%)'
              }}
            />

            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 text-left p-8 md:p-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all hover:bg-white/40"
              aria-expanded={isThisForMeOpen}
              aria-controls="is-this-for-me-panel"
              onClick={() => setIsThisForMeOpen((prev) => !prev)}
              data-testid="button-is-this-for-me-toggle"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Who this is for
                  </div>
                  <h2
                    id="is-this-for-me-heading"
                    className="text-2xl md:text-4xl font-bold"
                    style={{
                      fontFamily: 'Fraunces, Georgia, serif',
                      color: '#1f2937',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Is this for me?
                  </h2>
                </div>
                <p className="text-base text-gray-600 font-medium" style={{ fontFamily: 'Public Sans, sans-serif' }}>
                  Click to see if Reframe.me is right for your situation
                </p>
              </div>
              <ChevronDown
                className={`w-8 h-8 text-orange-600 flex-shrink-0 transition-all duration-500 ${isThisForMeOpen ? "rotate-180" : ""
                  }`}
                aria-hidden="true"
              />
            </button>

            <div
              id="is-this-for-me-panel"
              className={`overflow-hidden transition-all duration-500 ease-out ${isThisForMeOpen
                ? "max-h-[1600px] md:max-h-[900px] opacity-100"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="px-8 md:px-10 pb-10 space-y-8">
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

                <p className="text-lg md:text-xl leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#374151' }}>
                  Reframe.me is designed for people navigating job searches with a past record or justice involvement.
                </p>

                {/* This might help if */}
                <div
                  className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(254, 243, 199, 0.5) 100%)',
                    border: '2px solid rgba(251, 191, 36, 0.3)'
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <svg viewBox="0 0 100 100" fill="currentColor" className="text-orange-500">
                      <circle cx="50" cy="50" r="40" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold mb-5" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#ea580c' }}>
                    Reframe.me might help if:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-base leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#1f2937' }}>
                        You're applying for jobs after a conviction or justice involvement.
                      </span>
                    </li>
                    <li className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-base leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#1f2937' }}>
                        You feel stuck on what to say when your background comes up in the hiring process.
                      </span>
                    </li>
                    <li className="flex items-start gap-4 group">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span className="text-base leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#1f2937' }}>
                        You've received (or are worried about) a pre-adverse action notice and don't know how to respond.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Gentle reminder */}
                <div
                  className="rounded-2xl p-6 md:p-8 italic border-l-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(254, 252, 232, 0.9) 0%, rgba(254, 249, 195, 0.6) 100%)',
                    borderColor: '#fbbf24',
                    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.1)'
                  }}
                >
                  <p className="text-base leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#78350f' }}>
                    Even if you came home recently or it's been years, it's okay to still be finding the words for your story.
                  </p>
                </div>

                {/* This is not */}
                <div
                  className="rounded-2xl p-6 md:p-8"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(156, 163, 175, 0.2)'
                  }}
                >
                  <p className="text-lg font-bold mb-4" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#6b7280' }}>
                    This is not:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-base" style={{ fontFamily: 'Public Sans, sans-serif', color: '#4b5563' }}>
                        Legal advice or a substitute for speaking with a lawyer or legal aid.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-base" style={{ fontFamily: 'Public Sans, sans-serif', color: '#4b5563' }}>
                        A guarantee that you will be hired or keep a job.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-base" style={{ fontFamily: 'Public Sans, sans-serif', color: '#4b5563' }}>
                        A replacement for your own judgment or support from trusted people in your life.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Close button for mobile */}
                <button
                  onClick={handleCloseIsThisForMe}
                  className="md:hidden w-full rounded-xl py-4 px-6 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                    border: '1px solid rgba(251, 191, 36, 0.3)'
                  }}
                  aria-label="Close section"
                >
                  <span className="text-base font-semibold" style={{ fontFamily: 'Public Sans, sans-serif', color: '#ea580c' }}>
                    Close
                  </span>
                  <ChevronDown className="w-5 h-5 text-orange-600 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header - Editorial Style */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <div
              className="h-1 w-24 rounded-full mx-auto"
              style={{
                background: 'linear-gradient(90deg, #14b8a6 0%, #f97316 100%)'
              }}
            />
          </div>
          <h2
            id="why-matters-heading"
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: '1.1'
            }}
          >
            Why This Part of the Process{' '}
            <span className="italic" style={{ color: '#0d9488' }}>Matters</span>
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: 'Public Sans, sans-serif', color: '#475569' }}>
            Reframe.me focuses on one of the hardest parts of the employment journey: what you say after an offer, during a background check, or when you get a pre-adverse action notice.{' '}
            <strong style={{ color: '#1e293b' }}>These numbers show why that moment matters.</strong>
          </p>
        </div>

        {/* Stats - Magazine-Style Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mb-16">
          {/* Stat 1 - 1 in 3 */}
          <div
            className="stat-card-hover relative rounded-3xl overflow-hidden p-10 md:p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 253, 250, 0.95) 100%)',
              border: '2px solid rgba(20, 184, 166, 0.2)',
              boxShadow: '0 20px 60px rgba(20, 184, 166, 0.15)'
            }}
          >
            {/* Icon */}
            <div
              className="absolute top-6 right-6 md:top-8 md:right-8 w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                boxShadow: '0 10px 30px rgba(20, 184, 166, 0.3)',
                animation: 'pulse-glow 3s ease-in-out infinite'
              }}
            >
              <Users className="w-7 h-7 md:w-10 md:h-10 text-white" aria-hidden="true" />
            </div>

            {/* Big Number */}
            <div
              className="text-6xl md:text-9xl font-bold mb-6"
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.05em',
                lineHeight: '0.9'
              }}
            >
              1 in 3
            </div>

            <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#0f172a' }}>
              You're not the only one.
            </h3>

            <p className="text-lg leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#475569' }}>
              In the U.S., an estimated 70–100 million people — about <strong style={{ color: '#0d9488' }}>1 in 3 adults</strong> — have an arrest or conviction record that can show up on a background check. Having a record is common, and many people share the same concerns about how it might affect their job search.
            </p>
          </div>

          {/* Stat 2 - 85-95% */}
          <div
            className="stat-card-hover relative rounded-3xl overflow-hidden p-10 md:p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)',
              border: '2px solid rgba(100, 116, 139, 0.2)',
              boxShadow: '0 20px 60px rgba(100, 116, 139, 0.15)'
            }}
          >
            {/* Icon */}
            <div
              className="absolute top-6 right-6 md:top-8 md:right-8 w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                boxShadow: '0 10px 30px rgba(100, 116, 139, 0.3)',
                animation: 'pulse-glow 3s ease-in-out infinite 0.5s'
              }}
            >
              <Search className="w-7 h-7 md:w-10 md:h-10 text-white" aria-hidden="true" />
            </div>

            {/* Big Number */}
            <div
              className="text-5xl md:text-8xl font-bold mb-6"
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                background: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.05em',
                lineHeight: '0.9'
              }}
            >
              85–95%
            </div>

            <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#0f172a' }}>
              Background checks are almost universal.
            </h3>

            <p className="text-lg leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#475569' }}>
              Surveys of employers show that around <strong style={{ color: '#475569' }}>85–95% of U.S. companies</strong> use some form of pre-employment background screening. So if you're worried about what will come up after an offer, you're not overreacting — this is built into how most hiring works now.
            </p>
          </div>

          {/* Stat 3 - 53% */}
          <div
            className="stat-card-hover relative rounded-3xl overflow-hidden p-10 md:p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 247, 237, 0.95) 100%)',
              border: '2px solid rgba(249, 115, 22, 0.2)',
              boxShadow: '0 20px 60px rgba(249, 115, 22, 0.15)'
            }}
          >
            {/* Icon */}
            <div
              className="absolute top-8 right-8 w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                boxShadow: '0 10px 30px rgba(249, 115, 22, 0.3)',
                animation: 'pulse-glow 3s ease-in-out infinite 1s'
              }}
            >
              <TrendingUp className="w-10 h-10 text-white" aria-hidden="true" />
            </div>

            {/* Big Number */}
            <div
              className="text-8xl md:text-9xl font-bold mb-6"
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.05em',
                lineHeight: '0.9'
              }}
            >
              53%
            </div>

            <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#0f172a' }}>
              Many employers are willing to hire people with records.
            </h3>

            <p className="text-lg leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#475569' }}>
              In one national survey,{" "}
              <strong style={{ color: "#ea580c" }}>53% of HR professionals</strong> said
              they&apos;d be willing to hire candidates with criminal records, up from{" "}
              <strong className="text-slate-900">37%</strong> just a few years earlier.
              Other research finds that{" "}
              <strong className="text-slate-900">
                most managers say workers with records perform as well as—or better than—
                other employees once they&apos;re hired
              </strong>
              . That openness doesn&apos;t automatically turn into a job—candidates still have to get through
              hard conversations about their record.
            </p>
          </div>

          {/* Stat 4 - 1 Shot */}
          <div
            className="stat-card-hover relative rounded-3xl overflow-hidden p-10 md:p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 245, 255, 0.95) 100%)',
              border: '2px solid rgba(139, 92, 246, 0.2)',
              boxShadow: '0 20px 60px rgba(139, 92, 246, 0.15)'
            }}
          >
            {/* Icon */}
            <div
              className="absolute top-6 right-6 md:top-8 md:right-8 w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                animation: 'pulse-glow 3s ease-in-out infinite 1.5s'
              }}
            >
              <Target className="w-7 h-7 md:w-10 md:h-10 text-white" aria-hidden="true" />
            </div>

            {/* Big Number */}
            <div
              className="text-6xl md:text-9xl font-bold mb-6"
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.05em',
                lineHeight: '0.9'
              }}
            >
              1 Shot
            </div>

            <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#0f172a' }}>
              That's all you get to disclose when the background check comes up.
            </h3>

            <p className="text-lg leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#475569' }}>
              It's not just <em>whether</em> an employer runs a check—it's what happens when
              they ask about it.{" "}
              <strong className="text-slate-900">
                Preparation changes how you feel in the room.
              </strong>{" "}
              Instead of searching for the right words, you can answer with clarity and
              confidence—and move the conversation back to your skills and fit.
              <br /><br />
              With narratives and a response letter ready before you need them, you have
              employer-ready language you can use immediately and refine in your own voice.{" "}
              <strong className="text-slate-900">That's the gap Reframe.me is built for.</strong>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-10 border-l-4"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              borderColor: '#94a3b8',
              boxShadow: '0 4px 20px rgba(148, 163, 184, 0.1)'
            }}
          >
            <p className="text-base md:text-lg italic leading-relaxed mb-4" style={{ fontFamily: 'Public Sans, sans-serif', color: '#64748b' }}>
              These are big-picture numbers, not promises. Reframe.me can't control employers' decisions—but it can help you feel more prepared and supported when you have to talk about your record or respond to a background check.
            </p>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Public Sans, sans-serif' }}>
              Sources include national surveys from SHRM, the Council of State Governments, and re-entry research organizations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
