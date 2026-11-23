import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, X, Award } from 'lucide-react';

interface CertificateLightboxProps {
  imageSrc: string;
  imageAlt: string;
  triggerLabel: string;
  closeLabel: string;
  title: string;
  classification: string;
  description: string;
}

export const CertificateLightbox: React.FC<CertificateLightboxProps> = ({
  imageSrc,
  imageAlt,
  triggerLabel,
  closeLabel,
  title,
  classification,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard accessibility (Escape key) & focus management
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the close button when opened
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <div className="w-full">
      {/* Interactive Certificate Thumbnail & Inspection Trigger */}
      <div className="group relative rounded-[6px] overflow-hidden bg-[#1E0D16] border border-[#B99561]/40 shadow-md hover:border-[#B99561] transition-all duration-300">
        <div className="relative aspect-[1536/1024] w-full bg-[#1E0D16]">
          <img
            src={imageSrc}
            alt={imageAlt}
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain select-none transition-transform duration-300 group-hover:scale-[1.01]"
          />
          {/* Subtle gradient scrim on hover */}
          <div className="absolute inset-0 bg-[#2A1420]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </div>

        {/* Action Bar / Trigger Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#DFC8C2] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-[#24191B]">
            <Award className="w-4 h-4 text-[#B99561] shrink-0" aria-hidden="true" />
            <span className="font-semibold text-[#4B1728] truncate">{classification}</span>
          </div>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-[4px] bg-[#F2E5E2] hover:bg-[#EADBD7] text-[#4B1728] border border-[#DFC8C2] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] focus-visible:ring-offset-1"
            aria-haspopup="dialog"
          >
            <ZoomIn className="w-3.5 h-3.5 text-[#B99561]" aria-hidden="true" />
            <span>{triggerLabel}</span>
          </button>
        </div>
      </div>

      {/* Accessible Fullscreen Lightbox Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-[#1E0D16]/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#FBF8F4] rounded-[6px] border border-[#DFC8C2] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#DFC8C2] bg-white">
              <div className="flex items-center gap-2 min-w-0 pr-4">
                <Award className="w-4 h-4 text-[#B99561] shrink-0" aria-hidden="true" />
                <h3 className="font-serif text-sm sm:text-base font-semibold text-[#2A1420] truncate">
                  {title}
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 sm:p-2 rounded-[4px] border border-[#DFC8C2] bg-[#FBF8F4] text-[#24191B] hover:bg-[#F2E5E2] hover:text-[#4B1728] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561]"
                aria-label={closeLabel}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Modal Certificate Viewport */}
            <div className="p-2 sm:p-4 bg-[#1E0D16] flex items-center justify-center overflow-auto max-h-[calc(92vh-130px)]">
              <img
                src={imageSrc}
                alt={imageAlt}
                width={1536}
                height={1024}
                className="max-w-full max-h-[70vh] object-contain rounded-[2px] shadow-lg select-none"
              />
            </div>

            {/* Modal Caption / Exact Credential Wording */}
            <div className="px-4 sm:px-6 py-3 bg-[#FBF8F4] border-t border-[#DFC8C2] text-xs text-[#524245] leading-relaxed">
              <span className="font-semibold text-[#4B1728] block sm:inline mr-1">
                {classification}:
              </span>
              <span>{description}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
