import { useEffect, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { ToolType } from "@/lib/formState";

const loadingMessages = [
  "Analyzing your information...",
  "Crafting your personalized narrative...",
  "Preparing your documents...",
  "Almost there...",
];

export default function Loading() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = (params.get("tool") as ToolType) || "narrative";
  const data = params.get("data");

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/results?tool=${tool}&data=${data || ""}`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, tool, data]);

  return (
    <Layout>
      <section
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        aria-labelledby="loading-heading"
      >
        <div className="max-w-lg mx-auto text-center space-y-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Loader2
              className="w-10 h-10 text-primary animate-spin"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-4">
            <h1
              id="loading-heading"
              className="text-2xl md:text-3xl font-bold text-foreground"
            >
              Generating Your Documents
            </h1>
            <p
              className="text-lg text-muted-foreground transition-opacity duration-300"
              data-testid="text-loading-message"
              aria-live="polite"
            >
              {loadingMessages[messageIndex]}
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              This usually takes just a few seconds.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
