import { useState, useRef, useEffect, useId } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LOCALES, type Locale, getLocalizedPath } from '../../utils/i18n';
import { cn } from '../../utils/cn';

interface LanguageSwitcherProps {
  currentLang: Locale;
  currentPathname: string;
  className?: string;
  compact?: boolean;
}

const LANGUAGE_LABELS: Record<Locale, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  hi: { label: 'Hindi', native: 'हिंदी' },
  mr: { label: 'Marathi', native: 'मराठी' },
};

export function LanguageSwitcher({
  currentLang,
  currentPathname,
  className,
  compact = false,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownId = useId();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        aria-label={`Change language, current is ${LANGUAGE_LABELS[currentLang].label}`}
        className={cn(
          'inline-flex items-center justify-between gap-1.5 rounded-[4px] border border-[#DFC8C2] bg-[#FFFFFF] px-2.5 py-1.5 text-xs font-medium text-[#24191B] transition-colors',
          'hover:bg-[#FBF8F4] hover:border-[#C58F91]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FBF8F4]',
          compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
        )}
      >
        <Globe className="w-3.5 h-3.5 text-[#B99561]" aria-hidden="true" />
        <span className="font-medium tracking-wide">
          {LANGUAGE_LABELS[currentLang].native}
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-[#74686A] transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={dropdownId}
          role="listbox"
          aria-label="Language selection options"
          className="absolute right-0 mt-1.5 w-36 origin-top-right rounded-[4px] border border-[#DFC8C2] bg-white p-1 shadow-[0_8px_24px_-4px_rgba(42,20,32,0.15)] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {LOCALES.map((locale) => {
            const isSelected = locale === currentLang;
            const targetUrl = getLocalizedPath(currentPathname, locale);

            return (
              <a
                key={locale}
                href={targetUrl}
                role="option"
                aria-selected={isSelected}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center justify-between px-2.5 py-2 text-xs rounded-[2px] transition-colors font-medium',
                  isSelected
                    ? 'bg-[#F2E5E2] text-[#4B1728] font-semibold'
                    : 'text-[#24191B] hover:bg-[#FBF8F4] hover:text-[#4B1728]'
                )}
              >
                <div className="flex flex-col text-left">
                  <span className="leading-tight">{LANGUAGE_LABELS[locale].native}</span>
                  <span className="text-[10px] text-[#74686A] font-normal">
                    {LANGUAGE_LABELS[locale].label}
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#B99561]" aria-hidden="true" />
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
