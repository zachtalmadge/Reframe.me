import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "Do you sell or share my information?",
    answer:
      "No. Donations don't change how your data is handled. The goal is to keep this tool as safe and respectful as possible for people with records.",
  },
  {
    question: "Can organizations support this?",
    answer:
      "Yes. Re-entry programs, legal clinics, or employers who want to sponsor usage or collaborate can reach out for partnership options.",
  },
];

export function DonateFaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 dot-pattern dark:dot-pattern-dark">
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-14 px-4">
          <div className="w-16 h-1 shimmer-gradient rounded-full mx-auto mb-8" />
          <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ paddingBottom: '0.25rem' }}>
            Questions & <span className="text-gradient-warm italic">Answers</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="faq-item rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-md"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-7 text-left hover:bg-gray-50 transition-colors group"
                aria-expanded={openFaq === index}
              >
                <span className="text-xl font-bold text-gray-900 pr-4 display-font">{item.question}</span>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <ChevronDown
                    className={`w-5 h-5 text-white transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="px-7 pb-7 pt-2 bg-gradient-to-br from-teal-50/30 to-transparent">
                  <p className="text-lg text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
