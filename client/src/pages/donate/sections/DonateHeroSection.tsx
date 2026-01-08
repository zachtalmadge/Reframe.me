import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { EmailCaptureForm } from "@/components/email-capture/EmailCaptureForm";

interface DonateHeroSectionProps {
  scrollToQR: () => void;
  scrollToTransparency: () => void;
}

export function DonateHeroSection({
  scrollToQR,
  scrollToTransparency,
}: DonateHeroSectionProps) {
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      setHeroMounted(true);
    });
  }, []);

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a7e72 0%, #0d9488 30%, #f97316 100%)',
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 organic-blob opacity-20"
          style={{
            background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 organic-blob opacity-15"
          style={{
            background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10"
          style={{
            background: 'radial-gradient(circle, #ffffff 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="grain-overlay" />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-10">
        {/* Heart icon */}
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-md shadow-2xl border-2 border-white/30 transition-all duration-700 ease-out ${
            heroMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <Heart className="w-12 h-12 text-white" fill="white" />
        </div>

        <div className="space-y-8">
          <h1
            className={`display-font text-3xl md:text-5xl lg:text-7xl font-bold text-white transition-all duration-700 ease-out ${
              heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.2)',
              letterSpacing: '-0.02em',
              transitionDelay: '200ms',
              lineHeight: '1.1',
              paddingBottom: '0.5rem'
            }}
          >
            Help more people find
            <br />
            <span className="italic" style={{ fontStyle: 'italic' }}>the words</span> to talk
            <br />
            about their past
          </h1>

          <div
            className={`flex justify-center pt-4 transition-all duration-700 ease-out ${
              heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <Button
              onClick={scrollToQR}
              size="lg"
              className="group relative min-h-[64px] px-12 text-xl font-bold shadow-2xl transition-all duration-500 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
                color: 'white',
                borderRadius: '16px',
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Support Reframe.me
                <Heart className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                }}
              />
            </Button>
          </div>

          <p
            className={`text-xl md:text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto font-medium transition-all duration-700 ease-out ${
              heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            Reframe.me is built to help people with records share their story in a way that's
            honest, safe, and focused on growth. Your support helps keep it free, privacy-first,
            and improving over time.
          </p>

          <div
            className={`flex justify-center pt-2 transition-all duration-700 ease-out ${
              heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <button
              onClick={scrollToTransparency}
              className="text-white hover:text-white/80 font-semibold text-lg underline decoration-2 underline-offset-8 hover:underline-offset-4 transition-all duration-300"
            >
              How your support is used
            </button>
          </div>

          {/* Email Capture */}
          <div
            className={`max-w-md mx-auto pt-8 transition-all duration-700 ease-out ${
              heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: '1000ms' }}
          >
            <EmailCaptureForm
              source="donate"
              variant="default"
              title="Support the work + stay updated"
              description="We'll share progress, impact, and new tools."
              buttonText="Get updates"
              className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
