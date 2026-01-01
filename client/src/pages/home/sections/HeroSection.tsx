import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Heart } from "lucide-react";
import {
  beforeAfterPairs,
  BEFORE_DELAY,
  AFTER_DELAY,
  VISIBLE_DURATION,
  GAP_DURATION,
} from "../data/home.constants";

export default function HeroSection() {
  // Detect mobile synchronously before any state initialization
  const isMobile = typeof window !== 'undefined' &&
    (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768);

  const [heroMounted, setHeroMounted] = useState(false);
  const [showBefore, setShowBefore] = useState(false);
  const [showAfter, setShowAfter] = useState(false);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
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
  return (
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
  );
}
