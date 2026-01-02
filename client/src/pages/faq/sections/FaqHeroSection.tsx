import { BookOpen } from "lucide-react";

export function FaqHeroSection() {
  return (
    <div className="text-center space-y-6 mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100">
        <BookOpen className="w-4 h-4 text-teal-600" />
        <span className="text-sm font-medium text-teal-700 tracking-wide">Knowledge Base</span>
      </div>

      <h1
        id="faq-heading"
        className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-br from-gray-900 via-teal-800 to-gray-900 bg-clip-text text-transparent pb-2"
        style={{ fontFamily: 'Fraunces, Georgia, serif', letterSpacing: '-0.03em' }}
      >
        Everything You Need to Know
      </h1>

      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Clear answers about background checks, disclosure, and your rights during the hiring process.
      </p>
    </div>
  );
}
