// Dynamic metadata generation for different page types
import { Metadata } from "next";
import { seoConfig, generateProductMetadata, generateCategoryMetadata, generateBrandMetadata, generateOfferMetadata } from "./config";
import { getAbsoluteImageUrl, generateDynamicOGImage } from "@/lib/api/server";

interface ProductData {
  id: number;
  name: string;
  description: string;
  primary_image?: string;
  images?: string[];
  price?: number;
  final_price?: number;
  brand?: { name: string };
  category?: { name: string };
  product_identifier?: string;
  stock?: number;
  rating?: number;
  reviewCount?: number;
}

interface CategoryData {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

interface BrandData {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  image?: string;
}

interface OfferData {
  id: number;
  title: string;
  description?: string;
  image?: string;
  discount_type?: "percentage" | "fixed";
  discount_amount?: string;
  valid_until?: string;
}

// Generate metadata for product pages
export function generateProductPageMetadata(
  product: ProductData,
  locale: string = "ar"
): Metadata {
  if (!product) {
    return generateFallbackMetadata("product", locale);
  }

  const meta = generateProductMetadata({
    name: product.name,
    compatibility: product.brand?.name || "various vehicles"
  }, locale);

  const productImage = product.primary_image || product.images?.[0] 
    ? getAbsoluteImageUrl(product.primary_image || product.images?.[0])
    : generateDynamicOGImage(
        product.name,
        product.description,
        'product',
        product.final_price || product.price,
        locale
      );
  const productUrl = `${seoConfig.siteUrl}${locale === "en" ? "/en" : ""}/product/${product.id}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: `${product.name}, ${product.brand?.name || ""}, ${product.category?.name || ""}, ${seoConfig.company.keywords[locale as "en" | "ar"].slice(0, 5).join(", ")}`,
    openGraph: {
      type: "website",
      title: meta.title,
      description: meta.description,
      url: productUrl,
      siteName: seoConfig.company.name,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      title: meta.title,
      description: meta.description,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
      languages: {
        ar: `${seoConfig.siteUrl}/product/${product.id}`,
        en: `${seoConfig.siteUrl}/en/product/${product.id}`,
      },
    },
    other: {
      "product:price:amount": product.final_price?.toString() || product.price?.toString() || "",
      "product:price:currency": "SAR",
      "product:availability": (product.stock ?? 0) > 0 ? "in stock" : "out of stock",
      "product:brand": product.brand?.name || "FalParts",
      "product:category": product.category?.name || "",
    },
  };
}

// Generate metadata for category pages
export function generateCategoryPageMetadata(
  category: CategoryData,
  locale: string = "ar"
): Metadata {
  if (!category) {
    return generateFallbackMetadata("category", locale);
  }

  const meta = generateCategoryMetadata({ name: category.name }, locale);
  const categoryImage = category.image 
    ? getAbsoluteImageUrl(category.image)
    : generateDynamicOGImage(
        category.name,
        category.description || meta.description,
        'category',
        undefined,
        locale
      );
  const categoryUrl = `${seoConfig.siteUrl}${locale === "en" ? "/en" : ""}/categories/${category.id}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: `${category.name}, ${seoConfig.company.keywords[locale as "en" | "ar"].slice(0, 8).join(", ")}`,
    openGraph: {
      type: "website",
      title: meta.title,
      description: meta.description,
      url: categoryUrl,
      siteName: seoConfig.company.name,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [
        {
          url: categoryImage,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      title: meta.title,
      description: meta.description,
      images: [categoryImage],
    },
    alternates: {
      canonical: categoryUrl,
      languages: {
        ar: `${seoConfig.siteUrl}/categories/${category.id}`,
        en: `${seoConfig.siteUrl}/en/categories/${category.id}`,
      },
    },
  };
}

// Generate metadata for brand pages
export function generateBrandPageMetadata(
  brand: BrandData,
  locale: string = "ar"
): Metadata {
  if (!brand) {
    return generateFallbackMetadata("brand", locale);
  }

  const meta = generateBrandMetadata({ name: brand.name }, locale);
  const brandImage = brand.logo || brand.image 
    ? getAbsoluteImageUrl(brand.logo || brand.image)
    : generateDynamicOGImage(
        brand.name,
        brand.description || meta.description,
        'brand',
        undefined,
        locale
      );
  const brandUrl = `${seoConfig.siteUrl}${locale === "en" ? "/en" : ""}/brands/${brand.id}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: `${brand.name}, ${seoConfig.company.keywords[locale as "en" | "ar"].slice(0, 8).join(", ")}`,
    openGraph: {
      type: "website",
      title: meta.title,
      description: meta.description,
      url: brandUrl,
      siteName: seoConfig.company.name,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [
        {
          url: brandImage,
          width: 1200,
          height: 630,
          alt: brand.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      title: meta.title,
      description: meta.description,
      images: [brandImage],
    },
    alternates: {
      canonical: brandUrl,
      languages: {
        ar: `${seoConfig.siteUrl}/brands/${brand.id}`,
        en: `${seoConfig.siteUrl}/en/brands/${brand.id}`,
      },
    },
  };
}

// Generate metadata for offer pages
export function generateOfferPageMetadata(
  offer: OfferData,
  locale: string = "ar"
): Metadata {
  if (!offer) {
    return generateFallbackMetadata("offer", locale);
  }

  const meta = generateOfferMetadata({
    title: offer.title,
    expiryDate: offer.valid_until
  }, locale);

  const offerImage = offer.image 
    ? getAbsoluteImageUrl(offer.image)
    : generateDynamicOGImage(
        offer.title,
        offer.description || meta.description,
        'offer',
        undefined,
        locale
      );
  const offerUrl = `${seoConfig.siteUrl}${locale === "en" ? "/en" : ""}/offers/${offer.id}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: `${offer.title}, offers, deals, ${seoConfig.company.keywords[locale as "en" | "ar"].slice(0, 6).join(", ")}`,
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: offerUrl,
      siteName: seoConfig.company.name,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [
        {
          url: offerImage,
          width: 1200,
          height: 630,
          alt: offer.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      title: meta.title,
      description: meta.description,
      images: [offerImage],
    },
    alternates: {
      canonical: offerUrl,
      languages: {
        ar: `${seoConfig.siteUrl}/offers/${offer.id}`,
        en: `${seoConfig.siteUrl}/en/offers/${offer.id}`,
      },
    },
  };
}

// Fallback metadata when data is not available
function generateFallbackMetadata(type: string, locale: string = "ar"): Metadata {
  const fallbackTitle = locale === "ar" 
    ? `${seoConfig.company.name} - قطع غيار السيارات`
    : `${seoConfig.company.name} - Auto Parts`;
    
  const fallbackDescription = locale === "ar"
    ? "قطع غيار السيارات عالية الجودة وإكسسوارات السيارات"
    : "High-quality auto parts and car accessories";

  return {
    title: fallbackTitle,
    description: fallbackDescription,
    openGraph: {
      type: "website",
      title: fallbackTitle,
      description: fallbackDescription,
      siteName: seoConfig.company.name,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: [
        {
          url: `${seoConfig.siteUrl}/og-image.jpg`,
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
      title: fallbackTitle,
      description: fallbackDescription,
      images: [`${seoConfig.siteUrl}/og-image.jpg`],
    },
  };
}
