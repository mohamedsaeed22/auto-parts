"use client";

import { useState } from "react";
import { useGetProductsMutation } from "@/services/hooks";
import { ProductsRequest } from "@/services/hooks";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

export default function ProductsListExample() {
  const [filters, setFilters] = useState<ProductsRequest>({});

  // Use the mutation hook for products
  const [getProducts, { data: productsResponse, isLoading, error }] =
    useGetProductsMutation();

  // Load products on component mount or when filters change
  const loadProducts = () => {
    getProducts(filters);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<ProductsRequest>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    getProducts(updatedFilters);
  };

  const products = productsResponse?.data?.items || [];
  const pagination = productsResponse?.data?.pagination;

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search products..."
          className="px-3 py-2 border rounded-md"
          onChange={(e) =>
            handleFilterChange({ search: e.target.value || undefined })
          }
        />

        <input
          type="number"
          placeholder="Min Price"
          className="px-3 py-2 border rounded-md w-32"
          onChange={(e) =>
            handleFilterChange({
              min_price: e.target.value
                ? parseFloat(e.target.value)
                : undefined,
            })
          }
        />

        <input
          type="number"
          placeholder="Max Price"
          className="px-3 py-2 border rounded-md w-32"
          onChange={(e) =>
            handleFilterChange({
              max_price: e.target.value
                ? parseFloat(e.target.value)
                : undefined,
            })
          }
        />

        <Button onClick={loadProducts} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading...
            </>
          ) : (
            "Load Products"
          )}
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4 text-red-600">
            <AlertCircle className="h-8 w-8" />
            <p>Failed to load products</p>
            <Button onClick={loadProducts} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 space-y-3">
                <img
                  src={product.primary_image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <div className="space-y-1">
                  {product.discount_type && (
                    <p className="text-sm text-gray-500 line-through">
                      ${product.price}
                    </p>
                  )}
                  <p className="text-xl font-bold text-gray-900">
                    ${product.final_price}
                  </p>
                  {product.discount_info && (
                    <p className="text-sm text-green-600 font-medium">
                      {product.discount_info}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600">{product.category.name}</p>
                <div
                  className="text-sm text-gray-700 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            ))}
          </div>

          {/* Pagination Info */}
          {pagination && (
            <div className="flex justify-between items-center pt-6">
              <p className="text-sm text-gray-600">
                Showing {pagination.from} to {pagination.to} of{" "}
                {pagination.total} products
              </p>
              <p className="text-sm text-gray-600">
                Page {pagination.current_page} of {pagination.last_page}
              </p>
            </div>
          )}
        </>
      )}

      {/* No Products State */}
      {!isLoading && !error && products.length === 0 && productsResponse && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found</p>
        </div>
      )}
    </div>
  );
}
