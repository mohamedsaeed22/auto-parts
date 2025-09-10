// SEO Configuration for FalParts Auto Parts Website

export const seoConfig = {
  // Basic site information
  siteName: 'FalParts',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://falparts.com',
  defaultLocale: 'en',
  supportedLocales: ['en', 'ar'],
  
  // Company information
  company: {
    name: 'FalParts',
    description: {
      en: 'Leading auto parts supplier offering high-quality automotive parts, accessories, and components for all vehicle makes and models. Fast delivery, competitive prices, and expert support.',
      ar: 'المورد الرائد لقطع غيار السيارات يقدم قطع غيار عالية الجودة وإكسسوارات ومكونات السيارات لجميع ماركات وموديلات المركبات. توصيل سريع وأسعار تنافسية ودعم خبير.'
    },
    keywords: {
      en: [
        'auto parts',
        'car parts',
        'automotive parts',
        'vehicle parts',
        'spare parts',
        'car accessories',
        'automotive accessories',
        'engine parts',
        'brake parts',
        'suspension parts',
        'transmission parts',
        'electrical parts',
        'body parts',
        'filters',
        'oils',
        'batteries',
        'tires',
        'falparts',
        'online auto parts',
        'car repair parts'
      ],
      ar: [
        'قطع غيار السيارات',
        'قطع السيارات',
        'إكسسوارات السيارات',
        'قطع غيار',
        'أجزاء السيارات',
        'قطع المحرك',
        'قطع الفرامل',
        'قطع التعليق',
        'قطع ناقل الحركة',
        'القطع الكهربائية',
        'قطع الهيكل',
        'فلاتر',
        'زيوت',
        'بطاريات',
        'إطارات',
        'فال بارتس',
        'قطع غيار أونلاين',
        'قطع إصلاح السيارات'
      ]
    },
    contact: {
      phone: '+966-XXX-XXXX',
      email: 'info@falparts.com',
      address: {
        en: 'Saudi Arabia',
        ar: 'المملكة العربية السعودية'
      }
    },
    social: {
      facebook: 'https://facebook.com/falparts',
      twitter: 'https://twitter.com/falparts',
      instagram: 'https://instagram.com/falparts',
      linkedin: 'https://linkedin.com/company/falparts',
      youtube: 'https://youtube.com/@falparts'
    }
  },

  // Default metadata for different page types
  defaultMetadata: {
    home: {
      title: {
        en: 'FalParts - Premium Auto Parts & Car Accessories Online',
        ar: 'فال بارتس - قطع غيار السيارات والإكسسوارات المميزة أونلاين'
      },
      description: {
        en: 'Shop premium auto parts, car accessories, and automotive components at FalParts. Fast delivery, competitive prices, and quality guaranteed. Find parts for all vehicle makes and models.',
        ar: 'تسوق قطع غيار السيارات المميزة والإكسسوارات والمكونات في فال بارتس. توصيل سريع وأسعار تنافسية وجودة مضمونة. اعثر على قطع لجميع ماركات وموديلات المركبات.'
      }
    },
    products: {
      title: {
        en: 'Auto Parts & Car Accessories - FalParts',
        ar: 'قطع غيار السيارات والإكسسوارات - فال بارتس'
      },
      description: {
        en: 'Browse our extensive collection of auto parts and car accessories. Quality parts for all vehicle makes and models with fast delivery and competitive prices.',
        ar: 'تصفح مجموعتنا الواسعة من قطع غيار السيارات والإكسسوارات. قطع عالية الجودة لجميع ماركات وموديلات المركبات مع توصيل سريع وأسعار تنافسية.'
      }
    },
    categories: {
      title: {
        en: 'Auto Parts Categories - FalParts',
        ar: 'فئات قطع غيار السيارات - فال بارتس'
      },
      description: {
        en: 'Explore auto parts by category. Find engine parts, brake components, electrical parts, body parts, and more for your vehicle.',
        ar: 'استكشف قطع غيار السيارات حسب الفئة. اعثر على قطع المحرك ومكونات الفرامل والقطع الكهربائية وقطع الهيكل والمزيد لسيارتك.'
      }
    },
    brands: {
      title: {
        en: 'Auto Parts Brands - FalParts',
        ar: 'علامات قطع غيار السيارات - فال بارتس'
      },
      description: {
        en: 'Shop auto parts from top automotive brands. Quality guaranteed parts from trusted manufacturers for all vehicle types.',
        ar: 'تسوق قطع غيار السيارات من أفضل العلامات التجارية للسيارات. قطع مضمونة الجودة من مصنعين موثوقين لجميع أنواع المركبات.'
      }
    },
    about: {
      title: {
        en: 'About FalParts - Leading Auto Parts Supplier',
        ar: 'حول فال بارتس - المورد الرائد لقطع غيار السيارات'
      },
      description: {
        en: 'Learn about FalParts, your trusted partner for auto parts and automotive accessories. Quality products, expert service, and customer satisfaction guaranteed.',
        ar: 'تعرف على فال بارتس، شريكك الموثوق لقطع غيار السيارات وإكسسوارات السيارات. منتجات عالية الجودة وخدمة خبيرة ورضا العملاء مضمون.'
      }
    },
    contact: {
      title: {
        en: 'Contact FalParts - Auto Parts Support',
        ar: 'اتصل بفال بارتس - دعم قطع غيار السيارات'
      },
      description: {
        en: 'Get in touch with FalParts for auto parts inquiries, support, and expert advice. We\'re here to help you find the right parts for your vehicle.',
        ar: 'تواصل مع فال بارتس لاستفسارات قطع غيار السيارات والدعم والمشورة الخبيرة. نحن هنا لمساعدتك في العثور على القطع المناسبة لسيارتك.'
      }
    }
  },

  // Open Graph default settings
  openGraph: {
    type: 'website',
    siteName: 'FalParts',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FalParts - Auto Parts & Car Accessories'
      }
    ]
  },

  // Twitter Card default settings
  twitter: {
    card: 'summary_large_image',
    site: '@falparts',
    creator: '@falparts'
  },

  // Structured data templates
  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'FalParts',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://falparts.com',
      logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://falparts.com'}/logo.png`,
      description: 'Leading auto parts supplier offering high-quality automotive parts and accessories',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+966-XXX-XXXX',
        contactType: 'customer service',
        availableLanguage: ['English', 'Arabic']
      },
      sameAs: [
        'https://facebook.com/falparts',
        'https://twitter.com/falparts',
        'https://instagram.com/falparts',
        'https://linkedin.com/company/falparts'
      ]
    },
    localBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://falparts.com'}/#organization`,
      name: 'FalParts',
      description: 'Auto parts and automotive accessories supplier',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://falparts.com',
      telephone: '+966-XXX-XXXX',
      email: 'info@falparts.com',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'SA',
        addressRegion: 'Saudi Arabia'
      },
      openingHours: 'Mo-Su 00:00-23:59',
      priceRange: '$$'
    }
  },

  // Robots.txt configuration
  robots: {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/checkout/complete']
      }
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://falparts.com'}/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_SITE_URL || 'https://falparts.com'
  }
};

// Helper function to get localized metadata
export function getLocalizedMetadata(pageType: keyof typeof seoConfig.defaultMetadata, locale: string = 'en') {
  const metadata = seoConfig.defaultMetadata[pageType];
  return {
    title: metadata.title[locale as keyof typeof metadata.title] || metadata.title.en,
    description: metadata.description[locale as keyof typeof metadata.description] || metadata.description.en
  };
}

// Helper function to generate keywords
export function getKeywords(locale: string = 'en'): string {
  const keywords = seoConfig.company.keywords[locale as keyof typeof seoConfig.company.keywords] || seoConfig.company.keywords.en;
  return keywords.join(', ');
}

// Helper function to get canonical URL
export function getCanonicalUrl(path: string, locale?: string): string {
  const baseUrl = seoConfig.siteUrl;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (locale && locale !== seoConfig.defaultLocale) {
    return `${baseUrl}/${locale}/${cleanPath}`;
  }
  
  return `${baseUrl}/${cleanPath}`;
}

// Helper function to get alternate URLs for hreflang
export function getAlternateUrls(path: string): Array<{ hreflang: string; href: string }> {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return seoConfig.supportedLocales.map(locale => ({
    hreflang: locale,
    href: locale === seoConfig.defaultLocale 
      ? `${seoConfig.siteUrl}/${cleanPath}`
      : `${seoConfig.siteUrl}/${locale}/${cleanPath}`
  }));
}