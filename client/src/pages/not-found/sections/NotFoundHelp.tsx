import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Home, HelpCircle, Heart, FileText } from "lucide-react";

const helpfulLinks = [
  {
    icon: Home,
    label: "Home",
    href: "/",
    description: "Start your journey",
  },
  {
    icon: HelpCircle,
    label: "FAQ",
    href: "/faq",
    description: "Common questions",
  },
  {
    icon: Heart,
    label: "Donate",
    href: "/donate",
    description: "Support this project",
  },
  {
    icon: FileText,
    label: "Terms & Privacy",
    href: "/terms-privacy",
    description: "Legal information",
  },
];

export default function NotFoundHelp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation with delay
    setTimeout(() => {
      requestAnimationFrame(() => {
        setMounted(true);
      });
    }, 500);
  }, []);

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h2
          className={`text-center text-xl md:text-2xl font-semibold text-white/90 mb-8 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          You might be looking for
        </h2>

        {/* Links grid */}
        <nav
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          aria-label="Helpful navigation links"
        >
          {helpfulLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <a
                  className={`group block p-6 rounded-2xl backdrop-blur-md transition-all duration-700 ease-out hover:scale-105 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(249, 115, 22, 0.15) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <Icon
                        className="w-6 h-6 transition-colors duration-300"
                        style={{
                          color: index % 2 === 0 ? '#14b8a6' : '#f97316',
                        }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-semibold text-white mb-1 group-hover:text-teal-300 transition-colors duration-300"
                        style={{
                          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {link.label}
                      </h3>
                      <p
                        className="text-sm text-white/70"
                        style={{
                          textShadow: '0 1px 8px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {link.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                      <svg
                        className="w-5 h-5 text-white/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
