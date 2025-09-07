"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    discount_price: number | null;
    images: string[];
    description: string;
    category_id: number;
    brand_id: number;
    is_favorite: boolean;
    is_in_wishlist: boolean;
    rating: number;
    reviews_count: number;
    stock: number;
    specifications: Record<string, string>;
    created_at: string;
    updated_at: string;
  };
  className?: string;
  dir?: "ltr" | "rtl";
  onAddToCart?: (product: ProductCardProps["product"]) => void;
}

export function ProductCard({
  product,
  className,
  onAddToCart,
}: ProductCardProps) {
  const hasDiscount =
    product.discount_price !== null && product.discount_price < product.price;
  const finalPrice = product.discount_price || product.price;
  const primaryImage = product.images[0] || "/placeholder-product.jpg";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute left-2 top-2">
            <Badge variant="destructive" className="flex items-center gap-1">
              <Percent className="h-3 w-3" />
              {Math.round(((product.price - finalPrice) / product.price) * 100)}
              %
            </Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute right-2 top-2 flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={() => onAddToCart?.(product)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Product Info */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
          <Badge variant="outline" className="shrink-0">
            ID: {product.id}
          </Badge>
        </div>

        {/* Rating */}
        <div className="mb-2 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews_count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">${finalPrice.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="mt-2">
          <Badge
            variant={product.stock > 0 ? "secondary" : "destructive"}
            className="text-xs"
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
