import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function OilFrameworkInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
            data-testid="button-oil-framework-info"
          >
            What is the O.I.L. Framework?
          </button>
          <p className="text-sm text-muted-foreground">
            We use this because it's one of the most effective ways to explain
            your story clearly and honestly.
          </p>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>The O.I.L. Framework</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <p className="text-sm text-muted-foreground">
              The O.I.L. framework is one of the most effective ways to explain
              your background to employers. It helps you organize your story in
              a way that shows accountability, awareness, and growth.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    O
                  </span>
                  Ownership
                </h3>
                <p className="text-sm text-muted-foreground">
                  Briefly name what happened and take responsibility for your
                  part in a straightforward, respectful way. This isn't about
                  making excuses—it's about showing that you understand what
                  occurred.
                </p>
                <p className="text-sm text-foreground/80 italic pl-4 border-l-2 border-primary/30">
                  "I take full responsibility for the choices I made that led to
                  my conviction."
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    I
                  </span>
                  Impact
                </h3>
                <p className="text-sm text-muted-foreground">
                  Acknowledge who or what was affected and show that you
                  understand the consequences of your actions. This
                  demonstrates awareness and empathy.
                </p>
                <p className="text-sm text-foreground/80 italic pl-4 border-l-2 border-primary/30">
                  "I understand that my actions affected my family and community,
                  and I deeply regret the harm caused."
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    L
                  </span>
                  Lessons Learned
                </h3>
                <p className="text-sm text-muted-foreground">
                  Describe the concrete steps you've taken to change—programs
                  you've completed, skills you've built, and how you show up
                  differently now. This is where you highlight your growth.
                </p>
                <p className="text-sm text-foreground/80 italic pl-4 border-l-2 border-primary/30">
                  "Since then, I've completed vocational training, earned my GED,
                  and developed skills that help me contribute positively."
                </p>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <h3 className="text-base font-semibold text-foreground">
                Additional Considerations
              </h3>
              <p className="text-sm text-muted-foreground">
                These optional elements can strengthen your letter even further.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Clarifying Charge Relevance
                </h4>
                <p className="text-sm text-muted-foreground">
                  If appropriate, address how the charges are unrelated to the
                  position you're applying for and do not impact your
                  professional capabilities.
                </p>
                <p className="text-sm text-foreground/80 italic pl-4 border-l-2 border-primary/30">
                  "It is important to note that these charges are not connected
                  to my professional life in any way, nor do they impact my
                  ability to perform this job."
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Reinforcing Qualifications & Interest
                </h4>
                <p className="text-sm text-muted-foreground">
                  Highlight your professional experience, relevant skills, and
                  genuine interest in the company and the role.
                </p>
                <p className="text-sm text-foreground/80 italic pl-4 border-l-2 border-primary/30">
                  "My professional background includes extensive experience in
                  this field. I was drawn to this position because of your
                  company's values and reputation. Given the chance, I'm
                  confident I can demonstrate my value and commitment."
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Providing Context (Optional)
                </h4>
                <p className="text-sm text-muted-foreground">
                  If you're comfortable, you may provide context for your
                  charges to offer more understanding as to why the incident
                  occurred and why it won't happen again. This is entirely up
                  to your discretion and comfort.
                </p>
                <p className="text-sm text-foreground/80 italic pl-4 border-l-2 border-primary/30">
                  "Sharing context can sometimes provide deeper insight into
                  your story and motivations, reinforcing your growth and
                  future dedication."
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground">
                <span className="font-medium">Remember:</span> You only need to
                share what feels safe and honest. This framework is here to
                support you, not judge you. Take your time with each part.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={() => setIsOpen(false)}
              data-testid="button-oil-modal-close"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
