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
import { useInView } from "@/hooks/useInView";
import DonateCTASection from "./home/sections/DonateCTASection";
import ToolsBentoSection from "./home/sections/ToolsBentoSection";
import HowItWorksSection from "./home/sections/HowItWorksSection";
import TestimonialsSection from "./home/sections/TestimonialsSection";

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
    <>
      <style>{`
        /* Page-specific Home styles */

        /* Prevent horizontal scroll - using clip instead of hidden to preserve sticky */
        body, html {
          overflow-x: clip;
          max-width: 100vw;
        }

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
      <DonateCTASection />
      {/* End Donate CTA */}

      {/* What We Offer - Bento Grid */}
      <ToolsBentoSection />
      {/* End What We Offer - Bento Grid */}


      {/* Testimonials and Donate CTA */}
      <TestimonialsSection
        stories={stories}
        storyIndex={storyIndex}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        goToStory={goToStory}
        prevStory={prevStory}
        nextStory={nextStory}
        prefersReducedMotion={prefersReducedMotion}
      />
      {/* End Testimonials and Donate CTA */}

      {/* How It Works - Modern Process Flow */}
      <HowItWorksSection
        howItWorksRef={howItWorksRef}
        howItWorksInView={howItWorksInView}
        howItWorksSteps={howItWorksSteps}
      />
      {/* End How It Works - Modern Process Flow */}

    </>
  );
}
