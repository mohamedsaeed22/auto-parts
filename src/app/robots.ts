import { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/_next/',
          '/checkout/success',
          '/checkout/cancel',
          '/user/profile',
          '/user/orders',
          '/user/settings',
          '*.json$',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/checkout/success',
          '/checkout/cancel',
          '/user/profile',
          '/user/orders',
          '/user/settings',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/checkout/success',
          '/checkout/cancel',
          '/user/profile',
          '/user/orders',
          '/user/settings',
        ],
      },
    ],
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
    host: seoConfig.siteUrl,
  };
}