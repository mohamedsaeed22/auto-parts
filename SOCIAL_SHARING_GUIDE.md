# Social Media Sharing & Rich Previews Guide

This project now has comprehensive social media sharing capabilities that automatically generate rich previews when URLs are shared on WhatsApp, Facebook, Twitter, LinkedIn, and other platforms.

## 🚀 Features

- **Dynamic Open Graph metadata** for all page types
- **Automatic image generation** when no images are available
- **Language-specific previews** (Arabic/English)
- **Product-specific previews** with prices and descriptions
- **Category, brand, and offer previews**
- **SEO-optimized** for search engines and social platforms

## 📱 How It Works

### When someone shares a URL from your site:

1. **Product URLs** (`/product/123` or `/en/product/123`)
   - Shows product image, name, price, and description
   - Includes brand and category information
   - If no image available, generates a dynamic branded image

2. **Category URLs** (`/categories/456` or `/en/categories/456`)
   - Shows category name and description
   - Uses category image or generates branded image

3. **Brand URLs** (`/brands/789` or `/en/brands/789`)
   - Shows brand logo and information
   - Uses brand image or generates branded image

4. **Offer URLs** (`/offers/101` or `/en/offers/101`)
   - Shows offer title, description, and image
   - Includes discount information

5. **Home page** (`/` for Arabic, `/en` for English)
   - Shows site branding with language-specific content

## 🛠️ Technical Implementation

### Files Created/Modified:

1. **Server-side API utilities** (`src/lib/api/server.ts`)
   - Functions to fetch product, category, brand, and offer data
   - Image URL handling and validation

2. **Dynamic metadata generator** (`src/lib/seo/dynamic-metadata.ts`)
   - Generates Open Graph and Twitter Card metadata
   - Handles different content types and languages

3. **Layout files for each page type:**
   - `src/app/[locale]/product/[id]/layout.tsx`
   - `src/app/[locale]/categories/[id]/layout.tsx` 
   - `src/app/[locale]/brands/[id]/layout.tsx`
   - `src/app/[locale]/offers/[id]/layout.tsx`

4. **Dynamic OG image generator** (`src/app/api/og/route.tsx`)
   - Creates branded images on-the-fly
   - Supports Arabic and English text
   - Includes product prices when available

### How Metadata is Generated:

```typescript
// Example for product page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await fetchProductById(id);
  return generateProductPageMetadata(product, locale);
}
```

## 🔧 Configuration

### Environment Variables:
```env
NEXT_PUBLIC_SITE_URL=https://www.falparts.sa
NEXT_PUBLIC_API_BASE_URL=https://brave.iseek.name/api
```

### Required Images:
- Place a default `og-image.jpg` (1200x630px) in the `public/` folder
- Product, category, and brand images from your API will be used automatically
- If no images available, dynamic images are generated

## 🧪 Testing Social Previews

### Facebook/Meta Debugger:
1. Go to https://developers.facebook.com/tools/debug/
2. Enter your URL (e.g., `https://www.falparts.sa/product/123`)
3. Click "Debug" to see the preview
4. Click "Scrape Again" to refresh cached data

### Twitter Card Validator:
1. Go to https://cards-dev.twitter.com/validator
2. Enter your URL
3. Click "Preview card"

### WhatsApp Testing:
1. Send the URL in a WhatsApp chat
2. The preview should appear automatically
3. If it doesn't, the platform may need time to scrape the metadata

## 📋 Troubleshooting

### Preview not showing?
1. Check that your site is live and accessible
2. Ensure images are served over HTTPS
3. Use the Facebook debugger to force a re-scrape
4. Verify the URL structure is correct

### Wrong language in preview?
- Arabic URLs: `https://www.falparts.sa/product/123`
- English URLs: `https://www.falparts.sa/en/product/123`

### Image not appearing?
1. Check if the product/category/brand has an image in the API
2. Verify the image URL is accessible
3. The system will generate a branded image if none available

## 🎨 Customizing Dynamic Images

The dynamic image generator (`/api/og`) can be customized by modifying:

- Colors and gradients
- Logo and branding
- Text layout and fonts
- Background patterns

Example dynamic image URL:
```
https://www.falparts.sa/api/og?title=Product%20Name&description=Product%20description&price=299&locale=ar
```

## 📊 SEO Benefits

This implementation provides:

- **Rich snippets** in search results
- **Improved click-through rates** from social media
- **Better user engagement** with visual previews
- **Brand consistency** across all shared content
- **Multi-language support** for different markets

## 🔄 Cache Management

- Metadata is cached for 1 hour for better performance
- Images are cached by social platforms
- Use the Facebook debugger to force cache refresh during testing

## 📈 Analytics Tracking

Consider adding UTM parameters to shared URLs to track social traffic:

```typescript
const shareUrl = `${productUrl}?utm_source=whatsapp&utm_medium=social&utm_campaign=product_share`;
```

This comprehensive system ensures that every URL shared from your e-commerce site creates an engaging, branded preview that encourages clicks and conversions.
