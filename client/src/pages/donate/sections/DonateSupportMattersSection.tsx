import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Shield, MessageSquare, Users } from "lucide-react";

export function DonateSupportMattersSection() {
  return (
    <section className="relative py-20 md:py-28 px-6 sm:px-8 lg:px-12 dot-pattern dark:dot-pattern-dark">
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
  );
}
