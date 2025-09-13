import { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo/config";

// This would typically fetch from your API or database
// For now, we'll use static data structure
interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = seoConfig.siteUrl;
  const currentDate = new Date();

  // Static pages for both locales - Arabic prioritized
  const staticPages: SitemapEntry[] = [
    // Home pages - Arabic is the default
    {
      url: baseUrl, // Root URL serves Arabic content
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ar`, // Explicit Arabic URL
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },

    // Arabic pages (default language)
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/latestoffer`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/userPricing`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/favourites`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.5,
    },

    // English pages (secondary language)
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/products`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/categories`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/brands`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/latestoffer`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/userPricing`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/favourites`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/wishlist`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/cart`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.4,
    },
  ];

  // Dynamic pages - these would typically be fetched from your API
  const dynamicPages: SitemapEntry[] = [];

  try {
    // Fetch products (replace with actual API call)
    const products = await fetchProducts();
    const productPages = products.flatMap((product: any) => [
      {
        url: `${baseUrl}/product/${product.id}`, // Arabic (default)
        lastModified: product.updatedAt || currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/en/product/${product.id}`, // English (secondary)
        lastModified: product.updatedAt || currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
    ]);
    dynamicPages.push(...productPages);

    // Fetch categories (replace with actual API call)
    const categories = await fetchCategories();
    const categoryPages = categories.flatMap((category: any) => [
      {
        url: `${baseUrl}/categories/${category.id}`, // Arabic (default)
        lastModified: category.updatedAt || currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/en/categories/${category.id}`, // English (secondary)
        lastModified: category.updatedAt || currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ]);
    dynamicPages.push(...categoryPages);

    // Fetch brands (replace with actual API call)
    const brands = await fetchBrands();
    const brandPages = brands.flatMap((brand: any) => [
      {
        url: `${baseUrl}/brands/${brand.id}`, // Arabic (default)
        lastModified: brand.updatedAt || currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/en/brands/${brand.id}`, // English (secondary)
        lastModified: brand.updatedAt || currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
    ]);
    dynamicPages.push(...brandPages);

    // Fetch offers (replace with actual API call)
    const offers = await fetchOffers();
    const offerPages = offers.flatMap((offer: any) => [
      {
        url: `${baseUrl}/offers/${offer.id}`, // Arabic (default)
        lastModified: offer.updatedAt || currentDate,
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/en/offers/${offer.id}`, // English (secondary)
        lastModified: offer.updatedAt || currentDate,
        changeFrequency: "daily" as const,
        priority: 0.6,
      },
    ]);
    dynamicPages.push(...offerPages);
  } catch (error) {
    console.error("Error fetching dynamic pages for sitemap:", error);
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
    console.error("Error fetching products:", error);
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
    console.error("Error fetching categories:", error);
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
    console.error("Error fetching brands:", error);
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
    console.error("Error fetching offers:", error);
    return [];
  }
}
