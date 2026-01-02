import { MessageCircle, FileText } from "lucide-react";

interface ResultsGuidanceSectionProps {
  hasNarratives: boolean;
  hasLetter: boolean;
  activeResultType: "narratives" | "letter";
}

export default function ResultsGuidanceSection({
  hasNarratives,
  hasLetter,
  activeResultType
}: ResultsGuidanceSectionProps) {
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
