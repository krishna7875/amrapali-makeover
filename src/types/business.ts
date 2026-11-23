import { z } from 'zod';

export const ServiceItemSchema = z.object({
  id: z.enum(['bridal', 'haldi', 'engagement', 'party']),
  name: z.string().min(1),
  category: z.string().min(1),
  enquiryContext: z.string().min(1),
});

export const BusinessConfigSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    legalName: z.string().min(1),
    businessType: z.literal('Individual makeup artist'),
    tagline: z.string().min(1),
  }),
  location: z.object({
    city: z.string().min(1),
    district: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    displayLocation: z.string().min(1),
    hasCustomerStorefront: z.literal(false),
    serviceDeliveryMode: z.literal('on_location'),
    travelQualifier: z.string().min(1),
  }),
  contact: z.object({
    displayPhone: z.string().min(1),
    rawPhone: z.string().min(1),
    whatsAppUrl: z.string().regex(/^https?:\/\//, 'Must be a valid HTTP/HTTPS URL'),
    directPhoneTel: z.string().min(1),
  }),
  social: z.object({
    instagramHandle: z.string().min(1),
    instagramUrl: z.string().regex(/^https?:\/\//, 'Must be a valid HTTP/HTTPS URL'),
    facebookUrl: z.string().regex(/^https?:\/\//, 'Must be a valid HTTP/HTTPS URL').nullable().optional(),
  }),
  reviews: z.object({
    googleBusinessUrl: z.string().regex(/^https?:\/\//, 'Must be a valid HTTP/HTTPS URL').nullable(),
    hasVerifiedListing: z.boolean(),
  }),
  seo: z.object({
    siteUrl: z.string().regex(/^https?:\/\//, 'Must be a valid HTTP/HTTPS URL'),
    intendedDomain: z.string().min(1),
    isDomainPurchased: z.boolean(),
    isDomainVerified: z.boolean(),
    domainStatus: z.string().min(1),
    defaultOgImage: z.string().min(1),
    themeColor: z.string().min(1),
  }),
  pricing: z.object({
    mode: z.literal('enquiry_only'),
    disclaimer: z.string().min(1),
  }),
  services: z.array(ServiceItemSchema).length(4),
});

export type BusinessConfig = z.infer<typeof BusinessConfigSchema>;
export type ServiceItem = z.infer<typeof ServiceItemSchema>;
