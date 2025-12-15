import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Shield, Lock, Eye, Database, FileCheck, Heart } from "lucide-react";
import Layout from "@/components/Layout";

export default function TermsPrivacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

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

        /* Document texture overlay */
        .document-texture {
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(20, 184, 166, 0.015) 2px,
              rgba(20, 184, 166, 0.015) 4px
            );
        }

        /* Animated gradient border for commitment boxes */
        @keyframes border-flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
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

        /* Section number styling */
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

        /* Decorative quote styling */
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

        /* Icon pulse effect */
        @keyframes gentle-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .icon-pulse {
          animation: gentle-pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/50 overflow-hidden document-texture">
        {/* Decorative background elements */}
        <div
          className="absolute top-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)'
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)'
          }}
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto relative">
          {/* Back button */}
          <div className="mb-8">
            <Link href="/">
              <button className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-teal-200/30 hover:bg-white/80 hover:border-teal-300/50 transition-all duration-300 shadow-sm hover:shadow-md">
                <ArrowLeft className="w-4 h-4 text-teal-600 transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="text-sm font-medium text-teal-700 body-text">Back to Home</span>
              </button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-16 relative">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 mb-6 shadow-lg backdrop-blur-sm border border-white/50">
              <FileCheck className="w-10 h-10 text-teal-600 icon-pulse" />
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl app-heading mb-6 bg-gradient-to-br from-slate-800 via-teal-800 to-slate-700 bg-clip-text text-transparent">
              Terms & Privacy
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed body-text font-medium">
              Your privacy and trust are foundational to everything we do.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-100/50 border border-amber-200/50">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm text-amber-800 font-semibold body-text">Effective: December 15, 2025</span>
            </div>
          </div>

          {/* Privacy Commitment Callout */}
          <div className="commitment-box rounded-2xl p-8 md:p-10 mb-12 relative overflow-hidden shadow-xl">
            <div className="decorative-quote" aria-hidden="true">"</div>
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl app-heading text-teal-900 mb-3">
                    Our Core Commitment
                  </h2>
                  <div className="space-y-3 text-slate-700 body-text text-base md:text-lg leading-relaxed">
                    <p className="font-semibold">
                      We never store, share, or sell your personal information.
                    </p>
                    <p>
                      Reframe.me is designed with privacy-first architecture. Your sensitive information exists only in your browser session and disappears when you close the page. We believe your story is yours alone to tell.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">

            {/* Section 1 - What We Collect */}
            <article className="relative">
              <span className="section-number hidden md:inline" aria-hidden="true">01</span>
              <div className="relative z-10 pl-0 md:pl-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Database className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl app-heading text-slate-900">
                    Information We Collect
                  </h2>
                </div>

                <div className="space-y-6 text-slate-600 body-text text-base md:text-lg leading-relaxed">
                  <div className="space-y-4">
                    <h3 className="text-xl app-subheading text-slate-800 flex items-baseline gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0 mt-3" />
                      Information You Provide
                    </h3>
                    <p className="pl-6">
                      When you use our tools to generate disclosure narratives or response letters, you provide personal information including your background, experiences, employment history, and criminal record details. This information is processed entirely in your browser and transmitted securely to our AI service provider (OpenAI) to generate your personalized documents.
                    </p>
                    <div className="pl-6 bg-slate-50 border-l-4 border-teal-500 p-5 rounded-r-lg">
                      <p className="font-semibold text-slate-800 mb-2">Important:</p>
                      <p className="text-base">
                        We do not store any of this information on our servers. Once your session ends, all data is permanently deleted from our systems.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-200">
                    <h3 className="text-xl app-subheading text-slate-800 flex items-baseline gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 mt-3" />
                      Technical Information
                    </h3>
                    <p className="pl-6">
                      Like most websites, we may automatically collect certain technical information such as your IP address, browser type, device information, and general usage patterns. This data is anonymized and used solely to maintain service security and improve functionality.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 2 - How We Use Information */}
            <article className="relative">
              <span className="section-number hidden md:inline" aria-hidden="true">02</span>
              <div className="relative z-10 pl-0 md:pl-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl app-heading text-slate-900">
                    How We Use Your Information
                  </h2>
                </div>

                <div className="space-y-6 text-slate-600 body-text text-base md:text-lg leading-relaxed">
                  <p>
                    The personal information you provide is used for one purpose only: to generate your personalized disclosure narratives and response letters through our AI service.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                        <h4 className="font-semibold text-slate-800 body-text">We DO:</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-600 mt-1">✓</span>
                          <span>Process your data to generate documents</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-600 mt-1">✓</span>
                          <span>Use encryption for all data transmission</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-600 mt-1">✓</span>
                          <span>Delete session data immediately</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <h4 className="font-semibold text-slate-800 body-text">We DO NOT:</h4>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">✗</span>
                          <span>Store your information in databases</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">✗</span>
                          <span>Share data with third parties</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">✗</span>
                          <span>Sell or monetize your information</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 3 - AI Service Provider */}
            <article className="relative">
              <span className="section-number hidden md:inline" aria-hidden="true">03</span>
              <div className="relative z-10 pl-0 md:pl-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl app-heading text-slate-900">
                    Third-Party AI Processing
                  </h2>
                </div>

                <div className="space-y-6 text-slate-600 body-text text-base md:text-lg leading-relaxed">
                  <p>
                    To generate your personalized documents, we use OpenAI's API service. When you submit your information, it is transmitted securely to OpenAI's servers where the AI model processes it to create your narratives and letters.
                  </p>

                  <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
                    <h4 className="font-semibold text-purple-900 mb-3 app-subheading text-lg">
                      OpenAI's Data Practices
                    </h4>
                    <ul className="space-y-2 text-base">
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold mt-0.5">•</span>
                        <span>OpenAI does not use data submitted via their API to train or improve their models</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold mt-0.5">•</span>
                        <span>API data is retained for 30 days for abuse monitoring, then permanently deleted</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-purple-600 font-bold mt-0.5">•</span>
                        <span>All transmissions use enterprise-grade encryption</span>
                      </li>
                    </ul>
                    <p className="mt-4 text-sm text-purple-700">
                      Learn more: <a href="https://openai.com/enterprise-privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-900 font-semibold">OpenAI Enterprise Privacy</a>
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 4 - Your Data Rights */}
            <article className="relative">
              <span className="section-number hidden md:inline" aria-hidden="true">04</span>
              <div className="relative z-10 pl-0 md:pl-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl app-heading text-slate-900">
                    Your Rights & Control
                  </h2>
                </div>

                <div className="space-y-6 text-slate-600 body-text text-base md:text-lg leading-relaxed">
                  <p>
                    You have complete control over your information:
                  </p>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-4 bg-slate-50 p-5 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-teal-700 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-1">Session Control</h4>
                        <p>Your data exists only during your active session. Close your browser tab and everything is gone.</p>
                      </div>
                    </li>

                    <li className="flex items-start gap-4 bg-slate-50 p-5 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-teal-700 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-1">No Account Required</h4>
                        <p>We don't require registration or account creation, so there's no persistent profile to manage or delete.</p>
                      </div>
                    </li>

                    <li className="flex items-start gap-4 bg-slate-50 p-5 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-teal-700 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-1">Local Storage Only</h4>
                        <p>Any information saved between pages is stored locally in your browser. You can clear this anytime through your browser settings.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            {/* Section 5 - Terms of Use */}
            <article className="relative">
              <span className="section-number hidden md:inline" aria-hidden="true">05</span>
              <div className="relative z-10 pl-0 md:pl-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-slate-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl app-heading text-slate-900">
                    Terms of Service
                  </h2>
                </div>

                <div className="space-y-6 text-slate-600 body-text text-base md:text-lg leading-relaxed">
                  <div className="space-y-4">
                    <h3 className="text-xl app-subheading text-slate-800">Acceptance of Terms</h3>
                    <p>
                      By using Reframe.me, you agree to these terms. If you don't agree, please don't use the service.
                    </p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-200">
                    <h3 className="text-xl app-subheading text-slate-800">Service Description</h3>
                    <p>
                      Reframe.me is a free tool that helps justice-involved individuals prepare disclosure narratives and response letters for employment purposes. The service uses AI to generate personalized content based on information you provide.
                    </p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-200">
                    <h3 className="text-xl app-subheading text-slate-800">Not Legal Advice</h3>
                    <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-xl">
                      <p className="font-semibold text-amber-900 mb-2">
                        Important Disclaimer:
                      </p>
                      <p className="text-amber-800">
                        Reframe.me provides educational tools and general information only. The content generated is not legal advice and should not be relied upon as such. For legal guidance specific to your situation, please consult with a qualified attorney.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-200">
                    <h3 className="text-xl app-subheading text-slate-800">AI-Generated Content</h3>
                    <p>
                      All narratives and letters are generated by artificial intelligence based on your input. While we strive for accuracy and helpfulness, you should:
                    </p>
                    <ul className="space-y-2 pl-6">
                      <li className="flex items-start gap-3">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>Review all generated content carefully</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>Edit and personalize the content to accurately reflect your story</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>Verify all facts and ensure truthfulness before using any content</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-200">
                    <h3 className="text-xl app-subheading text-slate-800">User Responsibilities</h3>
                    <p>You agree to:</p>
                    <ul className="space-y-2 pl-6">
                      <li className="flex items-start gap-3">
                        <span className="text-slate-400 mt-1">→</span>
                        <span>Provide accurate information</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-slate-400 mt-1">→</span>
                        <span>Use the service for lawful purposes only</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-slate-400 mt-1">→</span>
                        <span>Not attempt to compromise the security or integrity of the service</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-slate-400 mt-1">→</span>
                        <span>Respect the privacy and rights of others</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-200">
                    <h3 className="text-xl app-subheading text-slate-800">Limitation of Liability</h3>
                    <p>
                      Reframe.me is provided "as is" without warranties of any kind. We are not liable for any outcomes resulting from your use of the generated content. Your use of this service is at your own risk.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Section 6 - Changes & Contact */}
            <article className="relative">
              <span className="section-number hidden md:inline" aria-hidden="true">06</span>
              <div className="relative z-10 pl-0 md:pl-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-rose-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl app-heading text-slate-900">
                    Updates & Contact
                  </h2>
                </div>

                <div className="space-y-6 text-slate-600 body-text text-base md:text-lg leading-relaxed">
                  <div className="space-y-4">
                    <h3 className="text-xl app-subheading text-slate-800">Changes to These Terms</h3>
                    <p>
                      We may update these terms and privacy practices from time to time. Significant changes will be noted on this page with an updated effective date. Your continued use of Reframe.me after changes constitutes acceptance of the updated terms.
                    </p>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-200">
                    <h3 className="text-xl app-subheading text-slate-800">Questions or Concerns?</h3>
                    <p>
                      If you have questions about these terms or our privacy practices, we're here to help. While this is a free community service, we're committed to transparency and user trust.
                    </p>
                  </div>
                </div>
              </div>
            </article>

          </div>

          {/* Final Statement */}
          <div className="mt-20 mb-12">
            <div className="commitment-box rounded-2xl p-8 md:p-10 relative overflow-hidden shadow-xl text-center">
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 mb-6 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl app-heading text-teal-900 mb-4">
                  Built with Care
                </h3>
                <p className="text-lg text-slate-700 body-text max-w-2xl mx-auto leading-relaxed">
                  Reframe.me exists to support your journey toward meaningful work and second chances. Your privacy, dignity, and success matter to us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
