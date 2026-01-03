export default function TermsPrivacyStyles() {
  return (
    <style>{`
      /* Page-specific Terms & Privacy styles */
      .app-heading {
        font-family: 'DM Sans', system-ui, sans-serif;
        font-weight: 700;
        letter-spacing: -0.03em;
      }

      .app-subheading {
        font-family: 'DM Sans', system-ui, sans-serif;
        font-weight: 600;
      }

      .body-text {
        font-family: 'DM Sans', system-ui, sans-serif;
      }

      .commitment-box {
        position: relative;
        background: linear-gradient(
          135deg,
          rgba(20, 184, 166, 0.05) 0%,
          rgba(14, 165, 233, 0.03) 50%,
          rgba(20, 184, 166, 0.05) 100%
        );
        border: 2px solid;
        border-image: linear-gradient(
          90deg,
          rgba(20, 184, 166, 0.3),
          rgba(14, 165, 233, 0.3),
          rgba(20, 184, 166, 0.3)
        ) 1;
      }

      .section-number {
        font-family: 'DM Sans', system-ui, sans-serif;
        font-weight: 700;
        color: rgba(20, 184, 166, 0.5);
        font-size: 5rem;
        line-height: 1;
        position: absolute;
        left: -60px;
        top: -10px;
        z-index: 0;
        user-select: none;
      }

      @media (max-width: 768px) {
        .section-number {
          font-size: 3rem;
          left: -20px;
          top: -5px;
          opacity: 0.3;
        }
      }

      .decorative-quote {
        font-family: 'DM Sans', system-ui, sans-serif;
        font-size: 8rem;
        font-weight: 700;
        line-height: 1;
        color: rgba(249, 115, 22, 0.08);
        position: absolute;
        top: -40px;
        left: -20px;
        user-select: none;
        pointer-events: none;
      }

      .icon-pulse {
        animation: gentle-pulse 3s ease-in-out infinite;
      }
    `}</style>
  );
}
