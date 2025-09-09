import { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo/config';

// This would typically fetch from your API or database
// For now, we'll use static data structure
interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = seoConfig.siteUrl;
  const currentDate = new Date();
  
  // Static pages for both locales
  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // English pages
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/latestoffer`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/userPricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Arabic pages
    {
      url: `${baseUrl}/ar/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/categories`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/brands`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/latestoffer`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/userPricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic pages - these would typically be fetched from your API
  const dynamicPages: SitemapEntry[] = [];

  try {
    // Fetch products (replace with actual API call)
    const products = await fetchProducts();
    const productPages = products.flatMap((product: any) => [
      {
        url: `${baseUrl}/product/${product.id}`,
        lastModified: product.updatedAt || currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/ar/product/${product.id}`,
        lastModified: product.updatedAt || currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
    ]);
    dynamicPages.push(...productPages);

    // Fetch categories (replace with actual API call)
    const categories = await fetchCategories();
    const categoryPages = categories.flatMap((category: any) => [
      {
        url: `${baseUrl}/categories/${category.id}`,
        lastModified: category.updatedAt || currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/ar/categories/${category.id}`,
        lastModified: category.updatedAt || currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ]);
    dynamicPages.push(...categoryPages);

    // Fetch brands (replace with actual API call)
    const brands = await fetchBrands();
    const brandPages = brands.flatMap((brand: any) => [
      {
        url: `${baseUrl}/brands/${brand.id}`,
        lastModified: brand.updatedAt || currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/ar/brands/${brand.id}`,
        lastModified: brand.updatedAt || currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
    ]);
    dynamicPages.push(...brandPages);

    // Fetch offers (replace with actual API call)
    const offers = await fetchOffers();
    const offerPages = offers.flatMap((offer: any) => [
      {
        url: `${baseUrl}/offers/${offer.id}`,
        lastModified: offer.updatedAt || currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/ar/offers/${offer.id}`,
        lastModified: offer.updatedAt || currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      },
    ]);
    dynamicPages.push(...offerPages);
  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error);
    // Continue with static pages only if dynamic fetch fails
  }

  return [...staticPages, ...dynamicPages];
}

// Mock functions - replace these with actual API calls
async function fetchProducts() {
  // This should fetch from your actual API
  // For now, return empty array to prevent errors
  try {
    // Example: const response = await fetch(`${process.env.API_URL}/products`);
    // return response.json();
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function fetchCategories() {
  // This should fetch from your actual API
  try {
    // Example: const response = await fetch(`${process.env.API_URL}/categories`);
    // return response.json();
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function fetchBrands() {
  // This should fetch from your actual API
  try {
    // Example: const response = await fetch(`${process.env.API_URL}/brands`);
    // return response.json();
    return [];
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

async function fetchOffers() {
  // This should fetch from your actual API
  try {
    // Example: const response = await fetch(`${process.env.API_URL}/offers`);
    // return response.json();
    return [];
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
}