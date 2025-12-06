import { Button } from "@/components/ui/button";

export type DocumentTab = "narratives" | "letter";

interface DocumentSwitcherProps {
  activeTab: DocumentTab;
  onTabChange: (tab: DocumentTab) => void;
  hasNarratives: boolean;
  hasLetter: boolean;
}

export function DocumentSwitcher({ 
  activeTab, 
  onTabChange, 
  hasNarratives, 
  hasLetter 
}: DocumentSwitcherProps) {
  if (!hasNarratives || !hasLetter) {
    return null;
  }

  return (
    <div 
      className="flex gap-1 p-1 bg-muted rounded-lg w-fit"
      data-testid="document-switcher"
    >
      <Button
        variant={activeTab === "narratives" ? "default" : "ghost"}
        size="sm"
        onClick={() => onTabChange("narratives")}
        className={activeTab === "narratives" ? "" : "text-muted-foreground"}
        data-testid="button-tab-narratives"
      >
        Disclosure Narratives
      </Button>
      <Button
        variant={activeTab === "letter" ? "default" : "ghost"}
        size="sm"
        onClick={() => onTabChange("letter")}
        className={activeTab === "letter" ? "" : "text-muted-foreground"}
        data-testid="button-tab-letter"
      >
        Response Letter
      </Button>
    </div>
  );
}
