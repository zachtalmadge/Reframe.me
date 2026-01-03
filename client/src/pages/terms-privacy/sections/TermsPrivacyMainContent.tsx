import { ARTICLE_SECTIONS, FINAL_STATEMENT } from "../data/content.constants";
import { ContentRenderer } from "./ContentRenderer";

export default function TermsPrivacyMainContent() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-16">
          {ARTICLE_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <article key={section.id} className="relative">
                <span className="section-number hidden md:inline" aria-hidden="true">
                  {section.sectionNumber}
                </span>
                <div className="relative z-10 pl-0 md:pl-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-lg ${section.iconBgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${section.iconColor}`} />
                    </div>
                    <h2 className="text-3xl md:text-4xl app-heading text-slate-900">
                      {section.heading}
                    </h2>
                  </div>

                  <div className="space-y-6 text-slate-600 body-text text-base md:text-lg leading-relaxed">
                    <ContentRenderer content={section.content} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Final Statement */}
        <div className="mt-20 mb-12">
          <div className="commitment-box rounded-2xl p-8 md:p-10 relative overflow-hidden shadow-xl text-center">
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 mb-6 shadow-lg">
                <FINAL_STATEMENT.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl app-heading text-teal-900 mb-4">
                {FINAL_STATEMENT.heading}
              </h3>
              <p className="text-lg text-slate-700 body-text max-w-2xl mx-auto leading-relaxed">
                {FINAL_STATEMENT.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
