import { useState } from "react";
import { Link, useSearch, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Mail, Files } from "lucide-react";
import Layout from "@/components/Layout";
import { FormWizard } from "@/components/form";
import { FormState, ToolType } from "@/lib/formState";

const toolInfo: Record<
  ToolType,
  { title: string; description: string; icon: typeof FileText }
> = {
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
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const toolParam = params.get("tool") as ToolType | null;

  const tool = toolParam && toolInfo[toolParam] ? toolParam : "narrative";
  const { title, description, icon: Icon } = toolInfo[tool];

  const handleFormComplete = (data: FormState) => {
    const encodedData = encodeURIComponent(JSON.stringify(data));
    navigate(`/loading?tool=${tool}&data=${encodedData}`);
  };

  return (
    <Layout>
      <section
        className="py-8 md:py-12 px-4 sm:px-6 lg:px-8"
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

          <div className="text-center space-y-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
              <Icon className="w-7 h-7 text-primary" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h1
                id="form-heading"
                className="text-2xl md:text-3xl font-bold leading-tight text-foreground"
              >
                {title}
              </h1>
              <p
                className="text-muted-foreground"
                data-testid="text-tool-description"
              >
                {description}
              </p>
            </div>
          </div>

          <FormWizard tool={tool} onComplete={handleFormComplete} />
        </div>
      </section>
    </Layout>
  );
}
