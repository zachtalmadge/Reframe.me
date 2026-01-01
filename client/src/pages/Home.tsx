import { useEffect } from "react";
import DonateCTASection from "./home/sections/DonateCTASection";
import ToolsBentoSection from "./home/sections/ToolsBentoSection";
import HowItWorksSection from "./home/sections/HowItWorksSection";
import TestimonialsSection from "./home/sections/TestimonialsSection";
import WhyProcessMattersSection from "./home/sections/WhyProcessMattersSection";
import HeroSection from "./home/sections/HeroSection";

export default function Home() {
  
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

      <HowItWorksSection />

    </>
  );
}
