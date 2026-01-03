import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FaqCtaSection() {
  return (
    <div className="relative rounded-3xl p-10 md:p-14 text-center overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 shadow-[0_20px_70px_rgba(20,184,166,0.35)]">
      <div className="absolute inset-0 gradient-shimmer opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 space-y-8">
        <div className="space-y-5">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
            style={{ fontFamily: 'Fraunces, Georgia, serif', letterSpacing: '-0.03em' }}
          >
            Ready to Get Started?
          </h2>
          <p className="text-teal-50 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
            Create your personalized narratives and response letters in minutes. Free, private, and designed for your success.
          </p>
        </div>

        <Link href="/selection">
          <Button
            size="lg"
            className="group min-h-[64px] mt-6 px-12 text-xl font-bold shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white border-2 border-orange-400/30 hover:border-orange-300/50"
            data-testid="button-get-started-faq"
          >
            Begin Your Journey
            <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" strokeWidth={2.5} />
          </Button>
        </Link>

        <p className="text-base md:text-lg text-teal-50 font-medium">
          No account required • Completely free • Takes 10-15 minutes
        </p>
      </div>
    </div>
  );
}
