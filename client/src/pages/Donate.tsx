import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Shield,
  Sparkles,
  Users,
  Lock,
  Share2,
  MessageSquare,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { DonateStyles } from "./donate/sections/DonateStyles";
import { DonateHeroSection } from "./donate/sections/DonateHeroSection";
import { DonatePaymentSection } from "./donate/sections/DonatePaymentSection";
import { DonateSupportMattersSection } from "./donate/sections/DonateSupportMattersSection";
import { DonateTransparencySection } from "./donate/sections/DonateTransparencySection";
import { DonateBackToTopButton } from "./donate/sections/DonateBackToTopButton";

export default function Donate() {
  const qrSectionRef = useRef<HTMLElement>(null);
  const transparencySectionRef = useRef<HTMLElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToQR = () => {
    qrSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTransparency = () => {
    transparencySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: "Do you sell or share my information?",
      answer:
        "No. Donations don't change how your data is handled. The goal is to keep this tool as safe and respectful as possible for people with records.",
    },
    {
      question: "Can organizations support this?",
      answer:
        "Yes. Re-entry programs, legal clinics, or employers who want to sponsor usage or collaborate can reach out for partnership options.",
    },
  ];

  return (
    <>
      <div style={{ overflowX: 'hidden', width: '100%', position: 'relative' }}>

       {/* Page-specific Donate styles */}
       <DonateStyles /> 


      {/* Hero Section */}
      <DonateHeroSection
        scrollToQR={scrollToQR}
        scrollToTransparency={scrollToTransparency}
      />

      {/* Payment Section */}
      <DonatePaymentSection ref={qrSectionRef} />

      {/* Why Your Support Matters - Asymmetric Grid */}
      <DonateSupportMattersSection />

      {/* Transparency Section - Editorial Style */}
      <DonateTransparencySection ref={transparencySectionRef} />


      {/* Why This Work Matters - Testimonial with Impact */}
      <section className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden dot-pattern dark:dot-pattern-dark">
        <div className="grain-overlay" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-12 px-4">
            <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8" style={{ paddingBottom: '0.25rem' }}>
              Why this work <span className="text-gradient-warm italic">matters</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-medium">
              Talking about a record with an employer can be one of the hardest parts of a job search.
              Many people don't have a lawyer, career coach, or mentor to help them find the words.
              Reframe.me gives them a starting point — language they can edit, practice, and make their
              own so they can walk into conversations a little more prepared and a little less alone.
            </p>
          </div>

          <div className="relative mt-16 p-12 md:p-16 rounded-3xl shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
              border: '3px solid #14b8a6',
            }}
          >
            <div className="absolute top-8 left-8 text-9xl display-font text-teal-200/40 leading-none pointer-events-none" style={{ fontStyle: 'italic' }}>"</div>
            <div className="absolute bottom-8 right-8 text-9xl display-font text-teal-200/40 leading-none pointer-events-none rotate-180" style={{ fontStyle: 'italic' }}>"</div>
            <div className="absolute -right-20 -top-20 w-64 h-64 organic-blob bg-teal-200/20 blur-3xl" />
            <div className="relative z-10">
              <p className="display-font text-2xl md:text-3xl italic text-gray-800 leading-relaxed text-center mb-6">
                "My client said this was the first time they saw their story written in a way that
                didn't shame them. It helped them feel ready to respond instead of shutting down."
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-0.5 bg-teal-400" />
                <p className="text-base font-semibold text-teal-700 tracking-wide">
                  Re-entry coach, anonymized
                </p>
                <div className="w-12 h-0.5 bg-teal-400" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Why This Work Matters - Testimonial with Impact */}


      {/* Privacy & Data Reassurance */}
      <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 dot-pattern dark:dot-pattern-dark">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 mb-8 shadow-xl">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ paddingBottom: '0.25rem' }}>
              Your data and your donation are <span className="text-gradient-warm italic">separate</span>
            </h2>
          </div>

          <div className="space-y-5 max-w-2xl mx-auto mb-12">
            {[
              "Reframe.me does not tie your donation to your narrative or letter content.",
              "The app is designed to avoid long-term storage of sensitive answers.",
              "Payment info stays with the payment platform; the tool itself doesn't track your card or bank details.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-teal-50/50 transition-colors">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 mt-2 flex-shrink-0 shadow-md" />
                <p className="text-lg text-gray-700 leading-relaxed font-medium">{text}</p>
              </div>
            ))}
          </div>

          <div className="relative p-8 rounded-2xl overflow-hidden shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)',
              border: '2px solid #14b8a6',
            }}
          >
            <div className="absolute -right-12 -bottom-12 w-48 h-48 organic-blob bg-teal-200/20" />
            <p className="relative text-lg font-bold text-center text-teal-900">
              Donations support the tool — not data collection. What you type into Reframe.me is not linked to your contribution.
            </p>
          </div>
        </div>
      </section>
      {/* End Privacy & Data Reassurance */}


      {/* FAQ Section - Modern Accordion */}
      <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 dot-pattern dark:dot-pattern-dark">
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-14 px-4">
            <div className="w-16 h-1 shimmer-gradient rounded-full mx-auto mb-8" />
            <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ paddingBottom: '0.25rem' }}>
              Questions & <span className="text-gradient-warm italic">Answers</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="faq-item rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-md"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-7 text-left hover:bg-gray-50 transition-colors group"
                  aria-expanded={openFaq === index}
                >
                  <span className="text-xl font-bold text-gray-900 pr-4 display-font">{item.question}</span>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <ChevronDown
                      className={`w-5 h-5 text-white transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="px-7 pb-7 pt-2 bg-gradient-to-br from-teal-50/30 to-transparent">
                    <p className="text-lg text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* End FAQ Section - Modern Accordion */}


      {/* Other Ways to Support */}
      <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 overflow-hidden dot-pattern dark:dot-pattern-dark">
        <div className="grain-overlay" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14 px-4">
            <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ paddingBottom: '0.25rem' }}>
              Other ways to <span className="text-gradient-warm italic">support</span>
            </h2>
            <p className="text-xl text-gray-600 font-medium">For folks who can't give money</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Share2,
                text: "Share Reframe.me with a re-entry coach, legal aid group, or workforce program.",
                color: "teal",
              },
              {
                icon: MessageSquare,
                text: "Send feedback about what's confusing or what would make this more helpful.",
                color: "orange",
              },
              {
                icon: Briefcase,
                text: "If you work in hiring, consider how fair-chance practices and tools like this can be part of your process.",
                color: "purple",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="card-3d border-0 shadow-xl overflow-hidden bg-white hover:shadow-2xl"
              >
                <CardContent className="p-8 text-center space-y-6 relative">
                  <div className={`absolute -right-8 -bottom-8 w-32 h-32 organic-blob opacity-20`}
                    style={{
                      background: `radial-gradient(circle, ${item.color === 'teal' ? '#14b8a6' : item.color === 'orange' ? '#f97316' : item.color === 'purple' ? '#8b5cf6' : '#06b6d4'} 0%, transparent 70%)`,
                    }}
                  />
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br shadow-lg"
                    style={{
                      background: item.color === 'teal' ? 'linear-gradient(135deg, #14b8a6, #0d9488)' : item.color === 'orange' ? 'linear-gradient(135deg, #f97316, #fb923c)' : item.color === 'purple' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    }}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="relative text-base text-gray-700 leading-relaxed font-medium">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* End Other Ways to Support */}


      {/* Closing CTA - Emotional Impact */}
      <section className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden dot-pattern dark:dot-pattern-dark">
        <div className="grain-overlay" />

        <div className="relative max-w-4xl mx-auto text-center space-y-12">
          <p className="display-font text-3xl md:text-4xl italic text-gray-800 leading-relaxed">
            If Reframe.me has helped you or someone you care about and you're in a position to give,{' '} 
            <span className="text-gradient-warm font-bold"> thank you</span>. If you're not able to donate, you're still exactly who this tool is for.
          </p>

          <Button
            onClick={scrollToQR}
            size="lg"
            className="group relative min-h-[64px] px-14 text-xl font-bold shadow-2xl transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
              color: 'white',
              borderRadius: '16px',
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Support Reframe.me
              <Heart className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" fill="white" />
            </span>
          </Button>
        </div>
      </section>
      {/* End Closing CTA - Emotional Impact */}

      </div>
      {/* End overflow div line 71 */}

      <DonateBackToTopButton />
    </>
  );
}
