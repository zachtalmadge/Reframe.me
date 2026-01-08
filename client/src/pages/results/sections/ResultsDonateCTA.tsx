import { Heart } from "lucide-react";
import { Link } from "wouter";
import { EmailCaptureForm } from "@/components/email-capture/EmailCaptureForm";

export default function ResultsDonateCTA() {
  return (
    <section className="animate-fadeInUp delay-400 opacity-0">
      <div className="paper-card donate-card rounded-3xl border-2 border-orange-100 dark:border-orange-900/30 overflow-hidden h-full flex flex-col">
        {/* Decorative top border accent */}
        <div className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

        <div className="px-6 py-8 md:px-8 md:py-10 flex-1 flex flex-col">
          <div className="max-w-2xl mx-auto text-center space-y-6 flex-1 flex flex-col justify-center">
            {/* Heart icon - subtle and refined */}
            <div className="inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center ring-1 ring-orange-200 dark:ring-orange-800/50">
                <Heart
                  className="w-8 h-8 text-orange-600 dark:text-orange-500"
                  fill="currentColor"
                  style={{ animation: 'gentle-pulse 3s ease-in-out infinite' }}
                />
              </div>
            </div>

            {/* Heading - Editorial typography */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-fraunces leading-tight tracking-tight">
                <span className="italic">Did this help you?</span>
              </h2>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-manrope font-medium">
                Help us keep Reframe.me{' '}
                <span className="font-bold text-orange-600 dark:text-orange-500">free and private</span>{' '}
                for the next person.
              </p>
            </div>

            {/* Description */}
            <div className="max-w-xl mx-auto border-l-2 border-orange-200 dark:border-orange-800/50 pl-4">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-manrope text-left">
                Your support covers AI costs, hosting, and development time—so people with records
                can keep using this tool without ads, tracking, or paywalls.
              </p>
            </div>

            {/* CTA Button - Clean and bold */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/donate">
                <button
                  className="donate-button group px-8 py-4 rounded-xl text-white font-bold text-base shadow-lg overflow-hidden min-w-[220px] font-manrope"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Heart className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" />
                    Support Reframe.me
                  </span>
                </button>
              </Link>
            </div>

            {/* Subtle reassurance */}
            <div className="pt-1">
              <p className="text-xs text-muted-foreground italic font-manrope">
                Whether you can donate or not, this tool is here for you.
              </p>
            </div>

            {/* Email Capture */}
            <div className="pt-6 max-w-md mx-auto">
              <EmailCaptureForm
                source="results"
                variant="default"
                title="Want more tools like this?"
                description="Get occasional templates + guidance for background check moments."
                buttonText="Send me updates"
                privacyLine="We don't store your narrative/letter. Email is only for updates."
              />
            </div>
          </div>
        </div>

        {/* Decorative bottom border accent */}
        <div className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      </div>
    </section>
  );
}
