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
import { DonateOtherWaysSection } from "./donate/sections/DonateOtherWaysSection";
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
      <DonateOtherWaysSection />


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
