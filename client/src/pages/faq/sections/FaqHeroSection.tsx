import { BookOpen } from "lucide-react";

export function FaqHeroSection() {
  return (
    <div className="text-center space-y-8 mb-20">
      <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-50 via-teal-50/90 to-cyan-50 border border-teal-200/60 shadow-sm">
        <BookOpen className="w-5 h-5 text-teal-600" strokeWidth={2} />
        <span className="text-sm font-semibold text-teal-700 tracking-wide uppercase">Knowledge Base</span>
      </div>

      <h1
        id="faq-heading"
        className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] bg-gradient-to-br from-gray-900 via-teal-800 to-gray-900 bg-clip-text text-transparent pb-2 px-4"
        style={{ fontFamily: 'Fraunces, Georgia, serif', letterSpacing: '-0.03em' }}
      >
        Everything You Need To Know
      </h1>

      <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 font-light">
        Clear answers about background checks, disclosure, and your rights during the hiring process.
      </p>
    </div>
  );
}
