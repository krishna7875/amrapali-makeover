import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from '../ui/Icons';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '../ui/Button';
import type { Locale, TranslationSchema } from '../../types/i18n';
import type { BusinessConfig } from '../../types/business';
import { buildWhatsAppUrl } from '../../utils/business';

interface HeaderNavigationProps {
  currentLang: Locale;
  currentPathname: string;
  translations: TranslationSchema;
  business: BusinessConfig;
}

export function HeaderNavigation({
  currentLang,
  currentPathname,
  translations: t,
  business,
}: HeaderNavigationProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).has('drawer');
    }
    return false;
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const homeUrl = `/${currentLang}/`;
  const whatsAppHref = buildWhatsAppUrl(business.contact.rawPhone, t.floatingWhatsApp.defaultMessage);

  const navLinks = [
    { href: `${homeUrl}#services`, label: t.nav.services },
    { href: `${homeUrl}#about`, label: t.nav.about },
    { href: `${homeUrl}#process`, label: t.nav.process },
    { href: `${homeUrl}#portfolio`, label: t.nav.portfolio },
    { href: `${homeUrl}#reviews`, label: t.nav.reviews },
    { href: `${homeUrl}#faq`, label: t.nav.faq },
    { href: `${homeUrl}#contact`, label: t.nav.contact },
  ];

  // Lock body scroll and manage focus when drawer opens/closes
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
      wasOpenRef.current = true;
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      if (wasOpenRef.current) {
        triggerRef.current?.focus();
        wasOpenRef.current = false;
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Handle Escape key and focus trap
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isDrawerOpen) return;

      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        triggerRef.current?.focus();
        return;
      }

      // Simple focus trap inside drawer
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  function closeDrawer() {
    setIsDrawerOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="flex items-center justify-between w-full gap-2 lg:gap-3 xl:gap-6">
      {/* Brand Wordmark */}
      <a
        href={homeUrl}
        className="group flex flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] rounded-[2px] shrink-0 min-w-0 pr-1 sm:pr-2"
      >
        <span className="font-serif text-xl sm:text-2xl lg:text-[1.375rem] xl:text-3xl font-medium tracking-tight text-[#2A1420] group-hover:text-[#4B1728] transition-colors leading-tight whitespace-nowrap">
          {t.common.brandName}
        </span>
        <span className="hidden sm:block text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#B99561] font-medium mt-1 whitespace-nowrap">
          {t.common.brandTagline}
        </span>
      </a>

      {/* Desktop Navigation Links */}
      <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-7 shrink-0">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-[#24191B] hover:text-[#4B1728] transition-colors relative py-1 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] rounded-[2px] shrink-0"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
        <LanguageSwitcher currentLang={currentLang} currentPathname={currentPathname} />
        <Button
          variant="primary"
          size="sm"
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          leftIcon={<WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />}
        >
          {t.nav.enquireButton}
        </Button>
      </div>

      {/* Mobile Controls (Language Switcher + Menu Trigger) */}
      <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
        <LanguageSwitcher
          currentLang={currentLang}
          currentPathname={currentPathname}
          compact
        />
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={t.nav.menuOpen}
          className="inline-flex items-center justify-center p-2 rounded-[4px] border border-[#DFC8C2] bg-white text-[#24191B] hover:bg-[#FBF8F4] hover:text-[#4B1728] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] shrink-0"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Navigation Drawer & Backdrop */}
      {isDrawerOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-[#1E0D16]/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Sliding Panel */}
          <div
            ref={drawerRef}
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.drawerTitle}
            className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-[#FBF8F4] border-l border-[#DFC8C2] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250"
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between border-b border-[#DFC8C2] pb-4">
                <div className="flex flex-col text-left">
                  <span className="font-serif text-xl font-medium text-[#2A1420]">
                    {t.common.brandName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#B99561]">
                    {business.location.displayLocation}
                  </span>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeDrawer}
                  aria-label={t.nav.menuClose}
                  className="p-2 rounded-[4px] border border-[#DFC8C2] bg-white text-[#24191B] hover:bg-[#F2E5E2] hover:text-[#4B1728] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561]"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Navigation Links List */}
              <nav aria-label="Mobile Navigation" className="mt-6 flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeDrawer}
                    className="flex items-center justify-between px-3 py-2.5 rounded-[4px] text-base font-medium text-[#24191B] hover:bg-[#F2E5E2] hover:text-[#4B1728] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561]"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#C58F91]" aria-hidden="true" />
                  </a>
                ))}
              </nav>

              {/* Verified Qualifier Reminder */}
              <div className="mt-6 p-3 rounded-[4px] bg-[#F2E5E2] border border-[#DFC8C2] text-xs text-[#524245] leading-relaxed text-left">
                <p className="font-semibold text-[#4B1728] mb-0.5">{t.common.onLocationService}</p>
                <p>{t.common.noStudioNotice}</p>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-[#DFC8C2] pt-6 mt-8 space-y-3">
              <Button
                variant="primary"
                size="md"
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
                leftIcon={<WhatsAppIcon className="w-4 h-4 shrink-0" />}
              >
                {t.nav.enquireButton}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={business.contact.directPhoneTel}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[4px] border border-[#DFC8C2] bg-white text-[#24191B] hover:bg-[#FBF8F4] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#B99561]" />
                  <span>Call</span>
                </a>
                <a
                  href={business.social.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[4px] border border-[#DFC8C2] bg-white text-[#24191B] hover:bg-[#FBF8F4] transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#C58F91]" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
