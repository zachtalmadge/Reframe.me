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
import { DonateTestimonialSection } from "./donate/sections/DonateTestimonialSection";
import { DonatePrivacySection } from "./donate/sections/DonatePrivacySection";
import { DonateFaqSection } from "./donate/sections/DonateFaqSection";
import { DonateBackToTopButton } from "./donate/sections/DonateBackToTopButton";

export default function Donate() {
  const qrSectionRef = useRef<HTMLElement>(null);
  const transparencySectionRef = useRef<HTMLElement>(null);

  const scrollToQR = () => {
    qrSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTransparency = () => {
    transparencySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      <DonateTestimonialSection />

      {/* Privacy & Data Reassurance */}
      <DonatePrivacySection />

      {/* FAQ Section - Modern Accordion */}
      <DonateFaqSection />


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

      <DonateBackToTopButton />
    </>
  );
}
