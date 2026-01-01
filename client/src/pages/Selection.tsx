import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BackToHomeRow from "./selection/sections/BackToHomeRow";
import BottomTagline from "./selection/sections/BottomTagline";
import SelectionHero from "./selection/sections/SelectionHero";
import PrivacyNotice from "./selection/sections/PrivacyNotice";
import ContinueCTA from "./selection/sections/ContinueCTA";
import QuickAnswersAccordion from "./selection/sections/QuickAnswersAccordion";
import OptionsGrid from "./selection/sections/OptionsGrid";
import type { ToolSelection } from "./selection/types/selection.types";
import { options } from "./selection/data/selection.constants";

export default function Selection() {
  const [selected, setSelected] = useState<ToolSelection>(null);
  const [hasMadeSelection, setHasMadeSelection] = useState(false);
  const [accordionValue, setAccordionValue] = useState<string>("");
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
  };

  const handleFirstSelection = () => {
    setHasMadeSelection(true);
  };

  return (
    <>
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
            onSelect={handleSelect}
            onFirstSelection={handleFirstSelection}
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
