import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FaqCtaSection() {
  return (
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
  );
}
