'use client';

import { seoConfig } from '@/lib/seo/config';

// Base interfaces for structured data
interface BaseStructuredData {
  '@context': string;
  '@type': string;
}

interface ProductData extends BaseStructuredData {
  '@type': 'Product';
  name: string;
  description: string;
  image: string | string[];
  brand: {
    '@type': 'Brand';
    name: string;
  };
  category: string;
  sku?: string;
  mpn?: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    availability: string;
    seller: {
      '@type': 'Organization';
      name: string;
    };
    validFrom?: string;
    validThrough?: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
  review?: Array<{
    '@type': 'Review';
    author: {
      '@type': 'Person';
      name: string;
    };
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number;
    };
    reviewBody: string;
  }>;
}

interface CategoryData extends BaseStructuredData {
  '@type': 'CollectionPage';
  name: string;
  description: string;
  url: string;
  mainEntity: {
    '@type': 'ItemList';
    numberOfItems: number;
    itemListElement: Array<{
      '@type': 'Product';
      position: number;
      name: string;
      url: string;
      image: string;
    }>;
  };
}

interface BrandData extends BaseStructuredData {
  '@type': 'Brand';
  name: string;
  description: string;
  logo: string;
  url: string;
  sameAs?: string[];
}

interface BreadcrumbData extends BaseStructuredData {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

interface WebsiteData extends BaseStructuredData {
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

interface FAQData extends BaseStructuredData {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

// Props for the StructuredData component
interface StructuredDataProps {
  type: 'product' | 'category' | 'brand' | 'breadcrumb' | 'website' | 'faq' | 'organization' | 'localBusiness';
  data?: any;
  locale?: string;
}

export function StructuredData({ type, data, locale = 'en' }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseContext = 'https://schema.org';
    
    switch (type) {
      case 'product':
        return generateProductData(data, baseContext);
      case 'category':
        return generateCategoryData(data, baseContext);
      case 'brand':
        return generateBrandData(data, baseContext);
      case 'breadcrumb':
        return generateBreadcrumbData(data, baseContext);
      case 'website':
        return generateWebsiteData(baseContext);
      case 'faq':
        return generateFAQData(data, baseContext);
      case 'organization':
        return seoConfig.structuredData.organization;
      case 'localBusiness':
        return seoConfig.structuredData.localBusiness;
      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}

// Helper functions to generate specific structured data types
function generateProductData(product: any, context: string): ProductData {
  return {
    '@context': context,
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: Array.isArray(product.images) ? product.images : [product.image || product.images],
    brand: {
      '@type': 'Brand',
      name: product.brand || 'FalParts'
    },
    category: product.category,
    sku: product.sku,
    mpn: product.mpn,
    offers: {
      '@type': 'Offer',
      price: product.price?.toString() || '0',
      priceCurrency: product.currency || 'SAR',
      availability: `https://schema.org/${product.inStock ? 'InStock' : 'OutOfStock'}`,
      seller: {
        '@type': 'Organization',
        name: seoConfig.company.name
      },
      validFrom: product.validFrom,
      validThrough: product.validThrough
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.average,
        reviewCount: product.rating.count
      }
    }),
    ...(product.reviews && {
      review: product.reviews.map((review: any) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating
        },
        reviewBody: review.comment
      }))
    })
  };
}

function generateCategoryData(category: any, context: string): CategoryData {
  return {
    '@context': context,
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `${seoConfig.siteUrl}/categories/${category.id}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: category.products?.length || 0,
      itemListElement: (category.products || []).map((product: any, index: number) => ({
        '@type': 'Product',
        position: index + 1,
        name: product.name,
        url: `${seoConfig.siteUrl}/product/${product.id}`,
        image: product.image
      }))
    }
  };
}

function generateBrandData(brand: any, context: string): BrandData {
  return {
    '@context': context,
    '@type': 'Brand',
    name: brand.name,
    description: brand.description,
    logo: brand.logo,
    url: `${seoConfig.siteUrl}/brands/${brand.id}`,
    ...(brand.socialLinks && {
      sameAs: brand.socialLinks
    })
  };
}

function generateBreadcrumbData(breadcrumbs: Array<{ name: string; url: string }>, context: string): BreadcrumbData {
  return {
    '@context': context,
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

function generateWebsiteData(context: string): WebsiteData {
  return {
    '@context': context,
    '@type': 'WebSite',
    name: seoConfig.company.name,
    url: seoConfig.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoConfig.siteUrl}/products?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

function generateFAQData(faqs: Array<{ question: string; answer: string }>, context: string): FAQData {
  return {
    '@context': context,
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// Export helper functions for use in other components
export {
  generateProductData,
  generateCategoryData,
  generateBrandData,
  generateBreadcrumbData,
  generateWebsiteData,
  generateFAQData
};

// Export types for TypeScript support
export type {
  ProductData,
  CategoryData,
  BrandData,
  BreadcrumbData,
  WebsiteData,
  FAQData,
  StructuredDataProps
};