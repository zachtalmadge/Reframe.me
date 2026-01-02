import { useEffect } from "react";
import { FaqStyles } from "./faq/sections/FaqStyles";
import { FaqHeroSection } from "./faq/sections/FaqHeroSection";
import { FaqImportantDisclaimer } from "./faq/sections/FaqImportantDisclaimer";
import { FaqList } from "./faq/sections/FaqList";
import { FaqBottomDisclaimer } from "./faq/sections/FaqBottomDisclaimer";
import { FaqCtaSection } from "./faq/sections/FaqCtaSection";

export default function Faq() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <FaqStyles />

      <section
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 min-h-screen dot-pattern dark:dot-pattern-dark relative overflow-hidden"
        aria-labelledby="faq-heading"
      >
        {/* Paper texture overlay */}
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Subtle decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <FaqHeroSection />
          <FaqImportantDisclaimer />
          <FaqList />
          <FaqBottomDisclaimer />
          <FaqCtaSection />
        </div>
      </section>
    </>
  );
}
