export function FaqStyles() {
  return (
    <style>{`
      /* Page-specific FAQ styles */
      .faq-question {
        font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        letter-spacing: -0.02em;
      }

      .faq-card {
        animation: float-in 0.6s ease-out;
        animation-fill-mode: backwards;
      }

      .faq-card:nth-child(1) { animation-delay: 0.05s; }
      .faq-card:nth-child(2) { animation-delay: 0.1s; }
      .faq-card:nth-child(3) { animation-delay: 0.15s; }
      .faq-card:nth-child(4) { animation-delay: 0.2s; }
      .faq-card:nth-child(5) { animation-delay: 0.25s; }
      .faq-card:nth-child(6) { animation-delay: 0.3s; }
      .faq-card:nth-child(7) { animation-delay: 0.35s; }
      .faq-card:nth-child(8) { animation-delay: 0.4s; }
      .faq-card:nth-child(9) { animation-delay: 0.45s; }
      .faq-card:nth-child(10) { animation-delay: 0.5s; }

      .category-badge {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
    `}</style>
  );
}
