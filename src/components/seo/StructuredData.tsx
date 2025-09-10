'use client';

import { seoConfig, getCanonicalUrl } from '@/lib/seo/config';
import { usePathname } from 'next/navigation';

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
  type: 'product' | 'category' | 'brand' | 'breadcrumb' | 'website' | 'faq' | 'organization' | 'localBusiness' | 'article';
  data?: any;
  locale?: string;
}

export function StructuredData({ type, data, locale = 'en' }: StructuredDataProps) {
  const pathname = usePathname();
  const canonicalUrl = getCanonicalUrl(pathname, locale);
  
  const generateStructuredData = () => {
    const baseContext = 'https://schema.org';
    
    switch (type) {
      case 'product':
        return {
          '@context': baseContext,
          '@type': 'Product',
          name: data.name,
          description: data.description,
          image: Array.isArray(data.image) ? data.image : [data.image],
          url: data.url || canonicalUrl,
          inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
          brand: {
            '@type': 'Brand',
            name: data.brand || seoConfig.company.name
          },
          category: data.category,
          sku: data.sku,
          mpn: data.mpn,
          productID: data.productID,
          gtin: data.gtin,
          gtin13: data.gtin13,
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: data.currency || 'SAR',
            availability: `https://schema.org/${data.availability || 'InStock'}`,
            url: data.url || canonicalUrl,
            priceValidUntil: data.priceValidUntil || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            seller: {
              '@type': 'Organization',
              name: seoConfig.company.name
            },
            validFrom: data.validFrom,
            validThrough: data.validThrough,
            itemCondition: data.itemCondition || 'https://schema.org/NewCondition'
          },
          ...(data.aggregateRating && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: data.aggregateRating.ratingValue,
              reviewCount: data.aggregateRating.reviewCount,
              bestRating: data.aggregateRating.bestRating || 5,
              worstRating: data.aggregateRating.worstRating || 1
            }
          }),
          ...(data.review && {
            review: data.review.map((review: any) => ({
              '@type': 'Review',
              author: {
                '@type': 'Person',
                name: review.author.name
              },
              reviewRating: {
                '@type': 'Rating',
                ratingValue: review.reviewRating.ratingValue,
                bestRating: review.reviewRating.bestRating || 5,
                worstRating: review.reviewRating.worstRating || 1
              },
              reviewBody: review.reviewBody,
              datePublished: review.datePublished
            }))
          })
        };
      case 'category':
        return {
          '@context': baseContext,
          '@type': 'ItemList',
          name: data.name,
          description: data.description,
          url: data.url || canonicalUrl,
          inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
          numberOfItems: data.numberOfItems,
          itemListElement: data.itemListElement.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: item.name,
              image: item.image,
              url: item.url,
              description: item.description,
              sku: item.sku,
              mpn: item.mpn,
              brand: {
                '@type': 'Brand',
                name: item.brand
              },
              offers: {
                '@type': 'Offer',
                price: item.price,
                priceCurrency: item.currency || 'SAR',
                availability: `https://schema.org/${item.availability || 'InStock'}`,
                url: item.url,
                priceValidUntil: item.priceValidUntil || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                itemCondition: item.itemCondition || 'https://schema.org/NewCondition'
              }
            }
          }))
        };
      case 'brand':
        return {
          '@context': baseContext,
          '@type': 'Brand',
          name: data.name,
          description: data.description,
          logo: data.logo,
          url: data.url || canonicalUrl,
          inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
          image: data.image || data.logo,
          slogan: data.slogan,
          ...(data.potentialAction && {
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: data.potentialAction.urlTemplate
              },
              'query-input': 'required name=search_term_string'
            }
          }),
          ...(data.sameAs && { sameAs: data.sameAs })
        };
      case 'breadcrumb':
        return {
          '@context': baseContext,
          '@type': 'BreadcrumbList',
          itemListElement: data.itemListElement.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.item || `${seoConfig.siteUrl}${item.path}`
          }))
        };
      case 'website':
        return {
          '@context': baseContext,
          '@type': 'WebSite',
          name: data?.name || seoConfig.siteName,
          url: data?.url || canonicalUrl,
          description: data?.description || seoConfig.company.description[locale as keyof typeof seoConfig.company.description],
          inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${seoConfig.siteUrl}/${locale}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        };
      case 'faq':
        return generateFAQData(data, baseContext);
      case 'organization':
        return {
          '@context': baseContext,
          '@type': 'Organization',
          name: data?.name || seoConfig.company.name,
          url: data?.url || canonicalUrl,
          logo: {
            '@type': 'ImageObject',
            url: data?.logo || `${seoConfig.siteUrl}/logo.png`,
            width: data?.logoWidth || 180,
            height: data?.logoHeight || 60
          },
          description: data?.description || seoConfig.company.description[locale as keyof typeof seoConfig.company.description],
          address: {
            '@type': 'PostalAddress',
            streetAddress: data?.streetAddress || seoConfig.company.address?.street,
            addressLocality: data?.addressLocality || seoConfig.company.address?.city,
            addressRegion: data?.addressRegion || seoConfig.company.address?.region,
            postalCode: data?.postalCode || seoConfig.company.address?.postalCode,
            addressCountry: data?.addressCountry || 'SA'
          },
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: data?.telephone || seoConfig.company.contact.phone,
              contactType: 'customer service',
              email: data?.email || seoConfig.company.contact.email,
              areaServed: data?.areaServed || 'SA',
              availableLanguage: ['English', 'Arabic']
            }
          ],
          sameAs: data?.sameAs || [
            seoConfig.company.social.facebook,
            seoConfig.company.social.twitter,
            seoConfig.company.social.instagram,
            seoConfig.company.social.linkedin
          ]
        };
      case 'localBusiness':
        return seoConfig.structuredData.localBusiness;
      case 'article':
        return {
          '@context': baseContext,
          '@type': 'Article',
          headline: data.headline || data.title,
          description: data.description,
          image: Array.isArray(data.image) ? data.image : [data.image],
          author: {
            '@type': 'Person',
            name: data.author?.name || seoConfig.company.name
          },
          publisher: {
            '@type': 'Organization',
            name: data.publisher?.name || seoConfig.company.name,
            logo: {
              '@type': 'ImageObject',
              url: data.publisher?.logo || `${seoConfig.siteUrl}/logo.png`,
              width: data.publisher?.logoWidth || 180,
              height: data.publisher?.logoHeight || 60
            }
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified || data.datePublished,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url || canonicalUrl
          },
          url: data.url || canonicalUrl,
          inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US'
        };
      default:
        return {};
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