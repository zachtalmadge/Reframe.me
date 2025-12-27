import { useEffect, useState } from "react";
import { useSearch, useLocation, Link } from "wouter";
import { Download, Home, AlertTriangle, BookOpen, MessageCircle, FileText, Loader2, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LeaveConfirmationModal } from "@/components/LeaveConfirmationModal";
import { ToolType } from "@/lib/formState";
import { loadResults, NarrativeItem, ResponseLetter, clearResults, GenerationResult, updateResults } from "@/lib/resultsPersistence";
import { loadFormData, clearFormData } from "@/lib/formPersistence";
import { useDocumentActions } from "@/hooks/useDocumentActions";
import { NarrativeCarousel } from "@/components/results/NarrativeCarousel";
import { ResponseLetterPanel } from "@/components/results/ResponseLetterPanel";
import { DocumentSwitcher, DocumentTab } from "@/components/results/DocumentSwitcher";
import { PartialFailureAlert } from "@/components/results/PartialFailureAlert";
import { useToast } from "@/hooks/use-toast";
import { regenerateNarrative, regenerateLetter } from "@/lib/api";
import {
  loadRegenerationCounts,
  saveRegenerationCounts,
  clearRegenerationCounts,
  incrementNarrativeCount,
  incrementLetterCount,
  RegenerationCounts,
  NarrativeType,
} from "@/lib/regenerationPersistence";

function ResultsGuidanceSection({
  hasNarratives,
  hasLetter,
  activeResultType
}: {
  hasNarratives: boolean;
  hasLetter: boolean;
  activeResultType: "narratives" | "letter";
}) {
  if (!hasNarratives && !hasLetter) return null;

  const showNarrativesGuidance = hasNarratives && (!hasLetter || activeResultType === "narratives");
  const showLetterGuidance = hasLetter && (!hasNarratives || activeResultType === "letter");

  return (
    <section
      className="animate-fadeInUp delay-400 opacity-0"
      aria-labelledby="guidance-heading"
      data-testid="section-guidance"
    >
      <div className="space-y-6">
        <div className="text-center space-y-3 py-4">
          <h2
            id="guidance-heading"
            className="text-2xl sm:text-3xl font-bold text-foreground font-fraunces tracking-tight accent-line pb-4"
          >
            How to use what you just created
          </h2>
          <p className="text-sm md:text-base text-muted-foreground font-manrope max-w-2xl mx-auto">
            A few ideas to help you put these materials to work.
          </p>
        </div>

        {showNarrativesGuidance && (
          <div
            className="space-y-4"
            role="tabpanel"
            aria-labelledby="guidance-heading"
            data-testid="guidance-narratives"
          >
            <div className="paper-card rounded-2xl p-6 md:p-8 border border-primary/20 space-y-6 font-manrope">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-3 font-fraunces">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                  <MessageCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                Getting comfortable with your narratives
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">1</span>
                  <span><strong className="text-foreground font-semibold">Practice out loud.</strong> Reading silently is different from speaking. Try saying one version a few times until it feels natural.</span>
                </li>
                <li className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">2</span>
                  <span><strong className="text-foreground font-semibold">Pick your anchor sentences.</strong> You don't need to memorize everything. Choose 1-2 sentences that feel most true to you.</span>
                </li>
                <li className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">3</span>
                  <span><strong className="text-foreground font-semibold">Make it your own.</strong> Edit the wording so it sounds like you. These are starting points, not scripts.</span>
                </li>
                <li className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">4</span>
                  <span><strong className="text-foreground font-semibold">Share with someone you trust.</strong> If it helps, practice with a friend, mentor, or counselor who can give you honest feedback.</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-primary/10">
                <p className="text-sm text-foreground/70 italic pl-4 border-l-2 border-primary/40">
                  Take your time. There's no rush to use these right away. When you're ready, you'll have words that feel prepared, not panicked.
                </p>
              </div>
            </div>
          </div>
        )}

        {showLetterGuidance && (
          <div className="paper-card rounded-2xl p-6 md:p-8 border border-primary/20 space-y-6 font-manrope">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3 font-fraunces">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              Before you send your letter
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  1
                </span>
                <span>
                  <strong className="text-foreground font-semibold">Add anything that feels important. </strong>
                  If you like this letter but want to say more or adjust the wording, copy it into a word-processing document or another AI tool and add your own details in your voice.
                </span>
              </li>
              <li className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  2
                </span>
                <span>
                  <strong className="text-foreground font-semibold">Check for accuracy.</strong> Review dates, names, charges, and employer details. Small errors can undermine your message.
                </span>
              </li>
              <li className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  3
                </span>
                <span>
                  <strong className="text-foreground font-semibold">Make sure it feels honest.</strong> If anything doesn't sit right with you, edit it. You should feel comfortable with every word.
                </span>
              </li>
              <li className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  4
                </span>
                <span>
                  <strong className="text-foreground font-semibold">Get a second opinion if you can.</strong> Consider sharing it with a trusted friend, reentry counselor, or legal aid organization before sending.
                </span>
              </li>
              <li className="flex gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  5
                </span>
                <span>
                  <strong className="text-foreground font-semibold">Know your timeline.</strong> Pre-adverse action notices usually give you a window to respond. Check the deadline on your notice.
                </span>
              </li>
            </ul>
            <div className="pt-4 border-t border-primary/10">
              <p className="text-sm text-foreground/70 italic pl-4 border-l-2 border-primary/40">
                This letter is a tool to help you respond thoughtfully. You deserve to be heard, and taking time to get it right is a sign of strength.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Results() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = (params.get("tool") as ToolType) || "narrative";

  const [narratives, setNarratives] = useState<NarrativeItem[]>([]);
  const [responseLetter, setResponseLetter] = useState<ResponseLetter | null>(null);
  const [status, setStatus] = useState<GenerationResult["status"]>("success");
  const [errors, setErrors] = useState<GenerationResult["errors"]>([]);
  const [activeTab, setActiveTab] = useState<DocumentTab>("narratives");
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const [sessionId, setSessionId] = useState<string>("");
  const [regenCounts, setRegenCounts] = useState<RegenerationCounts | null>(null);
  const [regeneratingType, setRegeneratingType] = useState<NarrativeType | null>(null);
  const [isLetterRegenerating, setIsLetterRegenerating] = useState(false);
  const [narrativeErrors, setNarrativeErrors] = useState<Record<NarrativeType, string | null>>({
    justice_focused_org: null,
    general_employer: null,
    minimal_disclosure: null,
    transformation_focused: null,
    skills_focused: null,
  });
  const [letterError, setLetterError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);

  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [exitDestination, setExitDestination] = useState<"home" | "faq" | null>(null);

  const {
    handleCopyNarrative,
    handleCopyLetter,
    handleDownloadNarrative,
    handleDownloadLetter,
    handleDownloadAll,
  } = useDocumentActions();

  useEffect(() => {
    const MAX_ATTEMPTS = 5;
    const RETRY_DELAY = 150; // ms

    console.log('[Results] Starting load with retry logic');

    const loadWithRetry = async () => {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        try {
          console.log(`[Results] Load attempt ${attempt + 1}/${MAX_ATTEMPTS}`);
          const persisted = loadResults();

          if (persisted) {
            console.log('[Results] Data loaded successfully:', { tool: persisted.tool, narrativesCount: persisted.result.narratives.length });
            // Success - set all data
            setNarratives(persisted.result.narratives);
            setResponseLetter(persisted.result.responseLetter);
            setStatus(persisted.result.status);
            setErrors(persisted.result.errors || []);
            setSessionId(persisted.sessionId);

            const counts = loadRegenerationCounts(persisted.sessionId);
            setRegenCounts(counts);

            if (persisted.tool === "responseLetter" ||
                (persisted.tool === "both" &&
                 persisted.result.narratives.length === 0 &&
                 persisted.result.responseLetter)) {
              setActiveTab("letter");
            }

            setIsLoading(false);
            return;
          }

          // Retry with exponential backoff
          const delay = RETRY_DELAY * Math.pow(1.5, attempt);
          console.log(`[Results] No data found, retrying in ${Math.round(delay)}ms...`);
          setLoadAttempts(attempt + 1);
          if (attempt < MAX_ATTEMPTS - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (e) {
          console.error(`[Results] Load attempt ${attempt + 1} failed:`, e);
        }
      }

      // All retries exhausted - redirect
      console.error('[Results] FAILED to load results after maximum attempts, redirecting to home');
      navigate("/");
    };

    loadWithRetry();
  }, [navigate]);

  const showNarratives = tool === "narrative" || tool === "both";
  const showResponseLetter = tool === "responseLetter" || tool === "both";
  const hasNarratives = showNarratives && narratives.length > 0;
  const hasLetter = showResponseLetter && responseLetter !== null;
  const hasBoth = hasNarratives && hasLetter;

  const handleStartOver = () => {
    clearFormData();
    clearResults();
    clearRegenerationCounts();
    navigate("/");
  };

  const handleLogoClick = () => {
    setExitDestination("home");
    setExitModalOpen(true);
  };

  const handleFaqClick = () => {
    setExitDestination("faq");
    setExitModalOpen(true);
  };

  const handleLearnMoreClick = () => {
    setExitDestination("faq");
    setExitModalOpen(true);
  };

  const handleConfirmExit = () => {
    setExitModalOpen(false);
    clearFormData();
    clearResults();
    clearRegenerationCounts();
    if (exitDestination === "home") {
      navigate("/");
    } else if (exitDestination === "faq") {
      navigate("/faq");
    }
  };

  const handleCancelExit = () => {
    setExitModalOpen(false);
    setExitDestination(null);
  };

  const handleDownloadAllDocuments = () => {
    handleDownloadAll(narratives, responseLetter);
  };

  const handleRetryFailed = () => {
    setIsRetrying(true);
    toast({
      title: "Retry not available yet",
      description: "Regeneration functionality will be added in a future update. Please start over to generate new documents.",
    });
    setTimeout(() => setIsRetrying(false), 1000);
  };

  const handleRegenerateNarrative = async (narrativeType: NarrativeType) => {
    const formData = loadFormData();
    if (!formData) {
      toast({
        title: "Unable to regenerate",
        description: "Form data is no longer available. Please start over.",
        variant: "destructive",
      });
      return;
    }

    setRegeneratingType(narrativeType);
    setNarrativeErrors(prev => ({ ...prev, [narrativeType]: null }));

    const { currentStep, errors: _errors, ...cleanFormData } = formData.formState;
    const response = await regenerateNarrative(narrativeType, cleanFormData);

    if (response.error) {
      setNarrativeErrors(prev => ({ ...prev, [narrativeType]: response.error! }));
      setRegeneratingType(null);
      return;
    }

    if (response.narrative) {
      const updatedNarratives = narratives.map(n => 
        n.type === narrativeType ? response.narrative! : n
      );
      setNarratives(updatedNarratives);

      const updatedResult: GenerationResult = {
        status,
        narratives: updatedNarratives,
        responseLetter,
        errors,
      };
      updateResults(updatedResult);

      const currentCounts = regenCounts || loadRegenerationCounts(sessionId);
      const newCounts = incrementNarrativeCount(currentCounts, narrativeType);
      setRegenCounts(newCounts);
      saveRegenerationCounts(newCounts);

      toast({
        title: "Narrative regenerated",
        description: "Your narrative has been updated with a fresh version.",
      });
    }

    setRegeneratingType(null);
  };

  const handleRegenerateLetter = async () => {
    const formData = loadFormData();
    if (!formData) {
      toast({
        title: "Unable to regenerate",
        description: "Form data is no longer available. Please start over.",
        variant: "destructive",
      });
      return;
    }

    setIsLetterRegenerating(true);
    setLetterError(null);

    const { currentStep, errors: _errors, ...cleanFormData } = formData.formState;
    const response = await regenerateLetter(cleanFormData);

    if (response.error) {
      setLetterError(response.error);
      setIsLetterRegenerating(false);
      return;
    }

    if (response.letter) {
      setResponseLetter(response.letter);

      const updatedResult: GenerationResult = {
        status,
        narratives,
        responseLetter: response.letter,
        errors,
      };
      updateResults(updatedResult);

      const currentCounts = regenCounts || loadRegenerationCounts(sessionId);
      const newCounts = incrementLetterCount(currentCounts);
      setRegenCounts(newCounts);
      saveRegenerationCounts(newCounts);

      toast({
        title: "Letter regenerated",
        description: "Your response letter has been updated with a fresh version.",
      });
    }

    setIsLetterRegenerating(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            Loading your results{loadAttempts > 0 ? ` (attempt ${loadAttempts + 1})` : ''}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 min-h-screen dot-pattern dark:dot-pattern-dark relative overflow-hidden"
        aria-labelledby="results-heading"
      >
        {/* Paper texture overlay */}
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Subtle decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          {/* Disclaimer Card - Refined & Dignified */}
          <div className="relative animate-fadeInUp opacity-0" style={{ animationDelay: '100ms' }}>
            {/* Subtle elevation shadow */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-200 via-orange-100 to-amber-200 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-amber-900/40 rounded-2xl blur-sm opacity-50" />

            {/* Main card with refined border treatment */}
            <div className="relative rounded-2xl border-l-4 border-amber-600 dark:border-amber-500 bg-gradient-to-br from-white via-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:via-amber-950/30 dark:to-orange-950/20 shadow-xl overflow-hidden">

              {/* Subtle grain texture for depth */}
              <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }} />

              {/* Top accent line */}
              <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

              <div className="relative p-6 md:p-8">
                <div className="flex gap-5">
                  {/* Elegant icon treatment */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center border border-amber-300/50 dark:border-amber-700/50 shadow-inner">
                      <AlertTriangle
                        className="w-7 h-7 text-amber-700 dark:text-amber-400"
                        aria-hidden="true"
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Content with refined hierarchy */}
                  <div className="flex-1 space-y-3 font-manrope">
                    <div className="space-y-1.5">
                      {/* Subtle label */}
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent dark:from-amber-700 dark:to-transparent max-w-[60px]" />
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                          Please Note
                        </span>
                      </div>

                      {/* Heading with elegant serif */}
                      <h2 className="text-xl md:text-2xl font-bold text-amber-900 dark:text-amber-100 tracking-tight" style={{ fontFamily: 'Fraunces, Georgia, serif', letterSpacing: '-0.01em' }}>
                        Important Disclaimer
                      </h2>
                    </div>

                    {/* Body text with comfortable reading size */}
                    <p className="text-sm md:text-base text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
                      These documents are personalized tools to help you prepare
                      for employment conversations. They are <span className="font-semibold border-b-2 border-amber-500/40 dark:border-amber-400/40">not legal advice</span>.
                      Please review and customize them to reflect your personal
                      situation before using them with potential employers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Subtle bottom border */}
              <div className="h-px bg-gradient-to-r from-transparent via-amber-300 dark:via-amber-700 to-transparent" />
            </div>
          </div>

          {status === "partial_fail" && errors.length > 0 && (
            <PartialFailureAlert
              errors={errors}
              onRetry={handleRetryFailed}
              isRetrying={isRetrying}
            />
          )}

          {/* Hero Section - Editorial Style */}
          <div className="text-center space-y-6 py-8 animate-fadeInUp delay-100 opacity-0">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-lg ring-1 ring-primary/10 mx-auto paper-card">
              <FileText className="w-10 h-10 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-3 accent-line pb-4">
              <h1
                id="results-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-fraunces tracking-tight"
              >
                Your Documents
                <br />
                <span className="text-primary italic">Are Ready</span>
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-manrope leading-relaxed">
              Review and download your personalized documents below. Take your time—these are yours to refine and use when you're ready.
            </p>
          </div>

          {hasBoth && (
            <div className="flex justify-center">
              <DocumentSwitcher
                activeTab={activeTab}
                onTabChange={setActiveTab}
                hasNarratives={hasNarratives}
                hasLetter={hasLetter}
              />
            </div>
          )}

          <div className="space-y-6">
            {(activeTab === "narratives" || !hasBoth) && hasNarratives && (
              <div data-testid="section-narratives" className="animate-fadeInUp delay-200 opacity-0">
                <NarrativeCarousel
                  narratives={narratives}
                  onCopy={handleCopyNarrative}
                  onDownload={handleDownloadNarrative}
                  onRegenerate={handleRegenerateNarrative}
                  regeneratingType={regeneratingType}
                  regenCounts={regenCounts?.narratives || {} as Record<NarrativeType, number>}
                  regenErrors={narrativeErrors}
                />
              </div>
            )}

            {(activeTab === "letter" || !hasBoth) && hasLetter && responseLetter && (
              <div data-testid="section-letter" className="animate-fadeInUp delay-200 opacity-0">
                <ResponseLetterPanel
                  letter={responseLetter}
                  onCopy={handleCopyLetter}
                  onDownload={handleDownloadLetter}
                  onRegenerate={handleRegenerateLetter}
                  isRegenerating={isLetterRegenerating}
                  regenCount={regenCounts?.letter || 0}
                  regenError={letterError}
                />
              </div>
            )}

            {showNarratives && narratives.length === 0 && !hasLetter && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No narratives were generated. Please try again.
                  </p>
                </CardContent>
              </Card>
            )}

            {showResponseLetter && !responseLetter && !hasNarratives && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No response letter was generated. Please try again.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="pt-8 border-t border-border/30 space-y-6 animate-fadeInUp delay-300 opacity-0">
            {(hasNarratives || hasLetter) && (
              <Button
                size="lg"
                className="w-full group shadow-md hover:shadow-lg transition-all font-manrope"
                onClick={handleDownloadAllDocuments}
                data-testid="button-download-all"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" aria-hidden="true" />
                Download All Documents
              </Button>
            )}

            <div className="paper-card flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-border/30">
              <p className="text-sm font-medium text-muted-foreground text-center sm:text-left font-manrope">
                Need to make changes? You can start over anytime.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleStartOver}
                  className="group border font-manrope"
                  data-testid="button-start-over"
                >
                  <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  Start Over
                </Button>
                <Button
                  className="bg-chart-2 hover:bg-chart-2/90 text-white shadow-md hover:shadow-lg transition-all group font-manrope"
                  onClick={handleLearnMoreClick}
                  data-testid="button-learn-more-results"
                >
                  <BookOpen className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" aria-hidden="true" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout on desktop: "How to use what you created" and "Did this help you?" */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12 mb-8">
            <ResultsGuidanceSection
              hasNarratives={hasNarratives}
              hasLetter={hasLetter}
              activeResultType={activeTab}
            />

            {/* Donation CTA Section - Refined Editorial */}
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
                  </div>
                </div>

                {/* Decorative bottom border accent */}
                <div className="h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              </div>
            </section>
          </div>
        </div>
      </section>

      <LeaveConfirmationModal
        open={exitModalOpen}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
        title="Before you leave this page"
        description="Don't forget to copy or download your results before you leave. We don't want you to lose something important by accident. Once you leave this page, you'll need to start over to generate new narratives or letters."
        warning="⚠️ Make sure you've saved your documents before leaving."
        confirmText="Leave anyway"
        cancelText="Stay on this page"
      />
    </>
  );
}
