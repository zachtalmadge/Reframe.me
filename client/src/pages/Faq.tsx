import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqStyles } from "./faq/sections/FaqStyles";
import { FaqHeroSection } from "./faq/sections/FaqHeroSection";
import { FaqImportantDisclaimer } from "./faq/sections/FaqImportantDisclaimer";
import { FaqList } from "./faq/sections/FaqList";
import { FaqBottomDisclaimer } from "./faq/sections/FaqBottomDisclaimer";

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

          {/* CTA section - elevated design */}
          <div
            className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0891b2 100%)',
              boxShadow: '0 20px 60px rgba(20, 184, 166, 0.3)'
            }}
          >
            <div className="absolute inset-0 gradient-shimmer opacity-30" />

            <div className="relative z-10 space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
                  Ready to Get Started?
                </h2>
                <p className="text-teal-50 text-lg max-w-2xl mx-auto">
                  Create your personalized narratives and response letters in minutes. Free, private, and designed for your success.
                </p>
              </div>

              <Link href="/selection">
                <Button
                  size="lg"
                  className="group min-h-[56px] mt-5 px-10 text-lg font-semibold shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                    color: 'white'
                  }}
                  data-testid="button-get-started-faq"
                >
                  Begin Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>

              <p className="text-sm text-teal-100 font-medium">
                No account required • Completely free • Takes 10-15 minutes
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
