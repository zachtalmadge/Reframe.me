import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type ToolSelection = "narrative" | "responseLetter" | "both" | null;

interface ContinueCTAProps {
  selected: ToolSelection;
  onContinue: () => void;
}

export default function ContinueCTA({ selected, onContinue }: ContinueCTAProps) {
  return (
    <Button
      size="lg"
      className={`
        group relative w-full min-h-[64px] md:min-h-[72px] text-lg md:text-xl font-bold rounded-2xl
        shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-xl
        ${selected ? 'scale-100' : 'scale-95'}
      `}
      disabled={!selected}
      onClick={onContinue}
      data-testid="button-continue"
      style={{
        background: selected
          ? 'linear-gradient(135deg, rgb(20 184 166) 0%, rgb(13 148 136) 100%)'
          : undefined
      }}
    >
      {/* Animated shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" aria-hidden="true" />

      <span className="relative z-10 flex items-center justify-center gap-3">
        <span style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
          {selected ? 'Continue to Form' : 'Select an Option to Continue'}
        </span>
        {selected && (
          <ArrowRight className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-2" aria-hidden="true" />
        )}
      </span>
    </Button>
  );
}
