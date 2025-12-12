import { useEffect, useState, useCallback } from "react";
import { useSearch, useLocation } from "wouter";
import { Loader2, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  ToolType,
  FormState,
  GenerationState,
  initialGenerationState,
  getErrorMessage,
  GenerationErrorType,
} from "@/lib/formState";
import { loadFormData, clearFormData } from "@/lib/formPersistence";
import { saveResults, GenerationResult } from "@/lib/resultsPersistence";
import { DisclaimerModal } from "@/components/disclaimer/DisclaimerModal";
import { LeaveConfirmationModal } from "@/components/LeaveConfirmationModal";

const loadingMessages = [
  "Analyzing your information...",
  "Preparing your documents...",
  "Almost there...",
];

const motivationalQuotes = [
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "I can be changed by what happens to me. But I refuse to be reduced by it.", author: "Maya Angelou" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Challenges are what make life interesting; overcoming them is what makes life meaningful.", author: "Joshua J. Marine" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
];

async function generateDocuments(
  selection: ToolType,
  formData: FormState
): Promise<GenerationResult> {
  const response = await fetch("/api/generate-documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selection,
      formData,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.errors?.[0]?.detail || `Server error: ${response.status}`);
  }

  return response.json();
}

export default function Loading() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = (params.get("tool") as ToolType) || "narrative";

  const [generationState, setGenerationState] = useState<GenerationState>(initialGenerationState);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [showQuotes, setShowQuotes] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [pendingNavTarget, setPendingNavTarget] = useState<string>("/");

  useEffect(() => {
    if (generationState.status !== "loading") return;

    if (messageIndex >= loadingMessages.length - 1) {
      setShowQuotes(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsMessageVisible(false);
      
      setTimeout(() => {
        setMessageIndex((prev) => prev + 1);
        setIsMessageVisible(true);
      }, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [generationState.status, messageIndex]);

  useEffect(() => {
    if (!showQuotes || generationState.status !== "loading") return;

    const timer = setInterval(() => {
      setIsQuoteVisible(false);
      
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
        setIsQuoteVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(timer);
  }, [showQuotes, generationState.status]);

  const startGeneration = useCallback(async () => {
    const persistedData = loadFormData();
    if (!persistedData) {
      navigate(`/form?tool=${tool}`);
      return;
    }

    setGenerationState((prev) => ({
      ...prev,
      status: "loading",
      error: null,
    }));

    try {
      const result = await generateDocuments(tool, persistedData.formState);
      
      if (result.status === "total_fail") {
        throw new Error(result.errors[0]?.detail || "Failed to generate documents");
      }

      saveResults(result, tool);
      
      setGenerationState((prev) => ({
        ...prev,
        status: "success",
      }));
      setShowDisclaimer(true);
    } catch (err) {
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

  const handleDisclaimerContinue = useCallback(() => {
    navigate(`/results?tool=${tool}`);
  }, [navigate, tool]);

  const handleLogoClick = useCallback(() => {
    setPendingNavTarget("/");
    setShowLeaveAlert(true);
  }, []);

  const handleFaqClick = useCallback(() => {
    setPendingNavTarget("/faq");
    setShowLeaveAlert(true);
  }, []);

  const handleConfirmLeave = useCallback(() => {
    clearFormData();
    navigate(pendingNavTarget);
  }, [navigate, pendingNavTarget]);

  const handleCancelLeave = useCallback(() => {
    setShowLeaveAlert(false);
  }, []);

  if (generationState.status === "error") {
    return (
      <Layout onLogoClick={handleLogoClick} onFaqClick={handleFaqClick}>
        <section
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-red-50/50 via-slate-50 to-slate-100/50 dark:from-red-950/20 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden"
          aria-labelledby="error-heading"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-red-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-red-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="max-w-lg mx-auto text-center space-y-8 relative z-10">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-destructive/20 rounded-full animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center shadow-xl ring-4 ring-destructive/20">
                <AlertCircle
                  className="w-12 h-12 text-destructive"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h1
                id="error-heading"
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                We couldn't generate your documents right now
              </h1>
              <p
                className="text-lg md:text-xl text-muted-foreground"
                data-testid="text-error-message"
              >
                {generationState.error?.message}
              </p>
            </div>

            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-6 border-2 border-border/50 shadow-lg">
              <p className="text-base text-muted-foreground font-medium">
                Nothing you entered was lost. Your information is safely saved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={handleRetry}
                size="lg"
                className="group shadow-lg hover:shadow-xl transition-all"
                data-testid="button-retry"
              >
                <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" aria-hidden="true" />
                Try Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleGoBack}
                className="group border-2"
                data-testid="button-go-back"
              >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
                Go back to form
              </Button>
            </div>

            {generationState.retryCount > 2 && (
              <p className="text-sm text-muted-foreground pt-4 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                Still having trouble? Please try again later or contact support if the issue persists.
              </p>
            )}
          </div>
        </section>
        <LeaveConfirmationModal
          open={showLeaveAlert}
          onConfirm={handleConfirmLeave}
          onCancel={handleCancelLeave}
        />
      </Layout>
    );
  }

  return (
    <Layout onLogoClick={handleLogoClick} onFaqClick={handleFaqClick}>
      <section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 25%, #fef3f2 50%, #f0fdfa 75%, #e0f2fe 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 15s ease infinite'
        }}
        aria-labelledby="loading-heading"
      >
        <style>{`
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.3); opacity: 0.2; }
          }

          @keyframes breathe-reverse {
            0%, 100% { transform: scale(1.3); opacity: 0.2; }
            50% { transform: scale(1); opacity: 0.6; }
          }

          @keyframes float-gentle {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
          }

          @keyframes float-gentle-2 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(-40px, 30px) rotate(-120deg); }
            66% { transform: translate(20px, -25px) rotate(-240deg); }
          }

          @keyframes orbit {
            from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
          }

          @keyframes orbit-reverse {
            from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
            to { transform: rotate(-360deg) translateX(60px) rotate(360deg); }
          }

          @keyframes spin-gentle {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Breathing background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
              animation: 'breathe 8s ease-in-out infinite'
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, transparent 70%)',
              animation: 'breathe-reverse 8s ease-in-out infinite'
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
              animation: 'breathe 10s ease-in-out infinite 2s'
            }}
          />
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-10 relative z-10">
          {/* Organic animated loader */}
          <div className="relative w-40 h-40 mx-auto">
            {/* Orbiting particles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ animation: 'orbit 12s linear infinite' }}>
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 shadow-lg" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ animation: 'orbit 12s linear infinite 4s' }}>
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ animation: 'orbit 12s linear infinite 8s' }}>
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 shadow-lg" />
              </div>
            </div>

            {/* Rotating rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ animation: 'orbit-reverse 8s linear infinite' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-teal-300 to-teal-500 shadow-md" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ animation: 'orbit-reverse 8s linear infinite 2.66s' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 shadow-md" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ animation: 'orbit-reverse 8s linear infinite 5.33s' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 shadow-md" />
              </div>
            </div>

            {/* Central breathing orb */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
                  boxShadow: '0 0 60px rgba(20, 184, 166, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.5)',
                  animation: 'breathe 4s ease-in-out infinite'
                }}
              >
                <Loader2
                  className="w-12 h-12 text-teal-600 dark:text-teal-400"
                  aria-hidden="true"
                  style={{ animation: 'spin-gentle 3s linear infinite' }}
                />
              </div>
            </div>

            {/* Floating accent particles */}
            <div
              className="absolute top-0 left-0 w-4 h-4 rounded-full bg-gradient-to-br from-teal-200 to-teal-400 opacity-60"
              style={{ animation: 'float-gentle 20s ease-in-out infinite' }}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-gradient-to-br from-orange-200 to-orange-400 opacity-60"
              style={{ animation: 'float-gentle-2 15s ease-in-out infinite' }}
            />
          </div>

          <div className="space-y-8">
            <h1
              id="loading-heading"
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 via-sky-600 to-orange-600 bg-clip-text text-transparent pb-2"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}
            >
              Generating Your Documents
            </h1>
            <div
              className="rounded-3xl p-6 backdrop-blur-sm mt-8"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(240, 253, 250, 0.7) 100%)',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                boxShadow: '0 8px 32px rgba(20, 184, 166, 0.1)'
              }}
            >
              <p
                className={`text-xl md:text-2xl font-medium bg-gradient-to-r from-teal-700 to-sky-700 bg-clip-text text-transparent transition-opacity duration-300 ${
                  isMessageVisible ? "opacity-100" : "opacity-0"
                }`}
                data-testid="text-loading-message"
                aria-live="polite"
              >
                {loadingMessages[messageIndex]}
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showQuotes ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            }`}
            aria-hidden="true"
          >
            <div
              className="rounded-3xl p-8 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(224, 242, 254, 0.5) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                boxShadow: '0 8px 32px rgba(56, 189, 248, 0.1)'
              }}
            >
              <div className="relative">
                <span className="absolute -top-6 -left-4 text-6xl bg-gradient-to-br from-teal-400 to-sky-400 bg-clip-text text-transparent font-serif opacity-30">"</span>
                <p
                  className={`text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed transition-opacity duration-300 ${
                    isQuoteVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                  data-testid="text-motivational-quote"
                >
                  {motivationalQuotes[quoteIndex].text}
                </p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
                  <p
                    className={`text-base text-gray-600 dark:text-gray-400 font-medium transition-opacity duration-300 ${
                      isQuoteVisible ? "opacity-100" : "opacity-0"
                    }`}
                    data-testid="text-quote-author"
                  >
                    {motivationalQuotes[quoteIndex].author}
                  </p>
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 253, 250, 0.8) 100%)',
                border: '1px solid rgba(20, 184, 166, 0.3)',
                boxShadow: '0 4px 16px rgba(20, 184, 166, 0.15)'
              }}
            >
              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
                    animation: 'breathe 1.5s ease-in-out infinite'
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
                    animation: 'breathe 1.5s ease-in-out infinite 0.5s'
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
                    animation: 'breathe 1.5s ease-in-out infinite 1s'
                  }}
                />
              </div>
              <p className="text-sm font-medium text-teal-700">
                This usually takes just a few seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      <DisclaimerModal
        open={showDisclaimer}
        onContinue={handleDisclaimerContinue}
      />

      <LeaveConfirmationModal
        open={showLeaveAlert}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
    </Layout>
  );
}
