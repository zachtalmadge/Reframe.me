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
    before: "I'm scared my past will cost me the job once they see my background.",
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
const VISIBLE_DURATION = 5000;  // ~5 seconds with both visible
const GAP_DURATION = 1000;

export default function Home() {
  const { ref: howItWorksRef, isInView: howItWorksInView } = useInView({
    threshold: 0.2,
    rootMargin: "0px 0px -5% 0px",
    triggerOnce: false,
  });

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
          background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0891b2 100%)'
        }}
        aria-labelledby="hero-heading"
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 gradient-shimmer-hero opacity-30" aria-hidden="true" />

        {/* Decorative background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
            }}
          />
          <div
            className="absolute bottom-40 left-1/4 w-[350px] h-[350px] rounded-full opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)'
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
                  className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/30 transition-all duration-700 ease-out ${
                    heroMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" aria-hidden="true" />
                  <span className="text-xs md:text-sm font-semibold tracking-wide text-white/95 uppercase">
                    Got a conditional offer, background check, or pre-adverse notice?
                  </span>
                </div>

                <h1
                  id="hero-heading"
                  className={`hero-heading text-4xl md:text-6xl font-bold leading-tight text-white transition-all duration-700 ease-out ${
                    heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  Prepare to talk honestly<br className="hidden sm:inline"/> about your record.
                </h1>
                <p className={`text-lg md:text-xl text-teal-50 leading-relaxed max-w-3xl mx-auto transition-all duration-700 ease-out ${
                  heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: '400ms' }}
                >
                  Your past is part of your story, <em className="font-medium">not the whole story</em>. Reframe.me helps
                  you share that story in a way that centers your growth and{" "}
                  <em className="font-medium">what you offer today</em>.
                </p>
              </div>

                            {/* CTA Button */}
              <div className="pt-6">
                <Link href="/selection">
                  <Button
                    size="lg"
                    className="group min-h-[56px] px-10 text-lg font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                      color: 'white'
                    }}
                    data-testid="button-get-started-hero"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                </Link>
              </div>

              {/* Before/After block - preserved functionality */}
              <div
                className="max-w-3xl mx-auto rounded-3xl p-8 md:p-12 backdrop-blur-sm relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 253, 250, 0.95) 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
                }}
                data-testid="before-after-block"
              >
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
                          className={`text-lg md:text-xl text-gray-600 italic motion-reduce:transition-none ${
                            isMobile ? '' : 'transition-opacity duration-300'
                          } ${isActive && showBefore ? "opacity-100" : "opacity-0"}`}
                          style={isMobile ? {
                            willChange: isActive ? 'opacity' : 'auto',
                            transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            WebkitFontSmoothing: 'antialiased',
                          } : undefined}
                        >
                          <span className="font-semibold text-gray-700 not-italic block mb-2">
                            Before:
                          </span>
                          <span className="text-gray-600">"{pair.before}"</span>
                        </div>
                        <div
                          className={`text-lg md:text-xl text-gray-900 font-medium motion-reduce:transition-none ${
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
                          } : undefined}
                        >
                          <span className="text-teal-700 font-semibold block mb-2">After:</span>
                          <span className="text-gray-900">"{pair.after}"</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base pt-4">
                <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/30">
                  <Clock className="w-4 h-4 text-white" aria-hidden="true" />
                  <span className="font-medium text-white">Takes 10 - 20 minutes</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/30">
                  <Heart className="w-4 h-4 text-white" aria-hidden="true" />
                  <span className="font-medium text-white">Free to use</span>
                </div>
              </div>



              <p className="text-sm text-teal-100 font-medium">
                No account required • Completely private • Your story, your way
              </p>
            </div>
          </div>
        </div>

      </section>

      <section
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-slate-50 to-slate-100/50 dark:from-transparent dark:via-slate-900/50 dark:to-slate-800/30"
        aria-labelledby="tools-heading"
      >
        <div className="max-w-5xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          </div>
        </div>
      </section>



      <section
        className="group relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 border-y-2 border-slate-200/50 dark:border-slate-700/50 cursor-default"
        aria-labelledby="safe-space-heading"
        data-testid="section-safe-space"
        tabIndex={0}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/20 dark:bg-slate-700/20 rounded-bl-full transition-opacity duration-300 group-hover:opacity-100 opacity-70" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-300/10 dark:bg-slate-600/10 rounded-tr-full" aria-hidden="true" />

        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-10 items-center justify-center relative">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 group-focus-within:scale-110 group-focus-within:rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 shadow-xl">
                  <Shield className="w-10 h-10 text-slate-700 dark:text-slate-200" aria-hidden="true" />
                </div>
              </div>
              <div className="space-y-5 flex-1 md:text-left text-center max-w-3xl">
                <div className="space-y-3">
                  <h2
                    id="safe-space-heading"
                    className="relative inline-block text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 overflow-hidden"
                  >
                    <span className="relative z-10">A judgement-free space, built for your privacy.</span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out motion-reduce:hidden dark:via-white/60"
                    />
                  </h2>
                  <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    We don't store what you write in this session. You decide
                    what to share, and you can close this tab at any time.
                  </p>
                </div>
                <ul className="flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-300 md:mx-0 mx-auto max-w-md">
                  <li className="flex items-center gap-2.5">
                    <span
                      className="w-2 h-2 rounded-full bg-slate-600 dark:bg-slate-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-medium">No account required.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span
                      className="w-2 h-2 rounded-full bg-slate-600 dark:bg-slate-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-medium">No tracking of your answers.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span
                      className="w-2 h-2 rounded-full bg-slate-600 dark:bg-slate-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-medium">You decide what to keep, copy, or delete.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-orange-50/60 to-orange-100/40 dark:from-transparent dark:via-orange-950/20 dark:to-orange-900/10"
        aria-labelledby="is-this-for-me-heading"
        data-testid="section-is-this-for-me"
      >
        <div className="max-w-4xl mx-auto">
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
      </section>

            <section
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-100/40 via-primary/5 to-primary/10 dark:from-orange-900/10 dark:via-primary/5 dark:to-primary/10"
        aria-labelledby="stories-heading"
        data-testid="section-stories"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2
              id="stories-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-3"
            >
              Stories of change
            </h2>
            <p className="text-lg text-muted-foreground">
              Anonymized snapshots of how people are using Reframe.me.
            </p>
          </div>

          <div
            className="relative max-w-2xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="relative rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card to-muted/30 p-8 md:p-12 min-h-[180px] flex flex-col justify-center shadow-lg"
              role="region"
              aria-roledescription="carousel"
              aria-label="Stories of change"
            >
              <div className="absolute top-4 right-4 text-6xl text-primary/10 font-serif" aria-hidden="true">"</div>
              <div
                key={storyIndex}
                className={`text-center relative z-10 ${
                  prefersReducedMotion ? "" : "animate-fade-in"
                }`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${storyIndex + 1} of ${stories.length}`}
              >
                <p className="text-lg md:text-xl text-foreground leading-relaxed italic font-light">
                  "{stories[storyIndex].quote}"
                </p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-8 h-0.5 bg-primary/30" aria-hidden="true" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {stories[storyIndex].role}
                  </p>
                  <div className="w-8 h-0.5 bg-primary/30" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevStory}
                aria-label="Previous story"
                data-testid="button-story-prev"
                className="rounded-full border-2 hover:border-primary/40 hover:bg-primary/5"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </Button>

              <div
                className="flex items-center gap-2.5"
                role="tablist"
                aria-label="Story slides"
              >
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStory(index)}
                    className={`rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      index === storyIndex
                        ? "bg-primary w-8 h-2.5"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2.5 h-2.5"
                    }`}
                    role="tab"
                    aria-selected={index === storyIndex}
                    aria-label={`Go to story ${index + 1}`}
                    data-testid={`button-story-dot-${index}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextStory}
                aria-label="Next story"
                data-testid="button-story-next"
                className="rounded-full border-2 hover:border-primary/40 hover:bg-primary/5"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>


      <section
        ref={howItWorksRef as React.RefObject<HTMLElement>}
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 via-slate-50 to-slate-100 dark:from-primary/10 dark:via-slate-900 dark:to-slate-800"
        aria-labelledby="how-it-works-heading"
        data-testid="section-how-it-works"
      >
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
                className="group w-full sm:w-auto min-h-[56px] px-12 text-xl font-semibold transition-all duration-300 hover:scale-105"
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
