import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Maximize2, AlertCircle } from 'lucide-react';
import type { 
  PortfolioCategoryId 
} from '../../config/portfolio';
import { 
  PORTFOLIO_CATEGORIES, 
  PORTFOLIO_ITEMS 
} from '../../config/portfolio';
import type { TranslationSchema } from '../../types/i18n';

interface PortfolioGalleryProps {
  translations: TranslationSchema['portfolioSection'];
}

export function PortfolioGallery({ translations: t }: PortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategoryId>('all');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const triggerRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Filter items based on active category
  const filteredItems = activeCategory === 'all'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  // Currently open lightbox item
  const activeLightboxItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  // Navigate lightbox
  const showPrev = useCallback(() => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
  }, [selectedItemIndex, filteredItems.length]);

  const showNext = useCallback(() => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
  }, [selectedItemIndex, filteredItems.length]);

  const closeLightbox = useCallback(() => {
    const closedId = activeLightboxItem?.id;
    setSelectedItemIndex(null);
    if (closedId && triggerRefs.current[closedId]) {
      triggerRefs.current[closedId]?.focus();
    }
  }, [activeLightboxItem]);

  // Handle keyboard events in lightbox
  useEffect(() => {
    if (selectedItemIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showNext();
      }
    }

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Focus close button initially
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [selectedItemIndex, closeLightbox, showPrev, showNext]);

  return (
    <div className="space-y-10 sm:space-y-12">
      
      {/* Category Filter Pills Bar */}
      <div 
        role="tablist" 
        aria-label="Portfolio Category Filters"
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-[8px] bg-white border border-[#DFC8C2] shadow-xs max-w-2xl mx-auto"
      >
        {PORTFOLIO_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const count = cat === 'all' 
            ? PORTFOLIO_ITEMS.length 
            : PORTFOLIO_ITEMS.filter((i) => i.category === cat).length;

          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              aria-controls="portfolio-gallery-grid"
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setSelectedItemIndex(null);
              }}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] ${
                isActive
                  ? 'bg-[#4B1728] text-[#FBF8F4] shadow-xs font-semibold'
                  : 'bg-transparent text-[#524245] hover:bg-[#F2E5E2] hover:text-[#4B1728]'
              }`}
            >
              <span>{t.filters[cat]}</span>
              <span className={`ml-1.5 text-[10px] ${isActive ? 'text-[#DFC8C2]' : 'text-[#74686A]'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div 
        id="portfolio-gallery-grid"
        role="tabpanel"
        aria-label={`${t.filters[activeCategory]} Portfolio Gallery`}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 lg:gap-8 items-stretch"
      >
        {filteredItems.map((item, index) => {
          const itemText = t.items[item.id as keyof typeof t.items] || {
            title: item.id,
            alt: item.id,
          };

          return (
            <article
              key={item.id}
              className="group flex flex-col bg-white rounded-[6px] border border-[#DFC8C2] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#B99561]/70 transition-all duration-300 relative text-left"
            >
              {/* Image Frame with Aspect Ratio */}
              <div 
                className="relative aspect-3/4 sm:aspect-4/5 w-full overflow-hidden bg-[#2A1420] cursor-pointer"
                onClick={() => setSelectedItemIndex(index)}
              >
                <img
                  src={item.imageSrc}
                  alt={itemText.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 select-none"
                />

                {/* Subtle Gradient Veil */}
                <div 
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1E0D16]/90 via-[#1E0D16]/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" 
                  aria-hidden="true" 
                />

                {/* Temporary Placeholder Badge for Haldi */}
                {item.isTemporaryPlaceholder && (
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-[#B99561] text-[#2A1420] text-[10px] font-bold uppercase tracking-wider shadow-md border border-[#DFC8C2]">
                    <AlertCircle className="w-3.5 h-3.5 text-[#2A1420] shrink-0" aria-hidden="true" />
                    <span>{t.temporaryBadge}</span>
                  </div>
                )}

                {/* Category Pill Tag */}
                <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-[3px] bg-[#2A1420]/85 backdrop-blur-xs text-[10px] font-semibold uppercase tracking-wider text-[#FBF8F4] border border-[#B99561]/40 shadow-xs">
                  {t.filters[item.category]}
                </div>

                {/* Overlay Text Details on Hover */}
                <div className="absolute inset-x-3 bottom-3 z-10 p-2 sm:p-3 flex items-end justify-between gap-3 text-left">
                  <div className="space-y-0.5">
                    <h3 className="font-serif text-base sm:text-lg font-medium text-[#FBF8F4] leading-snug drop-shadow-sm">
                      {itemText.title}
                    </h3>
                    <p className="text-[11px] text-[#DFC8C2]">
                      Amrapali Makeover &bull; {t.filters[item.category]}
                    </p>
                  </div>

                  <button
                    ref={(el) => { triggerRefs.current[item.id] = el; }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItemIndex(index);
                    }}
                    aria-label={`${t.viewImage}: ${itemText.title}`}
                    className="p-2 rounded-full bg-[#4B1728]/90 text-[#FBF8F4] border border-[#B99561] shadow-md hover:bg-[#642037] hover:scale-110 active:scale-95 transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561]"
                  >
                    <Maximize2 className="w-4 h-4 text-[#FBF8F4]" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Accessible Fullscreen Lightbox Modal */}
      {selectedItemIndex !== null && activeLightboxItem && typeof document !== 'undefined' && createPortal(
        <div 
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.items[activeLightboxItem.id as keyof typeof t.items]?.title || 'Image Preview'}
          className="fixed inset-0 z-50 bg-[#1E0D16]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between text-xs text-[#DFC8C2] border-b border-[#3D1F30] pb-3 z-10">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-medium text-[#FBF8F4]">
                Amrapali Makeover
              </span>
              <span className="text-[#B99561]">&bull;</span>
              <span className="text-[#B99561] font-semibold uppercase tracking-wider text-[11px]">
                {t.filters[activeLightboxItem.category]}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] text-[#DFC8C2]/80">
                {selectedItemIndex + 1} {t.lightbox.counterOf} {filteredItems.length}
              </span>

              <button
                ref={closeBtnRef}
                type="button"
                onClick={closeLightbox}
                aria-label={t.lightbox.close}
                className="p-2 rounded-[4px] bg-[#2A1420] text-[#FBF8F4] border border-[#B99561]/60 hover:bg-[#4B1728] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561]"
              >
                <X className="w-5 h-5 text-[#FBF8F4]" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Central Main Stage: Navigation Arrows & Image */}
          <div className="relative flex-1 flex items-center justify-center py-4 overflow-hidden">
            
            {/* Previous Button */}
            <button
              type="button"
              onClick={showPrev}
              aria-label={t.lightbox.previous}
              className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-[#2A1420]/90 text-[#FBF8F4] border border-[#B99561]/60 hover:bg-[#4B1728] hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561]"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </button>

            {/* Displayed Image */}
            <div className="relative max-h-[72vh] max-w-full flex items-center justify-center">
              <img
                src={activeLightboxItem.imageSrc}
                alt={t.items[activeLightboxItem.id as keyof typeof t.items]?.alt || ''}
                width={activeLightboxItem.width}
                height={activeLightboxItem.height}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-[4px] border border-[#B99561]/40 shadow-2xl"
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={showNext}
              aria-label={t.lightbox.next}
              className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-[#2A1420]/90 text-[#FBF8F4] border border-[#B99561]/60 hover:bg-[#4B1728] hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561]"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Bottom Info Bar: Caption & Temporary Disclaimer Notice */}
          <div className="border-t border-[#3D1F30] pt-3 text-center z-10 space-y-2">
            <h4 className="font-serif text-lg sm:text-xl font-medium text-[#FBF8F4]">
              {t.items[activeLightboxItem.id as keyof typeof t.items]?.title}
            </h4>

            {activeLightboxItem.isTemporaryPlaceholder && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-[#B99561]/20 border border-[#B99561] text-[#E2CA9D] text-xs max-w-md mx-auto">
                <AlertCircle className="w-4 h-4 text-[#B99561] shrink-0" aria-hidden="true" />
                <span>{t.temporaryNotice}</span>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
