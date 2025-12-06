import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Mail, ArrowRight, Clock, Shield, Heart } from "lucide-react";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <section 
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h1 
              id="hero-heading"
              className="text-4xl md:text-5xl font-bold leading-tight text-foreground"
            >
              Prepare for Your Next Opportunity
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              You deserve tools that help you tell your story with confidence. 
              Reflect.me creates personalized materials to support your job search journey.
            </p>
          </div>

          <div className="w-16 h-1 bg-primary mx-auto rounded-full" aria-hidden="true" />
        </div>
      </section>

      <section 
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8"
        aria-labelledby="tools-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="tools-heading" className="sr-only">Available Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    5 Disclosure Narratives
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You can generate five unique ways to discuss your background with 
                    potential employers. Each narrative is tailored to help you 
                    communicate your story professionally and confidently.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-chart-2" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    Pre-Adverse Action Response
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You can create a professional response letter if you receive 
                    a pre-adverse action notice. This letter helps you present 
                    additional context about your circumstances.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section 
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8"
        aria-labelledby="benefits-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2 id="benefits-heading" className="sr-only">Benefits</h2>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>Takes 5-10 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>No account required</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>Completely free</span>
            </div>
          </div>
        </div>
      </section>

      <section 
        className="py-12 md:py-16 px-4 sm:px-6 lg:px-8"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 id="cta-heading" className="sr-only">Get Started</h2>
          
          <Link href="/selection">
            <Button 
              size="lg"
              className="w-full sm:w-auto min-h-[48px] px-8 text-lg font-medium shadow-md"
              data-testid="button-get-started"
            >
              Let's Get Started
              <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
            </Button>
          </Link>
          
          <p className="text-sm text-muted-foreground">
            Your information stays private and is not stored after your session.
          </p>
        </div>
      </section>
    </Layout>
  );
}
