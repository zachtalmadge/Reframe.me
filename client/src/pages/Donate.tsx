import { useRef } from "react";
import { DonateStyles } from "./donate/sections/DonateStyles";
import { DonateHeroSection } from "./donate/sections/DonateHeroSection";
import { DonatePaymentSection } from "./donate/sections/DonatePaymentSection";
import { DonateSupportMattersSection } from "./donate/sections/DonateSupportMattersSection";
import { DonateTransparencySection } from "./donate/sections/DonateTransparencySection";
import { DonateTestimonialSection } from "./donate/sections/DonateTestimonialSection";
import { DonatePrivacySection } from "./donate/sections/DonatePrivacySection";
import { DonateFaqSection } from "./donate/sections/DonateFaqSection";
import { DonateOtherWaysSection } from "./donate/sections/DonateOtherWaysSection";
import { DonateClosingCtaSection } from "./donate/sections/DonateClosingCtaSection";
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
      <DonateClosingCtaSection scrollToQR={scrollToQR} />

      </div>

      <DonateBackToTopButton />
    </>
  );
}
