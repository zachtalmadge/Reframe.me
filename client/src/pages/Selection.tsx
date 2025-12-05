import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Mail, ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

export default function Selection() {
  return (
    <Layout>
      <section 
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8"
        aria-labelledby="selection-heading"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground"
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-4 mb-12">
            <h1 
              id="selection-heading"
              className="text-3xl md:text-4xl font-bold leading-tight text-foreground"
            >
              What would you like to create?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the tool that best fits your current needs. You can always come back and use the other one later.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="border-border shadow-sm transition-shadow duration-150"
              data-testid="card-narratives"
            >
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-primary" aria-hidden="true" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">
                    Disclosure Narratives
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Generate five personalized ways to discuss your background during interviews 
                    or on job applications.
                  </p>
                  <div className="pt-2">
                    <Button 
                      className="w-full"
                      disabled
                      data-testid="button-narratives"
                    >
                      Coming Soon
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-border shadow-sm transition-shadow duration-150"
              data-testid="card-response-letter"
            >
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-chart-2/10 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-chart-2" aria-hidden="true" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">
                    Response Letter
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Create a professional response to a pre-adverse action notice 
                    from a potential employer.
                  </p>
                  <div className="pt-2">
                    <Button 
                      className="w-full"
                      disabled
                      data-testid="button-response-letter"
                    >
                      Coming Soon
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Both tools are designed to help you present your best self to employers.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
