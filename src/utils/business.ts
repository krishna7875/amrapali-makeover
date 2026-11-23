import rawBusinessData from '../config/business.json';
import { BusinessConfigSchema, type BusinessConfig } from '../types/business';

// Validates business config at import/build time. Fails build if configuration schema is broken.
export const business: BusinessConfig = BusinessConfigSchema.parse(rawBusinessData);

/**
 * Builds a standardized wa.me URL with clean digits and safe URL-encoded message text.
 */
export function buildWhatsAppUrl(phone: string = business.contact.rawPhone, messageText?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!messageText || messageText.trim() === '') {
    return `https://wa.me/${cleanPhone}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText.trim())}`;
}

export default business;
