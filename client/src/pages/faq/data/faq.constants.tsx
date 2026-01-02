import { MessageSquare, FileText, Scale, Shield, Lightbulb, Users, AlertCircle, BookOpen, RefreshCw } from "lucide-react";

export const faqs = [
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
