"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CommonComponentProps, AnimationProps } from "@/types/component-props";
import { ArrowRight, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Category interface for type safety
 */
export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  products_count?: number;
  slug?: string;
  is_active?: boolean;
  parent_id?: number;
  children?: Category[];
}

/**
 * Enhanced CategoryCard component props
 */
interface CategoryCardProps extends CommonComponentProps, AnimationProps {
  /** Category data to display */
  category: Category;
  /** Card display variant */
  variant?: "default" | "compact" | "featured" | "minimal";
  /** Card size */
  size?: "sm" | "md" | "lg";
  /** Whether to show product count */
  showProductCount?: boolean;
  /** Whether to show description */
  showDescription?: boolean;
  /** Whether to show hover effects */
  hover?: boolean;
  /** Custom click handler */
  onClick?: (category: Category) => void;
  /** Whether the card is in a loading state */
  loading?: boolean;
  /** Custom link href override */
  href?: string;
}

/**
 * CategoryCard component for displaying product categories
 * with various layouts and interactive features
 */
const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  variant = "default",
  size = "md",
  showProductCount = true,
  showDescription = false,
  hover = true,
  onClick,
  loading = false,
  href,
  className,
  animate = true,
  duration = 300,
  delay = 0,
  ...props
}) => {
  const { t, i18n } = useTranslation("categories");
  const isRTL = i18n.language === "ar";

  // Safe access to category properties
  const categoryName = category.name || "Category Name Unavailable";
  const categoryDescription = category.description || "";
  const categoryImage = category.image || "/placeholder-category.jpg";
  const productsCount = category.products_count || 0;
  const categorySlug = category.slug || category.id.toString();
  
  // Generate link href
  const linkHref = href || `/categories/${categorySlug}`;

  // Variant-based styling
  const variantStyles = {
    default: {
      card: "bg-white border border-gray-200 hover:border-gray-300",
      image: "aspect-[4/3]",
      content: "p-4"
    },
    compact: {
      card: "bg-white border border-gray-100 hover:border-gray-200",
      image: "aspect-square",
      content: "p-3"
    },
    featured: {
      card: "bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 hover:border-blue-300",
      image: "aspect-[3/2]",
      content: "p-6"
    },
    minimal: {
      card: "bg-transparent hover:bg-gray-50",
      image: "aspect-square",
      content: "p-2"
    }
  };

  // Size-based styling
  const sizeStyles = {
    sm: {
      text: "text-sm",
      title: "text-base font-medium",
      description: "text-xs",
      badge: "text-xs px-2 py-1"
    },
    md: {
      text: "text-sm",
      title: "text-lg font-semibold",
      description: "text-sm",
      badge: "text-sm px-3 py-1"
    },
    lg: {
      text: "text-base",
      title: "text-xl font-bold",
      description: "text-base",
      badge: "text-base px-4 py-2"
    }
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(category);
    }
  };

  if (loading) {
    return (
      <Card
        className={cn(
          "animate-pulse",
          currentVariant.card,
          className
        )}
        hover={false}
        interactive={false}
      >
        <div className={cn("bg-gray-200 rounded-t-lg", currentVariant.image)} />
        <CardContent className={currentVariant.content}>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            {showDescription && <div className="h-3 bg-gray-200 rounded w-full" />}
            {showProductCount && <div className="h-3 bg-gray-200 rounded w-1/2" />}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300",
        currentVariant.card,
        hover && "hover:shadow-lg hover:scale-[1.02]",
        animate && "animate-in fade-in slide-in-from-bottom-4",
        className
      )}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`
      }}
      hover={hover}
      interactive
      onClick={handleClick}
      {...props}
    >
      <Link href={linkHref} className="block">
        {/* Category Image */}
        <div className={cn(
          "relative overflow-hidden bg-gray-100",
          currentVariant.image
        )}>
          <Image
            src={categoryImage}
            alt={categoryName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          
          {/* Arrow icon on hover */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="bg-white bg-opacity-90 rounded-full p-2 shadow-lg">
              <ArrowRight className={cn(
                "text-gray-700",
                size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
              )} />
            </div>
          </div>
        </div>

        {/* Category Content */}
        <CardContent className={currentVariant.content}>
          <div className="space-y-2">
            {/* Category Name */}
            <h3 className={cn(
              "line-clamp-2 transition-colors duration-200 group-hover:text-blue-600",
              currentSize.title,
              isRTL && "text-right"
            )}>
              {categoryName}
            </h3>

            {/* Category Description */}
            {showDescription && categoryDescription && (
              <p className={cn(
                "text-gray-600 line-clamp-2",
                currentSize.description,
                isRTL && "text-right"
              )}>
                {categoryDescription}
              </p>
            )}

            {/* Products Count */}
            {showProductCount && (
              <div className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}>
                <Package className={cn(
                  "text-gray-500",
                  size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
                )} />
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    currentSize.badge
                  )}
                >
                  {productsCount} {productsCount === 1 ? t("product") || "Product" : t("products") || "Products"}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

CategoryCard.displayName = "CategoryCard";

export default CategoryCard;
export { type CategoryCardProps };