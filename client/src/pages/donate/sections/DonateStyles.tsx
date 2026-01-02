export function DonateStyles() {
  return (
    <style>{`
        @keyframes float-subtle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(20, 184, 166, 0.3), 0 0 40px rgba(249, 115, 22, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(20, 184, 166, 0.5), 0 0 60px rgba(249, 115, 22, 0.3);
          }
        }

        .display-font {
          font-family: 'Fraunces', Georgia, serif;
          letter-spacing: -0.02em;
        }

        .grain-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
        }

        .shimmer-gradient {
          background: linear-gradient(
            135deg,
            #0d9488 0%,
            #14b8a6 25%,
            #f97316 50%,
            #14b8a6 75%,
            #0d9488 100%
          );
          background-size: 300% 300%;
          animation: shimmer-flow 8s ease infinite;
        }

        .text-gradient-warm {
          background: linear-gradient(135deg, #0d9488 0%, #f97316 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          padding-right: 4px;
          display: inline-block;
          animation: gentle-breathe 6s ease-in-out infinite;
        }

        .organic-blob {
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: float-subtle 8s ease-in-out infinite;
        }

        .card-3d {
          transform-style: preserve-3d;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        .card-3d:hover {
          transform: translateY(-16px) rotateX(3deg) scale(1.02);
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04),
            0 0 0 1px rgba(20, 184, 166, 0.1),
            0 0 40px rgba(20, 184, 166, 0.15);
        }

        .qr-card {
          position: relative;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .qr-card::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #14b8a6, #f97316);
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: -1;
          filter: blur(24px);
        }

        .qr-card:hover::before {
          opacity: 0.7;
          animation: glow-pulse 2s ease-in-out infinite;
        }

        .qr-card:hover {
          transform: translateY(-10px) scale(1.03);
        }

        /* Enhanced button states */
        .donate-button-enhanced {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .donate-button-enhanced::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .donate-button-enhanced:hover::before {
          width: 300px;
          height: 300px;
        }

        .donate-button-enhanced:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow:
            0 12px 24px rgba(0, 0, 0, 0.15),
            0 0 0 3px rgba(255, 255, 255, 0.3),
            0 0 40px rgba(20, 184, 166, 0.3);
        }

        .donate-button-enhanced:active {
          transform: translateY(0) scale(0.98);
        }

        /* Refined FAQ accordion */
        .faq-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-item:hover {
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05),
            0 0 0 2px rgba(20, 184, 166, 0.1);
        }

        /* Smoother section transitions */
        @media (prefers-reduced-motion: no-preference) {
          section {
            animation: fadeIn 0.6s ease-out backwards;
          }

          section:nth-child(2) { animation-delay: 0.1s; }
          section:nth-child(3) { animation-delay: 0.2s; }
          section:nth-child(4) { animation-delay: 0.3s; }
        }
      `}</style>
  );
}
