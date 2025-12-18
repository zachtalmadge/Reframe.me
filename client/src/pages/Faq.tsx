import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, FileText, Scale, Shield, Lightbulb, Users, AlertCircle, BookOpen, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "why-different-versions",
    question: "Why might I want different ways to talk about my record?",
    icon: MessageSquare,
    category: "Your Story",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          Different situations often call for different versions of your story. A quick form might only need a sentence, while a longer interview might give you space to share more context. The job, the person you're talking to, and what feels safe for you can all shape how much detail makes sense.
        </p>
        <p>
          Having a few prepared versions can help you feel less caught off guard and more in control. You're not changing the facts—you're choosing how much to share and what to focus on for each moment.
        </p>
        <p>
          It's completely normal to feel unsure about how to talk about your record. Many people find that practicing a few different versions helps build confidence over time.
        </p>
        <p>
          This is general guidance, not legal advice. If you have questions about what you're required to disclose, consider talking with a legal aid organization or employment counselor in your area.
        </p>
      </div>
    ),
  },
  {
    id: "what-is-pre-adverse-letter",
    question: "What is a pre-adverse action response letter, and when would I use one?",
    icon: FileText,
    category: "Letters & Responses",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          In some hiring processes, if something on your background check might lead an employer to change an offer or decide not to hire you, they may send you a "pre-adverse action" notice first. This gives you a chance to respond before a final decision is made.
        </p>
        <p>
          A pre-adverse action response letter is your opportunity to:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Correct any mistakes in the background report</li>
          <li>Share context about your record and circumstances</li>
          <li>Highlight the steps you've taken to grow and why you're still a strong fit for the job</li>
        </ul>
        <p>
          Laws and procedures vary by location and situation. This page cannot tell you exactly what your rights are or guarantee any outcome. This is not legal advice.
        </p>
        <p>
          If you receive a pre-adverse action notice, consider reaching out to a lawyer, legal aid organization, or local employment rights group to understand your specific options and rights.
        </p>
      </div>
    ),
  },
  {
    id: "when-disclose",
    question: "When should I disclose my record?",
    icon: Lightbulb,
    category: "Disclosure Timing",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          There is no single right answer. Many people choose to wait until after an initial interview or job offer, while others prefer to share earlier in the process. Laws vary by state and industry, so what works in one situation may not apply to another.
        </p>
        <p>
          Some states have "Ban the Box" laws that limit when employers can ask about criminal history. In those places, you may not be required to disclose until later in the hiring process.
        </p>
        <p>
          Consider speaking with a legal professional or employment counselor who understands your local laws and can help you decide what feels right for your situation.
        </p>
      </div>
    ),
  },
  {
    id: "pre-adverse-rights",
    question: "What are my rights during a pre-adverse action notice?",
    icon: Scale,
    category: "Your Rights",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          Under the Fair Credit Reporting Act (FCRA), if an employer is considering not hiring you based on your background check, they must first send you a "pre-adverse action" notice. This gives you a chance to review the report and respond before a final decision is made.
        </p>
        <p>
          You typically have at least five business days to dispute any errors or provide context. This is often where a thoughtful response letter can make a difference.
        </p>
        <p>
          Keep in mind that laws vary by state, and some employers may have different timelines or processes. This is general information, not legal advice. If you believe your rights have been violated, consider consulting with an attorney who specializes in employment law.
        </p>
      </div>
    ),
  },
  {
    id: "letter-effectiveness",
    question: "Does this letter actually work?",
    icon: Shield,
    category: "Effectiveness",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          We cannot guarantee any specific outcome. Every employer, situation, and background is different. What we can say is that a well-written, professional response that acknowledges your past and highlights your growth can help employers see beyond a background check.
        </p>
        <p>
          Many people have found that taking the time to craft a thoughtful response shows responsibility and self-awareness, qualities that employers value.
        </p>
        <p>
          This tool is meant to help you put your best foot forward, but hiring decisions ultimately rest with each employer. Laws and employer practices vary by location and industry. This is not legal advice. If you have questions about your rights, consider consulting with an attorney or legal aid organization.
        </p>
      </div>
    ),
  },
  {
    id: "privacy-data",
    question: "Is my information stored or shared?",
    icon: Shield,
    category: "Privacy & Security",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          We take your privacy seriously. The information you enter is used only to generate your documents and is not stored on our servers after your session ends. We do not sell or share your personal information with third parties.
        </p>
        <p>
          However, once you download or copy your documents, you are responsible for how that information is used or shared. We recommend saving your documents in a secure location.
        </p>
        <p>
          For complete details, please review our privacy policy. If you have specific concerns about data security, consider consulting with a privacy professional.
        </p>
      </div>
    ),
  },
  {
    id: "job-guarantee",
    question: "Can this guarantee I get a job or keep a job?",
    icon: Users,
    category: "Expectations",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          No. We cannot guarantee any employment outcome. Hiring decisions depend on many factors beyond a background check, including qualifications, interview performance, references, and employer preferences.
        </p>
        <p>
          What we offer is a tool to help you communicate your story professionally and confidently. Many people find that being prepared helps reduce anxiety and allows them to focus on showing their strengths.
        </p>
        <p>
          Employment laws and protections vary by state and industry. This is general information, not legal advice. We encourage you to continue building your skills, seeking support from employment programs, and consulting with a legal professional if you have questions about your rights.
        </p>
      </div>
    ),
  },
  {
    id: "legal-advice",
    question: "Is this legal advice? Are you my lawyer?",
    icon: AlertCircle,
    category: "Legal Disclaimer",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">No.</span> Reframe.me is not a law firm, and we are not your attorney. The information and documents provided here are for educational and informational purposes only and do not constitute legal advice.
        </p>
        <p>
          Every situation is unique, and laws vary significantly by state, county, and industry. What applies in one place may not apply in another.
        </p>
        <p>
          If you have legal questions or believe your rights have been violated, we strongly encourage you to consult with a qualified attorney or legal aid organization in your area. Many communities offer free or low-cost legal assistance for employment matters.
        </p>
      </div>
    ),
  },
  {
    id: "who-is-this-for",
    question: "Who is Reframe.me for (and not for)?",
    icon: BookOpen,
    category: "About This Tool",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          Reframe.me is designed to help people with criminal records prepare for employment conversations. This includes those who are job searching, responding to a pre-adverse action notice, or simply want to practice talking about their background.
        </p>
        <p>
          This tool may not be the right fit if you need legal representation, are facing active criminal charges, or have questions about court proceedings. In those cases, please seek help from a qualified attorney.
        </p>
        <p>
          We believe in second chances and want to support your journey, but we also want to be honest about what this tool can and cannot do. Laws vary by location, and this information is not legal advice. A legal professional can help you understand your specific rights and options.
        </p>
      </div>
    ),
  },
  {
    id: "legal-proceedings",
    question: "Can I use this letter in court or for legal proceedings?",
    icon: Scale,
    category: "Legal Use",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          The documents generated here are intended for employment purposes, such as responding to a pre-adverse action notice or preparing for job interviews. They are not designed for use in court, legal filings, or other formal legal proceedings.
        </p>
        <p>
          If you need documents for legal purposes, please work with an attorney who can prepare materials appropriate for your specific case and jurisdiction.
        </p>
        <p>
          Using these materials in a legal context without professional guidance could have unintended consequences. We want to help, but we also want you to be protected.
        </p>
      </div>
    ),
  },
  {
    id: "reuse-materials",
    question: "Can I reuse a narrative or letter for different jobs?",
    icon: RefreshCw,
    category: "Usage Tips",
    answer: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          Many people choose to adapt their narratives for different opportunities. The core of your story—your growth, what you've learned, and where you're headed—often stays the same, but you may want to adjust details to match the specific job or company.
        </p>
        <p>
          For pre-adverse action response letters, it's important to make sure the details match the specific employer and situation. A generic letter may not be as effective as one tailored to the circumstances.
        </p>
        <p>
          We encourage you to use these tools as a starting point and refine your materials as you learn what resonates with employers in your field. Remember that laws and employer requirements vary by location and industry. This is general guidance, not legal advice—consult with a legal professional if you have specific questions.
        </p>
      </div>
    ),
  },
];

export default function Faq() {
  const [openItem, setOpenItem] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');

        /* Dot pattern background */
        .dot-pattern {
          background-color: #FAFAF9;
          background-image: radial-gradient(circle, #0D9488 0.5px, transparent 0.5px);
          background-size: 24px 24px;
          background-position: 0 0, 12px 12px;
        }

        .dot-pattern-dark {
          background-color: #0f172a;
          background-image: radial-gradient(circle, rgba(13, 148, 136, 0.15) 0.5px, transparent 0.5px);
          background-size: 24px 24px;
        }

        /* Paper texture overlay */
        .paper-texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        @keyframes float-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

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

        .gradient-shimmer {
          background: linear-gradient(
            135deg,
            rgba(20, 184, 166, 0.03) 0%,
            rgba(249, 115, 22, 0.03) 25%,
            rgba(20, 184, 166, 0.03) 50%,
            rgba(249, 115, 22, 0.03) 75%,
            rgba(20, 184, 166, 0.03) 100%
          );
          background-size: 300% 300%;
          animation: shimmer-bg 10s ease infinite;
        }

        .category-badge {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>

      <section
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 min-h-screen dot-pattern dark:dot-pattern-dark relative overflow-hidden"
        aria-labelledby="faq-heading"
      >
        {/* Paper texture overlay */}
        <div className="paper-texture absolute inset-0 pointer-events-none" />

        {/* Subtle decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-chart-2/10 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Hero section */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700 tracking-wide">Knowledge Base</span>
            </div>

            <h1
              id="faq-heading"
              className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-br from-gray-900 via-teal-800 to-gray-900 bg-clip-text text-transparent pb-2"
              style={{ fontFamily: 'Fraunces, Georgia, serif', letterSpacing: '-0.03em' }}
            >
              Everything You Need to Know
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Clear answers about background checks, disclosure, and your rights during the hiring process.
            </p>
          </div>

          {/* Important notice - redesigned */}
          <div
            className="rounded-2xl p-6 md:p-8 mb-12 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(249, 115, 22, 0.12) 100%)',
              border: '2px solid rgba(249, 115, 22, 0.2)'
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <AlertCircle className="w-full h-full text-orange-500" />
            </div>

            <div className="relative space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-orange-900">Important Disclaimer</h3>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                Reframe.me is not a law firm and does not provide legal advice. The information here is for educational purposes only. We cannot guarantee hiring outcomes—every situation is unique, and employment laws vary by location and industry.
              </p>

              <p className="text-sm text-gray-700 leading-relaxed">
                When possible, consult with a qualified attorney or legal aid organization about your specific circumstances.
              </p>
            </div>
          </div>

          {/* FAQs - card-based design */}
          <div className="space-y-4 mb-16">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              const isOpen = openItem === faq.id;

              return (
                <div
                  key={faq.id}
                  className="faq-card group"
                  data-testid={`faq-item-${faq.id}`}
                >
                  <div
                    className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-teal-200"
                    style={{
                      boxShadow: isOpen ? '0 10px 40px rgba(20, 184, 166, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <button
                      onClick={() => setOpenItem(isOpen ? "" : faq.id)}
                      className="w-full text-left p-6 md:p-8 transition-colors duration-200"
                      data-testid={`faq-trigger-${faq.id}`}
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                          style={{
                            background: isOpen
                              ? 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)'
                              : 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(8, 145, 178, 0.1) 100%)'
                          }}
                        >
                          <Icon
                            className={`w-6 h-6 transition-colors duration-300 ${
                              isOpen ? 'text-white' : 'text-teal-600'
                            }`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3
                              className="faq-question text-lg md:text-xl font-semibold text-gray-900 leading-tight pr-4"
                            >
                              {faq.question}
                            </h3>

                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isOpen ? 'bg-teal-100 rotate-180' : 'bg-gray-100'
                              }`}
                            >
                              <ArrowRight
                                className={`w-4 h-4 transition-colors duration-300 ${
                                  isOpen ? 'text-teal-700 rotate-90' : 'text-gray-500'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="category-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100/80 border border-gray-200/50">
                            <span className="text-xs font-medium text-gray-600">{faq.category}</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Answer - accordion content */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div
                        className="px-6 md:px-8 pb-6 md:pb-8 pt-2"
                        style={{
                          background: 'linear-gradient(180deg, rgba(240, 253, 250, 0.3) 0%, transparent 100%)'
                        }}
                        data-testid={`faq-content-${faq.id}`}
                      >
                        <div className="pl-16 prose prose-sm max-w-none">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom disclaimer - minimalist */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 md:p-6 mb-12">
            <p className="text-xs text-gray-600 leading-relaxed text-center">
              <span className="font-semibold">Legal Reminder:</span> Nothing on this site constitutes legal advice. We are not responsible for hiring decisions. Results vary, and we make no guarantees. If you have legal questions, seek help from a qualified attorney.
            </p>
          </div>

          {/* CTA section - elevated design */}
          <div
            className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0891b2 100%)',
              boxShadow: '0 20px 60px rgba(20, 184, 166, 0.3)'
            }}
          >
            <div className="absolute inset-0 gradient-shimmer opacity-30" />

            <div className="relative z-10 space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'DM Sans, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
                  Ready to Get Started?
                </h2>
                <p className="text-teal-50 text-lg max-w-2xl mx-auto">
                  Create your personalized narratives and response letters in minutes. Free, private, and designed for your success.
                </p>
              </div>

              <Link href="/selection">
                <Button
                  size="lg"
                  className="group min-h-[56px] mt-5 px-10 text-lg font-semibold shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                    color: 'white'
                  }}
                  data-testid="button-get-started-faq"
                >
                  Begin Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>

              <p className="text-sm text-teal-100 font-medium">
                No account required • Completely free • Takes 10-15 minutes
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
