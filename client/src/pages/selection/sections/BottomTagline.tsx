import { Sparkles } from "lucide-react";

export default function BottomTagline() {
  return (
    <div className="text-center pt-4">
      <p className="text-sm md:text-base text-muted-foreground flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-teal-500" aria-hidden="true" />
        <span className="font-medium">Private, secure, and completely confidential</span>
      </p>
    </div>
  );
}
