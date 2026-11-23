import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { TranslationSchema } from '../../types/i18n';

interface FaqAccordionProps {
  items: TranslationSchema['faqSection']['items'];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  // Allow opening one item at a time (first item open by default for immediate preview)
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto" role="presentation">
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const buttonId = `faq-trigger-${item.id}`;
        const panelId = `faq-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={`rounded-[6px] border transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-white border-[#B99561] shadow-md'
                : 'bg-white/80 border-[#DFC8C2] hover:border-[#B99561]/60 hover:bg-white shadow-xs'
            }`}
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] focus-visible:ring-offset-2"
              >
                <span className="flex items-start gap-3.5">
                  <span 
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold shrink-0 mt-0.5 transition-colors ${
                      isOpen
                        ? 'bg-[#4B1728] text-[#FBF8F4]'
                        : 'bg-[#F2E5E2] text-[#4B1728]'
                    }`}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span className="font-serif text-base sm:text-lg font-medium text-[#2A1420] leading-snug">
                    {item.question}
                  </span>
                </span>
                
                <span 
                  className={`p-1.5 rounded-full shrink-0 transition-transform duration-300 ${
                    isOpen 
                      ? 'bg-[#F2E5E2] text-[#4B1728] rotate-180' 
                      : 'bg-transparent text-[#74686A]'
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 sm:px-6 pb-5 pt-2 pl-14 sm:pl-16 text-sm sm:text-base text-[#524245] leading-relaxed border-t border-[#DFC8C2]/40">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
