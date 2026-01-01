import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackToHomeRow() {
  return (
    <div className="mb-12 md:mb-16 opacity-0 animate-fade-in-up">
      <Link href="/">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-200 group -ml-2"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden="true" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
