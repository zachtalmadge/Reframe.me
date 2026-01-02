import { FileText } from "lucide-react";

export default function ResultsHero() {
  return (
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
  );
}
