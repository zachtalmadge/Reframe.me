import { useEffect, useState, useCallback } from "react";
import { useSearch, useLocation } from "wouter";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ToolType,
  FormState,
  GenerationState,
  initialGenerationState,
  getErrorMessage,
  GenerationErrorType,
} from "@/lib/formState";
import { loadFormData, clearFormData } from "@/lib/formPersistence";
import { saveResults, loadResults, GenerationResult } from "@/lib/resultsPersistence";
import { DisclaimerModal } from "@/components/disclaimer/DisclaimerModal";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { generateDocuments } from "./loading/utils/generateDocuments";
import { useMessageCycle } from "./loading/hooks/useMessageCycle";
import { useQuoteCycle } from "./loading/hooks/useQuoteCycle";
import { loadingMessages, motivationalQuotes } from "./loading/data/loadingContent";
import "./loading/styles/loading.css";
import "./loading/styles/error.css";

export default function Loading() {
  // Register this page as protected from navigation
  useProtectedPage();

  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = (params.get("tool") as ToolType) || "narrative";

  const [generationState, setGenerationState] = useState<GenerationState>(initialGenerationState);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Message cycling with proper timer cleanup
  const { messageIndex, isMessageVisible, showQuotes } = useMessageCycle(
    generationState.status === "loading",
    loadingMessages
  );

  // Quote cycling with proper timer cleanup
  const { quoteIndex, isQuoteVisible } = useQuoteCycle(
    showQuotes,
    generationState.status === "loading",
    motivationalQuotes.length
  );

  const startGeneration = useCallback(async () => {
    // Detect mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    console.log('[Loading] Starting generation', { tool, isMobile });

    const persistedData = loadFormData();
    if (!persistedData) {
      console.error('[Loading] No persisted form data found, redirecting to form');
      navigate(`/form?tool=${tool}`);
      return;
    }

    console.log('[Loading] Form data loaded successfully');

    setGenerationState((prev) => ({
      ...prev,
      status: "loading",
      error: null,
    }));

    /**
     * WORKAROUND: Automatic silent retry on all devices
     *
     * Problem: Document generation fails on first attempt but succeeds on second attempt.
     * This happens on:
     * - Mobile browsers (especially iOS Safari) - sessionStorage writes or network/API initialization timing
     * - Desktop on first load after deployment - serverless cold start / OpenAI client initialization
     *
     * Solution: Automatically retry once without showing error to user. This makes the failure
     * invisible - user sees continuous loading animation while we retry in background.
     *
     * Root causes:
     * - Server side: OpenAI client lazy initialization on cold start (first request after deploy)
     * - Client side: sessionStorage timing issues on mobile Safari
     *
     * TODO: Fix root causes:
     * - Server: Pre-warm OpenAI client on server startup instead of lazy loading
     * - Client: Investigate sessionStorage write delays and consider alternative storage
     * - Review AppInitializer timing and route protection logic
     *
     * To test if still needed: Set maxAttempts to 1 and test on fresh deployment
     */
    const maxAttempts = 2; // Apply retry to all devices for cold-start resilience
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`[Loading] WORKAROUND: Silent retry attempt ${attempt}/${maxAttempts} (cold-start protection)`);
          // Small delay before retry to let any timing issues resolve
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        const timeout = isMobile ? 90000 : 60000; // 90s mobile, 60s desktop
        console.log('[Loading] Calling generateDocuments with timeout:', timeout);

        const result = await generateDocuments(tool, persistedData.formState, timeout);
        console.log('[Loading] Generation result:', result.status);

        if (result.status === "total_fail") {
          throw new Error(result.errors[0]?.detail || "Failed to generate documents");
        }

        console.log('[Loading] Saving results to sessionStorage');
        const saveResult = saveResults(result, tool);
        if (!saveResult.success) {
          console.error('[Loading] Failed to save results:', saveResult.error);
          // Still continue to show disclaimer - data is in memory
        } else {
          console.log('[Loading] Results saved successfully');
        }

        // On mobile, add delay and verify save completed before proceeding
        if (isMobile) {
          console.log('[Loading] Mobile detected, waiting 150ms for storage stabilization');
          await new Promise(resolve => setTimeout(resolve, 150));

          // Verify the save actually worked
          const verification = loadResults();
          if (!verification) {
            console.error('[Loading] Save verification FAILED on mobile, retrying save...');
            saveResults(result, tool);
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify again
            const secondVerification = loadResults();
            if (!secondVerification) {
              console.error('[Loading] Second save verification FAILED! Data may be lost.');
            } else {
              console.log('[Loading] Second save successful');
            }
          } else {
            console.log('[Loading] Save verification successful');
          }
        }

        console.log('[Loading] Setting success state and showing disclaimer');
        setGenerationState((prev) => ({
          ...prev,
          status: "success",
        }));
        setShowDisclaimer(true);

        // SUCCESS - break out of retry loop
        return;

      } catch (err) {
        console.error(`[Loading] Generation error on attempt ${attempt}/${maxAttempts}:`, err);
        lastError = err as Error;

        // If this was our last attempt, show the error
        if (attempt === maxAttempts) {
          let errorType: GenerationErrorType = "unknown";

          if (err instanceof Error) {
            if (err.message.includes("network") || err.message.includes("fetch") || err.message.includes("Failed to fetch")) {
              errorType = "network";
            } else if (err.message.includes("timeout")) {
              errorType = "timeout";
            } else if (err.message.includes("500") || err.message.includes("server") || err.message.includes("Server error")) {
              errorType = "server";
            }
          }

          setGenerationState((prev) => ({
            status: "error",
            error: {
              type: errorType,
              message: getErrorMessage(errorType),
            },
            retryCount: prev.retryCount + 1,
          }));
        }
        // If not last attempt, continue loop for silent retry
      }
    }
  }, [navigate, tool]);

  useEffect(() => {
    startGeneration();
  }, []);

  const handleRetry = useCallback(() => {
    setMessageIndex(0);
    setIsMessageVisible(true);
    setShowQuotes(false);
    setQuoteIndex(0);
    setIsQuoteVisible(true);
    startGeneration();
  }, [startGeneration]);

  const handleGoBack = useCallback(() => {
    navigate(`/form?tool=${tool}`);
  }, [navigate, tool]);

  const handleDisclaimerContinue = () => {
    navigate(`/results?tool=${tool}`);
  };

  if (generationState.status === "error") {
    return (
      <>
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
                {generationState.error?.message}
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
                onClick={handleRetry}
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
                onClick={handleGoBack}
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

            {generationState.retryCount > 2 && (
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
      </>
    );
  }

  return (
    <>
      <section
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, #fdfcfb 0%, #fef9f3 30%, #fef6ee 60%, #fefaf8 100%)'
        }}
        aria-labelledby="loading-heading"
      >
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} />

        {/* Animated ink blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="ink-blob" />
          <div className="ink-blob" />
          <div className="ink-blob" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Main loading visualization - organic breathing orbs */}
          <div className="flex items-center justify-center mb-16 md:mb-20 pt-8">
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              {/* Outer ripple rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="ripple-ring w-full h-full rounded-full border-2"
                  style={{
                    borderColor: 'rgba(13, 148, 136, 0.2)',
                    animationDelay: '0s'
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="ripple-ring w-full h-full rounded-full border-2"
                  style={{
                    borderColor: 'rgba(13, 148, 136, 0.2)',
                    animationDelay: '1.7s'
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="ripple-ring w-full h-full rounded-full border-2"
                  style={{
                    borderColor: 'rgba(249, 115, 22, 0.15)',
                    animationDelay: '3.4s'
                  }}
                />
              </div>

              {/* Central breathing orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="breathing-circle w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, rgba(13, 148, 136, 0.08) 60%, transparent 100%)',
                    boxShadow: '0 0 60px rgba(13, 148, 136, 0.15), inset 0 0 30px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(13, 148, 136, 0.25) 100%)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: 'inset 0 2px 8px rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, #14b8a6 0%, #0d9488 100%)',
                        boxShadow: '0 4px 16px rgba(13, 148, 136, 0.4)',
                        animation: 'breathe-in-out 4s ease-in-out infinite'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content area with editorial spacing */}
          <div className="space-y-12 md:space-y-14">
            {/* Main heading */}
            <div className="text-center space-y-6">
              <h1
                id="loading-heading"
                className="loading-serif text-3xl md:text-5xl lg:text-6xl font-bold"
                style={{
                  color: '#0f766e',
                  lineHeight: '1.1',
                  textShadow: '0 2px 4px rgba(13, 148, 136, 0.1)'
                }}
              >
                Crafting your{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  story
                </span>
              </h1>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, #0d9488 100%)'
                  }}
                />
                <div className="w-2 h-2 rounded-full"
                  style={{ background: '#f97316' }}
                />
                <div className="w-12 h-px"
                  style={{
                    background: 'linear-gradient(90deg, #0d9488 0%, transparent 100%)'
                  }}
                />
              </div>
            </div>

            {/* Status message card */}
            <div className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(254,252,232,0.6) 100%)',
                border: '1.5px solid rgba(13, 148, 136, 0.15)',
                boxShadow: '0 8px 32px rgba(13, 148, 136, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
            >
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230d9488' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              />

              <div className="relative z-10 p-10 md:p-12">
                <p
                  className={`loading-sans text-xl md:text-2xl font-bold text-center transition-all duration-700 ${
                    isMessageVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    color: '#115e59'
                  }}
                  data-testid="text-loading-message"
                  aria-live="polite"
                >
                  {loadingMessages[messageIndex]}
                </p>
              </div>
            </div>

            {/* Motivational quotes section */}
            <div
              className={`transition-all duration-700 ease-in-out ${
                showQuotes ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
              aria-hidden="true"
            >
              <div className="relative rounded-3xl overflow-hidden p-10 md:p-14"
                style={{
                  background: 'linear-gradient(135deg, rgba(254,252,232,0.5) 0%, rgba(255,255,255,0.8) 50%, rgba(254,243,199,0.4) 100%)',
                  border: '1.5px solid rgba(249, 115, 22, 0.12)',
                  boxShadow: '0 12px 40px rgba(249, 115, 22, 0.08)'
                }}
              >
                {/* Quote marks decoration */}
                <div className="absolute top-6 left-6 text-6xl md:text-7xl opacity-10 loading-serif"
                  style={{ color: '#ea580c' }}
                >
                  "
                </div>

                <div className="relative space-y-8">
                  <div className="w-20 h-0.5 mx-auto rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, #f97316 50%, transparent 100%)'
                    }}
                  />

                  <blockquote
                    className={`loading-serif italic text-xl md:text-2xl lg:text-3xl leading-relaxed text-center transition-all duration-700 flex items-center justify-center ${
                      isQuoteVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                    style={{
                      color: '#78350f',
                      lineHeight: '1.6',
                      minHeight: '140px'
                    }}
                    data-testid="text-motivational-quote"
                  >
                    <span>{motivationalQuotes[quoteIndex].text}</span>
                  </blockquote>

                  <p
                    className={`loading-sans text-base md:text-lg font-bold text-center transition-all duration-700 ${
                      isQuoteVisible ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      color: '#92400e',
                      letterSpacing: '0.05em'
                    }}
                    data-testid="text-quote-author"
                  >
                    — {motivationalQuotes[quoteIndex].author}
                  </p>

                  <div className="w-20 h-0.5 mx-auto rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, #f97316 50%, transparent 100%)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Subtle timing note */}
            <div className="text-center pt-4">
              <p className="loading-sans text-sm font-semibold tracking-wide"
                style={{
                  color: '#64748b',
                  opacity: 0.7
                }}
              >
                This usually takes just a few moments
              </p>
            </div>
          </div>
        </div>
      </section>

      <DisclaimerModal
        open={showDisclaimer}
        onContinue={handleDisclaimerContinue}
      />
    </>
  );
}
