export type Locale = 'en' | 'hi' | 'mr';

export const LOCALES: Locale[] = ['en', 'hi', 'mr'];
export const DEFAULT_LOCALE: Locale = 'en';

export interface TranslationSchema {
  common: {
    brandName: string;
    brandTagline: string;
    bhiwandiBase: string;
    travelQualifierShort: string;
    travelQualifierFull: string;
    onLocationService: string;
    enquiryBasedPricing: string;
    noStudioNotice: string;
  };
  announcement: {
    badge: string;
    message: string;
    ctaText: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogLocale: string;
  };
  nav: {
    services: string;
    about: string;
    process: string;
    portfolio: string;
    reviews: string;
    faq: string;
    contact: string;
    enquireButton: string;
    menuOpen: string;
    menuClose: string;
    drawerTitle: string;
    selectLanguage: string;
  };
  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    subheadline: string;
    locationBadge: string;
    travelNote: string;
    primaryCta: string;
    secondaryCta: string;
    imageAlt: string;
    imagePlaceholderLabel: string;
    imagePlaceholderDimensions: string;
    imagePlaceholderNotice: string;
    badgeOnLocation: string;
    badgeEnquiryOnly: string;
    badgeServices: string;
  };
  languageSwitcher: {
    label: string;
    currentLanguage: string;
    en: string;
    hi: string;
    mr: string;
  };
  footer: {
    description: string;
    quickLinksTitle: string;
    servicesTitle: string;
    contactTitle: string;
    callNow: string;
    whatsAppNow: string;
    instagramFollow: string;
    locationLabel: string;
    copyrightText: string;
    backToTop: string;
    enquiryOnlyDisclaimer: string;
  };
  floatingWhatsApp: {
    ariaLabel: string;
    tooltipText: string;
    defaultMessage: string;
  };
  services: {
    bridal: string;
    haldi: string;
    engagement: string;
    party: string;
  };
  servicesSection: {
    eyebrow: string;
    heading: string;
    subheadline: string;
    pricingNotice: string;
    customQuoteNote: string;
    onLocationTag: string;
    enquiryOnlyTag: string;
    items: {
      bridal: {
        name: string;
        tagline: string;
        description: string;
        enquiryCta: string;
        whatsAppMessage: string;
        imageAlt: string;
        placeholderLabel: string;
      };
      haldi: {
        name: string;
        tagline: string;
        description: string;
        enquiryCta: string;
        whatsAppMessage: string;
        imageAlt: string;
        placeholderLabel: string;
      };
      engagement: {
        name: string;
        tagline: string;
        description: string;
        enquiryCta: string;
        whatsAppMessage: string;
        imageAlt: string;
        placeholderLabel: string;
      };
      party: {
        name: string;
        tagline: string;
        description: string;
        enquiryCta: string;
        whatsAppMessage: string;
        imageAlt: string;
        placeholderLabel: string;
      };
    };
  };
  about: {
    eyebrow: string;
    heading: string;
    leadText: string;
    bioParagraph1: string;
    bioParagraph2: string;
    experienceBadge: string;
    experienceLabel: string;
    locationBadge: string;
    locationQualifier: string;
    approachTitle: string;
    approachDescription: string;
    credentialsTitle: string;
    credentialsClassification: string;
    credentialsCourse: string;
    credentialsDuration: string;
    credentialsDate: string;
    credentialsDescription: string;
    viewCertificate: string;
    closeCertificate: string;
    certificateAlt: string;
    portraitAlt: string;
    portraitPlaceholderLabel: string;
    portraitPlaceholderSubtext: string;
    enquireCta: string;
    enquiryMessage: string;
  };
  bookingProcess: {
    eyebrow: string;
    heading: string;
    subheadline: string;
    disclaimerNotice: string;
    steps: {
      step1: {
        stepNumber: string;
        title: string;
        description: string;
        details: string[];
      };
      step2: {
        stepNumber: string;
        title: string;
        description: string;
        note: string;
      };
      step3: {
        stepNumber: string;
        title: string;
        description: string;
        note: string;
      };
      step4: {
        stepNumber: string;
        title: string;
        description: string;
        notice: string;
      };
    };
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
    whatsAppMessage: string;
  };
  serviceArea: {
    eyebrow: string;
    heading: string;
    subheadline: string;
    baseCardTitle: string;
    baseCardLocation: string;
    baseCardDescription: string;
    baseCardNote: string;
    travelCardTitle: string;
    travelCardSubtitle: string;
    travelCardDescription: string;
    travelCardCondition: string;
    travelCriteriaTitle: string;
    travelCriteriaItems: string[];
    outsideBhiwandiTitle: string;
    outsideBhiwandiDescription: string;
    outsideBhiwandiCta: string;
    outsideBhiwandiWhatsAppMessage: string;
  };
  portfolioSection: {
    eyebrow: string;
    heading: string;
    subheadline: string;
    filters: {
      all: string;
      bridal: string;
      haldi: string;
      engagement: string;
      party: string;
      hairstyle: string;
    };
    temporaryBadge: string;
    temporaryNotice: string;
    viewImage: string;
    lightbox: {
      close: string;
      previous: string;
      next: string;
      counterOf: string;
    };
    video: {
      eyebrow: string;
      heading: string;
      subheadline: string;
      badge: string;
      note: string;
    };
    items: {
      'bridal-0882': { title: string; alt: string };
      'bridal-0893': { title: string; alt: string };
      'haldi-0882': { title: string; alt: string };
      'haldi-0893': { title: string; alt: string };
      'engagement-0881': { title: string; alt: string };
      'engagement-0889': { title: string; alt: string };
      'engagement-0894': { title: string; alt: string };
      'party-0886': { title: string; alt: string };
      'party-0888': { title: string; alt: string };
      'hairstyle-9148': { title: string; alt: string };
      'hairstyle-9441': { title: string; alt: string };
    };
  };
  reviewsSection: {
    eyebrow: string;
    heading: string;
    subheadline: string;
    trustPillars: {
      verifiedTitle: string;
      verifiedDesc: string;
      transparentTitle: string;
      transparentDesc: string;
      occasionsTitle: string;
      occasionsDesc: string;
    };
    actionCard: {
      badge: string;
      heading: string;
      description: string;
      readReviewsCta: string;
      note: string;
    };
    complianceNotice: string;
  };
  faqSection: {
    eyebrow: string;
    heading: string;
    subheadline: string;
    items: {
      id: string;
      question: string;
      answer: string;
    }[];
    bottomCta: {
      title: string;
      description: string;
      buttonText: string;
      whatsAppMessage: string;
    };
  };
  contactSection: {
    eyebrow: string;
    heading: string;
    subheadline: string;
    form: {
      title: string;
      subtitle: string;
      fields: {
        name: {
          label: string;
          placeholder: string;
          requiredError: string;
        };
        phone: {
          label: string;
          placeholder: string;
          requiredError: string;
          invalidError: string;
          helpText: string;
        };
        occasion: {
          label: string;
          placeholder: string;
          requiredError: string;
          options: {
            bridal: string;
            haldi: string;
            engagement: string;
            party: string;
            other: string;
          };
          otherLabel: string;
          otherPlaceholder: string;
          otherRequiredError: string;
        };
        eventDate: {
          label: string;
          placeholder: string;
          requiredError: string;
          pastDateError: string;
        };
        venue: {
          label: string;
          placeholder: string;
          requiredError: string;
          helpText: string;
        };
        readyByTime: {
          label: string;
          placeholder: string;
          optionalBadge: string;
        };
        notes: {
          label: string;
          placeholder: string;
          optionalBadge: string;
        };
      };
      submitButton: string;
      submittingButton: string;
      disclosures: {
        opensWhatsApp: string;
        noServerStorage: string;
        enquiryOnlyNotice: string;
        availabilityNote: string;
      };
      submissionSuccessNotice: string;
      manualWhatsAppFallback: string;
      messageTemplate: {
        greeting: string;
        intro: string;
        nameLabel: string;
        phoneLabel: string;
        occasionLabel: string;
        dateLabel: string;
        venueLabel: string;
        readyByLabel: string;
        notesLabel: string;
        closing: string;
        thanks: string;
      };
    };
    directCard: {
      badge: string;
      heading: string;
      description: string;
      artistLabel: string;
      artistName: string;
      baseLabel: string;
      baseLocation: string;
      serviceModeLabel: string;
      serviceModeValue: string;
      directCallLabel: string;
      whatsAppChatLabel: string;
      instagramLabel: string;
      noStudioNotice: string;
    };
  };
}
