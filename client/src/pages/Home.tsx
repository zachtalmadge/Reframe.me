import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Mail, ArrowRight, Clock, Shield, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import { useInView } from "@/hooks/useInView";

const howItWorksSteps = [
  {
    title: "Share your situation",
    description:
      "Answer a few questions about your background and the job you're applying for.",
  },
  {
    title: "We help reframe your story",
    description:
      "Our tool turns your answers into clear, employer-ready language.",
  },
  {
    title: "Leave with talking points & documents",
    description:
      "You'll get narratives and a response letter you can reuse and refine.",
  },
];

export default function Home() {
  const { ref: howItWorksRef, isInView: howItWorksInView } = useInView({ threshold: 0.2 });

  return (
    <Layout>
      <section 
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h1 
              id="hero-heading"
              className="text-4xl md:text-5xl font-bold leading-tight text-foreground"
            >
              Prepare for Your Next Opportunity
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              You deserve tools that help you tell your story with confidence. 
              Reframe.me creates personalized materials to support your job search journey.
            </p>
          </div>

          <div className="w-16 h-1 bg-primary mx-auto rounded-full" aria-hidden="true" />
        </div>
      </section>

      <section 
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8"
        aria-labelledby="tools-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="tools-heading" className="sr-only">Available Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="group border-border shadow-sm cursor-default transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              tabIndex={0}
              data-testid="card-disclosure-narratives"
            >
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110 group-focus-within:scale-110 motion-reduce:group-hover:scale-100">
                  <FileText className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    5 Disclosure Narratives
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You can generate five unique ways to discuss your background with 
                    potential employers. Each narrative is tailored to help you 
                    communicate your story professionally and confidently.
                  </p>
                  <p 
                    className="text-sm font-medium text-primary opacity-0 translate-y-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    Show up prepared, not panicked.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="group border-border shadow-sm cursor-default transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              tabIndex={0}
              data-testid="card-pre-adverse-response"
            >
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110 group-focus-within:scale-110 motion-reduce:group-hover:scale-100">
                  <Mail className="w-6 h-6 text-chart-2" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Pre-Adverse Action Response
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You can create a professional response letter if you receive 
                    a pre-adverse action notice. This letter helps you present 
                    additional context about your circumstances.
                  </p>
                  <p 
                    className="text-sm font-medium text-chart-2 opacity-0 translate-y-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    Turn a scary letter into a grounded response.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section 
        ref={howItWorksRef as React.RefObject<HTMLElement>}
        className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"
        aria-labelledby="how-it-works-heading"
        data-testid="section-how-it-works"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 
              id="how-it-works-heading" 
              className="text-2xl md:text-3xl font-semibold text-foreground"
            >
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Three clear steps from feeling stuck to feeling prepared.
            </p>
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {howItWorksSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={`relative bg-background rounded-xl border border-border p-6 text-center transition-all duration-300 ease-out motion-reduce:transition-none ${
                    howItWorksInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transitionDelay: howItWorksInView ? `${index * 100}ms` : "0ms",
                  }}
                  data-testid={`step-${index + 1}`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-lg mx-auto mb-4 relative z-10">
                    {index + 1}
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6 md:mt-8" aria-hidden="true">
              <div className="relative w-48 md:w-64 h-1 bg-border rounded-full overflow-hidden">
                <div 
                  className={`absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700 ease-out motion-reduce:transition-none ${
                    howItWorksInView ? "w-full" : "w-0"
                  }`}
                  style={{ transitionDelay: howItWorksInView ? "200ms" : "0ms" }}
                />
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary shadow-md transition-all duration-700 ease-out motion-reduce:transition-none ${
                    howItWorksInView ? "left-[calc(100%-6px)]" : "left-0"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8"
        aria-labelledby="benefits-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="benefits-heading" className="sr-only">Benefits</h2>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>Takes 5-10 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>No account required</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>Completely free</span>
            </div>
          </div>
        </div>
      </section>

      <section 
        className="py-12 md:py-16 px-4 sm:px-6 lg:px-8"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 id="cta-heading" className="sr-only">Get Started</h2>
          
          <Link href="/selection">
            <Button 
              size="lg"
              className="group w-full sm:w-auto min-h-[48px] px-8 text-lg font-medium shadow-md"
              data-testid="button-get-started"
            >
              Get Started
              <span className="inline-flex transition-transform duration-150 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none">
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </span>
            </Button>
          </Link>
          
          <p className="text-sm text-muted-foreground">
            Your information stays private and is not stored after your session.
          </p>
        </div>
      </section>
    </Layout>
  );
}
