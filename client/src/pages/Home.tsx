import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Mail,
  ArrowRight,
  Clock,
  Shield,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

const stories = [
  {
    role: "Job seeker, retail",
    quote:
      "I used to panic when employers asked about my record. Now I have three honest ways to respond.",
  },
  {
    role: "First-time applicant after reentry",
    quote: "I turned a terrifying letter into a clear, professional response.",
  },
  {
    role: "Job seeker, tech support",
    quote: "For the first time, I feel ready to explain my past and my growth.",
  },
  {
    role: "Retail candidate",
    quote:
      "Having words prepared made the difference between freezing up and feeling confident.",
  },
];

export default function Home() {
  const { ref: howItWorksRef, isInView: howItWorksInView } = useInView({
    threshold: 0.2,
  });
  const [heroMounted, setHeroMounted] = useState(false);
  const [showAfter, setShowAfter] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setPrefersReducedMotion(prefersReduced);
    if (prefersReduced) {
      setHeroMounted(true);
      setShowAfter(true);
    } else {
      const mountId = requestAnimationFrame(() => setHeroMounted(true));
      const afterTimer = setTimeout(() => setShowAfter(true), 800);
      return () => {
        cancelAnimationFrame(mountId);
        clearTimeout(afterTimer);
      };
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setStoryIndex((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goToStory = (index: number) => {
    setStoryIndex(index);
  };

  const prevStory = () => {
    setStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const nextStory = () => {
    setStoryIndex((prev) => (prev + 1) % stories.length);
  };

  return (
    <Layout>
      <section
        className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div
          className="pointer-events-none absolute -left-20 -top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-float-slow motion-reduce:animate-none"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-chart-2/10 blur-3xl animate-float-slow-reverse motion-reduce:animate-none"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/4 -bottom-20 h-56 w-56 rounded-full bg-primary/5 blur-2xl animate-float-slow motion-reduce:animate-none"
          style={{ animationDelay: "-8s" }}
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto relative">
          <div className="relative overflow-hidden rounded-2xl p-8 md:p-12">
            <div
              className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-chart-2/5 rounded-2xl transition-all duration-500 ease-out motion-reduce:transition-none ${
                heroMounted
                  ? "opacity-100 translate-y-0 rotate-0"
                  : "opacity-0 translate-y-2 -rotate-1"
              }`}
              aria-hidden="true"
            />

            <div className="relative text-center space-y-6 md:space-y-8">
              <div className="space-y-4">
                <h1
                  id="hero-heading"
                  className="text-4xl md:text-5xl font-bold leading-tight text-foreground"
                >
                  Prepare for Your Next Opportunity
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  You deserve tools that help you tell your story with
                  confidence. Reframe.me creates personalized materials to
                  support your job search journey.
                </p>
              </div>

              <div
                className="w-16 h-1 bg-primary mx-auto rounded-full"
                aria-hidden="true"
              />

              <div
                className="max-w-md mx-auto text-left space-y-3 pt-4"
                data-testid="before-after-block"
              >
                <div
                  className={`text-sm text-muted-foreground/80 italic transition-opacity duration-300 motion-reduce:transition-none ${
                    heroMounted ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="font-medium text-muted-foreground not-italic">
                    Before:
                  </span>{" "}
                  "I freeze when employers ask about my record."
                </div>
                <div
                  className={`text-sm text-foreground font-medium transition-all duration-300 motion-reduce:transition-none ${
                    showAfter
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-1"
                  }`}
                >
                  <span className="text-primary">After:</span> "Now I have
                  language that explains my past and what I've done since."
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </section>

      <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8"
        aria-labelledby="tools-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="tools-heading" className="sr-only">
            Available Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className="group border-border shadow-sm cursor-default transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              tabIndex={0}
              data-testid="card-disclosure-narratives"
            >
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110 group-focus-within:scale-110 motion-reduce:group-hover:scale-100">
                  <FileText
                    className="w-6 h-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    5 Disclosure Narratives
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You can generate five unique ways to discuss your background
                    with potential employers. Each narrative is tailored to help
                    you communicate your story professionally and confidently.
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
        className="py-10 md:py-14 px-4 sm:px-6 lg:px-8"
        aria-labelledby="safe-space-heading"
        data-testid="section-safe-space"
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-xl border border-chart-2/20 bg-chart-2/5 p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-chart-2" aria-hidden="true" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2
                    id="safe-space-heading"
                    className="text-xl md:text-2xl font-semibold text-foreground"
                  >
                    A judgement-free space, built for your reality.
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We don't store what you write in this session. You decide
                    what to share, and you can close this tab at any time.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-chart-2"
                      aria-hidden="true"
                    />
                    No account required.
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-chart-2"
                      aria-hidden="true"
                    />
                    No tracking of your answers.
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-chart-2"
                      aria-hidden="true"
                    />
                    You decide what to keep, copy, or delete.
                  </li>
                </ul>
              </div>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            <div
              className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-border"
              aria-hidden="true"
            />

            {howItWorksSteps.map((step, index) => (
              <div
                key={step.title}
                className={`relative bg-background rounded-xl border border-border p-6 text-center transition-all duration-300 ease-out motion-reduce:transition-none ${
                  howItWorksInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: howItWorksInView
                    ? `${index * 100}ms`
                    : "0ms",
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
        </div>
      </section>
      <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8"
        aria-labelledby="benefits-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="benefits-heading" className="sr-only">
            Benefits
          </h2>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>Takes 5-10 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>Completely free</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 md:py-14 px-4 sm:px-6 lg:px-8"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 id="cta-heading" className="sr-only">
            Get Started
          </h2>

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

      <section
        className="py-10 md:py-14 px-4 sm:px-6 lg:px-8"
        aria-labelledby="stories-heading"
        data-testid="section-stories"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2
              id="stories-heading"
              className="text-xl md:text-2xl font-semibold text-foreground"
            >
              Stories of change
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Anonymized snapshots of how people are using Reframe.me.
            </p>
          </div>

          <div
            className="relative max-w-xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="relative rounded-xl border border-border bg-card p-6 md:p-8 min-h-[140px] flex flex-col justify-center"
              role="region"
              aria-roledescription="carousel"
              aria-label="Stories of change"
            >
              <div
                key={storyIndex}
                className={`text-center ${
                  prefersReducedMotion ? "" : "animate-fade-in"
                }`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${storyIndex + 1} of ${stories.length}`}
              >
                <p className="text-foreground leading-relaxed italic">
                  "{stories[storyIndex].quote}"
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {stories[storyIndex].role}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevStory}
                aria-label="Previous story"
                data-testid="button-story-prev"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </Button>

              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label="Story slides"
              >
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStory(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      index === storyIndex
                        ? "bg-primary w-4"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    role="tab"
                    aria-selected={index === storyIndex}
                    aria-label={`Go to story ${index + 1}`}
                    data-testid={`button-story-dot-${index}`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextStory}
                aria-label="Next story"
                data-testid="button-story-next"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
