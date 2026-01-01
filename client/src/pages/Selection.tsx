import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, Mail, ArrowRight, Files, Check } from "lucide-react";
import BackToHomeRow from "./selection/sections/BackToHomeRow";
import BottomTagline from "./selection/sections/BottomTagline";
import SelectionHero from "./selection/sections/SelectionHero";
import PrivacyNotice from "./selection/sections/PrivacyNotice";
import ContinueCTA from "./selection/sections/ContinueCTA";
import QuickAnswersAccordion from "./selection/sections/QuickAnswersAccordion";
import OptionsGrid from "./selection/sections/OptionsGrid";

type ToolSelection = "narrative" | "responseLetter" | "both" | null;

interface SelectionOption {
  id: ToolSelection;
  title: string;
  description: string;
  detail: string;
  icon: typeof FileText;
  accentColor: string;
  number: string;
}

const options: SelectionOption[] = [
  {
    id: "narrative",
    title: "Disclosure Narratives",
    description: "Five personalized approaches to discuss your background with confidence and clarity.",
    detail: "Perfect for after you recieve an offer with potential employers",
    icon: FileText,
    accentColor: "teal",
    number: "01",
  },
  {
    id: "responseLetter",
    title: "Response Letter",
    description: "A professional response to pre-adverse action notices that highlights your growth.",
    detail: "Addresses background check concerns while showcasing your transformation",
    icon: Mail,
    accentColor: "orange",
    number: "02",
  },
  {
    id: "both",
    title: "Complete Package",
    description: "Everything you need to navigate the employment process with full preparation.",
    detail: "Both narratives and response letter for comprehensive readiness",
    icon: Files,
    accentColor: "purple",
    number: "03",
  },
];

export default function Selection() {
  const [selected, setSelected] = useState<ToolSelection>(null);
  const [hasMadeSelection, setHasMadeSelection] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string>("");
  const [hoveredCard, setHoveredCard] = useState<ToolSelection>(null);
  const [, navigate] = useLocation();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContinue = () => {
    if (selected) {
      window.scrollTo(0, 0);
      navigate(`/form?tool=${selected}`);
    }
  };

  const handleSelect = (optionId: ToolSelection) => {
    setSelected(optionId);
    if (!hasMadeSelection) {
      setHasMadeSelection(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, optionId: ToolSelection) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(optionId);
    }
  };

  return (
    <>
      {/* Page-specific Selection animation utilities */}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.7s ease-out forwards;
        }

        .stagger-1 { animation-delay: 0.3s; }
        .stagger-2 { animation-delay: 0.5s; }
        .stagger-3 { animation-delay: 0.7s; }
        .stagger-4 { animation-delay: 0.9s; }
      `}</style>

      <section
        className="min-h-screen py-8 md:py-16 px-4 sm:px-6 lg:px-8 dot-pattern dark:dot-pattern-dark relative overflow-hidden"
        aria-labelledby="selection-heading"
      >
        {/* Paper texture overlay */}
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Subtle decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Back Button */}
          <BackToHomeRow />

          {/* Hero Section - Editorial Style */}
          <div className="mb-16 md:mb-24">
            <SelectionHero />

            {/* Quick Answers - Refined Design */}
            <QuickAnswersAccordion
              accordionValue={accordionValue}
              onAccordionChange={setAccordionValue}
            />
          </div>

          {/* Options Grid - Editorial Magazine Style */}
          <OptionsGrid
            options={options}
            selected={selected}
            hoveredCard={hoveredCard}
            onSelect={handleSelect}
            onKeyDown={handleKeyDown}
            onHoverEnter={setHoveredCard}
            onHoverLeave={() => setHoveredCard(null)}
          />

          {/* CTA Section - Editorial Style */}
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Continue Button */}
            <ContinueCTA selected={selected} onContinue={handleContinue} />

            {/* Privacy Notice - Refined */}
            <PrivacyNotice hasMadeSelection={hasMadeSelection} />

            {/* Bottom tagline */}
            <BottomTagline />
          </div>

        </div>
      </section>
    </>
  );
}
