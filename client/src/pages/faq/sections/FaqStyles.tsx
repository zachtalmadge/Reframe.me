export function FaqStyles() {
  return (
    <style>{`
      /* Refined entrance animations for FAQ cards */
      .faq-card {
        animation: float-in-refined 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        animation-fill-mode: backwards;
      }

      @keyframes float-in-refined {
        from {
          opacity: 0;
          transform: translateY(24px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* Staggered animation delays - critical for visual rhythm */
      .faq-card:nth-child(1) { animation-delay: 0.05s; }
      .faq-card:nth-child(2) { animation-delay: 0.10s; }
      .faq-card:nth-child(3) { animation-delay: 0.15s; }
      .faq-card:nth-child(4) { animation-delay: 0.20s; }
      .faq-card:nth-child(5) { animation-delay: 0.25s; }
      .faq-card:nth-child(6) { animation-delay: 0.30s; }
      .faq-card:nth-child(7) { animation-delay: 0.35s; }
      .faq-card:nth-child(8) { animation-delay: 0.40s; }
      .faq-card:nth-child(9) { animation-delay: 0.45s; }
      .faq-card:nth-child(10) { animation-delay: 0.50s; }
      .faq-card:nth-child(11) { animation-delay: 0.55s; }

      /* Smooth focus transitions */
      @media (prefers-reduced-motion: reduce) {
        .faq-card {
          animation: none;
        }
      }
    `}</style>
  );
}
