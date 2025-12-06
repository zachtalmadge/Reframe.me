import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NarrativeCard } from "./NarrativeCard";
import { NarrativeItem } from "@/lib/resultsPersistence";

interface NarrativeCarouselProps {
  narratives: NarrativeItem[];
  onCopy: (narrative: NarrativeItem) => Promise<boolean> | boolean;
  onDownload: (narrative: NarrativeItem) => void;
  onRegenerate?: (narrativeType: NarrativeItem["type"]) => void;
  regeneratingType?: NarrativeItem["type"] | null;
  regenCounts?: Record<NarrativeItem["type"], number>;
  regenErrors?: Record<NarrativeItem["type"], string | null>;
}

export function NarrativeCarousel({ 
  narratives, 
  onCopy, 
  onDownload,
  onRegenerate,
  regeneratingType = null,
  regenCounts = {} as Record<NarrativeItem["type"], number>,
  regenErrors = {} as Record<NarrativeItem["type"], string | null>,
}: NarrativeCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (narratives.length === 0) {
    return null;
  }

  return (
    <div className="w-full" data-testid="narrative-carousel">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {narratives.map((narrative, index) => (
            <div 
              key={narrative.id} 
              className="flex-none w-full min-w-0"
            >
              <NarrativeCard
                narrative={narrative}
                index={index}
                onCopy={onCopy}
                onDownload={onDownload}
                onRegenerate={onRegenerate}
                isRegenerating={regeneratingType === narrative.type}
                regenCount={regenCounts[narrative.type] || 0}
                regenError={regenErrors[narrative.type] || null}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Previous narrative"
          data-testid="button-carousel-prev"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          <span 
            className="text-sm text-muted-foreground"
            data-testid="text-carousel-position"
          >
            Narrative {selectedIndex + 1} of {narratives.length}
          </span>
          <div className="flex gap-1.5 ml-2">
            {narratives.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === selectedIndex 
                    ? "bg-primary" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to narrative ${index + 1}`}
                data-testid={`button-carousel-dot-${index + 1}`}
              />
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next narrative"
          data-testid="button-carousel-next"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
