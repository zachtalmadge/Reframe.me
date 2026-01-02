import { Card, CardContent } from "@/components/ui/card";
import { Share2, MessageSquare, Briefcase } from "lucide-react";

export function DonateOtherWaysSection() {
  return (
    <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 overflow-hidden dot-pattern dark:dot-pattern-dark">
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
              color: "purple",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="card-3d border-0 shadow-xl overflow-hidden bg-white hover:shadow-2xl"
            >
              <CardContent className="p-8 text-center space-y-6 relative">
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 organic-blob opacity-20`}
                  style={{
                    background: `radial-gradient(circle, ${item.color === 'teal' ? '#14b8a6' : item.color === 'orange' ? '#f97316' : item.color === 'purple' ? '#8b5cf6' : '#06b6d4'} 0%, transparent 70%)`,
                  }}
                />
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br shadow-lg"
                  style={{
                    background: item.color === 'teal' ? 'linear-gradient(135deg, #14b8a6, #0d9488)' : item.color === 'orange' ? 'linear-gradient(135deg, #f97316, #fb923c)' : item.color === 'purple' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'linear-gradient(135deg, #06b6d4, #0891b2)',
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
  );
}
