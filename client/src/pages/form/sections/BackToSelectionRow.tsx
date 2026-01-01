import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackToSelectionRow() {
  return (
    <div className="mb-6 animate-fadeInUp opacity-0">
      <Link href="/selection">
        <Button
          variant="outline"
          size="sm"
          className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-2 shadow-sm"
          data-testid="button-back-selection"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Selection
        </Button>
      </Link>
    </div>
  );
}
