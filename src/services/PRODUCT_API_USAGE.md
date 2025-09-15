# Product API Usage Guide

This guide shows how to use the updated Product API with proper loading, error, and data handling.

## 🔧 API Response Structure

The API now returns data in this format:

```json
{
  "code": 200,
  "message": "Products retrieved successfully",
  "errors": [],
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Product 1",
        "price": "100.00",
        "discount_type": "percentage",
        "discount_amount": "10.00",
        "final_price": 90,
        "discount_info": "10.00% (Offer)",
        "brand": null,
        "category": {
          "id": 3,
          "name": "sub category 1",
          "level": 2,
          "image": "https://example.com/image.jpg",
          "parent": {
            "id": 1,
            "name": "Primary Category 1"
          }
        },
        "offer": {
          "id": 1,
          "image": "https://example.com/offer.png",
          "discount_type": "percentage",
          "discount_amount": "10.00",
          "discount_info": "10.00%",
          "products_count": 2
        },
        "primary_image": "https://example.com/product.jpg",
        "images": [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg"
        ],
        "description": "<p>Product description</p>",
        "hover_text": "Product Discount",
        "product_identifier": "PRODUCT-2"
      }
    ],
    "pagination": {
      "total": 3,
      "per_page": 3,
      "current_page": 1,
      "last_page": 1,
      "from": 1,
      "to": 3
    }
  }
}
```

## 📋 Available Hooks

### 1. Get Single Product

```typescript
import { useGetProductQuery } from "@/services/hooks";

function ProductDetail({ productId }: { productId: number }) {
  const {
    data: productResponse,
    isLoading,
    error,
    refetch,
  } = useGetProductQuery(productId);

  const product = productResponse?.data;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.final_price}</p>
      <p>Original Price: ${product.price}</p>
      {product.discount_info && (
        <p className="text-green-600">{product.discount_info}</p>
      )}
      <img src={product.primary_image} alt={product.name} />
    </div>
  );
}
```

### 2. Get Products List

```typescript
import { useGetProductsMutation } from "@/services/hooks";

function ProductsList() {
  const [getProducts, { data: productsResponse, isLoading, error }] =
    useGetProductsMutation();

  const products = productsResponse?.data?.items || [];
  const pagination = productsResponse?.data?.pagination;

  const loadProducts = (filters = {}) => {
    getProducts(filters);
  };

  return (
    <div>
      <button onClick={() => loadProducts()}>
        {isLoading ? "Loading..." : "Load Products"}
      </button>

      {error && <div>Error loading products</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4">
            <img src={product.primary_image} alt={product.name} />
            <h3>{product.name}</h3>
            <div>
              {product.discount_type && (
                <span className="line-through text-gray-500">
                  ${product.price}
                </span>
              )}
              <span className="font-bold">${product.final_price}</span>
            </div>
            {product.discount_info && (
              <span className="text-green-600">{product.discount_info}</span>
            )}
          </div>
        ))}
      </div>

      {pagination && (
        <div>
          Page {pagination.current_page} of {pagination.last_page}(
          {pagination.total} total products)
        </div>
      )}
    </div>
  );
}
```

### 3. Add to Cart

```typescript
import { useAddToCartMutation } from "@/services/hooks";

function AddToCartButton({ productId }: { productId: number }) {
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    try {
      await addToCart({
        product_id: productId,
        quantity: 1,
      }).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={isAdding}>
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

## 🎯 Complete Product Details Page Example

Here's the updated product details page with full API integration:

```typescript
"use client";

import { useGetProductQuery, useAddToCartMutation } from "@/services/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const [selectedImage, setSelectedImage] = useState(0);

  // API Hooks
  const {
    data: productResponse,
    isLoading,
    error,
    refetch,
  } = useGetProductQuery(productId);

  const [addToCartApi, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const product = productResponse?.data;

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div>Loading product details...</div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div>
          <p>Error loading product</p>
          <button onClick={refetch}>Try Again</button>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div>Product not found</div>
      </div>
    );
  }

  // Prepare images with safety checks
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.primary_image
      ? [product.primary_image]
      : [];

  const handleAddToCart = async () => {
    try {
      await addToCartApi({
        product_id: product.id,
        quantity: 1,
      }).unwrap();

      alert("Added to cart successfully!");
    } catch (error) {
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {productImages.length > 0 ? (
              <img
                src={
                  productImages[
                    Math.min(selectedImage, productImages.length - 1)
                  ]
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    index === selectedImage
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2">
              {product.discount_type && (
                <p className="text-lg text-gray-500 line-through">
                  ${product.price}
                </p>
              )}
              <p className="text-2xl font-bold">${product.final_price}</p>
              {product.discount_info && (
                <p className="text-green-600 font-medium">
                  {product.discount_info}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          <div>
            <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm">
              {product.category.name}
            </span>
            {product.category.parent && (
              <span className="inline-block bg-gray-50 px-3 py-1 rounded-full text-sm ml-2">
                {product.category.parent.name}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
          </button>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Product Code:</span>
              <span>{product.product_identifier}</span>
            </div>
            <div className="flex justify-between">
              <span>Category:</span>
              <span>{product.category.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🔍 Search and Filter Products

```typescript
import { useGetProductsMutation } from "@/services/hooks";

function ProductsSearch() {
  const [filters, setFilters] = useState({
    search: "",
    category_id: undefined,
    min_price: undefined,
    max_price: undefined,
  });

  const [getProducts, { data, isLoading, error }] = useGetProductsMutation();

  const handleSearch = () => {
    getProducts(filters);
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Min Price"
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              min_price: e.target.value
                ? parseFloat(e.target.value)
                : undefined,
            }))
          }
        />
        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              max_price: e.target.value
                ? parseFloat(e.target.value)
                : undefined,
            }))
          }
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results */}
      {data?.data?.items && (
        <div>
          <p>{data.data.pagination.total} products found</p>
          {/* Render products */}
        </div>
      )}
    </div>
  );
}
```

## ⚡ Key Features

1. **Automatic Loading States**: All hooks provide `isLoading`, `error`, and `isSuccess` states
2. **Error Handling**: Comprehensive error handling with retry functionality
3. **Type Safety**: Full TypeScript support with proper type definitions
4. **Caching**: RTK Query automatically caches responses
5. **Real-time Updates**: Automatic cache invalidation and updates
6. **Optimistic Updates**: UI updates immediately while API calls are in progress

## 🎯 Best Practices

1. Always handle loading, error, and empty states
2. Use proper error boundaries for production apps
3. Implement retry mechanisms for failed requests
4. Show loading spinners for better UX
5. Use proper image loading with fallbacks
6. Implement proper accessibility features

This updated API integration provides a robust foundation for your product management with proper error handling, loading states, and data management.
