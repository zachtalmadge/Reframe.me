import { Link } from "wouter";
import { ArrowLeft, FileCheck, Shield } from "lucide-react";

export default function TermsPrivacyHero() {
  return (
    <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/50 overflow-hidden document-texture">
      {/* Decorative background elements */}
      <div
        className="absolute top-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)'
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)'
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto relative">
        {/* Back button */}
        <div className="mb-8">
          <Link href="/">
            <button className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-teal-200/30 hover:bg-white/80 hover:border-teal-300/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <ArrowLeft className="w-4 h-4 text-teal-600 transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="text-sm font-medium text-teal-700 body-text">Back to Home</span>
            </button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 mb-6 shadow-lg backdrop-blur-sm border border-white/50">
            <FileCheck className="w-10 h-10 text-teal-600 icon-pulse" />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl app-heading mb-6 bg-gradient-to-br from-slate-800 via-teal-800 to-slate-700 bg-clip-text text-transparent">
            Terms & Privacy
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed body-text font-medium">
            Your privacy and trust are foundational to everything we do.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-100/50 border border-amber-200/50">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm text-amber-800 font-semibold body-text">Effective: December 15, 2025</span>
          </div>
        </div>

        {/* Privacy Commitment Callout */}
        <div className="commitment-box rounded-2xl p-8 md:p-10 mb-12 relative overflow-hidden shadow-xl">
          <div className="decorative-quote" aria-hidden="true">"</div>
          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl app-heading text-teal-900 mb-3">
                  Our Core Commitment
                </h2>
                <div className="space-y-3 text-slate-700 body-text text-base md:text-lg leading-relaxed">
                  <p className="font-semibold">
                    We never store, share, or sell your personal information.
                  </p>
                  <p>
                    Reframe.me is designed with privacy-first architecture. Your sensitive information exists only in your browser session and disappears when you close the page. We believe your story is yours alone to tell.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
