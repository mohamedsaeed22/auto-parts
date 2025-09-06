"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Tag, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    final_price: number;
    primary_image: string;
    description: string;
    product_identifier: string;
    discount_info?: string;
    offer?: {
      id: number;
      name: string;
    };
    brand?: {
      id: number;
      name: string;
    };
    category?: {
      id: number;
      name: string;
    };
    discount_type?: "percentage" | "fixed" | null;
    discount_amount?: string | null;
    images?: string[];
    hover_text?: string;
  };
  className?: string;
  dir?: "ltr" | "rtl";
}

export function ProductCard({ product, className }: ProductCardProps) {
  const hasDiscount = product.final_price < product.price;

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
          src={product.primary_image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute left-2 top-2">
            <Badge variant="destructive" className="flex items-center gap-1">
              {product.discount_type === "percentage" ? (
                <Percent className="h-3 w-3" />
              ) : (
                <Tag className="h-3 w-3" />
              )}
              {product.discount_info}
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
          {product.brand && (
            <Badge variant="outline" className="shrink-0">
              {product.brand.name}
            </Badge>
          )}
        </div>

        {/* Category */}
        {product.category && (
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category.name}
            </Badge>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">
            ${product.final_price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Offer Badge */}
        {product.offer && (
          <div className="mt-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {product.offer.name}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
