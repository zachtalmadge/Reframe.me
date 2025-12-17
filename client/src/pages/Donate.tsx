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
  const qrSectionRef = useRef<HTMLElement>(null);
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes shimmer-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
        }

        .organic-blob {
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        }

        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .card-3d:hover {
          transform: translateY(-12px) rotateX(2deg) rotateY(2deg);
        }

        .qr-card {
          position: relative;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
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
          filter: blur(20px);
        }

        .qr-card:hover::before {
          opacity: 0.6;
        }

        .qr-card:hover {
          transform: translateY(-8px) scale(1.02);
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

      {/* Payment Section - Mobile-First Responsive */}
      <section
        ref={qrSectionRef}
        className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 scroll-mt-20 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 50%, #ecfdf5 100%)',
        }}
      >
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 organic-blob bg-teal-200/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 organic-blob bg-orange-200/20 blur-3xl" />
        </div>

        <div className="grain-overlay" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16 px-4">
            <div className="inline-block mb-4">
              <div className="w-20 h-1 shimmer-gradient rounded-full mx-auto mb-8" />
            </div>
            <h2 className="display-font text-3xl sm:text-4xl md:text-6xl font-bold mb-6" style={{ paddingBottom: '0.25rem' }}>
              Support Reframe.me <span className="text-gradient-warm">directly</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-medium">
              Right now, donations go straight to me (the creator) through Cash App or PayPal.
              Contributions are voluntary and help cover the real costs of keeping Reframe.me running and improving.
            </p>
          </div>

          {/* Mobile: Big Buttons (< 768px) */}
          <div className="block md:hidden space-y-6 max-w-md mx-auto mb-12">
            {/* Cash App Button */}
            <a
              href="https://cash.app/$ztalmadge"
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full"
            >
              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center">
                    <div className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg mb-4">
                      <span className="text-base font-bold text-white tracking-wide">Cash App</span>
                    </div>
                  </div>

                  <div className="relative">
                    <Button
                      size="lg"
                      className="w-full min-h-[72px] text-xl font-bold shadow-xl transition-all duration-500"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        borderRadius: '16px',
                      }}
                    >
                      <span className="flex items-center justify-center gap-3">
                        Open Cash App
                        <Heart className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
                      </span>
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-600 font-medium">
                    Tap to open Cash App and contribute any amount
                  </p>
                </CardContent>
              </Card>
            </a>

            {/* PayPal Button */}
            <a
              href="https://paypal.me/steezyzjt"
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full"
            >
              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-white to-indigo-50/50 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center">
                    <div className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg mb-4">
                      <span className="text-base font-bold text-white tracking-wide">PayPal</span>
                    </div>
                  </div>

                  <div className="relative">
                    <Button
                      size="lg"
                      className="w-full min-h-[72px] text-xl font-bold shadow-xl transition-all duration-500"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white',
                        borderRadius: '16px',
                      }}
                    >
                      <span className="flex items-center justify-center gap-3">
                        Open PayPal
                        <Heart className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
                      </span>
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-600 font-medium">
                    Tap to open PayPal and contribute any amount
                  </p>
                </CardContent>
              </Card>
            </a>
          </div>

          {/* Desktop: QR Codes + Links (>= 768px) */}
          <div className="hidden md:grid md:grid-cols-2 gap-10 max-w-4xl mx-auto mb-12">
            {/* Cash App Card */}
            <div className="qr-card">
              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm">
                <CardContent className="p-10 space-y-6">
                  <div className="text-center">
                    <div className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                      <span className="text-base font-bold text-white tracking-wide">Cash App</span>
                    </div>
                  </div>

                  <div className="flex justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-300 blur-2xl opacity-30 rounded-3xl transform scale-95" />
                    <div className="relative p-4 bg-white rounded-2xl shadow-xl">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://cash.app/$ztalmadge"
                        alt="Cash App QR Code"
                        className="w-56 h-56 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <a
                      href="https://cash.app/$ztalmadge"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lg font-bold text-green-700 hover:text-green-600 underline decoration-2 underline-offset-4 hover:underline-offset-8 transition-all duration-300"
                    >
                      Open CashApp
                      <span className="text-xl">→</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* PayPal Card */}
            <div className="qr-card">
              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-white to-indigo-50/50 backdrop-blur-sm">
                <CardContent className="p-10 space-y-6">
                  <div className="text-center">
                    <div className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg">
                      <span className="text-base font-bold text-white tracking-wide">PayPal</span>
                    </div>
                  </div>

                  <div className="flex justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-blue-300 blur-2xl opacity-30 rounded-3xl transform scale-95" />
                    <div className="relative p-4 bg-white rounded-2xl shadow-xl">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://paypal.me/steezyzjt"
                        alt="PayPal QR Code"
                        className="w-56 h-56 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <a
                      href="https://paypal.me/steezyzjt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lg font-bold text-indigo-700 hover:text-indigo-600 underline decoration-2 underline-offset-4 hover:underline-offset-8 transition-all duration-300"
                    >
                      Open PayPal
                      <span className="text-xl">→</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Unified Instructions - Desktop Only */}
          <div className="hidden md:block max-w-3xl mx-auto mb-16">
            <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100">
              <p className="text-lg text-gray-700 leading-relaxed font-medium">
                Scan the QR code with your phone or click the link to send a one-time contribution.
                You can add <span className="font-bold text-teal-700">'Reframe.me support'</span> in the note if you'd like.
              </p>
            </div>
          </div>

          {/* Safety Notice - Enhanced */}
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/50 p-8 shadow-lg overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 organic-blob bg-orange-200/30" />
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-orange-900 mb-2 text-lg">Important safety note</p>
                  <p className="text-base text-orange-800 leading-relaxed">
                    Please don't include any personal or sensitive legal details in payment notes.
                    Your story belongs in your documents, not in a payment memo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Your Support Matters - Asymmetric Grid */}
      <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
        <div className="grain-overlay" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="w-16 h-1 shimmer-gradient rounded-full mx-auto mb-6" />
            </div>
            <h2 className="display-font text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ paddingBottom: '0.25rem' }}>
              Your support helps to
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Card 1 - Larger */}
            <Card className="card-3d border-0 shadow-xl md:row-span-1 overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100/50">
              <CardContent className="p-8 relative">
                <div className="absolute -right-8 -top-8 w-32 h-32 organic-blob bg-teal-200/30" />
                <div className="relative space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                    Cover AI and hosting costs so people can generate narratives and letters for free
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="card-3d border-0 shadow-xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/50">
              <CardContent className="p-8 relative">
                <div className="absolute -left-8 -bottom-8 w-32 h-32 organic-blob bg-orange-200/30" />
                <div className="relative space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                    Keep Reframe.me privacy-first and account-free
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="card-3d border-0 shadow-xl overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-100/50">
              <CardContent className="p-8 relative">
                <div className="absolute -right-12 -bottom-12 w-40 h-40 organic-blob bg-cyan-200/30" />
                <div className="relative space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                    Improve prompts, wording, and features with feedback from job seekers and re-entry coaches
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="card-3d border-0 shadow-xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100/50">
              <CardContent className="p-8 relative">
                <div className="absolute -left-8 -top-8 w-32 h-32 organic-blob bg-amber-200/30" />
                <div className="relative space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                    Make it easier for organizations to use this tool with their clients
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-100 via-orange-100 to-teal-100 blur-xl opacity-60" />
              <div className="relative px-10 py-6 rounded-3xl bg-white shadow-xl border-2 border-teal-100">
                <p className="display-font text-2xl font-semibold text-gray-800 italic">
                  Whether you can donate or not,
                  <br />
                  <span className="text-gradient-warm">this tool is here for you.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section - Editorial Style */}
      <section
        ref={transparencySectionRef}
        className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 scroll-mt-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 50%, #fafaf9 100%)',
        }}
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
            {[
              {
                title: "AI and infrastructure costs",
                desc: "LLM subscription and tokens for generating narratives and letters, plus hosting and basic infrastructure.",
                color: "teal",
              },
              {
                title: "Ongoing development",
                desc: "Time spent improving prompts, fixing bugs, polishing the UI, and responding to feedback from people using the tool in real hiring situations.",
                color: "orange",
              },
              {
                title: "Creator time & sustainability",
                desc: "A portion supports my time working on Reframe.me so this project can keep going instead of burning out.",
                color: "cyan",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl border-2 bg-white p-8 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden group"
                style={{
                  borderColor: item.color === 'teal' ? '#14b8a6' : item.color === 'orange' ? '#f97316' : '#06b6d4',
                }}
              >
                <div className="absolute -right-16 -bottom-16 w-48 h-48 organic-blob opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${item.color === 'teal' ? '#14b8a650' : item.color === 'orange' ? '#f9731650' : '#06b6d450'} 0%, transparent 70%)`,
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

      {/* Why This Work Matters - Testimonial with Impact */}
      <section className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden bg-gradient-to-br from-orange-50 via-teal-50 to-orange-50">
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

      {/* Privacy & Data Reassurance */}
      <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 mb-8 shadow-xl">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ paddingBottom: '0.25rem' }}>
              Your data and your donation are <span className="text-gradient-warm italic">separate</span>
            </h2>
          </div>

          <div className="space-y-5 max-w-2xl mx-auto mb-12">
            {[
              "Reframe.me does not tie your donation to your narrative or letter content.",
              "The app is designed to avoid long-term storage of sensitive answers.",
              "Payment info stays with the payment platform; the tool itself doesn't track your card or bank details.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-teal-50/50 transition-colors">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 mt-2 flex-shrink-0 shadow-md" />
                <p className="text-lg text-gray-700 leading-relaxed font-medium">{text}</p>
              </div>
            ))}
          </div>

          <div className="relative p-8 rounded-2xl overflow-hidden shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)',
              border: '2px solid #14b8a6',
            }}
          >
            <div className="absolute -right-12 -bottom-12 w-48 h-48 organic-blob bg-teal-200/20" />
            <p className="relative text-lg font-bold text-center text-teal-900">
              Donations support the tool — not data collection. What you type into Reframe.me is not linked to your contribution.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section - Modern Accordion */}
      <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-14 px-4">
            <div className="w-16 h-1 shimmer-gradient rounded-full mx-auto mb-8" />
            <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ paddingBottom: '0.25rem' }}>
              Questions & <span className="text-gradient-warm italic">Answers</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border-2 border-gray-200 bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-7 text-left hover:bg-gray-50 transition-colors group"
                  aria-expanded={openFaq === index}
                >
                  <span className="text-xl font-bold text-gray-900 pr-4 display-font">{item.question}</span>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <ChevronDown
                      className={`w-5 h-5 text-white transition-transform duration-300 ${
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
                  <div className="px-7 pb-7 pt-2 bg-gradient-to-br from-teal-50/30 to-transparent">
                    <p className="text-lg text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Ways to Support */}
      <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 overflow-hidden bg-gradient-to-br from-orange-50 via-teal-50 to-orange-50">
        <div className="grain-overlay" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14 px-4">
            <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ paddingBottom: '0.25rem' }}>
              Other ways to <span className="text-gradient-warm italic">support</span>
            </h2>
            <p className="text-xl text-gray-600 font-medium">For folks who can't give money</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Share2,
                text: "Share Reframe.me with a re-entry coach, legal aid group, or workforce program.",
                color: "teal",
              },
              {
                icon: MessageSquare,
                text: "Send feedback about what's confusing or what would make this more helpful.",
                color: "orange",
              },
              {
                icon: Briefcase,
                text: "If you work in hiring, consider how fair-chance practices and tools like this can be part of your process.",
                color: "cyan",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="card-3d border-0 shadow-xl overflow-hidden bg-white hover:shadow-2xl"
              >
                <CardContent className="p-8 text-center space-y-6 relative">
                  <div className={`absolute -right-8 -bottom-8 w-32 h-32 organic-blob opacity-20`}
                    style={{
                      background: `radial-gradient(circle, ${item.color === 'teal' ? '#14b8a6' : item.color === 'orange' ? '#f97316' : '#06b6d4'} 0%, transparent 70%)`,
                    }}
                  />
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br shadow-lg"
                    style={{
                      background: item.color === 'teal' ? 'linear-gradient(135deg, #14b8a6, #0d9488)' : item.color === 'orange' ? 'linear-gradient(135deg, #f97316, #fb923c)' : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    }}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="relative text-base text-gray-700 leading-relaxed font-medium">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA - Emotional Impact */}
      <section className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden bg-gradient-to-br from-white via-teal-50/30 to-orange-50/30">
        <div className="grain-overlay" />

        <div className="relative max-w-4xl mx-auto text-center space-y-12">
          <p className="display-font text-3xl md:text-4xl italic text-gray-800 leading-relaxed">
            If Reframe.me has helped you or someone you care about and you're in a position to give,
            <span className="text-gradient-warm font-bold"> thank you</span>. If you're not able to donate, you're still exactly who this tool is for.
          </p>

          <Button
            onClick={scrollToQR}
            size="lg"
            className="group relative min-h-[64px] px-14 text-xl font-bold shadow-2xl transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
              color: 'white',
              borderRadius: '16px',
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Support Reframe.me
              <Heart className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" fill="white" />
            </span>
          </Button>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center shimmer-gradient"
          aria-label="Back to top"
        >
          <ArrowUp className="w-7 h-7 text-white" />
        </button>
      )}
      </div>
    </Layout>
  );
}
