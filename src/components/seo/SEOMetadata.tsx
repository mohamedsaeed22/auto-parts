'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { seoConfig, getCanonicalUrl, getAlternateUrls } from '@/lib/seo/config';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  locale?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  price?: string;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  category?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: object;
}

export function SEOMetadata({
  title,
  description,
  keywords,
  image,
  locale = 'en',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  price,
  currency = 'SAR',
  availability,
  brand,
  category,
  noIndex = false,
  noFollow = false,
  structuredData
}: SEOMetadataProps) {
  const pathname = usePathname();
  
  // Generate canonical URL
  const canonicalUrl = getCanonicalUrl(pathname, locale);
  
  // Generate alternate URLs for hreflang
  const alternateUrls = getAlternateUrls(pathname);
  
  // Default values
  const finalTitle = title || seoConfig.defaultMetadata.home.title[locale as keyof typeof seoConfig.defaultMetadata.home.title];
  const finalDescription = description || seoConfig.defaultMetadata.home.description[locale as keyof typeof seoConfig.defaultMetadata.home.description];
  const finalImage = image || `${seoConfig.siteUrl}/og-image.jpg`;
  
  // Robots meta content
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ');
  
  // Generate structured data for products
  const productStructuredData = price && {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: description,
    image: finalImage,
    brand: {
      '@type': 'Brand',
      name: brand || 'FalParts'
    },
    category: category,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: seoConfig.company.name
      }
    }
  };
  
  // Combine structured data
  const allStructuredData = [
    seoConfig.structuredData.organization,
    seoConfig.structuredData.localBusiness,
    ...(productStructuredData ? [productStructuredData] : []),
    ...(structuredData ? [structuredData] : [])
  ];

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />
      <meta name="language" content={locale} />
      <meta name="author" content={author || seoConfig.company.name} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Tags */}
      {alternateUrls.map(({ hreflang, href }) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={seoConfig.openGraph.siteName} />
      <meta property="og:locale" content={locale === 'ar' ? 'ar_SA' : 'en_US'} />
      
      {/* Open Graph Alternate Locales */}
      {seoConfig.supportedLocales
        .filter(loc => loc !== locale)
        .map(loc => (
          <meta 
            key={loc} 
            property="og:locale:alternate" 
            content={loc === 'ar' ? 'ar_SA' : 'en_US'} 
          />
        ))
      }
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
        </>
      )}
      
      {/* Product specific Open Graph tags */}
      {type === 'product' && (
        <>
          {price && <meta property="product:price:amount" content={price} />}
          {currency && <meta property="product:price:currency" content={currency} />}
          {availability && <meta property="product:availability" content={availability} />}
          {brand && <meta property="product:brand" content={brand} />}
          {category && <meta property="product:category" content={category} />}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={seoConfig.twitter.card} />
      <meta name="twitter:site" content={seoConfig.twitter.site} />
      <meta name="twitter:creator" content={seoConfig.twitter.creator} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#1f2937" />
      <meta name="msapplication-TileColor" content="#1f2937" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}
    </Head>
  );
}

// Helper component for Next.js App Router metadata
export function generateMetadata({
  title,
  description,
  keywords,
  image,
  locale = 'en',
  type = 'website',
  noIndex = false,
  noFollow = false
}: Omit<SEOMetadataProps, 'structuredData'>) {
  const finalTitle = title || seoConfig.defaultMetadata.home.title[locale as keyof typeof seoConfig.defaultMetadata.home.title];
  const finalDescription = description || seoConfig.defaultMetadata.home.description[locale as keyof typeof seoConfig.defaultMetadata.home.description];
  const finalImage = image || `${seoConfig.siteUrl}/og-image.jpg`;
  
  return {
    title: finalTitle,
    description: finalDescription,
    keywords: keywords,
    robots: {
      index: !noIndex,
      follow: !noFollow
    },
    openGraph: {
      type: type,
      title: finalTitle,
      description: finalDescription,
      images: [{
        url: finalImage,
        width: 1200,
        height: 630,
        alt: finalTitle
      }],
      siteName: seoConfig.openGraph.siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US'
    },
    twitter: {
      card: seoConfig.twitter.card,
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      title: finalTitle,
      description: finalDescription,
      images: [finalImage]
    },
    alternates: {
      canonical: getCanonicalUrl('/', locale),
      languages: Object.fromEntries(
        seoConfig.supportedLocales.map(loc => [
          loc,
          loc === seoConfig.defaultLocale 
            ? seoConfig.siteUrl 
            : `${seoConfig.siteUrl}/${loc}`
        ])
      )
    }
  };
}