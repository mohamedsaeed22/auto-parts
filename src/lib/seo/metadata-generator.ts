// Comprehensive SEO metadata generator for all pages
import { Metadata } from "next";
import {
  seoConfig,
  generateProductMetadata,
  generateCategoryMetadata,
  generateBrandMetadata,
  generateOfferMetadata,
  generateSearchMetadata,
  generateBreadcrumbStructuredData,
  generateProductStructuredData,
} from "./config";

// Base metadata for all pages
export function generateBaseMetadata(locale: string = "ar"): Metadata {
  const baseUrl = seoConfig.siteUrl;
  const isArabic = locale === "ar";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default:
        seoConfig.defaultMetadata.home.title[
          locale as keyof typeof seoConfig.defaultMetadata.home.title
        ],
      template: `%s | ${seoConfig.company.name}`,
    },
    description:
      seoConfig.defaultMetadata.home.description[
        locale as keyof typeof seoConfig.defaultMetadata.home.description
      ],
    keywords:
      seoConfig.company.keywords[
        locale as keyof typeof seoConfig.company.keywords
      ].join(", "),
    authors: [{ name: seoConfig.company.name }],
    creator: seoConfig.company.name,
    publisher: seoConfig.company.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: isArabic ? "ar_SA" : "en_US",
      url: baseUrl,
      siteName: seoConfig.company.name,
      title:
        seoConfig.defaultMetadata.home.title[
          locale as keyof typeof seoConfig.defaultMetadata.home.title
        ],
      description:
        seoConfig.defaultMetadata.home.description[
          locale as keyof typeof seoConfig.defaultMetadata.home.description
        ],
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: seoConfig.company.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      title:
        seoConfig.defaultMetadata.home.title[
          locale as keyof typeof seoConfig.defaultMetadata.home.title
        ],
      description:
        seoConfig.defaultMetadata.home.description[
          locale as keyof typeof seoConfig.defaultMetadata.home.description
        ],
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        en: baseUrl,
        ar: `${baseUrl}/ar`,
      },
    },
    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
      yahoo: "your-yahoo-verification-code",
    },
    category: "Automotive",
  };
}

// Home page metadata
export function generateHomeMetadata(locale: string = "ar"): Metadata {
  const baseMetadata = generateBaseMetadata(locale);
  const homeMetadata = seoConfig.defaultMetadata.home;

  return {
    ...baseMetadata,
    title: homeMetadata.title[locale as keyof typeof homeMetadata.title],
    description:
      homeMetadata.description[locale as keyof typeof homeMetadata.description],
    openGraph: {
      ...baseMetadata.openGraph,
      title: homeMetadata.title[locale as keyof typeof homeMetadata.title],
      description:
        homeMetadata.description[
          locale as keyof typeof homeMetadata.description
        ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: homeMetadata.title[locale as keyof typeof homeMetadata.title],
      description:
        homeMetadata.description[
          locale as keyof typeof homeMetadata.description
        ],
    },
  };
}

// Products page metadata
export function generateProductsMetadata(locale: string = "ar"): Metadata {
  const baseMetadata = generateBaseMetadata(locale);
  const productsMetadata = seoConfig.defaultMetadata.products;
  const url =
    locale === "ar"
      ? `${seoConfig.siteUrl}/ar/products`
      : `${seoConfig.siteUrl}/products`;

  return {
    ...baseMetadata,
    title:
      productsMetadata.title[locale as keyof typeof productsMetadata.title],
    description:
      productsMetadata.description[
        locale as keyof typeof productsMetadata.description
      ],
    alternates: {
      canonical: url,
      languages: {
        en: `${seoConfig.siteUrl}/products`,
        ar: `${seoConfig.siteUrl}/ar/products`,
      },
    },
    openGraph: {
      ...baseMetadata.openGraph,
      url,
      title:
        productsMetadata.title[locale as keyof typeof productsMetadata.title],
      description:
        productsMetadata.description[
          locale as keyof typeof productsMetadata.title
        ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title:
        productsMetadata.title[locale as keyof typeof productsMetadata.title],
      description:
        productsMetadata.description[
          locale as keyof typeof productsMetadata.description
        ],
    },
  };
}

// Product detail page metadata
export function generateProductDetailMetadata(
  product: any,
  locale: string = "ar"
): Metadata {
  const baseMetadata = generateBaseMetadata(locale);
  const productMetadata = generateProductMetadata(product, locale);
  const url =
    locale === "ar"
      ? `${seoConfig.siteUrl}/ar/product/${product.id}`
      : `${seoConfig.siteUrl}/product/${product.id}`;

  return {
    ...baseMetadata,
    title: productMetadata.title,
    description: productMetadata.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${seoConfig.siteUrl}/product/${product.id}`,
        ar: `${seoConfig.siteUrl}/ar/product/${product.id}`,
      },
    },
    openGraph: {
      ...baseMetadata.openGraph,
      type: "product",
      url,
      title: productMetadata.title,
      description: productMetadata.description,
      images: [
        {
          url: product.primary_image || `${seoConfig.siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: productMetadata.title,
      description: productMetadata.description,
      images: [product.primary_image || `${seoConfig.siteUrl}/og-image.jpg`],
    },
    other: {
      "product:price:amount": product.final_price || product.price,
      "product:price:currency": "SAR",
      "product:availability": product.stock > 0 ? "in stock" : "out of stock",
      "product:brand": product.brand?.name || "FalParts",
      "product:category": product.category?.name,
    },
  };
}

// Category page metadata
export function generateCategoryMetadata(
  category: any,
  locale: string = "ar"
): Metadata {
  const baseMetadata = generateBaseMetadata(locale);
  const categoryMetadata = generateCategoryMetadata(category, locale);
  const url =
    locale === "ar"
      ? `${seoConfig.siteUrl}/ar/categories/${category.id}`
      : `${seoConfig.siteUrl}/categories/${category.id}`;

  return {
    ...baseMetadata,
    title: categoryMetadata.title,
    description: categoryMetadata.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${seoConfig.siteUrl}/categories/${category.id}`,
        ar: `${seoConfig.siteUrl}/ar/categories/${category.id}`,
      },
    },
    openGraph: {
      ...baseMetadata.openGraph,
      url,
      title: categoryMetadata.title,
      description: categoryMetadata.description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: categoryMetadata.title,
      description: categoryMetadata.description,
    },
  };
}

// Brand page metadata
export function generateBrandPageMetadata(
  brand: any,
  locale: string = "ar"
): Metadata {
  const baseMetadata = generateBaseMetadata(locale);
  const brandMetadata = generateBrandMetadata(brand, locale);
  const url =
    locale === "ar"
      ? `${seoConfig.siteUrl}/ar/brands/${brand.id}`
      : `${seoConfig.siteUrl}/brands/${brand.id}`;

  return {
    ...baseMetadata,
    title: brandMetadata.title,
    description: brandMetadata.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${seoConfig.siteUrl}/brands/${brand.id}`,
        ar: `${seoConfig.siteUrl}/ar/brands/${brand.id}`,
      },
    },
    openGraph: {
      ...baseMetadata.openGraph,
      url,
      title: brandMetadata.title,
      description: brandMetadata.description,
      images: [
        {
          url: brand.image || `${seoConfig.siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: brand.name,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: brandMetadata.title,
      description: brandMetadata.description,
      images: [brand.image || `${seoConfig.siteUrl}/og-image.jpg`],
    },
  };
}

// Offer page metadata
export function generateOfferMetadata(
  offer: any,
  locale: string = "ar"
): Metadata {
  const baseMetadata = generateBaseMetadata(locale);
  const offerMetadata = generateOfferMetadata(offer, locale);
  const url =
    locale === "ar"
      ? `${seoConfig.siteUrl}/ar/offers/${offer.id}`
      : `${seoConfig.siteUrl}/offers/${offer.id}`;

  return {
    ...baseMetadata,
    title: offerMetadata.title,
    description: offerMetadata.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${seoConfig.siteUrl}/offers/${offer.id}`,
        ar: `${seoConfig.siteUrl}/ar/offers/${offer.id}`,
      },
    },
    openGraph: {
      ...baseMetadata.openGraph,
      type: "article",
      url,
      title: offerMetadata.title,
      description: offerMetadata.description,
      images: [
        {
          url: offer.image || `${seoConfig.siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: offer.title,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: offerMetadata.title,
      description: offerMetadata.description,
      images: [offer.image || `${seoConfig.siteUrl}/og-image.jpg`],
    },
  };
}

// Search results metadata
export function generateSearchMetadata(
  query: string,
  locale: string = "ar"
): Metadata {
  const baseMetadata = generateBaseMetadata(locale);
  const searchMetadata = generateSearchMetadata(query, locale);
  const url =
    locale === "ar"
      ? `${seoConfig.siteUrl}/ar/search?q=${encodeURIComponent(query)}`
      : `${seoConfig.siteUrl}/search?q=${encodeURIComponent(query)}`;

  return {
    ...baseMetadata,
    title: searchMetadata.title,
    description: searchMetadata.description,
    robots: {
      ...baseMetadata.robots,
      index: false, // Don't index search results
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      url,
      title: searchMetadata.title,
      description: searchMetadata.description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: searchMetadata.title,
      description: searchMetadata.description,
    },
  };
}

// User pages metadata (wishlist, favorites, cart, etc.)
export function generateUserPageMetadata(
  pageType: "wishlist" | "favourites" | "cart" | "checkout",
  locale: string = "ar"
): Metadata {
  const baseMetadata = generateBaseMetadata(locale);
  const pageMetadata = seoConfig.defaultMetadata[pageType];
  const url =
    locale === "ar"
      ? `${seoConfig.siteUrl}/ar/${pageType}`
      : `${seoConfig.siteUrl}/${pageType}`;

  return {
    ...baseMetadata,
    title: pageMetadata.title[locale as keyof typeof pageMetadata.title],
    description:
      pageMetadata.description[locale as keyof typeof pageMetadata.description],
    robots: {
      ...baseMetadata.robots,
      index: false, // Don't index user-specific pages
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      url,
      title: pageMetadata.title[locale as keyof typeof pageMetadata.title],
      description:
        pageMetadata.description[
          locale as keyof typeof pageMetadata.description
        ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: pageMetadata.title[locale as keyof typeof pageMetadata.title],
      description:
        pageMetadata.description[
          locale as keyof typeof pageMetadata.description
        ],
    },
  };
}

// Contact page metadata
export function generateContactMetadata(locale: string = "ar"): Metadata {
  const baseMetadata = generateBaseMetadata(locale);
  const contactMetadata = seoConfig.defaultMetadata.contact;
  const url =
    locale === "ar"
      ? `${seoConfig.siteUrl}/ar/contact`
      : `${seoConfig.siteUrl}/contact`;

  return {
    ...baseMetadata,
    title: contactMetadata.title[locale as keyof typeof contactMetadata.title],
    description:
      contactMetadata.description[
        locale as keyof typeof contactMetadata.description
      ],
    alternates: {
      canonical: url,
      languages: {
        en: `${seoConfig.siteUrl}/contact`,
        ar: `${seoConfig.siteUrl}/ar/contact`,
      },
    },
    openGraph: {
      ...baseMetadata.openGraph,
      url,
      title:
        contactMetadata.title[locale as keyof typeof contactMetadata.title],
      description:
        contactMetadata.description[
          locale as keyof typeof contactMetadata.description
        ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title:
        contactMetadata.title[locale as keyof typeof contactMetadata.title],
      description:
        contactMetadata.description[
          locale as keyof typeof contactMetadata.description
        ],
    },
  };
}

// About page metadata
export function generateAboutMetadata(locale: string = "ar"): Metadata {
  const baseMetadata = generateBaseMetadata(locale);
  const aboutMetadata = seoConfig.defaultMetadata.about;
  const url =
    locale === "ar"
      ? `${seoConfig.siteUrl}/ar/about`
      : `${seoConfig.siteUrl}/about`;

  return {
    ...baseMetadata,
    title: aboutMetadata.title[locale as keyof typeof aboutMetadata.title],
    description:
      aboutMetadata.description[
        locale as keyof typeof aboutMetadata.description
      ],
    alternates: {
      canonical: url,
      languages: {
        en: `${seoConfig.siteUrl}/about`,
        ar: `${seoConfig.siteUrl}/ar/about`,
      },
    },
    openGraph: {
      ...baseMetadata.openGraph,
      url,
      title: aboutMetadata.title[locale as keyof typeof aboutMetadata.title],
      description:
        aboutMetadata.description[
          locale as keyof typeof aboutMetadata.description
        ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: aboutMetadata.title[locale as keyof typeof aboutMetadata.title],
      description:
        aboutMetadata.description[
          locale as keyof typeof aboutMetadata.description
        ],
    },
  };
}
