// SEO Configuration for FalParts Auto Parts Website

export const seoConfig = {
  // Basic site information
  siteName: "FalParts",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.falparts.sa",
  defaultLocale: "ar",
  supportedLocales: ["ar", "en"],

  // Company information
  company: {
    name: "FalParts",
    legalName: "Fal Al-Gharbia Company",
    description: {
      en: "Fal Al-Gharbia Company is a leading Saudi company specializing in automotive spare parts, headquartered in Jeddah. We provide genuine and certified spare parts for all types of vehicles with focus on quality and fast delivery.",
      ar: "شركة فال الغربية هي شركة سعودية رائدة في مجال بيع قطع غيار السيارات، مقرها في مدينة جدة. نوفر قطع الغيار الأصلية والمعتمدة لجميع أنواع السيارات مع التركيز على الجودة وسرعة التوريد.",
    },
    keywords: {
      en: [
        "auto parts",
        "car parts",
        "automotive parts",
        "vehicle parts",
        "spare parts",
        "car accessories",
        "automotive accessories",
        "genuine parts",
        "certified parts",
        "engine parts",
        "brake parts",
        "suspension parts",
        "transmission parts",
        "electrical parts",
        "chinese car parts",
        "GEELY parts",
        "CHANGAN parts",
        "BAIC parts",
        "CHERY parts",
        "fal parts",
        "fal algharbia",
        "falparts",
        "jeddah auto parts",
        "saudi auto parts",
        "online auto parts",
      ],
      ar: [
        "قطع غيار السيارات",
        "قطع السيارات",
        "إكسسوارات السيارات",
        "قطع غيار أصلية",
        "قطع غيار معتمدة",
        "قطع غيار",
        "أجزاء السيارات",
        "قطع المحرك",
        "قطع الفرامل",
        "قطع التعليق",
        "قطع ناقل الحركة",
        "القطع الكهربائية",
        "قطع غيار سيارات صينية",
        "قطع جيلي",
        "قطع شانجان",
        "قطع بايك",
        "قطع شيري",
        "فال بارتس",
        "فال الغربية",
        "قطع غيار جدة",
        "قطع غيار السعودية",
        "قطع غيار أونلاين",
      ],
    },
    contact: {
      phone: "+966543777569",
      phoneDisplay: "0543777569",
      email: "parts@falfuture.com",
      website: "www.falfuture.com",
      address: {
        en: "Prince Mohammed Bin Abdulaziz St, Al Faisaliyah, Jeddah, Saudi Arabia",
        ar: "شارع الأمير محمد بن عبد العزيز، حي الفيصلية، جدة، المملكة العربية السعودية",
      },
      city: {
        en: "Jeddah",
        ar: "جدة",
      },
      country: {
        en: "Saudi Arabia",
        ar: "المملكة العربية السعودية",
      },
    },
    social: {
      facebook: "https://facebook.com/falparts",
      twitter: "https://twitter.com/falparts",
      instagram: "https://instagram.com/falparts",
      linkedin: "https://linkedin.com/company/falparts",
      youtube: "https://youtube.com/@falparts",
    },
  },

  // Default metadata for different page types
  defaultMetadata: {
    home: {
      title: {
        en: "FalParts - Premium Auto Parts & Car Accessories Online | Saudi Arabia",
        ar: "فال بارتس - قطع غيار السيارات والإكسسوارات المميزة أونلاين | المملكة العربية السعودية",
      },
      description: {
        en: "Shop premium auto parts, car accessories, and automotive components at FalParts. Fast delivery, competitive prices, and quality guaranteed. Find parts for all vehicle makes and models in Saudi Arabia.",
        ar: "تسوق قطع غيار السيارات المميزة والإكسسوارات والمكونات في فال بارتس. توصيل سريع وأسعار تنافسية وجودة مضمونة. اعثر على قطع لجميع ماركات وموديلات المركبات في المملكة العربية السعودية.",
      },
    },
    products: {
      title: {
        en: "Auto Parts & Car Accessories - Shop Online | FalParts Saudi Arabia",
        ar: "قطع غيار السيارات والإكسسوارات - تسوق أونلاين | فال بارتس السعودية",
      },
      description: {
        en: "Browse our extensive collection of auto parts and car accessories. Quality parts for all vehicle makes and models with fast delivery and competitive prices. Free shipping on orders over 500 SAR.",
        ar: "تصفح مجموعتنا الواسعة من قطع غيار السيارات والإكسسوارات. قطع عالية الجودة لجميع ماركات وموديلات المركبات مع توصيل سريع وأسعار تنافسية. شحن مجاني للطلبات أكثر من 500 ر.س.",
      },
    },
    categories: {
      title: {
        en: "Auto Parts Categories - FalParts",
        ar: "فئات قطع غيار السيارات - فال بارتس",
      },
      description: {
        en: "Explore auto parts by category. Find engine parts, brake components, electrical parts, body parts, and more for your vehicle.",
        ar: "استكشف قطع غيار السيارات حسب الفئة. اعثر على قطع المحرك ومكونات الفرامل والقطع الكهربائية وقطع الهيكل والمزيد لسيارتك.",
      },
    },
    brands: {
      title: {
        en: "Auto Parts Brands - FalParts",
        ar: "علامات قطع غيار السيارات - فال بارتس",
      },
      description: {
        en: "Shop auto parts from top automotive brands. Quality guaranteed parts from trusted manufacturers for all vehicle types.",
        ar: "تسوق قطع غيار السيارات من أفضل العلامات التجارية للسيارات. قطع مضمونة الجودة من مصنعين موثوقين لجميع أنواع المركبات.",
      },
    },
    about: {
      title: {
        en: "About FalParts - Leading Auto Parts Supplier",
        ar: "حول فال بارتس - المورد الرائد لقطع غيار السيارات",
      },
      description: {
        en: "Learn about FalParts, your trusted partner for auto parts and automotive accessories. Quality products, expert service, and customer satisfaction guaranteed.",
        ar: "تعرف على فال بارتس، شريكك الموثوق لقطع غيار السيارات وإكسسوارات السيارات. منتجات عالية الجودة وخدمة خبيرة ورضا العملاء مضمون.",
      },
    },
    contact: {
      title: {
        en: "Contact FalParts - Auto Parts Support & Customer Service",
        ar: "اتصل بفال بارتس - دعم قطع غيار السيارات وخدمة العملاء",
      },
      description: {
        en: "Get in touch with FalParts for auto parts inquiries, support, and expert advice. We're here to help you find the right parts for your vehicle. Call us or visit our store.",
        ar: "تواصل مع فال بارتس لاستفسارات قطع غيار السيارات والدعم والمشورة الخبيرة. نحن هنا لمساعدتك في العثور على القطع المناسبة لسيارتك. اتصل بنا أو زر متجرنا.",
      },
    },
    product: {
      title: {
        en: "{productName} - Auto Parts | FalParts",
        ar: "{productName} - قطع غيار السيارات | فال بارتس",
      },
      description: {
        en: "Buy {productName} online at FalParts. High-quality auto parts with fast delivery and competitive prices. Compatible with {compatibility}.",
        ar: "اشتري {productName} أونلاين من فال بارتس. قطع غيار عالية الجودة مع توصيل سريع وأسعار تنافسية. متوافق مع {compatibility}.",
      },
    },
    category: {
      title: {
        en: "{categoryName} Auto Parts - FalParts",
        ar: "قطع غيار {categoryName} - فال بارتس",
      },
      description: {
        en: "Shop {categoryName} auto parts at FalParts. Quality parts for all vehicle makes and models. Fast delivery and competitive prices.",
        ar: "تسوق قطع غيار {categoryName} من فال بارتس. قطع عالية الجودة لجميع ماركات وموديلات المركبات. توصيل سريع وأسعار تنافسية.",
      },
    },
    brand: {
      title: {
        en: "{brandName} Auto Parts - Official Dealer | FalParts",
        ar: "قطع غيار {brandName} - وكيل رسمي | فال بارتس",
      },
      description: {
        en: "Shop authentic {brandName} auto parts at FalParts. Official dealer with genuine parts, fast delivery, and competitive prices.",
        ar: "تسوق قطع غيار {brandName} الأصيلة من فال بارتس. وكيل رسمي مع قطع أصلية وتوصيل سريع وأسعار تنافسية.",
      },
    },
    offer: {
      title: {
        en: "{offerTitle} - Special Offer | FalParts",
        ar: "{offerTitle} - عرض خاص | فال بارتس",
      },
      description: {
        en: "Limited time offer: {offerTitle} at FalParts. Save big on auto parts and accessories. Valid until {expiryDate}.",
        ar: "عرض لفترة محدودة: {offerTitle} في فال بارتس. وفر الكثير على قطع غيار وإكسسوارات السيارات. صالح حتى {expiryDate}.",
      },
    },
    wishlist: {
      title: {
        en: "My Wishlist - Saved Auto Parts | FalParts",
        ar: "قائمة أمنياتي - قطع غيار محفوظة | فال بارتس",
      },
      description: {
        en: "View your saved auto parts and accessories in your wishlist. Easy to add to cart and purchase when ready.",
        ar: "عرض قطع غيار وإكسسوارات السيارات المحفوظة في قائمة أمنياتك. سهل الإضافة إلى السلة والشراء عند الاستعداد.",
      },
    },
    favourites: {
      title: {
        en: "My Favourites - Favorite Auto Parts | FalParts",
        ar: "مفضلاتي - قطع غيار مفضلة | فال بارتس",
      },
      description: {
        en: "View your favorite auto parts and accessories. Quick access to your most-loved products.",
        ar: "عرض قطع غيار وإكسسوارات السيارات المفضلة لديك. وصول سريع إلى منتجاتك المفضلة.",
      },
    },
    cart: {
      title: {
        en: "Shopping Cart - Auto Parts | FalParts",
        ar: "سلة التسوق - قطع غيار السيارات | فال بارتس",
      },
      description: {
        en: "Review your selected auto parts and accessories. Secure checkout with multiple payment options.",
        ar: "راجع قطع غيار وإكسسوارات السيارات المختارة. دفع آمن مع خيارات دفع متعددة.",
      },
    },
    checkout: {
      title: {
        en: "Checkout - Complete Your Order | FalParts",
        ar: "الدفع - أكمل طلبك | فال بارتس",
      },
      description: {
        en: "Complete your auto parts order with secure checkout. Multiple payment methods and fast delivery options.",
        ar: "أكمل طلب قطع غيار السيارات مع دفع آمن. طرق دفع متعددة وخيارات توصيل سريع.",
      },
    },
    search: {
      title: {
        en: 'Search Results for "{query}" - Auto Parts | FalParts',
        ar: 'نتائج البحث عن "{query}" - قطع غيار السيارات | فال بارتس',
      },
      description: {
        en: 'Search results for "{query}" in our auto parts catalog. Find the exact parts you need for your vehicle.',
        ar: 'نتائج البحث عن "{query}" في كتالوج قطع غيار السيارات. اعثر على القطع الدقيقة التي تحتاجها لسيارتك.',
      },
    },
  },

  // Open Graph default settings
  openGraph: {
    type: "website",
    siteName: "FalParts",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FalParts - Auto Parts & Car Accessories",
      },
    ],
  },

  // Twitter Card default settings
  twitter: {
    card: "summary_large_image",
    site: "@falparts",
    creator: "@falparts",
  },

  // Structured data templates
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "FalParts",
      url: process.env.NEXT_PUBLIC_SITE_URL || "http://www.falparts.sa",
      logo: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://www.falparts.sa"
      }/logo.png`,
      description:
        "Leading auto parts supplier offering high-quality automotive parts and accessories",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+966543777569",
        contactType: "customer service",
        email: "parts@falfuture.com",
        availableLanguage: ["English", "Arabic"],
        areaServed: "SA",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Saturday",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
          ],
          opens: "09:00",
          closes: "21:00",
        },
      },
      sameAs: [
        "https://facebook.com/falparts",
        "https://twitter.com/falparts",
        "https://instagram.com/falparts",
        "https://linkedin.com/company/falparts",
        "https://youtube.com/@falparts",
      ],
      foundingDate: "2020",
      numberOfEmployees: "50-100",
      industry: "Automotive Parts and Accessories",
    },
    localBusiness: {
      "@context": "https://schema.org",
      "@type": "AutomotivePartsStore",
      "@id": `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://www.falparts.sa"
      }/#organization`,
      name: "FalParts",
      alternateName: "Fal Al-Gharbia Company",
      description: "Leading Saudi company specializing in automotive spare parts. Supplier of genuine and certified spare parts for all types of vehicles.",
      url: process.env.NEXT_PUBLIC_SITE_URL || "http://www.falparts.sa",
      telephone: "+966543777569",
      email: "parts@falfuture.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Prince Mohammed Bin Abdulaziz St, Al Faisaliyah",
        addressLocality: "Jeddah",
        addressRegion: "Makkah Province",
        addressCountry: "SA",
        postalCode: "23441",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "21.5433",
        longitude: "39.1728",
      },
      openingHours: "Sa-Th 09:00-21:00",
      priceRange: "$$-$$$",
      paymentAccepted: ["Cash", "Credit Card", "Bank Transfer", "Apple Pay", "STCPay", "Mada"],
      currenciesAccepted: "SAR",
      areaServed: {
        "@type": "Country",
        name: "Saudi Arabia",
      },
    },
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "FalParts",
      url: process.env.NEXT_PUBLIC_SITE_URL || "http://www.falparts.sa",
      description: "Online auto parts store for all vehicle makes and models",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${
            process.env.NEXT_PUBLIC_SITE_URL || "http://www.falparts.sa"
          }/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: "FalParts",
        logo: {
          "@type": "ImageObject",
          url: `${
            process.env.NEXT_PUBLIC_SITE_URL || "http://www.falparts.sa"
          }/logo.png`,
        },
      },
    },
    breadcrumbList: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What types of auto parts do you sell?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We specialize in genuine and certified spare parts for all types of vehicles, with focus on Chinese automotive brands including GEELY, CHANGAN, BAIC, CHERY, FAW, as well as HYUNDAI, KIA, JETOUR, and HAVAL. We offer engine parts, transmission components, suspension parts, and electrical supplies.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer free shipping?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we offer free shipping on orders over 500 SAR within Saudi Arabia. We provide fast delivery with guaranteed quality.",
          },
        },
        {
          "@type": "Question",
          name: "How long does delivery take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We deliver parts in the shortest possible time with guaranteed quality. Standard delivery takes 2-5 business days within Saudi Arabia. Express delivery options are available for urgent orders.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer genuine parts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we are one of the largest suppliers of original and commercial Chinese car spare parts in the Kingdom. All parts are genuine and certified with manufacturer warranties.",
          },
        },
        {
          "@type": "Question",
          name: "Where are you located?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We are located in Jeddah, Saudi Arabia, at Prince Mohammed Bin Abdulaziz St, Al Faisaliyah. You can contact us at 0543777569 or email parts@falfuture.com",
          },
        },
        {
          "@type": "Question",
          name: "What are your business hours?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We are open Saturday through Thursday from 9:00 AM to 9:00 PM. Our customer service team is available during these hours to assist you.",
          },
        },
      ],
    },
  },

  // Robots.txt configuration
  robots: {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/checkout/complete"],
      },
    ],
    sitemap: `${
      process.env.NEXT_PUBLIC_SITE_URL || "http://www.falparts.sa"
    }/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_SITE_URL || "http://www.falparts.sa",
  },
};

// Helper function to get localized metadata
export function getLocalizedMetadata(
  pageType: keyof typeof seoConfig.defaultMetadata,
  locale: string = "ar"
) {
  const metadata = seoConfig.defaultMetadata[pageType];
  return {
    title:
      metadata.title[locale as keyof typeof metadata.title] ||
      metadata.title.en,
    description:
      metadata.description[locale as keyof typeof metadata.description] ||
      metadata.description.en,
  };
}

// Helper function to generate keywords
export function getKeywords(locale: string = "ar"): string {
  const keywords =
    seoConfig.company.keywords[
      locale as keyof typeof seoConfig.company.keywords
    ] || seoConfig.company.keywords.en;
  return keywords.join(", ");
}

// Helper function to get canonical URL
export function getCanonicalUrl(path: string, locale?: string): string {
  const baseUrl = seoConfig.siteUrl;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Arabic is default, so no prefix needed
  if (locale && locale === "en") {
    return `${baseUrl}/en/${cleanPath}`;
  }

  // Arabic (default) - no locale prefix
  return `${baseUrl}/${cleanPath}`;
}

// Helper function to get alternate URLs for hreflang
export function getAlternateUrls(
  path: string
): Array<{ hreflang: string; href: string }> {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return seoConfig.supportedLocales.map((locale) => ({
    hreflang: locale,
    href:
      locale === "ar" // Arabic is default
        ? `${seoConfig.siteUrl}/${cleanPath}`
        : `${seoConfig.siteUrl}/${locale}/${cleanPath}`,
  }));
}

// Helper function to generate product metadata
export function generateProductMetadata(
  product: { name?: string; compatibility?: string },
  locale: string = "ar"
) {
  const template = seoConfig.defaultMetadata.product;
  const title = template.title[locale as keyof typeof template.title]
    .replace("{productName}", product.name || "Auto Part")
    .replace("{compatibility}", product.compatibility || "various vehicles");

  const description = template.description[
    locale as keyof typeof template.description
  ]
    .replace("{productName}", product.name || "Auto Part")
    .replace("{compatibility}", product.compatibility || "various vehicles");

  return { title, description };
}

// Helper function to generate category metadata
export function generateCategoryMetadata(
  category: { name?: string },
  locale: string = "ar"
) {
  const template = seoConfig.defaultMetadata.category;
  const title = template.title[locale as keyof typeof template.title].replace(
    "{categoryName}",
    category.name || "Auto Parts"
  );

  const description = template.description[
    locale as keyof typeof template.description
  ].replace("{categoryName}", category.name || "Auto Parts");

  return { title, description };
}

// Helper function to generate brand metadata
export function generateBrandMetadata(
  brand: { name?: string },
  locale: string = "ar"
) {
  const template = seoConfig.defaultMetadata.brand;
  const title = template.title[locale as keyof typeof template.title].replace(
    "{brandName}",
    brand.name || "Auto Parts Brand"
  );

  const description = template.description[
    locale as keyof typeof template.description
  ].replace("{brandName}", brand.name || "Auto Parts Brand");

  return { title, description };
}

// Helper function to generate offer metadata
export function generateOfferMetadata(
  offer: { title?: string; expiryDate?: string },
  locale: string = "ar"
) {
  const template = seoConfig.defaultMetadata.offer;
  const title = template.title[locale as keyof typeof template.title].replace(
    "{offerTitle}",
    offer.title || "Special Offer"
  );

  const description = template.description[
    locale as keyof typeof template.description
  ]
    .replace("{offerTitle}", offer.title || "Special Offer")
    .replace("{expiryDate}", offer.expiryDate || "limited time");

  return { title, description };
}

// Helper function to generate search metadata
export function generateSearchMetadata(query: string, locale: string = "ar") {
  const template = seoConfig.defaultMetadata.search;
  const title = template.title[locale as keyof typeof template.title].replace(
    "{query}",
    query
  );

  const description = template.description[
    locale as keyof typeof template.description
  ].replace("{query}", query);

  return { title, description };
}

// Helper function to generate breadcrumb structured data
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Helper function to generate product structured data
export function generateProductStructuredData(product: {
  name: string;
  description: string;
  primary_image?: string;
  images?: string[];
  brand?: { name: string };
  category?: { name: string };
  product_identifier: string;
  final_price?: number;
  price?: number;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  id: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.primary_image || product.images?.[0],
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "FalParts",
    },
    category: product.category?.name,
    sku: product.product_identifier,
    offers: {
      "@type": "Offer",
      price: product.final_price || product.price,
      priceCurrency: "SAR",
      availability:
        (product.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "FalParts",
      },
      url: `${seoConfig.siteUrl}/product/${product.id}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 1,
        }
      : undefined,
  };
}
