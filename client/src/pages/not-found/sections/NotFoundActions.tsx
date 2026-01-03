import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundActions() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => {
      requestAnimationFrame(() => {
        setMounted(true);
      });
    }, 300);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Primary CTA - Back to Home */}
          <Link href="/">
            <Button
              size="lg"
              className="group relative min-h-[56px] px-10 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 overflow-hidden w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                color: 'white',
                boxShadow: '0 10px 40px rgba(249, 115, 22, 0.4), 0 0 60px rgba(249, 115, 22, 0.15)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2.5">
                <Home className="w-5 h-5" aria-hidden="true" />
                Back to Home
              </span>
              {/* Shine effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                }}
                aria-hidden="true"
              />
            </Button>
          </Link>

          {/* Secondary action - Go Back */}
          <Button
            onClick={handleGoBack}
            variant="outline"
            size="lg"
            className="group min-h-[56px] px-10 text-lg font-semibold rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            <span className="flex items-center gap-2.5">
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
              Go Back
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
