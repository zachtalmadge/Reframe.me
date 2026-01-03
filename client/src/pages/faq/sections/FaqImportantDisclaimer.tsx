import { AlertCircle } from "lucide-react";
import { DISCLAIMER_TEXT } from "../types/faq.types";

export function FaqImportantDisclaimer() {
  return (
    <div className="relative rounded-3xl p-7 md:p-10 mb-16 overflow-hidden bg-gradient-to-br from-orange-50/80 via-orange-50/60 to-amber-50/80 border-2 border-orange-200/50 shadow-sm">
      <div className="absolute top-0 right-0 w-40 h-40 opacity-[0.07] pointer-events-none">
        <AlertCircle className="w-full h-full text-orange-500" strokeWidth={1.5} />
      </div>

      <div className="relative space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200/80 flex items-center justify-center shadow-sm">
            <AlertCircle className="w-6 h-6 text-orange-700" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-orange-900 tracking-tight">
            Important Disclaimer
          </h3>
        </div>

        <p className="text-base md:text-lg text-gray-700 leading-relaxed pl-0 md:pl-14">
          {DISCLAIMER_TEXT.NOT_LAW_FIRM} {DISCLAIMER_TEXT.EDUCATIONAL_ONLY} {DISCLAIMER_TEXT.NO_GUARANTEES}
        </p>

        <p className="text-base md:text-lg text-gray-700 leading-relaxed pl-0 md:pl-14">
          {DISCLAIMER_TEXT.CONSULT_ATTORNEY}
        </p>
      </div>
    </div>
  );
}
