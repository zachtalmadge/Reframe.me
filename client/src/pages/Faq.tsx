import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaqStyles } from "./faq/sections/FaqStyles";
import { FaqHeroSection } from "./faq/sections/FaqHeroSection";
import { FaqImportantDisclaimer } from "./faq/sections/FaqImportantDisclaimer";
import { faqs } from "./faq/data/faq.constants";

export default function Faq() {
  const [openItem, setOpenItem] = useState<string>("");

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

          {/* FAQs - card-based design */}
          <div className="space-y-4 mb-16">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              const isOpen = openItem === faq.id;

              return (
                <div
                  key={faq.id}
                  className="faq-card group"
                  data-testid={`faq-item-${faq.id}`}
                >
                  <div
                    className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-teal-200"
                    style={{
                      boxShadow: isOpen ? '0 10px 40px rgba(20, 184, 166, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <button
                      onClick={() => setOpenItem(isOpen ? "" : faq.id)}
                      className="w-full text-left p-6 md:p-8 transition-colors duration-200"
                      data-testid={`faq-trigger-${faq.id}`}
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                          style={{
                            background: isOpen
                              ? 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)'
                              : 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)'
                          }}
                        >
                          <Icon
                            className={`w-6 h-6 transition-colors duration-300 ${
                              isOpen ? 'text-white' : 'text-teal-600'
                            }`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3
                              className="faq-question text-lg md:text-xl font-semibold text-gray-900 leading-tight pr-4"
                            >
                              {faq.question}
                            </h3>

                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isOpen ? 'bg-teal-100 rotate-180' : 'bg-gray-100'
                              }`}
                            >
                              <ArrowRight
                                className={`w-4 h-4 transition-colors duration-300 ${
                                  isOpen ? 'text-teal-700 rotate-90' : 'text-gray-500'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="category-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100/80 border border-gray-200/50">
                            <span className="text-xs font-medium text-gray-600">{faq.category}</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Answer - accordion content */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div
                        className="px-6 md:px-8 pb-6 md:pb-8 pt-2"
                        style={{
                          background: 'linear-gradient(180deg, rgba(240, 253, 250, 0.3) 0%, transparent 100%)'
                        }}
                        data-testid={`faq-content-${faq.id}`}
                      >
                        <div className="pl-16 prose prose-sm max-w-none">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom disclaimer - minimalist */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 md:p-6 mb-12">
            <p className="text-xs text-gray-600 leading-relaxed text-center">
              <span className="font-semibold">Legal Reminder:</span> Nothing on this site constitutes legal advice. We are not responsible for hiring decisions. Results vary, and we make no guarantees. If you have legal questions, seek help from a qualified attorney.
            </p>
          </div>

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
