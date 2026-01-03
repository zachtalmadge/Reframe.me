import { useState } from "react";
import { faqs } from "../data/faq.constants";
import { FaqCard } from "../components/FaqCard";

export function FaqList() {
  const [openItem, setOpenItem] = useState<string>("");

  const handleToggle = (faqId: string) => {
    setOpenItem(openItem === faqId ? "" : faqId);
  };

  return (
    <div className="mb-20">
      <div className="space-y-6">
        {faqs.map((faq) => (
          <FaqCard
            key={faq.id}
            faq={faq}
            isOpen={openItem === faq.id}
            onToggle={() => handleToggle(faq.id)}
          />
        ))}
      </div>
    </div>
  );
}
