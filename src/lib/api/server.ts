// Server-side API functions for metadata generation
import { seoConfig } from "@/lib/seo/config";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://brave.iseek.name/api";

// Product API
export async function fetchProductById(id: string | number, locale?: string) {
  try {
    const url = new URL(`${API_BASE_URL}/products/${id}`);
    if (locale) url.searchParams.set("locale", locale);
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.product || null;
  } catch (error) {
    return null;
  }
}

// Category API
export async function fetchCategoryById(id: string | number, locale?: string) {
  try {
    const url = new URL(`${API_BASE_URL}/categories/${id}`);
    if (locale) url.searchParams.set("locale", locale);
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    return null;
  }
}

// Offer API
export async function fetchOfferById(id: string | number, locale?: string) {
  try {
    const url = new URL(`${API_BASE_URL}/offers/${id}`);
    if (locale) url.searchParams.set("locale", locale);
    const response = await fetch(url.toString(), {
      next: { revalidate: 1800 }, // Cache for 30 minutes (offers change more frequently)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch offer: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    return null;
  }
}

// Helper function to ensure absolute URLs for images
export function getAbsoluteImageUrl(
  imagePath: string | null | undefined
): string {
  if (!imagePath) {
    return `${seoConfig.siteUrl}/og-image.jpg`; // Fallback image
  }

  // If it's already absolute, return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // If it starts with /, make it absolute
  if (imagePath.startsWith("/")) {
    return `${seoConfig.siteUrl}${imagePath}`;
  }

  // Otherwise, assume it needs the base URL
  return `${seoConfig.siteUrl}/${imagePath}`;
}

// Generate dynamic OG image URL for products/categories/brands
export function generateDynamicOGImage(
  title: string | undefined,
  description?: string,
  type: string = "product",
  price?: number,
  locale: string = "ar"
): string {
  const safeTitle =
    typeof title === "string" && title.length > 0
      ? title
      : seoConfig.company.name;
  const params = new URLSearchParams({
    title: safeTitle.slice(0, 100), // Limit title length
    type,
    locale,
  });

  if (description) {
    params.append("description", description.slice(0, 150));
  }

  if (price) {
    params.append("price", price.toString());
  }

  return `${seoConfig.siteUrl}/api/og?${params.toString()}`;
}

// Generate SEO-friendly slug from text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}
