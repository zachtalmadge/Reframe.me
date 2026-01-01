import { useState, useEffect, useRef } from "react";
import { useInView } from "@/hooks/useInView";
import DonateCTASection from "./home/sections/DonateCTASection";
import ToolsBentoSection from "./home/sections/ToolsBentoSection";
import HowItWorksSection from "./home/sections/HowItWorksSection";
import TestimonialsSection from "./home/sections/TestimonialsSection";
import WhyProcessMattersSection from "./home/sections/WhyProcessMattersSection";
import HeroSection from "./home/sections/HeroSection";
import {
  howItWorksSteps,
  stories,
  beforeAfterPairs,
  BEFORE_DELAY,
  AFTER_DELAY,
  VISIBLE_DURATION,
  GAP_DURATION,
} from "./home/data/home.constants";

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
    <>
      <HeroSection
        heroMounted={heroMounted}
        currentPairIndex={currentPairIndex}
        showBefore={showBefore}
        showAfter={showAfter}
        isMobile={isMobile}
        beforeAfterPairs={beforeAfterPairs}
      />

      <WhyProcessMattersSection />

      <DonateCTASection />

      <ToolsBentoSection />

      <TestimonialsSection
        prefersReducedMotion={prefersReducedMotion}
      />

      <HowItWorksSection
        howItWorksRef={howItWorksRef}
        howItWorksInView={howItWorksInView}
        howItWorksSteps={howItWorksSteps}
      />

    </>
  );
}
