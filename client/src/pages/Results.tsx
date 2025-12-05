import { useSearch, Link } from "wouter";
import { FileText, Mail, Download, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { ToolType, FormState } from "@/lib/formState";

export default function Results() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tool = (params.get("tool") as ToolType) || "narrative";
  const dataParam = params.get("data");

  let formData: FormState | null = null;
  try {
    if (dataParam) {
      formData = JSON.parse(decodeURIComponent(dataParam));
    }
  } catch (e) {
    console.error("Failed to parse form data:", e);
  }

  const showNarratives = tool === "narrative" || tool === "both";
  const showResponseLetter = tool === "responseLetter" || tool === "both";

  return (
    <Layout>
      <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8"
        aria-labelledby="results-heading"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <AlertTriangle
                  className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="space-y-2">
                  <h2 className="font-semibold text-foreground">
                    Important Disclaimer
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    These documents are personalized tools to help you prepare
                    for employment conversations. They are not legal advice.
                    Please review and customize them to reflect your personal
                    situation before using them with potential employers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <h1
              id="results-heading"
              className="text-2xl md:text-3xl font-bold text-foreground"
            >
              Your Documents Are Ready
            </h1>
            <p className="text-muted-foreground">
              Review and download your personalized documents below.
            </p>
          </div>

          <div className="space-y-6">
            {showNarratives && (
              <Card data-testid="card-narratives">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText
                      className="w-6 h-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">
                      Disclosure Narratives
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Five different ways to discuss your background
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      "Direct & Professional",
                      "Growth-Focused",
                      "Skills-First",
                      "Brief & Confident",
                      "Detailed & Transparent",
                    ].map((style, index) => (
                      <div
                        key={style}
                        className="p-4 rounded-lg bg-muted/50 space-y-2"
                        data-testid={`narrative-style-${index + 1}`}
                      >
                        <h3 className="font-medium text-foreground">{style}</h3>
                        <p className="text-sm text-muted-foreground">
                          Your personalized {style.toLowerCase()} narrative will
                          appear here. This approach emphasizes{" "}
                          {index === 0
                            ? "clarity and honesty"
                            : index === 1
                              ? "personal growth and change"
                              : index === 2
                                ? "your qualifications and abilities"
                                : index === 3
                                  ? "confidence without over-explaining"
                                  : "complete transparency and context"}
                          .
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" data-testid="button-download-narratives">
                    <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                    Download Narratives
                  </Button>
                </CardContent>
              </Card>
            )}

            {showResponseLetter && (
              <Card data-testid="card-response-letter">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Mail
                      className="w-6 h-6 text-secondary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">
                      Pre-Adverse Action Response Letter
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      A formal response for background check concerns
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your personalized response letter will appear here. It
                      addresses the employer's concerns while highlighting your
                      qualifications, rehabilitation efforts, and commitment to
                      the role.
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    variant="secondary"
                    data-testid="button-download-letter"
                  >
                    <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                    Download Response Letter
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                Need to make changes? You can start over anytime.
              </p>
              <Link href="/">
                <Button variant="outline" data-testid="button-start-over">
                  <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                  Start Over
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
