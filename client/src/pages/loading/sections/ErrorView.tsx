import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorViewProps {
  errorMessage: string | undefined;
  retryCount: number;
  onRetry: () => void;
  onGoBack: () => void;
}

export function ErrorView({ errorMessage, retryCount, onRetry, onGoBack }: ErrorViewProps) {
  return (
    <section
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fef3f2 0%, #fefaf8 50%, #fef2f2 100%)'
      }}
      aria-labelledby="error-heading"
    >
      {/* Organic background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Floating accent shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-10" style={{
        background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)',
        animation: 'error-float 6s ease-in-out infinite'
      }} />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full opacity-10" style={{
        background: 'radial-gradient(circle, #ea580c 0%, transparent 70%)',
        animation: 'error-float 8s ease-in-out infinite',
        animationDelay: '1s'
      }} />

      <div className="max-w-2xl mx-auto text-center space-y-10 relative z-10">
        {/* Error icon with organic treatment */}
        <div className="relative inline-block" style={{ animation: 'error-pulse-glow 3s ease-in-out infinite' }}>
          <div className="relative">
            {/* Layered backgrounds for depth */}
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-60" />
            <div className="absolute inset-0 bg-red-200 rounded-full blur-lg opacity-40" style={{ transform: 'scale(0.85)' }} />

            {/* Main icon container */}
            <div className="relative w-28 h-28 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #fca5a5 0%, #dc2626 100%)',
              boxShadow: '0 10px 40px rgba(220, 38, 38, 0.25), inset 0 -2px 10px rgba(0,0,0,0.1)'
            }}>
              <AlertCircle className="w-16 h-16 text-white" strokeWidth={2.5} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Heading with editorial styling */}
        <div className="space-y-5">
          <h1
            id="error-heading"
            className="error-serif text-3xl md:text-5xl font-bold"
            style={{
              color: '#7c2d12',
              lineHeight: '1.15'
            }}
          >
            Something didn't work
          </h1>
          <div className="w-16 h-1 mx-auto rounded-full" style={{
            background: 'linear-gradient(90deg, transparent 0%, #dc2626 50%, transparent 100%)'
          }} />
          <p
            className="error-sans text-lg md:text-xl font-semibold"
            style={{ color: '#9a3412' }}
            data-testid="text-error-message"
          >
            {errorMessage}
          </p>
        </div>

        {/* Reassurance card with texture */}
        <div className="relative rounded-3xl overflow-hidden p-8" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,243,199,0.8) 100%)',
          border: '2px solid rgba(217, 119, 6, 0.15)',
          boxShadow: '0 8px 32px rgba(217, 119, 6, 0.08)'
        }}>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 2.5a17.5 17.5 0 1 0 0 35 17.5 17.5 0 0 0 0-35z' fill='%23d97706' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }} />

          <p className="error-sans text-base md:text-lg font-bold relative z-10" style={{ color: '#78350f' }}>
            Your information is safe
          </p>
          <p className="error-sans text-sm md:text-base mt-2 relative z-10" style={{ color: '#92400e' }}>
            Nothing you entered was lost. Everything is saved.
          </p>
        </div>

        {/* Action buttons with warmth */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={onRetry}
            size="lg"
            className="group error-sans font-bold text-base px-8 py-6 rounded-2xl transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)',
              border: 'none'
            }}
            data-testid="button-retry"
          >
            <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-700" aria-hidden="true" />
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onGoBack}
            className="group error-sans font-bold text-base px-8 py-6 rounded-2xl transition-all duration-300"
            style={{
              borderWidth: '2px',
              borderColor: '#dc2626',
              color: '#dc2626',
              background: 'transparent'
            }}
            data-testid="button-go-back"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
            Back to Form
          </Button>
        </div>

        {retryCount > 2 && (
          <div className="rounded-2xl p-6 mt-6" style={{
            background: 'rgba(254, 243, 199, 0.4)',
            border: '1.5px solid rgba(217, 119, 6, 0.3)'
          }}>
            <p className="error-sans text-sm font-semibold" style={{ color: '#92400e' }}>
              Still having trouble? Please try again later or contact support if the issue persists.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
