import { forwardRef } from 'react';
import { TRANSPARENCY_ITEMS } from "../data/donate.constants";

interface DonateTransparencySectionProps {}

export const DonateTransparencySection = forwardRef<HTMLElement, DonateTransparencySectionProps>(
  (props, ref) => {
    return (
      <section
        ref={ref}
        className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 scroll-mt-20 overflow-hidden dot-pattern dark:dot-pattern-dark"
      >
        <div className="grain-overlay" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16 px-4">
            <div className="w-16 h-1 shimmer-gradient rounded-full mx-auto mb-8" />
            <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ paddingBottom: '0.25rem' }}>
              How your support is <span className="text-gradient-warm italic">used</span>
            </h2>
          </div>

          <div className="space-y-6 mb-12">
            {TRANSPARENCY_ITEMS.map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl border-2 bg-white p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden group"
                style={{
                  borderColor: item.color === 'teal' ? '#14b8a6' : item.color === 'orange' ? '#f97316' : item.color === 'purple' ? '#8b5cf6' : '#06b6d4',
                }}
              >
                <div className="absolute -right-16 -bottom-16 w-48 h-48 organic-blob opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${item.color === 'teal' ? '#14b8a650' : item.color === 'orange' ? '#f9731650' : item.color === 'purple' ? '#8b5cf650' : '#06b6d450'} 0%, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 display-font">{item.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-16 p-8 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)',
              border: '3px solid #14b8a6',
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 organic-blob bg-teal-200/20 blur-3xl" />
            <p className="relative text-lg text-gray-800 leading-relaxed text-center font-semibold">
              You're supporting a real person maintaining and improving
              a tool that's free for people with records to use.
            </p>
          </div>
        </div>
      </section>
    );
  }
);

DonateTransparencySection.displayName = 'DonateTransparencySection';
