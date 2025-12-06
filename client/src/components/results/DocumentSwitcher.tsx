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

  const isNarratives = activeTab === "narratives";

  return (
    <div 
      className="relative flex w-full max-w-xs rounded-full bg-muted p-1"
      role="tablist"
      aria-label="Document type selection"
      data-testid="document-switcher"
    >
      {/* Sliding background indicator */}
      <div 
        className={`absolute inset-y-1 w-[calc(50%-2px)] rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out ${
          isNarratives ? "translate-x-0 left-1" : "translate-x-full left-0"
        }`}
        aria-hidden="true"
      />
      
      {/* Narratives button */}
      <button
        role="tab"
        aria-selected={isNarratives}
        aria-controls="section-narratives"
        className={`relative z-10 flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          isNarratives 
            ? "text-primary-foreground" 
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => onTabChange("narratives")}
        data-testid="button-tab-narratives"
      >
        Narratives
      </button>
      
      {/* Response Letter button */}
      <button
        role="tab"
        aria-selected={!isNarratives}
        aria-controls="section-letter"
        className={`relative z-10 flex-1 py-2 px-4 text-sm font-medium rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          !isNarratives 
            ? "text-primary-foreground" 
            : "text-muted-foreground hover:text-foreground"
        }`}
        onClick={() => onTabChange("letter")}
        data-testid="button-tab-letter"
      >
        Response Letter
      </button>
    </div>
  );
}
