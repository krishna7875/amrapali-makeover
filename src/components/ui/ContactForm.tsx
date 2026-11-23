import { useState, useId } from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './Icons';
import type { TranslationSchema } from '../../types/i18n';

interface ContactFormProps {
  translations: TranslationSchema['contactSection']['form'];
  businessPhone?: string;
}

export function ContactForm({ translations: t, businessPhone = '918308944456' }: ContactFormProps) {
  const formId = useId();

  // Form Field States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    occasion: '',
    otherOccasion: '',
    eventDate: '',
    venue: '',
    readyByTime: '',
    notes: '',
  });

  // Validation States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string | null>(null);

  // Compute today's date formatted as YYYY-MM-DD for min date attribute
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return t.fields.name.requiredError;
        return '';

      case 'phone': {
        const trimmed = value.trim();
        if (!trimmed) return t.fields.phone.requiredError;

        // 1. Reject alphabetic characters and disallowed symbols
        // Only digits, spaces, hyphens, and optional leading '+' are permitted
        if (/[^0-9\s\-+]/.test(trimmed)) {
          return t.fields.phone.invalidError;
        }

        // '+' is only permitted at the very beginning and only once
        if (trimmed.includes('+') && (!trimmed.startsWith('+') || (trimmed.match(/\+/g) || []).length > 1)) {
          return t.fields.phone.invalidError;
        }

        // 2. Normalize Indian phone numbers by removing permitted spaces and hyphens before validation
        const normalized = trimmed.replace(/[\s\-]/g, '');

        // 3. Accept valid 10-digit Indian mobile numbers and valid numbers prefixed with +91 (or 91)
        // Valid Indian mobile numbers start with 6, 7, 8, or 9 and have 10 digits
        const isTenDigit = /^[6-9]\d{9}$/.test(normalized);
        const isPlus91 = /^\+91[6-9]\d{9}$/.test(normalized);
        const isBare91 = /^91[6-9]\d{9}$/.test(normalized);

        if (!isTenDigit && !isPlus91 && !isBare91) {
          return t.fields.phone.invalidError;
        }
        return '';
      }

      case 'occasion':
        if (!value || !['bridal', 'haldi', 'engagement', 'party', 'other'].includes(value)) {
          return t.fields.occasion.requiredError;
        }
        return '';

      case 'otherOccasion':
        if (!value.trim()) {
          return t.fields.occasion.otherRequiredError;
        }
        return '';

      case 'eventDate': {
        if (!value) return t.fields.eventDate.requiredError;
        const selected = new Date(value + 'T00:00:00');
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (isNaN(selected.getTime())) return t.fields.eventDate.requiredError;
        if (selected < now) return t.fields.eventDate.pastDateError;
        return '';
      }

      case 'venue':
        if (!value.trim()) return t.fields.venue.requiredError;
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'occasion' && value !== 'other') {
        return { ...prev, [name]: value, otherOccasion: '' };
      }
      return { ...prev, [name]: value };
    });

    if (name === 'occasion' && value !== 'other') {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.otherOccasion;
        return next;
      });
    }

    // If field was already touched, validate dynamically
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    // Mark all required fields as touched
    const newTouched: { [key: string]: boolean } = {
      name: true,
      phone: true,
      occasion: true,
      eventDate: true,
      venue: true,
    };
    if (formData.occasion === 'other') {
      newTouched.otherOccasion = true;
    }
    setTouched((prev) => ({ ...prev, ...newTouched }));

    // Validate all required fields
    const newErrors: { [key: string]: string } = {};
    const nameErr = validateField('name', formData.name);
    if (nameErr) newErrors.name = nameErr;

    const phoneErr = validateField('phone', formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const occasionErr = validateField('occasion', formData.occasion);
    if (occasionErr) newErrors.occasion = occasionErr;

    if (formData.occasion === 'other') {
      const otherErr = validateField('otherOccasion', formData.otherOccasion);
      if (otherErr) newErrors.otherOccasion = otherErr;
    }

    const dateErr = validateField('eventDate', formData.eventDate);
    if (dateErr) newErrors.eventDate = dateErr;

    const venueErr = validateField('venue', formData.venue);
    if (venueErr) newErrors.venue = venueErr;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus first erroneous input for accessibility
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(`${formId}-${firstErrorField}`);
      if (element) element.focus();
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    // Build WhatsApp message
    const tmpl = t.messageTemplate;
    let occasionDisplay = t.fields.occasion.options[formData.occasion as keyof typeof t.fields.occasion.options] || formData.occasion;
    if (formData.occasion === 'other' && formData.otherOccasion.trim()) {
      occasionDisplay = `${t.fields.occasion.options.other} — ${formData.otherOccasion.trim()}`;
    }

    const messageLines = [
      tmpl.greeting,
      '',
      tmpl.intro,
      '',
      `${tmpl.nameLabel}: ${formData.name.trim()}`,
      `${tmpl.phoneLabel}: ${formData.phone.trim()}`,
      `${tmpl.occasionLabel}: ${occasionDisplay}`,
      `${tmpl.dateLabel}: ${formData.eventDate}`,
      `${tmpl.venueLabel}: ${formData.venue.trim()}`,
    ];

    if (formData.readyByTime.trim()) {
      messageLines.push(`${tmpl.readyByLabel}: ${formData.readyByTime.trim()}`);
    }

    if (formData.notes.trim()) {
      messageLines.push(`${tmpl.notesLabel}: ${formData.notes.trim()}`);
    }

    messageLines.push('', tmpl.closing, '', tmpl.thanks);

    const fullMessage = messageLines.join('\n');
    const waUrl = `https://wa.me/${businessPhone}?text=${encodeURIComponent(fullMessage)}`;
    setLastWhatsAppUrl(waUrl);

    // Open WhatsApp in a new tab safely
    try {
      const newTab = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        // In case popup blocker intercepted, redirect directly
        window.location.assign(waUrl);
      }
    } catch {
      window.location.assign(waUrl);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id={`${formId}-form`}
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-[8px] border border-[#DFC8C2] p-6 sm:p-8 lg:p-10 shadow-sm space-y-6 text-left"
    >
      <div>
        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#2A1420] tracking-tight">
          {t.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#524245] mt-1 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        
        {/* 1. Customer Name (Required) */}
        <div className="sm:col-span-2 space-y-1.5">
          <label 
            htmlFor={`${formId}-name`} 
            className="block text-xs sm:text-sm font-semibold text-[#2A1420]"
          >
            {t.fields.name.label} <span className="text-[#9E2A2B] text-sm" aria-hidden="true">*</span>
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            required
            aria-required="true"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t.fields.name.placeholder}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            className={`w-full px-4 py-3 rounded-[4px] text-sm text-[#24191B] bg-white border transition-colors duration-150 placeholder:text-[#A19597] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] ${
              errors.name ? 'border-[#9E2A2B] bg-[#FDF7F7]' : 'border-[#DFC8C2] hover:border-[#B99561]'
            }`}
          />
          {errors.name && (
            <p id={`${formId}-name-error`} role="alert" className="flex items-center gap-1.5 text-xs text-[#9E2A2B] font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* 2. Phone Number (Required) */}
        <div className="space-y-1.5">
          <label 
            htmlFor={`${formId}-phone`} 
            className="block text-xs sm:text-sm font-semibold text-[#2A1420]"
          >
            {t.fields.phone.label} <span className="text-[#9E2A2B] text-sm" aria-hidden="true">*</span>
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            required
            aria-required="true"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t.fields.phone.placeholder}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${formId}-phone-error` : `${formId}-phone-help`}
            className={`w-full px-4 py-3 rounded-[4px] text-sm text-[#24191B] bg-white border transition-colors duration-150 placeholder:text-[#A19597] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] ${
              errors.phone ? 'border-[#9E2A2B] bg-[#FDF7F7]' : 'border-[#DFC8C2] hover:border-[#B99561]'
            }`}
          />
          {errors.phone ? (
            <p id={`${formId}-phone-error`} role="alert" className="flex items-center gap-1.5 text-xs text-[#9E2A2B] font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.phone}</span>
            </p>
          ) : (
            <p id={`${formId}-phone-help`} className="text-[11px] text-[#74686A]">
              {t.fields.phone.helpText}
            </p>
          )}
        </div>

        {/* 3. Occasion (Required) */}
        <div className="space-y-1.5">
          <label 
            htmlFor={`${formId}-occasion`} 
            className="block text-xs sm:text-sm font-semibold text-[#2A1420]"
          >
            {t.fields.occasion.label} <span className="text-[#9E2A2B] text-sm" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <select
              id={`${formId}-occasion`}
              name="occasion"
              required
              aria-required="true"
              value={formData.occasion}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.occasion}
              aria-describedby={errors.occasion ? `${formId}-occasion-error` : undefined}
              className={`w-full px-4 py-3 rounded-[4px] text-sm text-[#24191B] bg-white border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] appearance-none cursor-pointer ${
                errors.occasion ? 'border-[#9E2A2B] bg-[#FDF7F7]' : 'border-[#DFC8C2] hover:border-[#B99561]'
              } ${!formData.occasion ? 'text-[#74686A]' : 'text-[#24191B]'}`}
            >
              <option value="" disabled>
                {t.fields.occasion.placeholder}
              </option>
              <option value="bridal">{t.fields.occasion.options.bridal}</option>
              <option value="haldi">{t.fields.occasion.options.haldi}</option>
              <option value="engagement">{t.fields.occasion.options.engagement}</option>
              <option value="party">{t.fields.occasion.options.party}</option>
              <option value="other">{t.fields.occasion.options.other}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#524245]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.occasion && (
            <p id={`${formId}-occasion-error`} role="alert" className="flex items-center gap-1.5 text-xs text-[#9E2A2B] font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.occasion}</span>
            </p>
          )}

          {formData.occasion === 'other' && (
            <div className="space-y-1.5 pt-2">
              <label 
                htmlFor={`${formId}-otherOccasion`} 
                className="block text-xs sm:text-sm font-semibold text-[#2A1420]"
              >
                {t.fields.occasion.otherLabel} <span className="text-[#9E2A2B] text-sm" aria-hidden="true">*</span>
              </label>
              <input
                id={`${formId}-otherOccasion`}
                name="otherOccasion"
                type="text"
                required
                aria-required="true"
                value={formData.otherOccasion}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t.fields.occasion.otherPlaceholder}
                aria-invalid={!!errors.otherOccasion}
                aria-describedby={errors.otherOccasion ? `${formId}-otherOccasion-error` : undefined}
                className={`w-full px-4 py-3 rounded-[4px] text-sm text-[#24191B] bg-white border transition-colors duration-150 placeholder:text-[#A19597] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] ${
                  errors.otherOccasion ? 'border-[#9E2A2B] bg-[#FDF7F7]' : 'border-[#DFC8C2] hover:border-[#B99561]'
                }`}
              />
              {errors.otherOccasion && (
                <p id={`${formId}-otherOccasion-error`} role="alert" className="flex items-center gap-1.5 text-xs text-[#9E2A2B] font-medium pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.otherOccasion}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* 4. Event Date (Required, Min Today) */}
        <div className="space-y-1.5">
          <label 
            htmlFor={`${formId}-eventDate`} 
            className="block text-xs sm:text-sm font-semibold text-[#2A1420]"
          >
            {t.fields.eventDate.label} <span className="text-[#9E2A2B] text-sm" aria-hidden="true">*</span>
          </label>
          <input
            id={`${formId}-eventDate`}
            name="eventDate"
            type="date"
            min={todayStr}
            required
            aria-required="true"
            value={formData.eventDate}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!errors.eventDate}
            aria-describedby={errors.eventDate ? `${formId}-eventDate-error` : undefined}
            className={`w-full px-4 py-3 rounded-[4px] text-sm text-[#24191B] bg-white border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] ${
              errors.eventDate ? 'border-[#9E2A2B] bg-[#FDF7F7]' : 'border-[#DFC8C2] hover:border-[#B99561]'
            }`}
          />
          {errors.eventDate && (
            <p id={`${formId}-eventDate-error`} role="alert" className="flex items-center gap-1.5 text-xs text-[#9E2A2B] font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.eventDate}</span>
            </p>
          )}
        </div>

        {/* 5. Venue City or Area (Required) */}
        <div className="space-y-1.5">
          <label 
            htmlFor={`${formId}-venue`} 
            className="block text-xs sm:text-sm font-semibold text-[#2A1420]"
          >
            {t.fields.venue.label} <span className="text-[#9E2A2B] text-sm" aria-hidden="true">*</span>
          </label>
          <input
            id={`${formId}-venue`}
            name="venue"
            type="text"
            required
            aria-required="true"
            value={formData.venue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t.fields.venue.placeholder}
            aria-invalid={!!errors.venue}
            aria-describedby={errors.venue ? `${formId}-venue-error` : `${formId}-venue-help`}
            className={`w-full px-4 py-3 rounded-[4px] text-sm text-[#24191B] bg-white border transition-colors duration-150 placeholder:text-[#A19597] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] ${
              errors.venue ? 'border-[#9E2A2B] bg-[#FDF7F7]' : 'border-[#DFC8C2] hover:border-[#B99561]'
            }`}
          />
          {errors.venue ? (
            <p id={`${formId}-venue-error`} role="alert" className="flex items-center gap-1.5 text-xs text-[#9E2A2B] font-medium pt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.venue}</span>
            </p>
          ) : (
            <p id={`${formId}-venue-help`} className="text-[11px] text-[#74686A]">
              {t.fields.venue.helpText}
            </p>
          )}
        </div>

        {/* 6. Ready-by Time (Optional) */}
        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label 
              htmlFor={`${formId}-readyByTime`} 
              className="block text-xs sm:text-sm font-semibold text-[#2A1420]"
            >
              {t.fields.readyByTime.label}
            </label>
            <span className="text-[11px] text-[#74686A]">
              {t.fields.readyByTime.optionalBadge}
            </span>
          </div>
          <input
            id={`${formId}-readyByTime`}
            name="readyByTime"
            type="text"
            value={formData.readyByTime}
            onChange={handleChange}
            placeholder={t.fields.readyByTime.placeholder}
            className="w-full px-4 py-3 rounded-[4px] text-sm text-[#24191B] bg-white border border-[#DFC8C2] hover:border-[#B99561] transition-colors duration-150 placeholder:text-[#A19597] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561]"
          />
        </div>

        {/* 7. Additional Notes or Requirements (Optional) */}
        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label 
              htmlFor={`${formId}-notes`} 
              className="block text-xs sm:text-sm font-semibold text-[#2A1420]"
            >
              {t.fields.notes.label}
            </label>
            <span className="text-[11px] text-[#74686A]">
              {t.fields.notes.optionalBadge}
            </span>
          </div>
          <textarea
            id={`${formId}-notes`}
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder={t.fields.notes.placeholder}
            className="w-full px-4 py-3 rounded-[4px] text-sm text-[#24191B] bg-white border border-[#DFC8C2] hover:border-[#B99561] transition-colors duration-150 placeholder:text-[#A19597] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] resize-y min-h-[80px]"
          />
        </div>

      </div>

      {/* Disclosures Notice Box */}
      <div className="p-4 rounded-[6px] bg-[#F2E5E2]/60 border border-[#DFC8C2] text-xs text-[#524245] space-y-1.5">
        <p className="font-semibold text-[#4B1728] flex items-center gap-1.5">
          <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{t.disclosures.opensWhatsApp}</span>
        </p>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-[#74686A]">
          <li>{t.disclosures.noServerStorage}</li>
          <li>{t.disclosures.enquiryOnlyNotice}</li>
          <li>{t.disclosures.availabilityNote}</li>
        </ul>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-[4px] bg-[#4B1728] hover:bg-[#642037] active:bg-[#38111E] text-[#FBF8F4] text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B99561] focus-visible:ring-offset-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-[#FBF8F4] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <span>{t.submittingButton}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-[#DFC8C2]" aria-hidden="true" />
              <span>{t.submitButton}</span>
            </>
          )}
        </button>
      </div>

      {/* Confirmation & Fallback Link */}
      {lastWhatsAppUrl && (
        <div className="p-3.5 rounded-[4px] bg-[#FBF8F4] border border-[#B99561] text-xs text-[#2A1420] space-y-1 animate-in fade-in duration-200">
          <p className="flex items-center gap-1.5 font-medium text-[#4B1728]">
            <CheckCircle2 className="w-4 h-4 text-[#B99561] shrink-0" aria-hidden="true" />
            <span>{t.submissionSuccessNotice}</span>
          </p>
          <p>
            <a
              href={lastWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4B1728] underline font-medium hover:text-[#B99561] transition-colors"
            >
              {t.manualWhatsAppFallback}
            </a>
          </p>
        </div>
      )}

    </form>
  );
}
