import { AlertCircle } from "lucide-react";
import { DISCLAIMER_TEXT } from "../types/faq.types";

export function FaqImportantDisclaimer() {
  return (
    <div
      className="rounded-2xl p-6 md:p-8 mb-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(249, 115, 22, 0.12) 100%)',
        border: '2px solid rgba(249, 115, 22, 0.2)'
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <AlertCircle className="w-full h-full text-orange-500" />
      </div>

      <div className="relative space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-orange-900">Important Disclaimer</h3>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          {DISCLAIMER_TEXT.NOT_LAW_FIRM} {DISCLAIMER_TEXT.EDUCATIONAL_ONLY} {DISCLAIMER_TEXT.NO_GUARANTEES}
        </p>

        <p className="text-sm text-gray-700 leading-relaxed">
          {DISCLAIMER_TEXT.CONSULT_ATTORNEY}
        </p>
      </div>
    </div>
  );
}
