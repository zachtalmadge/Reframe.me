import { DISCLAIMER_TEXT } from "../types/faq.types";

export function FaqBottomDisclaimer() {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 md:p-6 mb-12">
      <p className="text-xs text-gray-600 leading-relaxed text-center">
        <span className="font-semibold">Legal Reminder:</span> Nothing on this site constitutes legal advice. We are not responsible for hiring decisions. {DISCLAIMER_TEXT.RESULTS_VARY} {DISCLAIMER_TEXT.SEEK_ATTORNEY}
      </p>
    </div>
  );
}
