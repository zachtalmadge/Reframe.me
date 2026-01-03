import { ChevronRight } from "lucide-react";
import { FaqItem } from "../types/faq.types";
import { CategoryBadge } from "./CategoryBadge";

interface FaqCardProps {
  faq: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

export function FaqCard({ faq, isOpen, onToggle }: FaqCardProps) {
  const Icon = faq.icon;

  return (
    <div
      className="faq-card group"
      data-testid={`faq-item-${faq.id}`}
    >
      <div
        className={`
          relative rounded-3xl border-2 bg-white/90
          overflow-hidden transition-[border-color,transform] duration-200 cubic-bezier(0.2,0,0,1)
          hover:-translate-y-1
          ${isOpen
            ? 'border-teal-300/80 shadow-[0_12px_48px_rgba(20,184,166,0.2)]'
            : 'border-gray-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:border-teal-200/60 hover:shadow-[0_8px_32px_rgba(20,184,166,0.12)]'
          }
        `}
      >
        {/* Subtle gradient overlay for depth */}
        <div
          className={`absolute inset-0 bg-gradient-to-br pointer-events-none ${
            isOpen
              ? 'from-teal-50/40 via-transparent to-cyan-50/20 opacity-100'
              : 'from-gray-50/20 via-transparent to-transparent opacity-0'
          }`}
          aria-hidden="true"
        />

        <button
          onClick={onToggle}
          className="relative w-full text-left px-7 py-7 md:px-9 md:py-9 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white rounded-3xl"
          data-testid={`faq-trigger-${faq.id}`}
          aria-expanded={isOpen}
        >
          <div className="flex items-start gap-5 md:gap-6">
            {/* Icon with enhanced visual treatment */}
            <div
              className={`
                flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl
                flex items-center justify-center transition-[background-color,transform] duration-200 cubic-bezier(0.2,0,0,1)
                shadow-sm
                ${isOpen
                  ? 'bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 shadow-teal-200/50 shadow-lg scale-105'
                  : 'bg-gradient-to-br from-teal-50/80 via-teal-100/60 to-cyan-50/80 group-hover:from-teal-100 group-hover:shadow-md'
                }
              `}
            >
              <Icon
                className={`w-7 h-7 md:w-8 md:h-8 transition-[color,transform] duration-200 ${
                  isOpen ? 'text-white scale-110' : 'text-teal-600 group-hover:text-teal-700'
                }`}
                strokeWidth={isOpen ? 2.5 : 2}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-5 mb-4">
                <h3
                  className={`
                    text-2xl md:text-3xl font-bold leading-tight tracking-tight
                    transition-colors duration-200
                    ${isOpen ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'}
                  `}
                  style={{
                    fontFamily: 'Fraunces, Georgia, serif',
                    letterSpacing: '-0.025em'
                  }}
                >
                  {faq.question}
                </h3>

                {/* Chevron indicator */}
                <div
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-xl
                    flex items-center justify-center
                    transition-[background-color,transform] duration-200 cubic-bezier(0.2,0,0,1)
                    ${isOpen
                      ? 'bg-teal-100/80 rotate-90 shadow-sm'
                      : 'bg-gray-100/80 group-hover:bg-gray-200/80'
                    }
                  `}
                  aria-hidden="true"
                >
                  <ChevronRight
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isOpen ? 'text-teal-700' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              {/* Enhanced category badge */}
              <CategoryBadge category={faq.category} />
            </div>
          </div>
        </button>

        {/* Answer - accordion content with refined animation */}
        <div
          className={`
            grid transition-[grid-template-rows,opacity] duration-200 cubic-bezier(0.2,0,0,1)
            ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
          `}
        >
          <div className="overflow-hidden">
            <div
              className="relative px-7 md:px-9 pb-8 md:pb-10 pt-2"
              data-testid={`faq-content-${faq.id}`}
            >
              {/* Subtle divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" aria-hidden="true" />

              <div className="pl-0 md:pl-[88px] prose prose-base md:prose-lg max-w-none">
                <div className="text-gray-600 leading-relaxed [&>div>p]:mb-4 [&>div>p]:leading-relaxed [&>div>ul]:mb-4 [&>div>ul]:space-y-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
