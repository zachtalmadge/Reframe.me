import { Database, Eye, Lock, Shield, FileCheck, Heart } from "lucide-react";
import type { ArticleSection, FinalStatement } from "./content.types";

/**
 * Article sections content for Terms & Privacy page
 */
export const ARTICLE_SECTIONS: ArticleSection[] = [
  // Section 1 - Information We Collect
  {
    id: "section-01",
    sectionNumber: "01",
    icon: Database,
    iconBgColor: "bg-teal-100",
    iconColor: "text-teal-600",
    heading: "Information We Collect",
    content: [
      {
        type: "subsection",
        heading: "Information You Provide",
        bulletColor: "bg-teal-500",
        content: [
          {
            type: "paragraph",
            text: "When you use our tools to generate disclosure narratives or response letters, you provide personal information including your background, experiences, employment history, and criminal record details. This information is processed entirely in your browser and transmitted securely to our AI service provider (OpenAI) to generate your personalized documents.",
            className: "pl-6"
          },
          {
            type: "callout",
            variant: "info",
            title: "Important:",
            content: "We do not store any of this information on our servers. Once your session ends, all data is permanently deleted from our systems."
          }
        ]
      },
      {
        type: "subsection",
        heading: "Technical Information",
        bulletColor: "bg-orange-500",
        hasDivider: true,
        content: [
          {
            type: "paragraph",
            text: "Like most websites, we may automatically collect certain technical information such as your IP address, browser type, device information, and general usage patterns. This data is anonymized and used solely to maintain service security and improve functionality.",
            className: "pl-6"
          }
        ]
      }
    ]
  },

  // Section 2 - How We Use Your Information
  {
    id: "section-02",
    sectionNumber: "02",
    icon: Eye,
    iconBgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
    heading: "How We Use Your Information",
    content: [
      {
        type: "paragraph",
        text: "The personal information you provide is used for one purpose only: to generate your personalized disclosure narratives and response letters through our AI service."
      },
      {
        type: "grid",
        columns: [
          {
            heading: "We DO:",
            headingColor: "text-slate-800",
            bgGradient: "from-teal-50 to-cyan-50",
            borderColor: "border-teal-100",
            icon: "●",
            iconColor: "bg-teal-500",
            items: [
              "Process your data to generate documents",
              "Use encryption for all data transmission",
              "Delete session data immediately"
            ]
          },
          {
            heading: "We DO NOT:",
            headingColor: "text-slate-800",
            bgGradient: "from-orange-50 to-amber-50",
            borderColor: "border-orange-100",
            icon: "●",
            iconColor: "bg-orange-500",
            items: [
              "Store your information in databases",
              "Share data with third parties",
              "Sell or monetize your information"
            ]
          }
        ]
      }
    ]
  },

  // Section 3 - Third-Party AI Processing
  {
    id: "section-03",
    sectionNumber: "03",
    icon: Lock,
    iconBgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    heading: "Third-Party AI Processing",
    content: [
      {
        type: "paragraph",
        text: "To generate your personalized documents, we use OpenAI's API service. When you submit your information, it is transmitted securely to OpenAI's servers where the AI model processes it to create your narratives and letters."
      },
      {
        type: "callout",
        variant: "success",
        title: "OpenAI's Data Practices",
        content: "",
        items: [
          "OpenAI does not use data submitted via their API to train or improve their models",
          "API data is retained for 30 days for abuse monitoring, then permanently deleted",
          "All transmissions use enterprise-grade encryption"
        ],
        link: {
          text: "OpenAI Enterprise Privacy",
          url: "https://openai.com/enterprise-privacy"
        }
      }
    ]
  },

  // Section 4 - Your Rights & Control
  {
    id: "section-04",
    sectionNumber: "04",
    icon: Shield,
    iconBgColor: "bg-amber-100",
    iconColor: "text-amber-600",
    heading: "Your Rights & Control",
    content: [
      {
        type: "paragraph",
        text: "You have complete control over your information:"
      },
      {
        type: "list",
        variant: "numbered",
        items: [
          "Session Control|Your data exists only during your active session. Close your browser tab and everything is gone.",
          "No Account Required|We don't require registration or account creation, so there's no persistent profile to manage or delete.",
          "Local Storage Only|Any information saved between pages is stored locally in your browser. You can clear this anytime through your browser settings."
        ]
      }
    ]
  },

  // Section 5 - Terms of Service
  {
    id: "section-05",
    sectionNumber: "05",
    icon: FileCheck,
    iconBgColor: "bg-slate-100",
    iconColor: "text-slate-600",
    heading: "Terms of Service",
    content: [
      {
        type: "subsection",
        heading: "Acceptance of Terms",
        content: [
          {
            type: "paragraph",
            text: "By using Reframe.me, you agree to these terms. If you don't agree, please don't use the service."
          }
        ]
      },
      {
        type: "subsection",
        heading: "Service Description",
        hasDivider: true,
        content: [
          {
            type: "paragraph",
            text: "Reframe.me is a free tool that helps justice-involved individuals prepare disclosure narratives and response letters for employment purposes. The service uses AI to generate personalized content based on information you provide."
          }
        ]
      },
      {
        type: "subsection",
        heading: "Not Legal Advice",
        hasDivider: true,
        content: [
          {
            type: "callout",
            variant: "warning",
            title: "Important Disclaimer:",
            content: "Reframe.me provides educational tools and general information only. The content generated is not legal advice and should not be relied upon as such. For legal guidance specific to your situation, please consult with a qualified attorney."
          }
        ]
      },
      {
        type: "subsection",
        heading: "AI-Generated Content",
        hasDivider: true,
        content: [
          {
            type: "paragraph",
            text: "All narratives and letters are generated by artificial intelligence based on your input. While we strive for accuracy and helpfulness, you should:"
          },
          {
            type: "list",
            variant: "bullet",
            items: [
              "Review all generated content carefully",
              "Edit and personalize the content to accurately reflect your story",
              "Verify all facts and ensure truthfulness before using any content"
            ]
          }
        ]
      },
      {
        type: "subsection",
        heading: "User Responsibilities",
        hasDivider: true,
        content: [
          {
            type: "paragraph",
            text: "You agree to:"
          },
          {
            type: "list",
            variant: "arrow",
            items: [
              "Provide accurate information",
              "Use the service for lawful purposes only",
              "Not attempt to compromise the security or integrity of the service",
              "Respect the privacy and rights of others"
            ]
          }
        ]
      },
      {
        type: "subsection",
        heading: "Limitation of Liability",
        hasDivider: true,
        content: [
          {
            type: "paragraph",
            text: "Reframe.me is provided \"as is\" without warranties of any kind. We are not liable for any outcomes resulting from your use of the generated content. Your use of this service is at your own risk."
          }
        ]
      }
    ]
  },

  // Section 6 - Updates & Contact
  {
    id: "section-06",
    sectionNumber: "06",
    icon: Heart,
    iconBgColor: "bg-rose-100",
    iconColor: "text-rose-600",
    heading: "Updates & Contact",
    content: [
      {
        type: "subsection",
        heading: "Changes to These Terms",
        content: [
          {
            type: "paragraph",
            text: "We may update these terms and privacy practices from time to time. Significant changes will be noted on this page with an updated effective date. Your continued use of Reframe.me after changes constitutes acceptance of the updated terms."
          }
        ]
      },
      {
        type: "subsection",
        heading: "Questions or Concerns?",
        hasDivider: true,
        content: [
          {
            type: "paragraph",
            text: "If you have questions about these terms or our privacy practices, we're here to help. While this is a free community service, we're committed to transparency and user trust."
          }
        ]
      }
    ]
  }
];

/**
 * Final statement content
 */
export const FINAL_STATEMENT: FinalStatement = {
  icon: Heart,
  heading: "Built with Care",
  description: "Reframe.me exists to support your journey toward meaningful work and second chances. Your privacy, dignity, and success matter to us."
};
