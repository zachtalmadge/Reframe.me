import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Mail,
  ArrowRight,
  Clock,
  Shield,
  Heart,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  Search,
  TrendingUp,
  Anchor,
  Target,
} from "lucide-react";
import Layout from "@/components/Layout";
import { useInView } from "@/hooks/useInView";

const howItWorksSteps = [
  {
    title: "Share your situation",
    description:
      "Answer a few questions about your background and the job you're applying for.",
  },
  {
    title: "We help reframe your story",
    description:
      "Our tool turns your answers into clear, employer-ready language.",
  },
  {
    title: "Leave with talking points & documents",
    description:
      "You'll get narratives and a response letter you can reuse and refine.",
  },
];

const stories = [
  {
    role: "Job seeker, retail",
    quote:
      "I used to panic when employers asked about my record. Now I have three honest ways to respond.",
  },
  {
    role: "First-time applicant after reentry",
    quote: "I turned a terrifying letter into a clear, professional response.",
  },
  {
    role: "Job seeker, tech support",
    quote: "For the first time, I feel ready to explain my past and my growth.",
  },
  {
    role: "Retail candidate",
    quote:
      "Having words prepared made the difference between freezing up and feeling confident.",
  },
];

const beforeAfterPairs = [
  {
    before: "I just got a conditional offer and I'm worried about the background check.",
    after: "Now I have language ready for if my record comes up in the hiring process.",
  },
  {
    before: "I'm worried my past will cost me the job once they see my background.",
    after: "I can explain what happened, what’s changed, and the skills I bring today.",
  },
  {
    before: "I'm not sure how to respond to a pre-adverse action notice.",
    after: "I have a clear, structured response letter in my own voice.",
  },
  {
    before: "I feel like I'm facing this process alone.",
    after: "I have talking points I can practice and share with someone I trust.",
  },
];


const BEFORE_DELAY = 200;
const AFTER_DELAY = 800;
const VISIBLE_DURATION = 8000;  // ~8 seconds with both visible
const GAP_DURATION = 1000;

export default function Home() {
  const { ref: howItWorksRef, isInView: howItWorksInView } = useInView({
    threshold: 0.2,
    rootMargin: "0px 0px -5% 0px",
    triggerOnce: false,
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Detect mobile synchronously before any state initialization
  const isMobile = typeof window !== 'undefined' &&
    (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768);

  const [heroMounted, setHeroMounted] = useState(false);
  const [showBefore, setShowBefore] = useState(false);
  const [showAfter, setShowAfter] = useState(false);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isThisForMeOpen, setIsThisForMeOpen] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setPrefersReducedMotion(prefersReduced);

    if (prefersReduced) {
      setHeroMounted(true);
      setShowBefore(true);
      setShowAfter(true);
      setAnimationReady(true);
    } else {
      // On mobile, add significant delay to ensure DOM is ready
      if (isMobile) {
        setTimeout(() => {
          requestAnimationFrame(() => {
            setHeroMounted(true);
            setAnimationReady(true);
          });
        }, 500);
      } else {
        requestAnimationFrame(() => {
          setHeroMounted(true);
          setAnimationReady(true);
        });
      }
    }
  }, [isMobile]);

  useEffect(() => {
    if (!animationReady || prefersReducedMotion) {
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    function runCycle(index: number) {
      if (isMobile) {
        // Mobile: Set states to hidden first, then wait for next frame
        setCurrentPairIndex(index);
        setShowBefore(false);
        setShowAfter(false);

        requestAnimationFrame(() => {
          // Force a reflow
          void document.body.offsetHeight;

          requestAnimationFrame(() => {
            // Now start the fade-in sequence
            timeouts.push(setTimeout(() => {
              requestAnimationFrame(() => {
                setShowBefore(true);
              });
            }, BEFORE_DELAY + 200)); // Add extra delay on mobile

            timeouts.push(setTimeout(() => {
              requestAnimationFrame(() => {
                setShowAfter(true);
              });
            }, AFTER_DELAY + 200)); // Add extra delay on mobile
          });
        });
      } else {
        // Desktop: Original simple timing
        setCurrentPairIndex(index);
        setShowBefore(false);
        setShowAfter(false);

        timeouts.push(setTimeout(() => setShowBefore(true), BEFORE_DELAY));
        timeouts.push(setTimeout(() => setShowAfter(true), AFTER_DELAY));
      }

      const fadeOutTime = AFTER_DELAY + VISIBLE_DURATION + (isMobile ? 200 : 0);
      timeouts.push(
        setTimeout(() => {
          setShowBefore(false);
          setShowAfter(false);
        }, fadeOutTime)
      );

      const nextStartTime = fadeOutTime + GAP_DURATION;
      timeouts.push(
        setTimeout(() => {
          runCycle((index + 1) % beforeAfterPairs.length);
        }, nextStartTime)
      );
    }

    // Start the cycle
    runCycle(0);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [animationReady, prefersReducedMotion, isMobile]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setStoryIndex((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goToStory = (index: number) => {
    setStoryIndex(index);
  };

  const prevStory = () => {
    setStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const nextStory = () => {
    setStoryIndex((prev) => (prev + 1) % stories.length);
  };

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes shimmer-hero {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gradient-shimmer-hero {
          background: linear-gradient(
            135deg,
            rgba(20, 184, 166, 0.03) 0%,
            rgba(249, 115, 22, 0.03) 25%,
            rgba(20, 184, 166, 0.03) 50%,
            rgba(249, 115, 22, 0.03) 75%,
            rgba(20, 184, 166, 0.03) 100%
          );
          background-size: 300% 300%;
          animation: shimmer-hero 10s ease infinite;
        }

        .hero-heading {
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
          letter-spacing: -0.03em;
        }
      `}</style>

      <section
        className="relative py-16 md:py-24 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #0d9488 25%, #134e4a 50%, #9a3412 75%, #7c2d12 100%)'
        }}
        aria-labelledby="hero-heading"
      >
        {/* Atmospheric background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Radial glow - top right - Teal */}
          <div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)',
            }}
          />
          {/* Radial glow - bottom left - Orange */}
          <div
            className="absolute -bottom-40 -left-40 w-[600px] h-[600px] opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
            }}
          />
          {/* Center ambient light - mixed */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-15 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #14b8a6 0%, #f97316 50%, transparent 70%)',
            }}
          />
          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative text-center space-y-10">
              {/* Heading */}
              <div className="space-y-6">
                {/* Eyebrow */}
                <div
                  className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full backdrop-blur-md border transition-all duration-700 ease-out ${
                    heroMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    aria-hidden="true"
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6 0%, #f97316 100%)',
                      boxShadow: '0 0 8px rgba(20, 184, 166, 0.6)'
                    }}
                  />
                  <span className="text-xs md:text-sm font-semibold tracking-wide text-white uppercase">
                    Got a conditional offer, background check, or pre-adverse notice?
                  </span>
                </div>

                <h1
                  id="hero-heading"
                  className={`hero-heading text-4xl md:text-6xl font-bold leading-tight text-white transition-all duration-700 ease-out ${
                    heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transitionDelay: '200ms',
                    textShadow: '0 2px 30px rgba(0, 0, 0, 0.4), 0 0 60px rgba(20, 184, 166, 0.15)'
                  }}
                >
                  Prepare to talk confidently<br className="hidden sm:inline"/> about your record
                </h1>
                <p className={`text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto transition-all duration-700 ease-out ${
                  heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: '400ms',
                  textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)'
                }}
                >
                  Your past is part of your story, <em className="font-medium text-white">not the whole story</em>. Reframe.me helps
                  you share that story in a way that centers your growth and{" "}
                  <em className="font-medium text-white">what you offer today</em>.
                </p>
              </div>

                            {/* CTA Button */}
              <div className="pt-6">
                <Link href="/selection">
                  <Button
                    size="lg"
                    className="group relative min-h-[64px] px-12 text-xl font-bold rounded-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                      color: 'white',
                      boxShadow: '0 10px 40px rgba(249, 115, 22, 0.5), 0 0 80px rgba(249, 115, 22, 0.2)'
                    }}
                    data-testid="button-get-started-hero"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Get Started
                      <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                    {/* Shine effect on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                      }}
                    />
                  </Button>
                </Link>
              </div>

              {/* Before/After block - preserved functionality */}
              <div
                className="max-w-3xl mx-auto rounded-3xl p-8 md:p-12 backdrop-blur-md relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.12) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
                data-testid="before-after-block"
              >
                {/* Decorative top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(20, 184, 166, 0.5) 50%, transparent 100%)',
                  }}
                />
                {/* Decorative bottom accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.5) 50%, transparent 100%)',
                  }}
                />
                <div className="grid" style={{ gridTemplateRows: '1fr', gridTemplateColumns: '1fr' }}>
                  {beforeAfterPairs.map((pair, index) => {
                    const isActive = index === currentPairIndex;
                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-5"
                        style={{ gridRow: 1, gridColumn: 1 }}
                        aria-hidden={!isActive}
                      >
                        <div
                          className={`relative text-lg md:text-xl text-white/70 italic motion-reduce:transition-none ${
                            isMobile ? '' : 'transition-opacity duration-300'
                          } ${isActive && showBefore ? "opacity-100" : "opacity-0"}`}
                          style={isMobile ? {
                            willChange: isActive ? 'opacity' : 'auto',
                            transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            WebkitFontSmoothing: 'antialiased',
                            textShadow: '0 1px 10px rgba(0, 0, 0, 0.3)',
                          } : {
                            textShadow: '0 1px 10px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          <span className="font-semibold text-white/90 not-italic block mb-2">
                            Before:
                          </span>
                          <span className="text-white/70">"{pair.before}"</span>
                        </div>
                        <div
                          className={`relative text-lg md:text-xl text-white font-medium motion-reduce:transition-none ${
                            isMobile ? '' : 'transition-all duration-300'
                          } ${
                            isActive && showAfter
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-1"
                          }`}
                          style={isMobile ? {
                            willChange: isActive ? 'opacity, transform' : 'auto',
                            transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isActive && showAfter ? 'translate3d(0, 0, 0)' : 'translate3d(0, 0.25rem, 0)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            WebkitFontSmoothing: 'antialiased',
                            textShadow: '0 2px 15px rgba(0, 0, 0, 0.3)',
                          } : {
                            textShadow: '0 2px 15px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          <span
                            className="font-bold block mb-2 relative"
                            style={{
                              background: 'linear-gradient(135deg, #2dd4bf 0%, #22d3ee 30%, #fb923c 70%, #f97316 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              filter: 'brightness(1.2) saturate(1.3)',
                              fontSize: '1.05em',
                            }}
                          >
                            After:
                          </span>
                          <span className="text-white">"{pair.after}"</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base pt-4">
                <div
                  className="flex items-center gap-2.5 backdrop-blur-md px-5 py-2.5 rounded-full border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Clock className="w-4 h-4 text-teal-300" aria-hidden="true" />
                  <span className="font-medium text-white">Takes 10 - 20 minutes</span>
                </div>
                <div
                  className="flex items-center gap-2.5 backdrop-blur-md px-5 py-2.5 rounded-full border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Heart className="w-4 h-4 text-orange-300" aria-hidden="true" />
                  <span className="font-medium text-white">Free to use</span>
                </div>
              </div>



              <p className="text-sm text-white/80 font-medium">
                No account required • Completely private • Your story, your way
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* Why This Part of the Process Matters Section (with Is This For Me) */}
      <section
        className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50"
        aria-labelledby="why-matters-heading"
      >
        {/* Subtle top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto">
          {/* Is This For Me - Integrated */}
          <div className="max-w-4xl mx-auto mb-16" data-testid="section-is-this-for-me">
            <div className="rounded-2xl border-2 border-orange-400/30 bg-gradient-to-br from-orange-50/80 to-orange-100/40 dark:from-orange-950/20 dark:to-orange-900/10 p-6 md:p-8 shadow-lg">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 rounded-lg p-3 -m-3 hover:bg-orange-100/30 dark:hover:bg-orange-900/20 transition-colors"
                aria-expanded={isThisForMeOpen}
                aria-controls="is-this-for-me-panel"
                onClick={() => setIsThisForMeOpen((prev) => !prev)}
                data-testid="button-is-this-for-me-toggle"
              >
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center rounded-full bg-orange-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 border border-orange-400/30">
                    Who this is for
                  </div>
                  <h2
                    id="is-this-for-me-heading"
                    className="text-xl md:text-2xl font-bold text-foreground"
                  >
                    Is this for me?
                  </h2>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 transition-transform duration-300 ${
                    isThisForMeOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <div
                id="is-this-for-me-panel"
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  isThisForMeOpen
                    ? "max-h-[600px] opacity-100 mt-6"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-6 text-base text-muted-foreground pt-6 border-t-2 border-orange-400/20">
                  <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                    Reframe.me is designed for people navigating job searches with a past record or justice involvement.
                  </p>

                  <div className="bg-white/60 dark:bg-slate-900/30 rounded-xl p-5 border border-orange-400/20">
                    <p className="font-bold text-lg text-orange-700 dark:text-orange-400 mb-3">
                      Reframe.me might help if:
                    </p>
                    <ul className="space-y-2.5 list-none">
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-foreground/80">You're applying for jobs after a conviction or justice involvement.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-foreground/80">You feel stuck on what to say when your background comes up in the hiring process.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-foreground/80">You've received (or are worried about) a pre-adverse action notice and don't know how to respond.</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-base text-foreground/80 italic leading-relaxed bg-orange-100/40 dark:bg-orange-900/20 p-4 rounded-lg border-l-4 border-orange-400">
                    Even if you came home recently or it's been years, it's okay to still be finding the words for your story.
                  </p>

                  <div className="bg-white/60 dark:bg-slate-900/30 rounded-xl p-5 border border-orange-400/20">
                    <p className="font-bold text-lg text-orange-700 dark:text-orange-400 mb-3">
                      This is not:
                    </p>
                    <ul className="space-y-2.5 list-none">
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-2.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-foreground/80">Legal advice or a substitute for speaking with a lawyer or legal aid.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-2.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-foreground/80">A guarantee that you will be hired or keep a job.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50 mt-2.5 flex-shrink-0" aria-hidden="true" />
                        <span className="text-foreground/80">A replacement for your own judgment or support from trusted people in your life.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2
              id="why-matters-heading"
              className="text-3xl md:text-5xl font-bold text-foreground mb-4"
              style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.02em' }}
            >
              Why This Part of the Process Matters
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Reframe.me focuses on one of the hardest parts of the employment journey: what you say after an offer, during a background check, or when you get a pre-adverse action notice. These numbers show why that moment matters.
            </p>

      
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
            {/* Card 1 - Normalizing */}
            <Card className="group relative overflow-hidden border-2 border-teal-200/40 dark:border-teal-800/40 hover:border-teal-300/60 dark:hover:border-teal-700/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-100/40 to-transparent dark:from-teal-900/20 rounded-bl-full" aria-hidden="true" />
              <CardContent className="p-8 md:p-10 relative">
                <div className="flex items-start gap-5 mb-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 dark:from-teal-400/20 dark:to-teal-500/10 flex items-center justify-center">
                    <Users className="w-7 h-7 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-teal-700 to-teal-600 dark:from-teal-400 dark:to-teal-300 bg-clip-text text-transparent"
                      style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.03em' }}
                    >
                      1 in 3
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                      You're not the only one.
                    </h3>
                  </div>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  In the U.S., an estimated 70–100 million people — about 1 in 3 adults — have an arrest or conviction record that can show up on a background check. Having a record is common, and many people share the same concerns about how it might affect their job search.
                </p>
              </CardContent>
            </Card>

            {/* Card 2 - Background checks */}
            <Card className="group relative overflow-hidden border-2 border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300/80 dark:hover:border-slate-600/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-slate-200/40 to-transparent dark:from-slate-800/40 rounded-bl-full" aria-hidden="true" />
              <CardContent className="p-8 md:p-10 relative">
                <div className="flex items-start gap-5 mb-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-600/10 dark:from-slate-400/20 dark:to-slate-500/10 flex items-center justify-center">
                    <Search className="w-7 h-7 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-slate-700 to-slate-600 dark:from-slate-300 dark:to-slate-400 bg-clip-text text-transparent"
                      style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.03em' }}
                    >
                      85–95%
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                      Background checks are almost universal.
                    </h3>
                  </div>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Surveys of employers show that around 85–95% of U.S. companies use some form of pre-employment background screening. So if you're worried about what will come up after an offer, you're not overreacting — this is built into how most hiring works now.
                </p>
              </CardContent>
            </Card>

            {/* Card 3 - Employers willing */}
            <Card className="group relative overflow-hidden border-2 border-orange-200/40 dark:border-orange-800/40 hover:border-orange-300/60 dark:hover:border-orange-700/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-100/40 to-transparent dark:from-orange-900/20 rounded-bl-full" aria-hidden="true" />
              <CardContent className="p-8 md:p-10 relative">
                <div className="flex items-start gap-5 mb-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 dark:from-orange-400/20 dark:to-orange-500/10 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-700 to-orange-600 dark:from-orange-400 dark:to-orange-300 bg-clip-text text-transparent"
                      style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.03em' }}
                    >
                      53%
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                      Many employers are willing to hire people with records.
                    </h3>
                  </div>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  In one national survey, 53% of HR professionals said they'd be willing to hire candidates with criminal records, up from 37% just a few years earlier. Other research finds that most managers say workers with records perform as well as or better than other employees once they're hired. With the right preparation, you still have a real shot. That openness doesn't automatically turn into a job—candidates still have to get through hard conversations about their record. That's the gap Reframe.me is built for.
                </p>
              </CardContent>
            </Card>

            {/* Card 4 - One Shot */}
            <Card className="group relative overflow-hidden border-2 border-purple-200/40 dark:border-purple-800/40 hover:border-purple-300/60 dark:hover:border-purple-700/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/40 to-transparent dark:from-purple-900/20 rounded-bl-full" aria-hidden="true" />
              <CardContent className="p-8 md:p-10 relative">
                <div className="flex items-start gap-5 mb-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 dark:from-purple-400/20 dark:to-purple-500/10 flex items-center justify-center">
                    <Target className="w-7 h-7 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div
                      className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent"
                      style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.03em' }}
                    >
                      1 Shot
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground/90 leading-tight">
                      That's all you get to explain your record when an employer asks.
                    </h3>
                  </div>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  It's not just <em className="italic">whether</em> an employer runs a check—it's what happens when they ask about it. When your narratives and response letter are ready before you need them, you can respond calmly and keep moving forward. <strong className="font-bold text-foreground">That's the gap Reframe.me is built for.</strong>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative rounded-xl p-6 md:p-8 border-l-4 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic">
                These are big-picture numbers, not promises. Reframe.me can't control employers' decisions—but it can help you feel more prepared and supported when you have to talk about your record or respond to a background check.
              </p>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground/70 text-center">
              Sources include national surveys from SHRM, the Council of State Governments, and re-entry research organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Donate CTA - After Why Matters Section */}
      <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Subtle top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto">
          <div className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 253, 250, 0.8) 100%)',
              border: '2px solid rgba(20, 184, 166, 0.15)',
              boxShadow: '0 10px 40px rgba(20, 184, 166, 0.08)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Decorative heart icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-gradient-to-br from-orange-100 to-teal-100 shadow-lg">
              <Heart className="w-8 h-8 text-teal-600" fill="currentColor" aria-hidden="true" />
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
              Help keep this tool free and accessible
            </h3>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Every contribution helps cover the costs of keeping Reframe.me running—so more people can prepare for employment conversations with confidence, regardless of their ability to pay.
            </p>

            <Link href="/donate">
              <Button
                size="lg"
                className="group relative px-8 py-6 text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                  color: 'white'
                }}
              >
                <Heart className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                Support Reframe.me
              </Button>
            </Link>

            <p className="text-xs text-gray-500 mt-4 italic">
              Can't donate? You're still exactly who this tool is for.
            </p>
          </div>
        </div>
      </section>

      <section
        className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50"
        aria-labelledby="tools-heading"
      >
        {/* Subtle top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" aria-hidden="true" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              id="tools-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              What we offer
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Two free tools to help you prepare for employment conversations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: 5 Disclosure Narratives */}
            <Card
              className="group relative border-2 border-primary/20 shadow-lg cursor-default transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40 focus-within:-translate-y-2 focus-within:shadow-2xl focus-within:border-primary/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0 overflow-hidden"
              tabIndex={0}
              data-testid="card-disclosure-narratives"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" aria-hidden="true" />
              <CardContent className="p-8 md:p-10 space-y-5 relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 group-focus-within:scale-110 group-focus-within:rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 shadow-md">
                  <FileText
                    className="w-8 h-8 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">
                    5 Disclosure Narratives
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Generate five unique ways to talk about your background with employers—each narrative focuses on your growth, strengths, and who you are today, so you can speak with more confidence.
                  </p>
                  <div className="pt-2">
                    <p
                      className="text-base font-semibold text-primary opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 motion-reduce:transition-none flex items-center gap-2"
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Show up prepared, not panicked.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Pre-Adverse Action Response */}
            <Card
              className="group relative border-2 border-chart-2/20 shadow-lg cursor-default transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:border-chart-2/40 focus-within:-translate-y-2 focus-within:shadow-2xl focus-within:border-chart-2/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0 overflow-hidden"
              tabIndex={0}
              data-testid="card-pre-adverse-response"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-chart-2/5 rounded-bl-full" aria-hidden="true" />
              <CardContent className="p-8 md:p-10 space-y-5 relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chart-2/20 to-chart-2/10 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 group-focus-within:scale-110 group-focus-within:rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 shadow-md">
                  <Mail className="w-8 h-8 text-chart-2" aria-hidden="true" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">
                    Pre-Adverse Action Response
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Get a strong, professional response letter you can send if you receive a pre-adverse action notice—one that adds context, highlights your growth, and helps the employer see the full picture of who you are today.
                  </p>
                  <div className="pt-2">
                    <p
                      className="text-base font-semibold text-chart-2 opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 motion-reduce:transition-none flex items-center gap-2"
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Turn a scary letter into a grounded response.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Judgement-Free Privacy */}
            <Card
              className="group relative border-2 border-slate-300/40 shadow-lg cursor-default transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:border-slate-400/60 focus-within:-translate-y-2 focus-within:shadow-2xl focus-within:border-slate-400/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0 overflow-hidden"
              tabIndex={0}
              data-testid="card-privacy"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200/30 rounded-bl-full" aria-hidden="true" />
              <CardContent className="p-8 md:p-10 space-y-5 relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-300/30 to-slate-400/20 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 group-focus-within:scale-110 group-focus-within:rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 shadow-md">
                  <Shield
                    className="w-8 h-8 text-slate-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground">
                    A judgement-free space, built for your privacy.
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    We don't store what you write in this session. You decide what to share, and you can close this tab at any time.
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" aria-hidden="true" />
                      <span className="font-medium">No account required.</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" aria-hidden="true" />
                      <span className="font-medium">No tracking of your answers.</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" aria-hidden="true" />
                      <span className="font-medium">You decide what to keep, copy, or delete.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      <section
        className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #0d9488 25%, #134e4a 50%, #9a3412 75%, #7c2d12 100%)'
        }}
        aria-labelledby="stories-heading"
        data-testid="section-stories"
      >
        {/* Atmospheric background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Radial glow - top left */}
          <div
            className="absolute -top-40 -left-40 w-96 h-96 opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)',
            }}
          />
          {/* Radial glow - bottom right */}
          <div
            className="absolute -bottom-40 -right-40 w-[500px] h-[500px] opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
            }}
          />
          {/* Center ambient light - teal/orange mix */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-15 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #14b8a6 0%, #f97316 50%, transparent 70%)',
            }}
          />
          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&display=swap');

          @keyframes story-fade-in {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes ambient-glow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }

          .story-quote {
            font-family: 'Crimson Pro', Georgia, serif;
            animation: story-fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .ambient-orb {
            animation: ambient-glow 4s ease-in-out infinite;
          }
        `}</style>

        <div className="relative max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-block mb-6">
              <div
                className="h-1 w-20 rounded-full mx-auto mb-8"
                style={{
                  background: 'linear-gradient(90deg, #14b8a6 0%, #f97316 100%)',
                }}
              />
            </div>
            <h2
              id="stories-heading"
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.03em' }}
            >
              Stories of <span className="italic" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>change</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Anonymized snapshots of how people are using Reframe.me.
            </p>
          </div>

          {/* Story Showcase */}
          <div
            className="relative max-w-5xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Main story container */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.08) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
              role="region"
              aria-roledescription="carousel"
              aria-label="Stories of change"
            >
              {/* Decorative top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(20, 184, 166, 0.5) 50%, transparent 100%)',
                }}
              />

              {/* Story content */}
              <div className="relative px-8 py-16 md:px-16 md:py-24">
                {/* Decorative quote mark - large */}
                <div
                  className="absolute top-12 left-8 md:left-12 text-9xl md:text-[12rem] leading-none opacity-10 pointer-events-none select-none"
                  style={{
                    fontFamily: 'Crimson Pro, Georgia, serif',
                    color: '#14b8a6',
                  }}
                  aria-hidden="true"
                >
                  "
                </div>

                {/* Story content with stacked positioning */}
                <div className="relative" style={{ minHeight: '280px' }}>
                  {stories.map((story, index) => {
                    const isActive = index === storyIndex;
                    return (
                      <div
                        key={index}
                        className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-700 ${
                          isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${index + 1} of ${stories.length}`}
                        aria-hidden={!isActive}
                      >
                        {/* Quote text */}
                        <blockquote
                          className={`story-quote text-2xl md:text-4xl lg:text-5xl leading-tight md:leading-tight lg:leading-tight text-white font-light italic mb-10 md:mb-12 relative ${
                            prefersReducedMotion ? '' : ''
                          }`}
                          style={{
                            textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {story.quote}
                        </blockquote>

                        {/* Attribution */}
                        <div className="flex items-center gap-4 relative">
                          <div
                            className="h-px flex-1 max-w-[80px]"
                            style={{
                              background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.6) 0%, transparent 100%)',
                            }}
                          />
                          <p
                            className="text-sm md:text-base font-medium tracking-wide uppercase text-slate-300"
                            style={{ letterSpacing: '0.1em' }}
                          >
                            {story.role}
                          </p>
                          <div
                            className="h-px flex-1 max-w-[80px]"
                            style={{
                              background: 'linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.6) 100%)',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Decorative bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.5) 50%, transparent 100%)',
                }}
              />
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-8 mt-12">
              {/* Previous button */}
              <button
                onClick={prevStory}
                aria-label="Previous story"
                data-testid="button-story-prev"
                className="group relative w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                }}
              >
                <ChevronLeft className="w-6 h-6 text-white mx-auto transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
              </button>

              {/* Dots navigation */}
              <div
                className="flex items-center gap-3"
                role="tablist"
                aria-label="Story slides"
              >
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStory(index)}
                    className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                      index === storyIndex
                        ? 'w-12 h-3'
                        : 'w-3 h-3 hover:scale-125'
                    }`}
                    style={{
                      background: index === storyIndex
                        ? 'linear-gradient(90deg, #14b8a6 0%, #f97316 100%)'
                        : 'rgba(255, 255, 255, 0.3)',
                      boxShadow: index === storyIndex
                        ? '0 0 20px rgba(20, 184, 166, 0.5)'
                        : 'none',
                    }}
                    role="tab"
                    aria-selected={index === storyIndex}
                    aria-label={`Go to story ${index + 1}`}
                    data-testid={`button-story-dot-${index}`}
                  />
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={nextStory}
                aria-label="Next story"
                data-testid="button-story-next"
                className="group relative w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                }}
              >
                <ChevronRight className="w-6 h-6 text-white mx-auto transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Integrated Donate CTA */}
          <div className="max-w-4xl mx-auto mt-20 md:mt-28">
            {/* Divider */}
            <div className="text-center mb-16">
              <div
                className="inline-block h-px w-48 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                }}
              />
            </div>

            {/* CTA Content */}
            <div className="text-center space-y-10">
              {/* Icon decoration */}
              <div className="flex justify-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(20, 184, 166, 0.2) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 rounded-full opacity-50 blur-xl"
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #14b8a6 100%)',
                    }}
                  />
                  <Heart className="w-10 h-10 text-white relative z-10" fill="white" aria-hidden="true" />
                </div>
              </div>

              {/* Heading */}
              <h3
                className="text-3xl md:text-5xl font-bold text-white italic leading-tight"
                style={{
                  fontFamily: 'Crimson Pro, Georgia, serif',
                  textShadow: '0 2px 30px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '-0.01em',
                }}
              >
                Stories like these are why this exists
              </h3>

              {/* Description */}
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto font-light">
                If this tool has helped you or someone you know, your support helps ensure it stays free and available for everyone navigating this journey.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Link href="/donate">
                  <Button
                    size="lg"
                    className="group relative px-10 py-7 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                      color: 'white',
                      boxShadow: '0 10px 40px rgba(249, 115, 22, 0.4), 0 0 60px rgba(249, 115, 22, 0.2)',
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" aria-hidden="true" />
                      Support This Work
                    </span>
                    {/* Shine effect on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                      }}
                    />
                  </Button>
                </Link>

                <span className="text-sm text-white/60 font-medium">or</span>

                <a
                  href="/donate"
                  className="text-base font-semibold text-teal-300 hover:text-teal-200 underline underline-offset-4 decoration-2 hover:underline-offset-8 transition-all duration-300"
                >
                  Share with someone who needs it
                </a>
              </div>

              {/* Note */}
              <p className="text-sm text-white/60 italic pt-4 font-light">
                Every bit helps—but this tool is here for you whether you can give or not.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={howItWorksRef as React.RefObject<HTMLElement>}
        className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50"
        aria-labelledby="how-it-works-heading"
        data-testid="section-how-it-works"
      >
        {/* Subtle top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" aria-hidden="true" />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              id="how-it-works-heading"
              className="text-3xl md:text-5xl font-bold text-foreground mb-4"
            >
              How it works
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Three clear steps from feeling stuck to feeling prepared.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative mb-12">
            <div
              className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full"
              aria-hidden="true"
            />

            {howItWorksSteps.map((step, index) => (
              <div
                key={step.title}
                className={`relative bg-gradient-to-br from-background to-muted/20 rounded-2xl border-2 border-border shadow-lg p-8 text-center transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  howItWorksInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{
                  transitionDelay: howItWorksInView
                    ? `${index * 200}ms`
                    : "0ms",
                }}
                data-testid={`step-${index + 1}`}
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-2xl mx-auto mb-6 relative z-10 shadow-lg">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Final Encouragement Block */}
          <div className="mt-16 mb-12">
            <div
              className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(240, 253, 250, 0.6) 0%, rgba(224, 242, 254, 0.6) 100%)',
                border: '2px solid rgba(20, 184, 166, 0.2)',
                boxShadow: '0 10px 40px rgba(20, 184, 166, 0.15)'
              }}
            >
              {/* Decorative quote mark */}
              <div
                className="absolute top-8 left-8 text-9xl font-serif opacity-10 pointer-events-none"
                style={{ color: 'rgb(20, 184, 166)' }}
                aria-hidden="true"
              >
                "
              </div>

              {/* Subtle background orbs */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)'
                }}
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)'
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                <p
                  className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 bg-clip-text text-transparent"
                  style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.02em' }}
                >
                  Your past doesn't define your future
                </p>

                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Every person deserves the chance to move forward. You've already taken the first step by being here.
                </p>

                <div className="pt-4">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-100/60 border border-teal-200">
                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" aria-hidden="true" />
                    <span className="text-sm font-semibold text-teal-700">Start reframing today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/selection">
              <Button
                size="lg"
                className="group w-full sm:w-auto min-h-[56px] px-12 text-xl font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                  color: 'white'
                }}
                data-testid="button-get-started"
              >
                Get Started
                <span className="inline-flex transition-transform duration-150 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none ml-2">
                  <ArrowRight className="w-6 h-6" aria-hidden="true" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
}
