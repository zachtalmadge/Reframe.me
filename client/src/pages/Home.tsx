import { useState, useEffect, useRef } from "react";
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
  const isThisForMeRef = useRef<HTMLDivElement>(null);

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
    <Layout>
      <style>{`
        /* Prevent horizontal scroll - using clip instead of hidden to preserve sticky */
        body, html {
          overflow-x: clip;
          max-width: 100vw;
        }

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
          font-family: 'Fraunces', Georgia, serif;
          letter-spacing: -0.03em;
        }
      `}</style>

      {/* Hero Section */}
      <section
        className="relative py-16 md:py-24 overflow-x-hidden overflow-y-visible"
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
                  className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full backdrop-blur-md border transition-all duration-700 ease-out ${heroMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
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
                  className={`hero-heading text-4xl md:text-6xl font-bold leading-tight text-white transition-all duration-700 ease-out ${heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  style={{
                    transitionDelay: '200ms',
                    textShadow: '0 2px 30px rgba(0, 0, 0, 0.4), 0 0 60px rgba(20, 184, 166, 0.15)'
                  }}
                >
                  Prepare to talk confidently<br className="hidden sm:inline" /> about your record
                </h1>
                <p className={`text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto transition-all duration-700 ease-out ${heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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
                          className={`relative text-lg md:text-xl text-white/70 italic motion-reduce:transition-none ${isMobile ? '' : 'transition-opacity duration-300'
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
                          className={`relative text-lg md:text-xl text-white font-medium motion-reduce:transition-none ${isMobile ? '' : 'transition-all duration-300'
                            } ${isActive && showAfter
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
      {/* End Hero Section*/}

      {/* Why This Part of the Process Matters Section (with Is This For Me) */}
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
                That’s all you get to disclose when the background check comes up.
              </h3>

              <p className="text-lg leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#475569' }}>
                It’s not just <em>whether</em> an employer runs a check—it’s what happens when
                they ask about it.{" "}
                <strong className="text-slate-900">
                  Preparation changes how you feel in the room.
                </strong>{" "}
                Instead of searching for the right words, you can answer with clarity and
                confidence—and move the conversation back to your skills and fit.
                <br /><br />
                With narratives and a response letter ready before you need them, you have
                employer-ready language you can use immediately and refine in your own voice.{" "}
                <strong className="text-slate-900">That’s the gap Reframe.me is built for.</strong>
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
      {/* End Why This Part of the Process Matters Section (with Is This For Me) */}

      {/* Donate CTA */}
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
      {/* End Donate CTA */}

      {/* What We Offer - Bento Grid */}
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
      {/* End What We Offer - Bento Grid */}


      {/* Testimonials and Donate CTA */}
      <section
        className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-visible"
        style={{
          background: '#ffffff'
        }}
        aria-labelledby="stories-heading"
        data-testid="section-stories"
      >
        {/* Geometric decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large teal circle - top right */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-5"
            style={{
              background: '#14b8a6'
            }}
          />
          {/* Orange square - bottom left */}
          <div
            className="absolute -bottom-24 -left-24 w-80 h-80 rotate-12 opacity-5"
            style={{
              background: '#f97316'
            }}
          />
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;700&display=swap');

          @keyframes testimonial-slide-in {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float-gentle {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          .testimonial-quote {
            font-family: 'DM Serif Display', Georgia, serif;
            animation: testimonial-slide-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .float-icon {
            animation: float-gentle 3s ease-in-out infinite;
          }
        `}</style>

        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-24">
            {/* Decorative element above title */}
            <div className="inline-flex items-center gap-4 mb-10">
              <div
                className="h-1 w-16 rounded-full"
                style={{
                  background: '#14b8a6',
                }}
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: '#f97316',
                }}
              />
              <div
                className="h-1 w-16 rounded-full"
                style={{
                  background: '#14b8a6',
                }}
              />
            </div>

            <h2
              id="stories-heading"
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
              style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
             <span className="italic">Testimonials</span>
            </h2>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#475569'
              }}
            >
              Anonymized snapshots of how people are using Reframe.me.
            </p>
          </div>

          {/* Two Column Layout - Story Showcase + Donate CTA */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: Story Showcase */}
            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Main story container */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: '#ffffff',
                  border: '4px solid #14b8a6',
                  boxShadow: '0 30px 80px rgba(20, 184, 166, 0.2), 0 10px 30px rgba(0, 0, 0, 0.1)',
                }}
                role="region"
                aria-roledescription="carousel"
                aria-label="Stories of change"
              >
              {/* Decorative top color bar */}
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{
                  background: 'linear-gradient(90deg, #14b8a6 0%, #f97316 100%)',
                }}
              />

              {/* Story content */}
              <div className="relative px-8 py-16 md:px-16 md:py-24">
                {/* Decorative quote mark - large and bold */}
                <div
                  className="absolute top-8 left-6 md:left-10 text-[10rem] md:text-[16rem] leading-none opacity-15 pointer-events-none select-none font-bold"
                  style={{
                    fontFamily: 'DM Serif Display, Georgia, serif',
                    color: '#f97316',
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
                        className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-700 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                          }`}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${index + 1} of ${stories.length}`}
                        aria-hidden={!isActive}
                      >
                        {/* Quote text */}
                        <blockquote
                          className={`testimonial-quote text-2xl md:text-4xl lg:text-5xl leading-tight md:leading-tight lg:leading-tight font-normal italic mb-10 md:mb-12 relative ${prefersReducedMotion ? '' : ''
                            }`}
                          style={{
                            color: '#0f172a',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {story.quote}
                        </blockquote>

                        {/* Attribution */}
                        <div className="flex items-center gap-4 relative">
                          <div
                            className="h-1 flex-1 max-w-[60px] rounded-full"
                            style={{
                              background: '#14b8a6',
                            }}
                          />
                          <p
                            className="text-sm md:text-base font-bold tracking-wider uppercase"
                            style={{
                              letterSpacing: '0.15em',
                              color: '#0d9488'
                            }}
                          >
                            {story.role}
                          </p>
                          <div
                            className="h-1 flex-1 max-w-[60px] rounded-full"
                            style={{
                              background: '#f97316',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Decorative bottom color bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-2"
                style={{
                  background: 'linear-gradient(90deg, #f97316 0%, #14b8a6 100%)',
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
                className="group relative w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                style={{
                  background: '#14b8a6',
                  boxShadow: '0 6px 24px rgba(20, 184, 166, 0.3)',
                }}
              >
                <ChevronLeft className="w-6 h-6 text-white mx-auto transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
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
                    className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${index === storyIndex
                      ? 'w-12 h-3'
                      : 'w-3 h-3 hover:scale-150'
                      }`}
                    style={{
                      background: index === storyIndex
                        ? 'linear-gradient(90deg, #14b8a6 0%, #f97316 100%)'
                        : '#cbd5e1',
                      boxShadow: index === storyIndex
                        ? '0 4px 16px rgba(20, 184, 166, 0.4)'
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
                className="group relative w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                style={{
                  background: '#f97316',
                  boxShadow: '0 6px 24px rgba(249, 115, 22, 0.3)',
                }}
              >
                <ChevronRight className="w-6 h-6 text-white mx-auto transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </div>
            </div>

            {/* RIGHT COLUMN: Donate CTA */}
            <div className="flex flex-col justify-center items-center text-center space-y-8 px-4 md:px-6">
              {/* Decorative element - bold geometric heart */}
              <div className="relative self-center float-icon">
                <div
                  className="w-28 h-28 rounded-2xl flex items-center justify-center relative group transition-all duration-500 hover:scale-110 hover:rotate-6"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                    boxShadow: '0 20px 50px rgba(249, 115, 22, 0.4), 0 10px 20px rgba(249, 115, 22, 0.2)',
                  }}
                >
                  {/* Inner border effect */}
                  <div
                    className="absolute inset-2 rounded-xl border-2 border-white/30"
                  />
                  <Heart
                    className="w-14 h-14 text-white relative z-10 transition-transform duration-300 group-hover:scale-110"
                    fill="white"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Heading with bold typography */}
              <h3
                className="text-3xl md:text-4xl lg:text-5xl font-bold italic leading-tight max-w-lg"
                style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                }}
              >
                Stories like these are why this exists
              </h3>

              {/* Description with strong contrast */}
              <p
                className="text-base md:text-lg lg:text-xl leading-relaxed max-w-md font-medium"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: '#475569',
                }}
              >
                If this tool has helped you or someone you know, your support helps ensure it stays free and available for everyone navigating this journey.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full md:w-auto">
                <Link href="/donate">
                  <Button
                    size="lg"
                    className="group relative px-10 py-7 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:-rotate-1 active:scale-95 overflow-hidden w-full sm:w-auto"
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                      color: 'white',
                      boxShadow: '0 12px 40px rgba(249, 115, 22, 0.4)',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-3 justify-center">
                      <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-125" fill="currentColor" aria-hidden="true" />
                      Support This Work
                    </span>
                    {/* Shine effect on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                      }}
                    />
                  </Button>
                </Link>

                <span className="text-sm font-bold tracking-wider uppercase" style={{ color: '#94a3b8' }}>or</span>

                <a
                  href="/donate"
                  className="text-base font-bold underline underline-offset-4 decoration-2 hover:underline-offset-8 transition-all duration-300"
                  style={{
                    color: '#14b8a6',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Share with someone who needs it
                </a>
              </div>

              {/* Note with clear typography */}
              <p
                className="text-sm italic pt-2 font-medium max-w-sm"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: '#64748b',
                }}
              >
                Every bit helps—but this tool is here for you whether you can give or not.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* End Testimonials and Donate CTA */}

      {/* How It Works - Modern Process Flow */}
      <section
        ref={howItWorksRef as React.RefObject<HTMLElement>}
        className="relative py-24 md:py-36 px-4 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-visible"
        aria-labelledby="how-it-works-heading"
        data-testid="section-how-it-works"
        style={{
          background: 'linear-gradient(180deg, #fafaf9 0%, #f5f5f4 50%, #fef3c7 100%)'
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&display=swap');

          @keyframes draw-line {
            from { stroke-dashoffset: 1000; }
            to { stroke-dashoffset: 0; }
          }

          @keyframes pulse-step {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          @keyframes glow-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .step-card-hover {
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .step-card-hover:hover {
            transform: translateY(-16px) scale(1.02);
          }

          .connecting-line {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw-line 2s ease-out forwards;
          }
        `}</style>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs */}
          <div
            className="absolute top-0 left-1/4 w-[500px] h-[500px] opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)'
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[600px] h-[600px] opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #f97316 0%, transparent 70%)'
            }}
          />
          {/* Diagonal accent lines */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-5"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(0,0,0,0.05) 50px, rgba(0,0,0,0.05) 52px)'
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 md:mb-28">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-teal-500 to-teal-600" />
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600" />
              </div>
            </div>
            <h2
              id="how-it-works-heading"
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                background: 'linear-gradient(135deg, #0f172a 0%, #0d9488 50%, #ea580c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.03em'
              }}
            >
              How it works
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#57534e' }}>
              Three clear steps from feeling stuck to feeling <strong style={{ color: '#0d9488' }}>prepared</strong>.
            </p>
          </div>

          {/* Process Flow */}
          <div className="max-w-6xl mx-auto mb-20">
            {/* Desktop - Horizontal Flow */}
            <div className="hidden lg:block relative">
              {/* SVG Connecting Lines */}
              <svg className="absolute top-32 left-0 w-full h-32 pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path
                  d="M 260 40 Q 320 40, 380 40"
                  stroke="url(#lineGradient1)"
                  strokeWidth="3"
                  fill="none"
                  className={`connecting-line ${howItWorksInView ? '' : ''}`}
                  style={{ animationDelay: '0.5s' }}
                />
                <path
                  d="M 640 40 Q 700 40, 760 40"
                  stroke="url(#lineGradient2)"
                  strokeWidth="3"
                  fill="none"
                  className={`connecting-line ${howItWorksInView ? '' : ''}`}
                  style={{ animationDelay: '1s' }}
                />
              </svg>

              <div className="grid grid-cols-3 gap-12 relative z-10">
                {howItWorksSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`step-card-hover transition-all duration-700 ${howItWorksInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-12"
                      }`}
                    style={{
                      transitionDelay: howItWorksInView ? `${index * 200}ms` : "0ms",
                    }}
                    data-testid={`step-${index + 1}`}
                  >
                    {/* Card */}
                    <div
                      className="relative rounded-3xl p-8 md:p-10 overflow-hidden group h-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
                        border: '2px solid rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                        minHeight: '380px'
                      }}
                    >
                      {/* Gradient overlay on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: index === 0
                            ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, transparent 100%)'
                            : index === 1
                              ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, transparent 100%)'
                              : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%)'
                        }}
                      />

                      {/* Step Number Badge */}
                      <div className="relative mb-8">
                        <div
                          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl relative group-hover:scale-110 transition-transform duration-500"
                          style={{
                            background: index === 0
                              ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                              : index === 1
                                ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                                : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            boxShadow: `0 10px 30px ${index === 0
                              ? 'rgba(20, 184, 166, 0.4)'
                              : index === 1
                                ? 'rgba(249, 115, 22, 0.4)'
                                : 'rgba(139, 92, 246, 0.4)'
                              }`
                          }}
                        >
                          <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Cabinet Grotesk, system-ui, sans-serif' }}>
                            {index + 1}
                          </span>
                        </div>
                        {/* Glow ring */}
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: index === 0
                              ? 'radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, transparent 70%)'
                              : index === 1
                                ? 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)'
                                : 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                            transform: 'scale(2)',
                            filter: 'blur(20px)'
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 space-y-4">
                        <h3
                          className="text-2xl md:text-3xl font-bold leading-tight"
                          style={{
                            fontFamily: 'Cabinet Grotesk, system-ui, sans-serif',
                            color: '#1c1917',
                            letterSpacing: '-0.02em'
                          }}
                        >
                          {step.title}
                        </h3>
                        <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#57534e' }}>
                          {step.description}
                        </p>
                      </div>

                      {/* Arrow hint */}
                      {index < 2 && (
                        <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                          <ArrowRight className="w-6 h-6" style={{ color: index === 0 ? '#f97316' : '#8b5cf6' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile - Vertical Stack */}
            <div className="lg:hidden space-y-4">
              {howItWorksSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={`transition-all duration-700 ${howItWorksInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                    }`}
                  style={{
                    transitionDelay: howItWorksInView ? `${index * 200}ms` : "0ms",
                  }}
                  data-testid={`step-${index + 1}`}
                >
                  <div
                    className="relative rounded-3xl p-8 overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
                      border: '2px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="flex items-start gap-6">
                      {/* Step Number */}
                      <div
                        className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                          background: index === 0
                            ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                            : index === 1
                              ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                              : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          boxShadow: `0 10px 30px ${index === 0
                            ? 'rgba(20, 184, 166, 0.4)'
                            : index === 1
                              ? 'rgba(249, 115, 22, 0.4)'
                              : 'rgba(139, 92, 246, 0.4)'
                            }`
                        }}
                      >
                        <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Cabinet Grotesk, system-ui, sans-serif' }}>
                          {index + 1}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <h3
                          className="text-xl md:text-2xl font-bold leading-tight"
                          style={{
                            fontFamily: 'Cabinet Grotesk, system-ui, sans-serif',
                            color: '#1c1917',
                            letterSpacing: '-0.02em'
                          }}
                        >
                          {step.title}
                        </h3>
                        <p className="text-base leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#57534e' }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connector for mobile */}
                  {index < 2 && (
                    <div className="flex justify-center py-2">
                      <div className="w-1 h-8 rounded-full" style={{ background: index === 0 ? 'linear-gradient(to bottom, #14b8a6, #f97316)' : 'linear-gradient(to bottom, #f97316, #8b5cf6)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA Block */}
          <div className="max-w-4xl mx-auto">
            <div
              className="relative rounded-3xl p-10 md:p-16 text-center overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.6) 100%)',
                border: '3px solid rgba(251, 191, 36, 0.3)',
                boxShadow: '0 25px 70px rgba(251, 146, 60, 0.15)'
              }}
            >
              {/* Decorative elements */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-700"
                style={{
                  background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)'
                }}
              />
              <div
                className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-700"
                style={{
                  background: 'radial-gradient(circle, #f97316 0%, transparent 70%)'
                }}
              />

              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <p
                    className="text-3xl md:text-5xl font-bold leading-tight"
                    style={{
                      fontFamily: 'Fraunces, Georgia, serif',
                      background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #f97316 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Your past doesn't define your future
                  </p>
                  <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'Public Sans, sans-serif', color: '#78350f' }}>
                    Every person deserves the chance to move forward. You've already taken the first step by being here.
                  </p>
                </div>

                <Link href="/selection">
                  <Button
                    size="lg"
                    className="group relative px-6 py-5 md:px-12 md:py-7 mt-5 text-base md:text-xl font-bold rounded-2xl transition-all duration-400 hover:scale-105 overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
                      color: 'white',
                      boxShadow: '0 15px 40px rgba(249, 115, 22, 0.4)',
                      fontFamily: 'Cabinet Grotesk, system-ui, sans-serif'
                    }}
                    data-testid="button-get-started"
                  >
                    <span className="relative z-10 flex items-center gap-2 md:gap-3">
                      Start Reframing Today
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
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

                <div className="flex items-center justify-center gap-2 pt-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-300" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End How It Works - Modern Process Flow */}

    </Layout>
  );
}
