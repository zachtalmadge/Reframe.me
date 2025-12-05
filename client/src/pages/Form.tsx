import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, Mail, Files, Construction } from "lucide-react";
import Layout from "@/components/Layout";

type ToolType = "narrative" | "responseLetter" | "both";

const toolInfo: Record<ToolType, { title: string; description: string; icon: typeof FileText }> = {
  narrative: {
    title: "Disclosure Narratives",
    description: "You're creating five personalized disclosure narratives.",
    icon: FileText,
  },
  responseLetter: {
    title: "Response Letter",
    description: "You're creating a pre-adverse action response letter.",
    icon: Mail,
  },
  both: {
    title: "Both Documents",
    description: "You're creating disclosure narratives and a response letter.",
    icon: Files,
  },
};

export default function Form() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const toolParam = params.get("tool") as ToolType | null;
  
  const tool = toolParam && toolInfo[toolParam] ? toolParam : "narrative";
  const { title, description, icon: Icon } = toolInfo[tool];

  return (
    <Layout>
      <section 
        className="py-8 md:py-16 px-4 sm:px-6 lg:px-8"
        aria-labelledby="form-heading"
      >
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/selection">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground"
                data-testid="button-back-selection"
              >
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Back to Selection
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
              <Icon className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
            
            <div className="space-y-2">
              <h1 
                id="form-heading"
                className="text-2xl md:text-3xl font-bold leading-tight text-foreground"
              >
                {title}
              </h1>
              <p className="text-muted-foreground" data-testid="text-tool-description">
                {description}
              </p>
            </div>
          </div>

          <Card className="mt-8 border-border shadow-sm">
            <CardContent className="p-8 md:p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto">
                <Construction className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Form Coming Soon
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                  We're building the questionnaire that will help create your personalized documents. 
                  Check back soon!
                </p>
              </div>
              <div className="pt-4">
                <Link href="/selection">
                  <Button variant="outline" data-testid="button-choose-different">
                    Choose a Different Option
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
