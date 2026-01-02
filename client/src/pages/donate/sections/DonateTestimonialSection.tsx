export function DonateTestimonialSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden dot-pattern dark:dot-pattern-dark">
      <div className="grain-overlay" />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12 px-4">
          <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8" style={{ paddingBottom: '0.25rem' }}>
            Why this work <span className="text-gradient-warm italic">matters</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-medium">
            Talking about a record with an employer can be one of the hardest parts of a job search.
            Many people don't have a lawyer, career coach, or mentor to help them find the words.
            Reframe.me gives them a starting point — language they can edit, practice, and make their
            own so they can walk into conversations a little more prepared and a little less alone.
          </p>
        </div>

        <div className="relative mt-16 p-12 md:p-16 rounded-3xl shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
            border: '3px solid #14b8a6',
          }}
        >
          <div className="absolute top-8 left-8 text-9xl display-font text-teal-200/40 leading-none pointer-events-none" style={{ fontStyle: 'italic' }}>"</div>
          <div className="absolute bottom-8 right-8 text-9xl display-font text-teal-200/40 leading-none pointer-events-none rotate-180" style={{ fontStyle: 'italic' }}>"</div>
          <div className="absolute -right-20 -top-20 w-64 h-64 organic-blob bg-teal-200/20 blur-3xl" />
          <div className="relative z-10">
            <p className="display-font text-2xl md:text-3xl italic text-gray-800 leading-relaxed text-center mb-6">
              "My client said this was the first time they saw their story written in a way that
              didn't shame them. It helped them feel ready to respond instead of shutting down."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-0.5 bg-teal-400" />
              <p className="text-base font-semibold text-teal-700 tracking-wide">
                Re-entry coach, anonymized
              </p>
              <div className="w-12 h-0.5 bg-teal-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
