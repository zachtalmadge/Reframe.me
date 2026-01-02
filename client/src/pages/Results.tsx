/**
 * Results Page - Display Generated Documents
 *
 * This page displays the AI-generated disclosure narratives and/or pre-adverse
 * action response letter after successful generation. It provides:
 * - Document viewing (narratives and/or letter based on tool type)
 * - Copy/download functionality for all documents
 * - Regeneration (up to 3 times per document type)
 * - Guidance on how to use the generated content
 * - Exit confirmation to prevent accidental data loss
 *
 * ARCHITECTURE:
 * This page uses a facade pattern to reduce complexity. The useResultsPage()
 * hook composes all business logic and returns a clean, grouped API:
 *   - results.ui: Loading state, tabs, visibility flags
 *   - results.data: Narratives, letter, status, errors, regen counts
 *   - results.actions: All user actions (copy, download, regenerate, exit)
 *   - results.state: Async operation states (loading, errors)
 *
 * DATA FLOW:
 * 1. URL param "tool" determines which document types to show
 * 2. useResultsPage() loads persisted results from sessionStorage (with retry)
 * 3. If loading fails after retries, redirects to home
 * 4. If successful, displays appropriate sections based on available data
 *
 * PRIVACY:
 * - All data stored in sessionStorage (cleared after 1 hour or on browser close)
 * - No server-side persistence of generated content
 * - User must explicitly copy/download documents before leaving
 */

import { useSearch } from "wouter";
import { Loader2 } from "lucide-react";
import { LeaveConfirmationModal } from "@/components/LeaveConfirmationModal";
import { useProtectedPage } from "@/hooks/useProtectedPage";
import { PartialFailureAlert } from "@/components/results/PartialFailureAlert";
import { validateToolParam } from "@/lib/utils";
import ResultsGuidanceSection from "./results/sections/ResultsGuidanceSection";
import ResultsDisclaimerCard from "./results/sections/ResultsDisclaimerCard";
import ResultsHero from "./results/sections/ResultsHero";
import ResultsDocumentsSection from "./results/sections/ResultsDocumentsSection";
import ResultsActionsPanel from "./results/sections/ResultsActionsPanel";
import ResultsDonateCTA from "./results/sections/ResultsDonateCTA";
import { useResultsPage } from "./results/hooks/useResultsPage";

export default function Results() {
  // ============================================================================
  // SETUP & CONFIGURATION
  // ============================================================================

  /**
   * Register this page as protected from navigation.
   * Prevents accidental loss of generated documents by showing a confirmation
   * modal when user tries to navigate away (back button, close tab, etc.)
   */
  useProtectedPage();

  /**
   * Extract and validate the "tool" parameter from URL query string.
   * Valid values: "narrative" | "responseLetter" | "both"
   * Defaults to "narrative" if invalid or missing.
   *
   * This determines which document types should be displayed:
   * - "narrative": Show only disclosure narratives (5 variations)
   * - "responseLetter": Show only pre-adverse action response letter
   * - "both": Show both narratives and letter with tab switcher
   */
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = validateToolParam(params.get("tool"));

  /**
   * Main facade hook that composes all Results page logic.
   * Returns a clean API grouped by concern:
   *
   * results.ui - UI state and visibility
   *   - isLoading: Whether initial data is loading
   *   - loadAttempts: Current retry attempt (0-4)
   *   - hasNarratives: Whether narratives were generated
   *   - hasLetter: Whether response letter was generated
   *   - hasBoth: Whether both types were generated
   *   - activeTab: Current active tab ("narratives" | "letter")
   *   - setActiveTab: Tab switcher function
   *   - showNarratives: Whether to show narratives section (based on tool param)
   *   - showResponseLetter: Whether to show letter section (based on tool param)
   *
   * results.data - Document data and metadata
   *   - narratives: Array of 5 narrative variations
   *   - responseLetter: Response letter object or null
   *   - status: Generation status ("success" | "partial_fail" | "total_fail")
   *   - errors: Array of error objects (if any)
   *   - regenNarrativeCounts: Count of regenerations per narrative type
   *   - regenLetterCount: Count of letter regenerations
   *
   * results.actions - User action handlers
   *   - downloadAll: Download all documents as ZIP
   *   - copyNarrative: Copy narrative to clipboard
   *   - downloadNarrative: Download narrative as PDF
   *   - copyLetter: Copy letter to clipboard
   *   - downloadLetter: Download letter as PDF
   *   - regenerateNarrative: Regenerate a specific narrative type
   *   - regenerateLetter: Regenerate the response letter
   *   - retryPartialFail: Retry failed document generation (placeholder)
   *   - startOver: Clear all data and return to home
   *   - learnMore: Navigate to FAQ page
   *   - confirmExit: Confirm leaving the page
   *   - cancelExit: Cancel exit and stay on page
   *
   * results.state - Async operation states
   *   - regeneratingType: Which narrative type is currently regenerating
   *   - narrativeErrors: Error messages per narrative type
   *   - isLetterRegenerating: Whether letter is regenerating
   *   - letterError: Letter regeneration error message
   *   - exitModalOpen: Whether exit confirmation modal is open
   *   - isRetrying: Whether retry operation is in progress
   */
  const results = useResultsPage({ tool });

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  /**
   * Show loading spinner while initial data is being loaded.
   * The loader performs up to 5 retry attempts with exponential backoff
   * (150ms base delay) before redirecting to home if data is not found.
   *
   * Displays current attempt number if retrying (e.g., "attempt 2").
   */
  if (results.ui.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
            Loading your results{results.ui.loadAttempts > 0 ? ` (attempt ${results.ui.loadAttempts + 1})` : ''}...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN CONTENT
  // ============================================================================

  return (
    <>
      {/* Main results section with decorative background elements */}
      <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 min-h-screen dot-pattern dark:dot-pattern-dark relative overflow-hidden"
        aria-labelledby="results-heading"
      >
        {/* Paper texture overlay for subtle background texture */}
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Decorative corner accents for visual polish */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />

        {/* Primary content container (max-width 3xl for readability) */}
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          {/* Disclaimer about AI-generated content and legal advice */}
          <ResultsDisclaimerCard />

          {/* Partial failure alert - shown if some documents failed to generate */}
          {results.data.status === "partial_fail" && results.data.errors.length > 0 && (
            <PartialFailureAlert
              errors={results.data.errors}
              onRetry={results.actions.retryPartialFail}
              isRetrying={results.state.isRetrying}
            />
          )}

          {/* Hero section with success message and key stats */}
          <ResultsHero />

          {/*
            Main documents section - displays narratives and/or letter.
            - If tool="both": Shows tab switcher to toggle between types
            - If tool="narrative": Shows only narratives carousel
            - If tool="responseLetter": Shows only letter panel

            Handles all document interactions:
            - Copy to clipboard
            - Download as PDF
            - Regenerate (up to 3 times per type)
            - Display regeneration errors
          */}
          <ResultsDocumentsSection
            hasBoth={results.ui.hasBoth}
            hasNarratives={results.ui.hasNarratives}
            hasLetter={results.ui.hasLetter}
            showNarratives={results.ui.showNarratives}
            showResponseLetter={results.ui.showResponseLetter}
            activeTab={results.ui.activeTab}
            setActiveTab={results.ui.setActiveTab}
            narratives={results.data.narratives}
            responseLetter={results.data.responseLetter}
            onCopyNarrative={results.actions.copyNarrative}
            onDownloadNarrative={results.actions.downloadNarrative}
            onRegenerateNarrative={results.actions.regenerateNarrative}
            regeneratingType={results.state.regeneratingType}
            regenNarrativeCounts={results.data.regenNarrativeCounts}
            narrativeErrors={results.state.narrativeErrors}
            onCopyLetter={results.actions.copyLetter}
            onDownloadLetter={results.actions.downloadLetter}
            onRegenerateLetter={results.actions.regenerateLetter}
            isLetterRegenerating={results.state.isLetterRegenerating}
            regenLetterCount={results.data.regenLetterCount}
            letterError={results.state.letterError}
          />

          {/*
            Primary action buttons panel:
            - Download All: Creates ZIP with all generated documents
            - Start Over: Clears data and returns to home (with confirmation)
            - Learn More: Navigates to FAQ page (with confirmation)
          */}
          <ResultsActionsPanel
            hasNarratives={results.ui.hasNarratives}
            hasLetter={results.ui.hasLetter}
            onDownloadAll={results.actions.downloadAll}
            onStartOver={results.actions.startOver}
            onLearnMore={results.actions.learnMore}
          />
        </div>

        {/*
          Two-column layout for supplementary content (desktop only).
          Stacks vertically on mobile (< xl breakpoint).

          Left: Guidance on how to use the generated documents
          Right: Donation CTA to support the free service
        */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12 mb-8">
            {/*
              Usage guidance section - provides context-aware tips
              on when and how to use the generated documents.
              Content varies based on what was generated (narratives/letter).
            */}
            <ResultsGuidanceSection
              hasNarratives={results.ui.hasNarratives}
              hasLetter={results.ui.hasLetter}
              activeResultType={results.ui.activeTab}
            />

            {/*
              Donation CTA - asks users to support the service
              to keep it free, private, and ad-free for others.
            */}
            <ResultsDonateCTA />
          </div>
        </div>
      </section>

      {/*
        Exit confirmation modal - prevents accidental data loss.
        Triggered by:
        - Clicking "Start Over"
        - Clicking "Learn More"
        - Browser navigation (back button, close tab, etc.)

        Warns user that results are not saved server-side and will
        be lost if they leave without downloading/copying.
      */}
      <LeaveConfirmationModal
        open={results.state.exitModalOpen}
        onConfirm={results.actions.confirmExit}
        onCancel={results.actions.cancelExit}
        title="Before you leave this page"
        description="Don't forget to copy or download your results before you leave. We don't want you to lose something important by accident. Once you leave this page, you'll need to start over to generate new narratives or letters."
        warning="⚠️ Make sure you've saved your documents before leaving."
        confirmText="Leave anyway"
        cancelText="Stay on this page"
      />
    </>
  );
}
