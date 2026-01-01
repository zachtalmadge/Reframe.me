import { useEffect } from "react";
import { useInView } from "@/hooks/useInView";
import DonateCTASection from "./home/sections/DonateCTASection";
import ToolsBentoSection from "./home/sections/ToolsBentoSection";
import HowItWorksSection from "./home/sections/HowItWorksSection";
import TestimonialsSection from "./home/sections/TestimonialsSection";
import WhyProcessMattersSection from "./home/sections/WhyProcessMattersSection";
import HeroSection from "./home/sections/HeroSection";
import { howItWorksSteps } from "./home/data/home.constants";

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

  return (
    <>
      <HeroSection />
      <WhyProcessMattersSection />
      <DonateCTASection />
      <ToolsBentoSection />

      <TestimonialsSection />

      <HowItWorksSection
        howItWorksRef={howItWorksRef}
        howItWorksInView={howItWorksInView}
        howItWorksSteps={howItWorksSteps}
      />

    </>
  );
}
