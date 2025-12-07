import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "when-disclose",
    question: "When should I disclose my record?",
    answer: "",
  },
  {
    id: "pre-adverse-rights",
    question: "What are my rights during a pre-adverse action notice?",
    answer: "",
  },
  {
    id: "what-employers-see",
    question: "What do employers typically see on a background check?",
    answer: "",
  },
  {
    id: "ban-the-box",
    question: "What is 'Ban the Box' and does it apply to me?",
    answer: "",
  },
  {
    id: "how-to-explain",
    question: "How do I explain gaps in my employment history?",
    answer: "",
  },
  {
    id: "after-interview",
    question: "What should I do after the interview if I disclosed?",
    answer: "",
  },
];

export default function Faq() {
  return (
    <Layout>
      <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1
              id="faq-heading"
              className="text-2xl md:text-3xl font-bold leading-tight text-foreground"
            >
              Learn More
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Answers to common questions about background checks, disclosure,
              and your rights during the hiring process.
            </p>
          </div>

          <div className="rounded-xl border border-chart-2/20 bg-chart-2/5 p-4 md:p-6 mb-8">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">
                Important note:
              </span>{" "}
              This page provides general information only. It is not legal
              advice, and we cannot guarantee any hiring outcome. Every
              situation is different. When possible, consult with a legal
              professional or trusted advisor about your specific circumstances.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  data-testid={`faq-item-${faq.id}`}
                >
                  <AccordionTrigger
                    className="text-left text-sm md:text-base"
                    data-testid={`faq-trigger-${faq.id}`}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent data-testid={`faq-content-${faq.id}`}>
                    {faq.answer || (
                      <span className="text-muted-foreground italic">
                        Answer coming soon.
                      </span>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center space-y-4 pt-6 border-t border-border">
            <p className="text-muted-foreground">
              Ready to prepare for your next opportunity?
            </p>
            <Link href="/selection">
              <Button
                size="lg"
                className="group w-full sm:w-auto min-h-[48px] px-8 text-lg font-medium"
                data-testid="button-get-started-faq"
              >
                Get Started
                <span className="inline-flex transition-transform duration-150 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none">
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
