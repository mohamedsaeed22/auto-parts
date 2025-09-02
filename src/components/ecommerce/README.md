# E-commerce Card Components

A comprehensive collection of reusable card components for e-commerce applications, built with React, TypeScript, and Tailwind CSS.

## Overview

This library provides six main card components designed for modern e-commerce interfaces:

- **ProductCard** - Display product information with pricing, ratings, and actions
- **CategoryCard** - Showcase product categories with images and counts
- **OfferCard** - Highlight promotional offers and discounts
- **BrandCard** - Present brand information with logos and details
- **ReviewCard** - Show customer reviews with ratings and feedback
- **OrderCard** - Display order information with status tracking

## Features

✅ **TypeScript Support** - Full type safety with comprehensive interfaces
✅ **Responsive Design** - Mobile-first approach with responsive layouts
✅ **Accessibility** - ARIA labels and keyboard navigation support
✅ **Internationalization** - Built-in i18n support with react-i18next
✅ **RTL Support** - Right-to-left language support
✅ **Animation Support** - Smooth animations and transitions
✅ **Loading States** - Skeleton loading animations
✅ **Customizable** - Multiple variants, sizes, and styling options
✅ **Server-Side Compatible** - Works with Next.js server components

## Installation

```bash
npm install react react-dom next
npm install @radix-ui/react-avatar @radix-ui/react-badge @radix-ui/react-button
npm install lucide-react react-i18next date-fns
npm install tailwindcss class-variance-authority clsx tailwind-merge
```

## Quick Start

```tsx
import { ProductCard, CategoryCard, OfferCard } from '@/components/ecommerce';

// Basic usage
function MyComponent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ProductCard
        product={{
          id: 1,
          name: "Brake Pads",
          price: 89.99,
          image: "/products/brake-pads.jpg",
          rating: 4.5,
          reviews_count: 128
        }}
      />
      
      <CategoryCard
        category={{
          id: 1,
          name: "Engine Parts",
          image: "/categories/engine.jpg",
          products_count: 245
        }}
      />
      
      <OfferCard
        offer={{
          id: 1,
          title: "Summer Sale",
          discount_percentage: 25,
          image: "/offers/summer-sale.jpg",
          products_count: 150
        }}
      />
    </div>
  );
}
```

## Component Documentation

### ProductCard

Displays product information with pricing, ratings, and interactive actions.

#### Props

```tsx
interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "detailed" | "minimal";
  size?: "sm" | "md" | "lg";
  showRating?: boolean;
  showQuickActions?: boolean;
  showDiscount?: boolean;
  hover?: boolean;
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}
```

#### Usage Examples

```tsx
// Basic product card
<ProductCard
  product={product}
  onAddToCart={(product) => console.log('Added to cart:', product)}
/>

// Compact variant without quick actions
<ProductCard
  product={product}
  variant="compact"
  showQuickActions={false}
  size="sm"
/>

// Detailed variant with all features
<ProductCard
  product={product}
  variant="detailed"
  showRating={true}
  showDiscount={true}
  onAddToCart={handleAddToCart}
  onAddToWishlist={handleAddToWishlist}
  onQuickView={handleQuickView}
/>
```

### CategoryCard

Showcases product categories with images and product counts.

#### Props

```tsx
interface CategoryCardProps {
  category: Category;
  variant?: "default" | "compact" | "featured" | "minimal";
  size?: "sm" | "md" | "lg";
  showProductCount?: boolean;
  showDescription?: boolean;
  hover?: boolean;
  loading?: boolean;
  onClick?: (category: Category) => void;
  href?: string;
}
```

#### Usage Examples

```tsx
// Basic category card
<CategoryCard
  category={category}
  onClick={(cat) => router.push(`/categories/${cat.slug}`)}
/>

// Featured variant with description
<CategoryCard
  category={category}
  variant="featured"
  showDescription={true}
  size="lg"
/>

// Grid of compact categories
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {categories.map(category => (
    <CategoryCard
      key={category.id}
      category={category}
      variant="compact"
      size="sm"
    />
  ))}
</div>
```

### OfferCard

Highlights promotional offers and discounts with expiry information.

#### Props

```tsx
interface OfferCardProps {
  offer: Offer;
  variant?: "default" | "compact" | "featured" | "minimal";
  size?: "sm" | "md" | "lg";
  showProductCount?: boolean;
  showExpiryDate?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
  hover?: boolean;
  loading?: boolean;
  onViewOffer?: (offer: Offer) => void;
}
```

#### Usage Examples

```tsx
// Featured offer with all details
<OfferCard
  offer={offer}
  variant="featured"
  showExpiryDate={true}
  showDescription={true}
  showActions={true}
  onViewOffer={(offer) => router.push(`/offers/${offer.id}`)}
/>

// Compact offer for sidebar
<OfferCard
  offer={offer}
  variant="compact"
  size="sm"
  showProductCount={false}
/>
```

### BrandCard

Presents brand information with logos, ratings, and product counts.

#### Props

```tsx
interface BrandCardProps {
  brand: Brand;
  variant?: "default" | "compact" | "featured" | "minimal" | "logo-only";
  size?: "sm" | "md" | "lg";
  showProductCount?: boolean;
  showDescription?: boolean;
  showRating?: boolean;
  showCountry?: boolean;
  hover?: boolean;
  loading?: boolean;
  onClick?: (brand: Brand) => void;
}
```

#### Usage Examples

```tsx
// Featured brand with all details
<BrandCard
  brand={brand}
  variant="featured"
  showRating={true}
  showCountry={true}
  showDescription={true}
/>

// Logo-only grid layout
<div className="grid grid-cols-4 md:grid-cols-6 gap-4">
  {brands.map(brand => (
    <BrandCard
      key={brand.id}
      brand={brand}
      variant="logo-only"
      size="sm"
    />
  ))}
</div>
```

### ReviewCard

Displays customer reviews with ratings, helpful votes, and verification badges.

#### Props

```tsx
interface ReviewCardProps {
  review: Review;
  variant?: "default" | "compact" | "detailed" | "minimal";
  size?: "sm" | "md" | "lg";
  showProduct?: boolean;
  showHelpfulVotes?: boolean;
  showProsAndCons?: boolean;
  showImages?: boolean;
  showActions?: boolean;
  hover?: boolean;
  loading?: boolean;
  onHelpfulVote?: (reviewId: number, helpful: boolean) => void;
}
```

#### Usage Examples

```tsx
// Detailed review with all features
<ReviewCard
  review={review}
  variant="detailed"
  showProsAndCons={true}
  showImages={true}
  showHelpfulVotes={true}
  onHelpfulVote={(id, helpful) => handleHelpfulVote(id, helpful)}
/>

// Compact review for product page
<ReviewCard
  review={review}
  variant="compact"
  showProduct={false}
  showActions={false}
/>
```

### OrderCard

Displays order information with status tracking and action buttons.

#### Props

```tsx
interface OrderCardProps {
  order: Order;
  variant?: "default" | "compact" | "detailed" | "minimal";
  size?: "sm" | "md" | "lg";
  showItems?: boolean;
  showShippingAddress?: boolean;
  showActions?: boolean;
  maxItemsToShow?: number;
  hover?: boolean;
  loading?: boolean;
  onViewDetails?: (orderId: number) => void;
  onTrackOrder?: (trackingNumber: string) => void;
  onReorder?: (orderId: number) => void;
}
```

#### Usage Examples

```tsx
// Detailed order with all features
<OrderCard
  order={order}
  variant="detailed"
  showItems={true}
  showShippingAddress={true}
  showActions={true}
  onViewDetails={(id) => router.push(`/orders/${id}`)}
  onTrackOrder={(tracking) => window.open(`/track/${tracking}`)}
  onReorder={(id) => handleReorder(id)}
/>

// Compact order for dashboard
<OrderCard
  order={order}
  variant="compact"
  showItems={false}
  maxItemsToShow={2}
/>
```

## Styling and Customization

### Variants

All components support multiple variants:

- **default** - Standard appearance with balanced styling
- **compact** - Reduced padding and smaller elements
- **detailed** - Enhanced styling with more information
- **minimal** - Clean, minimal design
- **featured** - Eye-catching design for highlighted content

### Sizes

Three size options available:

- **sm** - Small size for dense layouts
- **md** - Medium size (default)
- **lg** - Large size for prominent display

### Custom Styling

All components accept a `className` prop for custom styling:

```tsx
<ProductCard
  product={product}
  className="shadow-xl border-2 border-blue-200"
/>
```

### Animation

Components support animation props:

```tsx
<ProductCard
  product={product}
  animate={true}
  duration={500}
  delay={100}
/>
```

## Loading States

All components include skeleton loading states:

```tsx
<ProductCard
  product={product}
  loading={isLoading}
/>
```

## Internationalization

Components use react-i18next for translations:

```tsx
// Translation keys used:
// products.*, categories.*, offers.*, brands.*, reviews.*, orders.*

// Example translation file (en.json)
{
  "products": {
    "add_to_cart": "Add to Cart",
    "add_to_wishlist": "Add to Wishlist",
    "quick_view": "Quick View",
    "out_of_stock": "Out of Stock"
  },
  "categories": {
    "products": "Products",
    "view_all": "View All"
  }
}
```

## RTL Support

Components automatically adapt to RTL languages:

```tsx
// Automatic RTL detection based on i18n language
const isRTL = i18n.language === 'ar';
```

## Best Practices

### Performance

1. **Use loading states** for better UX during data fetching
2. **Implement lazy loading** for image-heavy components
3. **Memoize handlers** to prevent unnecessary re-renders

```tsx
const handleAddToCart = useCallback((product: Product) => {
  // Add to cart logic
}, []);

<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
/>
```

### Accessibility

1. **Provide alt text** for all images
2. **Use semantic HTML** elements
3. **Include ARIA labels** for interactive elements

### Responsive Design

```tsx
// Responsive grid example
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map(product => (
    <ProductCard
      key={product.id}
      product={product}
      size={{ base: 'sm', md: 'md', lg: 'lg' }}
    />
  ))}
</div>
```

## Error Handling

Components gracefully handle missing data:

```tsx
// Safe property access with fallbacks
const productName = product.name || "Product Name Unavailable";
const productImage = product.image || "/placeholder-product.jpg";
```

## Testing

### Unit Testing Example

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/ecommerce';

test('ProductCard renders product information', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    image: '/test-image.jpg'
  };

  render(<ProductCard product={mockProduct} />);
  
  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('$99.99')).toBeInTheDocument();
});

test('ProductCard calls onAddToCart when button clicked', () => {
  const mockOnAddToCart = jest.fn();
  const mockProduct = { id: 1, name: 'Test Product', price: 99.99 };

  render(
    <ProductCard
      product={mockProduct}
      onAddToCart={mockOnAddToCart}
    />
  );
  
  fireEvent.click(screen.getByText('Add to Cart'));
  expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
});
```

## Migration Guide

### From v1.x to v2.x

1. **Updated prop names**:
   - `showQuickActions` → `showActions`
   - `onWishlist` → `onAddToWishlist`

2. **New required props**:
   - All components now require a `loading` prop

3. **Breaking changes**:
   - Removed deprecated `theme` prop
   - Updated TypeScript interfaces

## Contributing

When contributing new features:

1. **Follow TypeScript conventions**
2. **Add comprehensive prop documentation**
3. **Include usage examples**
4. **Write unit tests**
5. **Update this README**

## License

MIT License - see LICENSE file for details.