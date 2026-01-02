import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { faqs } from "../data/faq.constants";

export function FaqList() {
  const [openItem, setOpenItem] = useState<string>("");

  return (
    <div className="space-y-4 mb-16">
      {faqs.map((faq, index) => {
        const Icon = faq.icon;
        const isOpen = openItem === faq.id;

        return (
          <div
            key={faq.id}
            className="faq-card group"
            data-testid={`faq-item-${faq.id}`}
          >
            <div
              className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-teal-200"
              style={{
                boxShadow: isOpen ? '0 10px 40px rgba(20, 184, 166, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <button
                onClick={() => setOpenItem(isOpen ? "" : faq.id)}
                className="w-full text-left p-6 md:p-8 transition-colors duration-200"
                data-testid={`faq-trigger-${faq.id}`}
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isOpen
                        ? 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)'
                        : 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)'
                    }}
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isOpen ? 'text-white' : 'text-teal-600'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3
                        className="faq-question text-lg md:text-xl font-semibold text-gray-900 leading-tight pr-4"
                      >
                        {faq.question}
                      </h3>

                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen ? 'bg-teal-100 rotate-180' : 'bg-gray-100'
                        }`}
                      >
                        <ArrowRight
                          className={`w-4 h-4 transition-colors duration-300 ${
                            isOpen ? 'text-teal-700 rotate-90' : 'text-gray-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="category-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100/80 border border-gray-200/50">
                      <span className="text-xs font-medium text-gray-600">{faq.category}</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Answer - accordion content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div
                  className="px-6 md:px-8 pb-6 md:pb-8 pt-2"
                  style={{
                    background: 'linear-gradient(180deg, rgba(240, 253, 250, 0.3) 0%, transparent 100%)'
                  }}
                  data-testid={`faq-content-${faq.id}`}
                >
                  <div className="pl-16 prose prose-sm max-w-none">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
