import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Shield,
  Sparkles,
  Users,
  Lock,
  Share2,
  MessageSquare,
  Briefcase,
  ArrowUp,
  ChevronDown,
} from "lucide-react";
import Layout from "@/components/Layout";

export default function Donate() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const qrSectionRef = useRef<HTMLSection>(null);
  const transparencySectionRef = useRef<HTMLElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      setHeroMounted(true);
    });
  }, []);

  const scrollToQR = () => {
    qrSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTransparency = () => {
    transparencySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: "Do you sell or share my information?",
      answer:
        "No. Donations don't change how your data is handled. The goal is to keep this tool as safe and respectful as possible for people with records.",
    },
    {
      question: "Can organizations support this?",
      answer:
        "Yes. Re-entry programs, legal clinics, or employers who want to sponsor usage or collaborate can reach out for partnership options.",
    },
  ];

  return (
    <Layout>
      <div style={{ overflowX: 'hidden', width: '100%', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Work+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes shimmer-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float-organic {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15px, -20px) scale(1.05); }
          66% { transform: translate(-10px, 10px) scale(0.95); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .editorial-display {
          font-family: 'Playfair Display', Georgia, serif;
          letter-spacing: -0.02em;
        }

        .editorial-sans {
          font-family: 'Work Sans', system-ui, sans-serif;
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
          background-size: 200% 200%;
          animation: shimmer-flow 8s ease-in-out infinite;
        }

        .organic-blob {
          animation: float-organic 20s ease-in-out infinite;
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }

        .section-number {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          font-size: 8rem;
          line-height: 0.8;
          opacity: 0.08;
          position: absolute;
          z-index: 0;
        }

        .card-magazine {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-magazine:hover {
          transform: translateY(-8px) scale(1.02);
        }

        @media (max-width: 768px) {
          .section-number {
            font-size: 4rem;
          }
        }
      `}</style>

      {/* Hero Section - Dramatic */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a7e72 0%, #0d9488 30%, #f97316 100%)',
        }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 organic-blob opacity-20"
            style={{
              background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-80 h-80 organic-blob opacity-15"
            style={{
              background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10"
            style={{
              background: 'radial-gradient(circle, #ffffff 0%, transparent 60%)',
            }}
          />
        </div>

        <div className="grain-overlay" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-10">
          {/* Heart icon */}
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-md shadow-2xl border-2 border-white/30 transition-all duration-700 ease-out ${
              heroMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <Heart className="w-12 h-12 text-white" fill="white" />
          </div>

          <div className="space-y-8">
            <h1
              className={`display-font text-3xl md:text-5xl lg:text-7xl font-bold text-white transition-all duration-700 ease-out ${
                heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.2)',
                letterSpacing: '-0.02em',
                transitionDelay: '200ms',
                lineHeight: '1.4',
                paddingBottom: '0.5rem'
              }}
            >
              Help more people find
              <br />
              <span className="italic" style={{ fontStyle: 'italic' }}>the words</span> to talk
              <br />
              about their past
            </h1>

            <div
              className={`flex justify-center pt-4 transition-all duration-700 ease-out ${
                heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <Button
                onClick={scrollToQR}
                size="lg"
                className="group relative min-h-[64px] px-12 text-xl font-bold shadow-2xl transition-all duration-500 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
                  color: 'white',
                  borderRadius: '16px',
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Support Reframe.me
                  <Heart className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                  }}
                />
              </Button>
            </div>

            <p
              className={`text-xl md:text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto font-medium transition-all duration-700 ease-out ${
                heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              Reframe.me is built to help people with records share their story in a way that's
              honest, safe, and focused on growth. Your support helps keep it free, privacy-first,
              and improving over time.
            </p>

            <div
              className={`flex justify-center pt-2 transition-all duration-700 ease-out ${
                heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <button
                onClick={scrollToTransparency}
                className="text-white hover:text-white/80 font-semibold text-lg underline decoration-2 underline-offset-8 hover:underline-offset-4 transition-all duration-300"
              >
                How your support is used
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: Payment */}
      <section
        ref={qrSectionRef}
        className="relative py-24 md:py-36 px-6 sm:px-8 lg:px-12 scroll-mt-20 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #fef9f3 0%, #fff9ed 50%, #fef3e2 100%)'
        }}
      >
        <div className="grain-overlay" />

        {/* Section number */}
        <div className="section-number top-12 left-8 md:left-16 editorial-display text-orange-900/10">01</div>

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <div className="max-w-4xl mb-20">
            <div className="h-1 w-24 bg-gradient-to-r from-orange-600 to-transparent mb-8" />
            <h2 className="editorial-display text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 leading-tight">
              Support <span className="italic text-orange-600">directly</span>
            </h2>
            <p className="editorial-sans text-xl md:text-2xl text-gray-700 leading-relaxed font-medium max-w-3xl">
              Right now, donations go straight to me (the creator) through Cash App or PayPal.
              Contributions are voluntary and help cover the real costs of keeping Reframe.me running and improving.
            </p>
          </div>

          {/* Mobile: Big Buttons */}
          <div className="block md:hidden space-y-6 max-w-md mx-auto mb-16">
            {/* Cash App */}
            <a
              href="https://cash.app/$ztalmadge"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="card-magazine relative rounded-3xl p-8 shadow-2xl" style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="editorial-sans text-sm font-bold tracking-wider uppercase text-white/80">Cash App</span>
                  <Heart className="w-6 h-6 text-white/80" />
                </div>
                <p className="editorial-display text-3xl font-bold text-white mb-2">
                  Tap to open
                </p>
                <p className="editorial-sans text-white/90 text-base">
                  Contribute any amount
                </p>
              </div>
            </a>

            {/* PayPal */}
            <a
              href="https://paypal.me/steezyzjt"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="card-magazine relative rounded-3xl p-8 shadow-2xl" style={{
                background: 'linear-gradient(135deg, #0070ba 0%, #003087 100%)',
              }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="editorial-sans text-sm font-bold tracking-wider uppercase text-white/80">PayPal</span>
                  <Heart className="w-6 h-6 text-white/80" />
                </div>
                <p className="editorial-display text-3xl font-bold text-white mb-2">
                  Tap to open
                </p>
                <p className="editorial-sans text-white/90 text-base">
                  Contribute any amount
                </p>
              </div>
            </a>
          </div>

          {/* Desktop: QR Codes */}
          <div className="hidden md:grid grid-cols-2 gap-12 mb-20">
            {/* Cash App Card */}
            <div className="card-magazine relative rounded-3xl overflow-hidden shadow-2xl" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
              border: '3px solid #10b981'
            }}>
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="editorial-display text-3xl font-bold text-gray-900">Cash App</h3>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  }}>
                    <Heart className="w-6 h-6 text-white" fill="white" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="relative p-4 bg-white rounded-2xl shadow-xl">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://cash.app/$ztalmadge"
                      alt="Cash App QR Code"
                      className="w-56 h-56 rounded-xl"
                    />
                  </div>
                </div>

                <a
                  href="https://cash.app/$ztalmadge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center"
                >
                  <span className="editorial-sans text-lg font-bold inline-flex items-center gap-2 transition-all duration-300 hover:gap-4" style={{ color: '#059669' }}>
                    Open Cash App
                    <span className="text-2xl">→</span>
                  </span>
                </a>
              </div>
            </div>

            {/* PayPal Card */}
            <div className="card-magazine relative rounded-3xl overflow-hidden shadow-2xl" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
              border: '3px solid #0070ba'
            }}>
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="editorial-display text-3xl font-bold text-gray-900">PayPal</h3>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #0070ba 0%, #003087 100%)'
                  }}>
                    <Heart className="w-6 h-6 text-white" fill="white" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="relative p-4 bg-white rounded-2xl shadow-xl">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://paypal.me/steezyzjt"
                      alt="PayPal QR Code"
                      className="w-56 h-56 rounded-xl"
                    />
                  </div>
                </div>

                <a
                  href="https://paypal.me/steezyzjt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center"
                >
                  <span className="editorial-sans text-lg font-bold inline-flex items-center gap-2 transition-all duration-300 hover:gap-4" style={{ color: '#003087' }}>
                    Open PayPal
                    <span className="text-2xl">→</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Instructions - Desktop Only */}
          <div className="hidden md:block mb-16">
            <div className="rounded-2xl p-8 text-center" style={{
              background: 'rgba(255, 255, 255, 0.6)',
              border: '2px solid rgba(120, 53, 15, 0.1)'
            }}>
              <p className="editorial-sans text-lg text-gray-700 leading-relaxed font-medium">
                Scan the QR code with your phone or click the link to send a one-time contribution.
                You can add <span className="font-bold text-orange-700">'Reframe.me support'</span> in the note if you'd like.
              </p>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="relative rounded-2xl overflow-hidden p-8 md:p-10 shadow-xl" style={{
            background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
            border: '2px solid #f97316'
          }}>
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
              }}>
                <Lock className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="editorial-sans text-lg font-bold text-orange-900 mb-3">Important safety note</p>
                <p className="editorial-sans text-base text-orange-800 leading-relaxed font-medium">
                  Please don't include any personal or sensitive legal details in payment notes.
                  Your story belongs in your documents, not in a payment memo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Why Your Support Matters */}
      <section className="relative py-24 md:py-36 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{
        background: 'linear-gradient(160deg, #f0fdfa 0%, #ccfbf1 50%, #f0fdfa 100%)'
      }}>
        <div className="grain-overlay" />
        <div className="section-number top-12 right-8 md:right-16 editorial-display text-teal-900/10">02</div>

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-4xl mb-20">
            <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-transparent mb-8" />
            <h2 className="editorial-display text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-12">
              Your support <span className="italic text-teal-600">helps to</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                icon: Sparkles,
                text: "Cover AI and hosting costs so people can generate narratives and letters for free",
                color: "#0d9488",
                bg: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)"
              },
              {
                icon: Shield,
                text: "Keep Reframe.me privacy-first and account-free",
                color: "#f97316",
                bg: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)"
              },
              {
                icon: MessageSquare,
                text: "Improve prompts, wording, and features with feedback from job seekers and re-entry coaches",
                color: "#0891b2",
                bg: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)"
              },
              {
                icon: Users,
                text: "Make it easier for organizations to use this tool with their clients",
                color: "#ea580c",
                bg: "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)"
              }
            ].map((item, i) => (
              <div
                key={i}
                className="card-magazine relative rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden"
                style={{ background: item.bg }}
              >
                <div className="relative z-10 flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{
                    background: item.color
                  }}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="editorial-sans text-lg md:text-xl font-semibold text-gray-900 leading-relaxed pt-2">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-block relative rounded-3xl p-10 md:p-12 shadow-2xl" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
              border: '3px solid #0d9488'
            }}>
              <p className="editorial-display text-2xl md:text-3xl font-bold text-gray-900 italic leading-relaxed">
                Whether you can donate or not,
                <br className="hidden md:block" />
                <span className="text-teal-600"> this tool is here for you.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Transparency */}
      <section
        ref={transparencySectionRef}
        className="relative py-24 md:py-36 px-6 sm:px-8 lg:px-12 scroll-mt-20 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #fafaf9 0%, #f5f5f4 100%)'
        }}
      >
        <div className="grain-overlay" />
        <div className="section-number top-12 left-8 md:left-16 editorial-display text-stone-900/10">03</div>

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-4xl mb-20">
            <div className="h-1 w-24 bg-gradient-to-r from-stone-600 to-transparent mb-8" />
            <h2 className="editorial-display text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              How your support <span className="italic text-orange-600">is used</span>
            </h2>
          </div>

          <div className="space-y-6 mb-16">
            {[
              {
                title: "AI and infrastructure costs",
                desc: "LLM subscription and tokens for generating narratives and letters, plus hosting and basic infrastructure.",
                color: "#0d9488",
                bg: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)"
              },
              {
                title: "Ongoing development",
                desc: "Time spent improving prompts, fixing bugs, polishing the UI, and responding to feedback from people using the tool in real hiring situations.",
                color: "#f97316",
                bg: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)"
              },
              {
                title: "Creator time & sustainability",
                desc: "A portion supports my time working on Reframe.me so this project can keep going instead of burning out.",
                color: "#0891b2",
                bg: "linear-gradient(135deg, #ecfeff 0%, #ffffff 100%)"
              }
            ].map((item, i) => (
              <div
                key={i}
                className="card-magazine relative rounded-3xl p-8 md:p-10 shadow-xl"
                style={{
                  background: item.bg,
                  borderLeft: `6px solid ${item.color}`
                }}
              >
                <h3 className="editorial-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="editorial-sans text-base md:text-lg text-gray-700 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative rounded-3xl p-10 md:p-12 shadow-2xl overflow-hidden" style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            border: '3px solid #0d9488'
          }}>
            <div className="relative z-10 text-center">
              <p className="editorial-sans text-xl md:text-2xl text-gray-900 leading-relaxed font-bold">
                You're supporting a real person maintaining and improving
                a tool that's free for people with records to use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 04: Why This Matters */}
      <section className="relative py-24 md:py-36 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{
        background: 'linear-gradient(160deg, #fff7ed 0%, #ffedd5 50%, #fff7ed 100%)'
      }}>
        <div className="grain-overlay" />
        <div className="section-number top-12 right-8 md:right-16 editorial-display text-orange-900/10">04</div>

        <div className="relative max-w-5xl mx-auto">
          <div className="max-w-4xl mb-16">
            <div className="h-1 w-24 bg-gradient-to-r from-orange-600 to-transparent mb-8" />
            <h2 className="editorial-display text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-12">
              Why this work <span className="italic text-orange-600">matters</span>
            </h2>
            <p className="editorial-sans text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
              Talking about a record with an employer can be one of the hardest parts of a job search.
              Many people don't have a lawyer, career coach, or mentor to help them find the words.
              Reframe.me gives them a starting point — language they can edit, practice, and make their
              own so they can walk into conversations a little more prepared and a little less alone.
            </p>
          </div>

          <div className="relative rounded-3xl p-12 md:p-16 shadow-2xl overflow-hidden" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
            border: '4px solid #0d9488'
          }}>
            <div className="absolute top-8 left-8 editorial-display text-8xl md:text-9xl text-teal-200/30 leading-none pointer-events-none">"</div>
            <div className="absolute bottom-8 right-8 editorial-display text-8xl md:text-9xl text-teal-200/30 leading-none pointer-events-none rotate-180">"</div>

            <div className="relative z-10 text-center space-y-8">
              <p className="editorial-display text-2xl md:text-3xl lg:text-4xl italic text-gray-900 leading-relaxed">
                "My client said this was the first time they saw their story written in a way that
                didn't shame them. It helped them feel ready to respond instead of shutting down."
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-teal-400" />
                <p className="editorial-sans text-base md:text-lg font-bold text-teal-700 tracking-wide uppercase">
                  Re-entry coach, anonymized
                </p>
                <div className="h-px w-16 bg-teal-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 05: Privacy Reassurance */}
      <section className="relative py-24 md:py-36 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{
        background: 'linear-gradient(160deg, #f0fdfa 0%, #ccfbf1 100%)'
      }}>
        <div className="grain-overlay" />
        <div className="section-number top-12 left-8 md:left-16 editorial-display text-teal-900/10">05</div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 shadow-2xl" style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
            }}>
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="editorial-display text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Your data and your donation <br className="hidden md:block" />
              are <span className="italic text-teal-600">separate</span>
            </h2>
          </div>

          <div className="space-y-6 mb-12 max-w-3xl mx-auto">
            {[
              "Reframe.me does not tie your donation to your narrative or letter content.",
              "The app is designed to avoid long-term storage of sensitive answers.",
              "Payment info stays with the payment platform; the tool itself doesn't track your card or bank details."
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-6 p-6 rounded-2xl transition-all duration-300 hover:bg-white/60">
                <div className="flex-shrink-0 w-3 h-3 rounded-full mt-2.5 shadow-md" style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
                }} />
                <p className="editorial-sans text-lg md:text-xl text-gray-800 leading-relaxed font-medium">{text}</p>
              </div>
            ))}
          </div>

          <div className="relative rounded-3xl p-10 md:p-12 shadow-2xl" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
            border: '3px solid #0d9488'
          }}>
            <p className="editorial-sans text-xl md:text-2xl font-bold text-center text-teal-900 leading-relaxed">
              Donations support the tool — not data collection. What you type into Reframe.me is not linked to your contribution.
            </p>
          </div>
        </div>
      </section>

      {/* Section 06: FAQ */}
      <section className="relative py-24 md:py-36 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{
        background: 'linear-gradient(160deg, #fafaf9 0%, #e7e5e4 100%)'
      }}>
        <div className="grain-overlay" />
        <div className="section-number top-12 right-8 md:right-16 editorial-display text-stone-900/10">06</div>

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-1 w-24 bg-gradient-to-r from-stone-600 to-transparent mb-8 mx-auto" />
            <h2 className="editorial-display text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Questions & <span className="italic text-orange-600">Answers</span>
            </h2>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden shadow-xl"
                style={{
                  background: '#ffffff',
                  border: '2px solid #e7e5e4'
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-8 text-left hover:bg-stone-50 transition-colors group"
                  aria-expanded={openFaq === index}
                >
                  <span className="editorial-display text-xl md:text-2xl font-bold text-gray-900 pr-6">{item.question}</span>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300" style={{
                    background: openFaq === index ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' : 'linear-gradient(135deg, #d6d3d1 0%, #a8a29e 100%)'
                  }}>
                    <ChevronDown
                      className={`w-6 h-6 text-white transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="px-8 pb-8 pt-2">
                    <p className="editorial-sans text-lg md:text-xl text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 07: Other Ways to Support */}
      <section className="relative py-24 md:py-36 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{
        background: 'linear-gradient(160deg, #fff7ed 0%, #fed7aa 50%, #fff7ed 100%)'
      }}>
        <div className="grain-overlay" />
        <div className="section-number top-12 left-8 md:left-16 editorial-display text-orange-900/10">07</div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-1 w-24 bg-gradient-to-r from-orange-600 to-transparent mb-8 mx-auto" />
            <h2 className="editorial-display text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Other ways to <span className="italic text-orange-600">support</span>
            </h2>
            <p className="editorial-sans text-xl md:text-2xl text-gray-700 font-semibold">For folks who can't give money</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Share2,
                text: "Share Reframe.me with a re-entry coach, legal aid group, or workforce program.",
                color: "#0d9488",
                bg: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)"
              },
              {
                icon: MessageSquare,
                text: "Send feedback about what's confusing or what would make this more helpful.",
                color: "#f97316",
                bg: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)"
              },
              {
                icon: Briefcase,
                text: "If you work in hiring, consider how fair-chance practices and tools like this can be part of your process.",
                color: "#0891b2",
                bg: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)"
              }
            ].map((item, i) => (
              <div
                key={i}
                className="card-magazine relative rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden"
                style={{ background: item.bg }}
              >
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg" style={{
                    background: item.color
                  }}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="editorial-sans text-base md:text-lg text-gray-800 leading-relaxed font-semibold">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative py-24 md:py-36 px-6 sm:px-8 lg:px-12 overflow-hidden" style={{
        background: 'linear-gradient(160deg, #f0fdfa 0%, #fff7ed 50%, #f0fdfa 100%)'
      }}>
        <div className="grain-overlay" />

        <div className="relative max-w-5xl mx-auto text-center space-y-12">
          <p className="editorial-display text-3xl md:text-4xl lg:text-5xl italic text-gray-900 leading-relaxed">
            If Reframe.me has helped you or someone you care about and you're in a position to give,
            <span className="font-bold text-orange-600"> thank you</span>. If you're not able to donate, you're still exactly who this tool is for.
          </p>

          <Button
            onClick={scrollToQR}
            size="lg"
            className="group relative min-h-[72px] px-16 text-xl md:text-2xl font-bold shadow-2xl transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
              color: 'white',
              borderRadius: '20px',
            }}
          >
            <span className="relative z-10 flex items-center gap-4">
              Support Reframe.me
              <Heart className="w-7 h-7 transition-transform duration-300 group-hover:scale-125" fill="white" />
            </span>
          </Button>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
          }}
          aria-label="Back to top"
        >
          <ArrowUp className="w-7 h-7 text-white" />
        </button>
      )}
      </div>
    </Layout>
  );
}
