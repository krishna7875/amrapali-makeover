import en from '../content/translations/en.json';
import hi from '../content/translations/hi.json';
import mr from '../content/translations/mr.json';
import { type Locale, type TranslationSchema, LOCALES, DEFAULT_LOCALE } from '../types/i18n';

const translations: Record<Locale, TranslationSchema> = {
  en,
  hi,
  mr,
};

export function isValidLocale(lang: string): lang is Locale {
  return LOCALES.includes(lang as Locale);
}

export function getTranslations(lang: string = DEFAULT_LOCALE): TranslationSchema {
  const normalizedLang = isValidLocale(lang) ? lang : DEFAULT_LOCALE;
  return translations[normalizedLang];
}

/**
 * Replaces or prefixes the locale in a given pathname.
 * E.g., /en/ -> /hi/
 * /styleguide -> /styleguide (keeps un-localized routes intact)
 */
export function getLocalizedPath(currentPathname: string, targetLocale: Locale): string {
  const segments = currentPathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return `/${targetLocale}/`;
  }

  // If first segment is an existing locale, replace it
  if (isValidLocale(segments[0])) {
    segments[0] = targetLocale;
    return `/${segments.join('/')}/`;
  }

  // If it's a non-localized page like /styleguide, keep as-is or prefix if intended
  if (currentPathname.startsWith('/styleguide')) {
    return currentPathname;
  }

  return `/${targetLocale}/${segments.join('/')}/`;
}

export { LOCALES, DEFAULT_LOCALE, type Locale };
