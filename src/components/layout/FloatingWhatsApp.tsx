import { useState } from 'react';
import { WhatsAppIcon } from '../ui/Icons';
import type { TranslationSchema } from '../../types/i18n';
import type { BusinessConfig } from '../../types/business';
import { buildWhatsAppUrl } from '../../utils/business';
import { cn } from '../../utils/cn';

interface FloatingWhatsAppProps {
  translations: TranslationSchema;
  business: BusinessConfig;
}

export function FloatingWhatsApp({ translations: t, business }: FloatingWhatsAppProps) {
  const [isHovered, setIsHovered] = useState(false);
  const whatsAppHref = buildWhatsAppUrl(business.contact.rawPhone, t.floatingWhatsApp.defaultMessage);

  return (
    <div
      className={cn(
        'fixed z-40 transition-all duration-300',
        'bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-5',
        'sm:bottom-[calc(1.75rem+env(safe-area-inset-bottom,0px))] sm:right-7'
      )}
    >
      <div className="relative flex items-center justify-end">
        {/* Tooltip Label (reveals on hover/focus) */}
        <span
          role="tooltip"
          id="floating-whatsapp-tooltip"
          className={cn(
            'hidden sm:block absolute right-full mr-3 px-3 py-1.5 rounded-[4px] bg-[#2A1420] text-[#FBF8F4] text-xs font-medium tracking-wide whitespace-nowrap shadow-lg border border-[#3D1F30] transition-all duration-200 pointer-events-none',
            isHovered
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-2'
          )}
        >
          {t.floatingWhatsApp.tooltipText}
        </span>

        {/* Floating Button Action */}
        <a
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.floatingWhatsApp.ariaLabel}
          aria-describedby="floating-whatsapp-tooltip"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          className={cn(
            'flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-[0_8px_24px_-4px_rgba(75,23,40,0.4)] transition-all duration-200 select-none cursor-pointer',
            'bg-[#4B1728] text-[#FBF8F4] border-2 border-[#B99561]',
            'hover:bg-[#642037] hover:border-[#D4B98E] hover:scale-105 hover:shadow-[0_12px_28px_-4px_rgba(75,23,40,0.5)] active:scale-95',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B99561]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF8F4]'
          )}
        >
          <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
