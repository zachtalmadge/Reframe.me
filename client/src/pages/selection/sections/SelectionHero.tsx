export default function SelectionHero() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-start gap-4 md:gap-6 mb-6 opacity-0 animate-fade-in-up stagger-1">
        <div className="flex-shrink-0 w-1 h-16 md:h-20 bg-gradient-to-b from-teal-500 to-orange-500 rounded-full" aria-hidden="true" />
        <div>
          <div className="text-xs md:text-sm font-semibold tracking-wider text-teal-600 dark:text-teal-400 uppercase mb-3 md:mb-4">
            Begin Your Journey
          </div>
          <h1
            id="selection-heading"
            className="text-4xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-foreground mb-4 md:mb-6"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            What would you
            <br />
            like to create<span className="text-teal-500">?</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Choose the tool that aligns with your current needs. Each path is designed
            to help you move forward with confidence and clarity.
          </p>
        </div>
      </div>
    </div>
  );
}
