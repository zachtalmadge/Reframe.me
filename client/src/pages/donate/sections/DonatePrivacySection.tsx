import { Lock } from "lucide-react";

export function DonatePrivacySection() {
  return (
    <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 dot-pattern dark:dot-pattern-dark">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 mb-8 shadow-xl">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ paddingBottom: '0.25rem' }}>
            Your data and your donation are <span className="text-gradient-warm italic">separate</span>
          </h2>
        </div>

        <div className="space-y-5 max-w-2xl mx-auto mb-12">
          {[
            "Reframe.me does not tie your donation to your narrative or letter content.",
            "The app is designed to avoid long-term storage of sensitive answers.",
            "Payment info stays with the payment platform; the tool itself doesn't track your card or bank details.",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-teal-50/50 transition-colors">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 mt-2 flex-shrink-0 shadow-md" />
              <p className="text-lg text-gray-700 leading-relaxed font-medium">{text}</p>
            </div>
          ))}
        </div>

        <div className="relative p-8 rounded-2xl overflow-hidden shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)',
            border: '2px solid #14b8a6',
          }}
        >
          <div className="absolute -right-12 -bottom-12 w-48 h-48 organic-blob bg-teal-200/20" />
          <p className="relative text-lg font-bold text-center text-teal-900">
            Donations support the tool — not data collection. What you type into Reframe.me is not linked to your contribution.
          </p>
        </div>
      </div>
    </section>
  );
}
