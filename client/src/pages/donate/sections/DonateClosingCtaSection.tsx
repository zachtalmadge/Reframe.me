import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface DonateClosingCtaSectionProps {
  scrollToQR: () => void;
}

export function DonateClosingCtaSection({ scrollToQR }: DonateClosingCtaSectionProps) {
  return (
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
  );
}
