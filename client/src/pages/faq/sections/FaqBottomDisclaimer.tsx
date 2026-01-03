import { DISCLAIMER_TEXT } from "../types/faq.types";

export function FaqBottomDisclaimer() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/60 border border-gray-200/80 p-6 md:p-8 mb-16 shadow-sm">
      <p className="text-sm md:text-base text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
        <span className="font-bold text-gray-800">Legal Reminder:</span> Nothing on this site constitutes legal advice. We are not responsible for hiring decisions. {DISCLAIMER_TEXT.RESULTS_VARY} {DISCLAIMER_TEXT.SEEK_ATTORNEY}
      </p>
    </div>
  );
}
