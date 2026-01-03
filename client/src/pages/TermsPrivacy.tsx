import { useEffect } from "react";
import TermsPrivacyStyles from "./terms-privacy/sections/TermsPrivacyStyles";
import TermsPrivacyHero from "./terms-privacy/sections/TermsPrivacyHero";
import TermsPrivacyMainContent from "./terms-privacy/sections/TermsPrivacyMainContent";

export default function TermsPrivacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <TermsPrivacyStyles />
      <TermsPrivacyHero />
      <TermsPrivacyMainContent />
    </>
  );
}
