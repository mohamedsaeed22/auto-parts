"use client";

import React, { useState, useCallback } from "react";
import {
  ProductCard,
  CategoryCard,
  OfferCard,
  BrandCard,
  ReviewCard,
  OrderCard,
  type Product,
  type Category,
  type Offer,
  type Brand,
  type Review,
  type Order
} from "./index";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

/**
 * Comprehensive examples demonstrating all card components
 * with various configurations and use cases
 */

// Sample data for demonstrations
const sampleProduct: Product = {
  id: 1,
  name: "Premium Brake Pads Set",
  description: "High-performance ceramic brake pads for superior stopping power",
  price: 89.99,
  original_price: 119.99,
  currency: "USD",
  image: "/products/brake-pads.jpg",
  images: ["/products/brake-pads.jpg", "/products/brake-pads-2.jpg"],
  rating: 4.5,
  reviews_count: 128,
  stock_quantity: 15,
  sku: "BP-001",
  brand: "AutoPro",
  category: "Brake System",
  is_featured: true,
  is_on_sale: true,
  discount_percentage: 25,
  tags: ["ceramic", "premium", "performance"]
};

const sampleCategory: Category = {
  id: 1,
  name: "Engine Parts",
  description: "Complete range of engine components and accessories",
  image: "/categories/engine-parts.jpg",
  products_count: 245,
  slug: "engine-parts",
  is_featured: true
};

const sampleOffer: Offer = {
  id: 1,
  title: "Summer Sale - Engine Parts",
  description: "Get up to 30% off on all engine components",
  discount_percentage: 30,
  discount_amount: 50,
  image: "/offers/summer-sale.jpg",
  products_count: 150,
  start_date: "2024-06-01",
  end_date: "2024-08-31",
  is_active: true,
  terms: "Valid on selected items only"
};

const sampleBrand: Brand = {
  id: 1,
  name: "AutoPro",
  description: "Leading manufacturer of premium automotive parts",
  logo: "/brands/autopro-logo.png",
  products_count: 89,
  slug: "autopro",
  is_active: true,
  country: "Germany",
  website: "https://autopro.com",
  rating: 4.7,
  established_year: 1985,
  is_featured: true
};

const sampleReview: Review = {
  id: 1,
  rating: 5,
  title: "Excellent brake pads!",
  comment: "These brake pads exceeded my expectations. The stopping power is incredible and they're very quiet. Installation was straightforward and they fit perfectly. Highly recommended for anyone looking for premium brake pads.",
  author_name: "John Smith",
  author_avatar: "/avatars/john-smith.jpg",
  created_at: "2024-01-15T10:30:00Z",
  verified_purchase: true,
  helpful_votes: 24,
  total_votes: 28,
  product_id: 1,
  product_name: "Premium Brake Pads Set",
  pros: ["Excellent stopping power", "Very quiet operation", "Easy installation"],
  cons: ["Slightly expensive"],
  recommended: true
};

const sampleOrder: Order = {
  id: 1,
  order_number: "ORD-2024-001",
  status: "shipped",
  total_amount: 234.97,
  currency: "USD",
  created_at: "2024-01-10T14:30:00Z",
  updated_at: "2024-01-12T09:15:00Z",
  estimated_delivery: "2024-01-15T18:00:00Z",
  tracking_number: "TRK123456789",
  payment_method: "Credit Card",
  shipping_address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    postal_code: "10001",
    country: "United States"
  },
  items: [
    {
      id: 1,
      product_id: 1,
      product_name: "Premium Brake Pads Set",
      product_image: "/products/brake-pads.jpg",
      quantity: 2,
      price: 89.99,
      total: 179.98,
      sku: "BP-001"
    },
    {
      id: 2,
      product_id: 2,
      product_name: "Oil Filter",
      product_image: "/products/oil-filter.jpg",
      quantity: 1,
      price: 24.99,
      total: 24.99,
      sku: "OF-002"
    }
  ],
  items_count: 3,
  customer_name: "John Doe",
  customer_email: "john.doe@example.com"
};

/**
 * ProductCard Examples
 */
export const ProductCardExamples: React.FC = () => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = useCallback((product: Product) => {
    success(`${product.name} added to cart!`);
  }, [success]);

  const handleAddToWishlist = useCallback((product: Product) => {
    success(`${product.name} added to wishlist!`);
  }, [success]);

  const handleQuickView = useCallback((product: Product) => {
    console.log('Quick view:', product);
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">ProductCard Examples</h2>
      
      {/* Default variant */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Variant</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProductCard
            product={sampleProduct}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onQuickView={handleQuickView}
          />
          <ProductCard
            product={sampleProduct}
            loading={loading}
          />
          <ProductCard
            product={{ ...sampleProduct, stock_quantity: 0 }}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Different variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ProductCard
            product={sampleProduct}
            variant="compact"
            size="sm"
            onAddToCart={handleAddToCart}
          />
          <ProductCard
            product={sampleProduct}
            variant="detailed"
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
          <ProductCard
            product={sampleProduct}
            variant="minimal"
            showQuickActions={false}
            onAddToCart={handleAddToCart}
          />
          <ProductCard
            product={sampleProduct}
            variant="grid"
            size="lg"
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      <Button
        onClick={() => setLoading(!loading)}
        variant="outline"
      >
        Toggle Loading State
      </Button>
    </div>
  );
};

/**
 * CategoryCard Examples
 */
export const CategoryCardExamples: React.FC = () => {
  const handleCategoryClick = useCallback((category: Category) => {
    console.log('Category clicked:', category);
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">CategoryCard Examples</h2>
      
      {/* Different variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CategoryCard
            category={sampleCategory}
            onClick={handleCategoryClick}
          />
          <CategoryCard
            category={sampleCategory}
            variant="compact"
            size="sm"
            onClick={handleCategoryClick}
          />
          <CategoryCard
            category={sampleCategory}
            variant="featured"
            showDescription={true}
            onClick={handleCategoryClick}
          />
          <CategoryCard
            category={sampleCategory}
            variant="minimal"
            showProductCount={false}
            onClick={handleCategoryClick}
          />
        </div>
      </div>

      {/* Loading states */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Loading States</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard
            category={sampleCategory}
            loading={true}
          />
          <CategoryCard
            category={sampleCategory}
            variant="compact"
            loading={true}
          />
          <CategoryCard
            category={sampleCategory}
            variant="featured"
            loading={true}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * OfferCard Examples
 */
export const OfferCardExamples: React.FC = () => {
  const handleViewOffer = useCallback((offer: Offer) => {
    console.log('View offer:', offer);
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">OfferCard Examples</h2>
      
      {/* Different variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OfferCard
            offer={sampleOffer}
            showExpiryDate={true}
            showDescription={true}
            showActions={true}
            onViewOffer={handleViewOffer}
          />
          <OfferCard
            offer={sampleOffer}
            variant="compact"
            size="sm"
            onViewOffer={handleViewOffer}
          />
          <OfferCard
            offer={sampleOffer}
            variant="featured"
            size="lg"
            showExpiryDate={true}
            onViewOffer={handleViewOffer}
          />
        </div>
      </div>

      {/* Expired offer */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Expired Offer</h3>
        <div className="max-w-md">
          <OfferCard
            offer={{
              ...sampleOffer,
              end_date: "2023-12-31",
              is_active: false
            }}
            showExpiryDate={true}
            onViewOffer={handleViewOffer}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * BrandCard Examples
 */
export const BrandCardExamples: React.FC = () => {
  const handleBrandClick = useCallback((brand: Brand) => {
    console.log('Brand clicked:', brand);
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">BrandCard Examples</h2>
      
      {/* Different variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <BrandCard
            brand={sampleBrand}
            showRating={true}
            showCountry={true}
            showDescription={true}
            onClick={handleBrandClick}
          />
          <BrandCard
            brand={sampleBrand}
            variant="compact"
            size="sm"
            onClick={handleBrandClick}
          />
          <BrandCard
            brand={sampleBrand}
            variant="featured"
            showRating={true}
            onClick={handleBrandClick}
          />
          <BrandCard
            brand={sampleBrand}
            variant="minimal"
            onClick={handleBrandClick}
          />
          <BrandCard
            brand={sampleBrand}
            variant="logo-only"
            size="sm"
            onClick={handleBrandClick}
          />
        </div>
      </div>

      {/* Logo grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Logo Grid</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <BrandCard
              key={i}
              brand={{ ...sampleBrand, id: i + 1 }}
              variant="logo-only"
              size="sm"
              onClick={handleBrandClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * ReviewCard Examples
 */
export const ReviewCardExamples: React.FC = () => {
  const { success } = useToast();

  const handleHelpfulVote = useCallback((reviewId: number, helpful: boolean) => {
    success(`Marked review as ${helpful ? 'helpful' : 'not helpful'}`);
  }, [success]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">ReviewCard Examples</h2>
      
      {/* Different variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variants</h3>
        <div className="space-y-6">
          <ReviewCard
            review={sampleReview}
            variant="detailed"
            showProsAndCons={true}
            showHelpfulVotes={true}
            onHelpfulVote={handleHelpfulVote}
          />
          <ReviewCard
            review={sampleReview}
            variant="compact"
            showProduct={false}
            showActions={false}
          />
          <ReviewCard
            review={{
              ...sampleReview,
              rating: 2,
              title: "Not satisfied with the quality",
              comment: "The brake pads didn't meet my expectations. They're noisy and don't provide the stopping power I was looking for.",
              verified_purchase: false,
              recommended: false
            }}
            onHelpfulVote={handleHelpfulVote}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * OrderCard Examples
 */
export const OrderCardExamples: React.FC = () => {
  const { success } = useToast();

  const handleViewDetails = useCallback((orderId: number) => {
    console.log('View order details:', orderId);
  }, []);

  const handleTrackOrder = useCallback((trackingNumber: string) => {
    success(`Tracking order: ${trackingNumber}`);
  }, [success]);

  const handleReorder = useCallback((orderId: number) => {
    success(`Reordering items from order #${orderId}`);
  }, [success]);

  const handleContactSupport = useCallback((orderId: number) => {
    console.log('Contact support for order:', orderId);
  }, []);

  const handleDownloadInvoice = useCallback((orderId: number) => {
    success(`Downloading invoice for order #${orderId}`);
  }, [success]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">OrderCard Examples</h2>
      
      {/* Different statuses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Statuses</h3>
        <div className="space-y-6">
          <OrderCard
            order={sampleOrder}
            variant="detailed"
            showItems={true}
            showShippingAddress={true}
            showActions={true}
            onViewDetails={handleViewDetails}
            onTrackOrder={handleTrackOrder}
            onReorder={handleReorder}
            onContactSupport={handleContactSupport}
            onDownloadInvoice={handleDownloadInvoice}
          />
          
          <OrderCard
            order={{
              ...sampleOrder,
              id: 2,
              order_number: "ORD-2024-002",
              status: "pending",
              tracking_number: undefined
            }}
            showItems={false}
            onViewDetails={handleViewDetails}
            onContactSupport={handleContactSupport}
          />
          
          <OrderCard
            order={{
              ...sampleOrder,
              id: 3,
              order_number: "ORD-2024-003",
              status: "delivered"
            }}
            variant="compact"
            maxItemsToShow={2}
            onViewDetails={handleViewDetails}
            onReorder={handleReorder}
            onDownloadInvoice={handleDownloadInvoice}
          />
          
          <OrderCard
            order={{
              ...sampleOrder,
              id: 4,
              order_number: "ORD-2024-004",
              status: "cancelled"
            }}
            variant="minimal"
            showItems={false}
            showActions={false}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Complete Examples Showcase
 */
export const CardComponentsShowcase: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">E-commerce Card Components</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A comprehensive showcase of all available card components with various
          configurations, variants, and interactive features.
        </p>
      </div>

      <ProductCardExamples />
      <CategoryCardExamples />
      <OfferCardExamples />
      <BrandCardExamples />
      <ReviewCardExamples />
      <OrderCardExamples />
    </div>
  );
};

export default CardComponentsShowcase;