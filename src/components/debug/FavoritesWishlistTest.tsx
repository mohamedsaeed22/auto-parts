"use client";

import React, { useState } from "react";
import { useGetSectionsQuery, useGetProductsListQuery } from "@/services/api";
import { useFavouritesWishlist } from "@/hooks/useFavouritesWishlist";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark, RefreshCw } from "lucide-react";

/**
 * Debug component to test favorites/wishlist cache invalidation
 * This component shows sections data and allows testing the cache invalidation
 */
const FavoritesWishlistTest: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  // Fetch sections data
  const {
    data: sectionsResponse,
    isLoading: sectionsLoading,
    error: sectionsError,
    refetch: refetchSections,
  } = useGetSectionsQuery({});

  // Fetch products data
  const {
    data: productsResponse,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useGetProductsListQuery({});

  // Favorites/wishlist hooks
  const {
    handleToggleFavourite,
    handleToggleWishlist,
    isLoading: isActionLoading,
  } = useFavouritesWishlist();

  const sections = sectionsResponse?.data?.items || [];
  const products = productsResponse?.data?.items || [];

  const handleTestFavourite = async (productId: number) => {
    setSelectedProductId(productId);
    try {
      await handleToggleFavourite(productId);
      console.log(`✅ Toggled favourite for product ${productId}`);
    } catch (error) {
      console.error(
        `❌ Failed to toggle favourite for product ${productId}:`,
        error
      );
    } finally {
      setSelectedProductId(null);
    }
  };

  const handleTestWishlist = async (productId: number) => {
    setSelectedProductId(productId);
    try {
      await handleToggleWishlist(productId);
      console.log(`✅ Toggled wishlist for product ${productId}`);
    } catch (error) {
      console.error(
        `❌ Failed to toggle wishlist for product ${productId}:`,
        error
      );
    } finally {
      setSelectedProductId(null);
    }
  };

  if (sectionsLoading || productsLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading sections...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (sectionsError || productsError) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Error loading sections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load sections data</p>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => refetchSections()} className="mt-4">
              Retry Sections
            </Button>
            <Button onClick={() => refetchProducts()} className="mt-4">
              Retry Products
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Favorites/Wishlist Cache Invalidation Test</span>
            <div className="flex gap-2">
              <Button
                onClick={() => refetchSections()}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Sections
              </Button>
              <Button
                onClick={() => refetchProducts()}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Products
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            This component tests bidirectional cache invalidation when
            adding/removing products from favorites or wishlist. When you toggle
            a product's status from either endpoint, both endpoints should
            automatically refresh to reflect the changes without page reload.
          </p>

          <div className="grid gap-4">
            {/* Products from /api/products endpoint */}
            <Card className="border border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">
                  Products from /api/products endpoint
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {products.length} products
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.slice(0, 6).map((product) => (
                    <Card key={product.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              ID: {product.id}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Badge
                              variant={
                                product.in_favorites ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              {product.in_favorites
                                ? "Favorited"
                                : "Not Favorited"}
                            </Badge>
                            <Badge
                              variant={
                                product.in_wishlist ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              <Bookmark className="h-3 w-3 mr-1" />
                              {product.in_wishlist
                                ? "Wishlisted"
                                : "Not Wishlisted"}
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={
                                product.in_favorites ? "default" : "outline"
                              }
                              onClick={() => handleTestFavourite(product.id)}
                              disabled={
                                isActionLoading &&
                                selectedProductId === product.id
                              }
                              className="text-xs"
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              {product.in_favorites ? "Remove" : "Add"} Favorite
                            </Button>

                            <Button
                              size="sm"
                              variant={
                                product.in_wishlist ? "default" : "outline"
                              }
                              onClick={() => handleTestWishlist(product.id)}
                              disabled={
                                isActionLoading &&
                                selectedProductId === product.id
                              }
                              className="text-xs"
                            >
                              <Bookmark className="h-3 w-3 mr-1" />
                              {product.in_wishlist ? "Remove" : "Add"} Wishlist
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sections from /api/sections endpoint */}
            {sections.map((section) => (
              <Card key={section.id} className="border">
                <CardHeader>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {section.products_count} products
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.products?.map((product) => (
                      <Card key={product.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                ID: {product.id}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  product.in_favorites ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                <Heart className="h-3 w-3 mr-1" />
                                {product.in_favorites
                                  ? "Favorited"
                                  : "Not Favorited"}
                              </Badge>
                              <Badge
                                variant={
                                  product.in_wishlist ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                <Bookmark className="h-3 w-3 mr-1" />
                                {product.in_wishlist
                                  ? "Wishlisted"
                                  : "Not Wishlisted"}
                              </Badge>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={
                                  product.in_favorites ? "default" : "outline"
                                }
                                onClick={() => handleTestFavourite(product.id)}
                                disabled={
                                  isActionLoading &&
                                  selectedProductId === product.id
                                }
                                className="text-xs"
                              >
                                <Heart className="h-3 w-3 mr-1" />
                                {product.in_favorites ? "Remove" : "Add"}{" "}
                                Favorite
                              </Button>

                              <Button
                                size="sm"
                                variant={
                                  product.in_wishlist ? "default" : "outline"
                                }
                                onClick={() => handleTestWishlist(product.id)}
                                disabled={
                                  isActionLoading &&
                                  selectedProductId === product.id
                                }
                                className="text-xs"
                              >
                                <Bookmark className="h-3 w-3 mr-1" />
                                {product.in_wishlist ? "Remove" : "Add"}{" "}
                                Wishlist
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoritesWishlistTest;
