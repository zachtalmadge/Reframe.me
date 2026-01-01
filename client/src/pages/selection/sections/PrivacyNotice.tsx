import { Shield } from "lucide-react";

interface PrivacyNoticeProps {
  hasMadeSelection: boolean;
}

export default function PrivacyNotice({ hasMadeSelection }: PrivacyNoticeProps) {
  return (
    <div
      className={`
        rounded-2xl border-l-4 px-6 md:px-8 py-5 transition-all duration-700 shadow-md
        border-amber-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm
        ${hasMadeSelection
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none h-0 p-0 m-0 overflow-hidden border-0"
        }
      `}
      data-testid="alert-privacy-warning"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
          <Shield className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-sm md:text-base font-bold text-foreground">
            Your Privacy Matters
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            If you refresh the page, your information will be cleared and you'll need to start over.
            We don't store your data after your session ends.
          </p>
        </div>
      </div>
    </div>
  );
}
