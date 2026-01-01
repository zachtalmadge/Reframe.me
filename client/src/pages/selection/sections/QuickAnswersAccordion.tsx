import { Link } from "wouter";
import { MessageSquare, ArrowRight, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface QuickAnswersAccordionProps {
  accordionValue: string;
  onAccordionChange: (value: string) => void;
}

export default function QuickAnswersAccordion({
  accordionValue,
  onAccordionChange,
}: QuickAnswersAccordionProps) {
  return (
    <div className="mt-10 md:mt-12 opacity-0 animate-fade-in-up stagger-2">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={accordionValue}
        onValueChange={onAccordionChange}
      >
        <AccordionItem
          value="quick-answers"
          className="border-l-4 border-orange-500 rounded-r-2xl px-6 md:px-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl"
        >
          <AccordionTrigger className="hover:no-underline py-5 group">
            <div className="flex items-center gap-4 text-left w-full">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <MessageSquare className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-base font-bold text-foreground">
                  Have questions before you decide?
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  Quick answers to help guide your choice
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-14 md:px-16 pb-6 pt-2 text-left">
            <div className="space-y-6">
              {/* Question 1 */}
              <div className="space-y-2">
                <h4 className="text-sm md:text-base font-semibold text-foreground flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-500 flex-shrink-0">Q:</span>
                  <span>Why might I want different ways to talk about my record?</span>
                </h4>
                <div className="pl-5 space-y-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed text-left">
                  <p>
                    Different situations often call for different versions of your story. A quick form might only need a sentence, while a longer interview might give you space to share more context.
                  </p>
                  <p>
                    Having a few prepared versions can help you feel less caught off guard and more in control. You're not changing the facts—you're choosing how much to share and what to focus on for each moment.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-orange-200/50 dark:border-orange-800/30" />

              {/* Question 1b - Follow-up */}
              <div className="space-y-2">
                <h4 className="text-sm md:text-base font-semibold text-foreground flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-500 flex-shrink-0">Q:</span>
                  <span>When should I use my disclosure narrative?</span>
                </h4>
                <div className="pl-5 space-y-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed text-left">
                  <p>
                    In most cases, it's best to wait until after you receive a job offer to discuss your record. During the interview process, focus on emphasizing your skills, experience, and what you bring to the role.
                  </p>
                  <p>
                    Once you have an offer and a background check is pending, that's typically when you'd use one of your prepared narratives to provide context about your record.
                  </p>
                  <p>
                    Having this prepared ahead of time means you won't be caught off guard trying to find the right words in a stressful moment.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-orange-200/50 dark:border-orange-800/30" />

              {/* Question 2 */}
              <div className="space-y-2">
                <h4 className="text-sm md:text-base font-semibold text-foreground flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-500 flex-shrink-0">Q:</span>
                  <span>What is a pre-adverse action response letter, and when would I use one?</span>
                </h4>
                <div className="pl-5 space-y-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed text-left">
                  <p>
                    In some hiring processes, if something on your background check might lead an employer to change an offer or decide not to hire you, they may send you a "pre-adverse action" notice first.
                  </p>
                  <p>
                    A pre-adverse action response letter is your opportunity to correct any mistakes, share context about your record, and highlight the steps you've taken to grow.
                  </p>
                </div>
              </div>

              {/* Link to full FAQ */}
              <div className="pt-3 border-t border-orange-200/50 dark:border-orange-800/30">
                <Link href="/faq">
                  <button className="text-xs md:text-sm text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-medium hover:underline underline-offset-4 transition-all duration-200 flex items-center gap-1.5 group">
                    <span>View all frequently asked questions</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                </Link>
              </div>

              {/* Close button for mobile */}
              <div className="pt-4 md:hidden">
                <button
                  onClick={() => onAccordionChange("")}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-xl"
                  aria-label="Close quick answers"
                >
                  <span>Close</span>
                  <ChevronDown className="w-4 h-4 rotate-180" aria-hidden="true" />
                </button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
