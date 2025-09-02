"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CommonComponentProps, AnimationProps } from "@/types/component-props";
import { Package, Star, ArrowRight, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Brand interface for type safety
 */
export interface Brand {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  image?: string;
  products_count?: number;
  slug?: string;
  is_active?: boolean;
  country?: string;
  website?: string;
  rating?: number;
  established_year?: number;
  is_featured?: boolean;
}

/**
 * Enhanced BrandCard component props
 */
interface BrandCardProps extends CommonComponentProps, AnimationProps {
  /** Brand data to display */
  brand: Brand;
  /** Card display variant */
  variant?: "default" | "compact" | "featured" | "minimal" | "logo-only";
  /** Card size */
  size?: "sm" | "md" | "lg";
  /** Whether to show product count */
  showProductCount?: boolean;
  /** Whether to show description */
  showDescription?: boolean;
  /** Whether to show rating */
  showRating?: boolean;
  /** Whether to show country */
  showCountry?: boolean;
  /** Whether to show hover effects */
  hover?: boolean;
  /** Custom click handler */
  onClick?: (brand: Brand) => void;
  /** Whether the card is in a loading state */
  loading?: boolean;
  /** Custom link href override */
  href?: string;
}

/**
 * BrandCard component for displaying brand information
 * with various layouts and interactive features
 */
const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  variant = "default",
  size = "md",
  showProductCount = true,
  showDescription = false,
  showRating = false,
  showCountry = false,
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
  const { t, i18n } = useTranslation("brands");
  const isRTL = i18n.language === "ar";

  // Safe access to brand properties
  const brandName = brand.name || "Brand Name Unavailable";
  const brandDescription = brand.description || "";
  const brandLogo = brand.logo || brand.image || "/placeholder-brand.jpg";
  const productsCount = brand.products_count || 0;
  const brandSlug = brand.slug || brand.id.toString();
  const brandCountry = brand.country || "";
  const brandRating = brand.rating || 0;
  const establishedYear = brand.established_year;
  
  // Generate link href
  const linkHref = href || `/brands/${brandSlug}`;

  // Variant-based styling
  const variantStyles = {
    default: {
      card: "bg-white border border-gray-200 hover:border-gray-300",
      logo: "aspect-square p-4",
      content: "p-4"
    },
    compact: {
      card: "bg-white border border-gray-100 hover:border-gray-200",
      logo: "aspect-square p-2",
      content: "p-3"
    },
    featured: {
      card: "bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-200 hover:border-purple-300",
      logo: "aspect-[4/3] p-6",
      content: "p-6"
    },
    minimal: {
      card: "bg-transparent hover:bg-gray-50",
      logo: "aspect-square p-2",
      content: "p-2"
    },
    "logo-only": {
      card: "bg-white border border-gray-200 hover:border-gray-300",
      logo: "aspect-square p-6",
      content: "p-2"
    }
  };

  // Size-based styling
  const sizeStyles = {
    sm: {
      text: "text-sm",
      title: "text-sm font-medium",
      description: "text-xs",
      badge: "text-xs px-2 py-1"
    },
    md: {
      text: "text-sm",
      title: "text-base font-semibold",
      description: "text-sm",
      badge: "text-sm px-3 py-1"
    },
    lg: {
      text: "text-base",
      title: "text-lg font-bold",
      description: "text-base",
      badge: "text-base px-4 py-2"
    }
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(brand);
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
        <div className={cn("bg-gray-200 rounded-t-lg", currentVariant.logo)} />
        {variant !== "logo-only" && (
          <CardContent className={currentVariant.content}>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              {showDescription && <div className="h-3 bg-gray-200 rounded w-full" />}
              {showProductCount && <div className="h-3 bg-gray-200 rounded w-1/2" />}
            </div>
          </CardContent>
        )}
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
        brand.is_featured && "ring-2 ring-yellow-400 ring-opacity-50",
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
        {/* Featured Badge */}
        {brand.is_featured && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-yellow-500 text-yellow-900 border-yellow-600">
              <Star className="h-3 w-3 mr-1 fill-current" />
              {t("featured") || "Featured"}
            </Badge>
          </div>
        )}

        {/* Brand Logo */}
        <div className={cn(
          "relative overflow-hidden bg-gray-50 flex items-center justify-center",
          currentVariant.logo
        )}>
          <Image
            src={brandLogo}
            alt={brandName}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-110 p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300" />
          
          {/* Arrow icon on hover */}
          {variant !== "logo-only" && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div className="bg-white bg-opacity-90 rounded-full p-1 shadow-lg">
                <ArrowRight className={cn(
                  "text-gray-700",
                  size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3 w-3"
                )} />
              </div>
            </div>
          )}
        </div>

        {/* Brand Content */}
        {variant !== "logo-only" && (
          <CardContent className={currentVariant.content}>
            <div className="space-y-2">
              {/* Brand Name */}
              <h3 className={cn(
                "line-clamp-1 transition-colors duration-200 group-hover:text-blue-600",
                currentSize.title,
                isRTL && "text-right"
              )}>
                {brandName}
              </h3>

              {/* Brand Description */}
              {showDescription && brandDescription && (
                <p className={cn(
                  "text-gray-600 line-clamp-2",
                  currentSize.description,
                  isRTL && "text-right"
                )}>
                  {brandDescription}
                </p>
              )}

              {/* Brand Details */}
              <div className="space-y-2">
                {/* Rating */}
                {showRating && brandRating > 0 && (
                  <div className={cn(
                    "flex items-center gap-1",
                    isRTL && "flex-row-reverse"
                  )}>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < Math.floor(brandRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({brandRating})</span>
                  </div>
                )}

                {/* Country and Established Year */}
                {(showCountry && brandCountry) || establishedYear ? (
                  <div className={cn(
                    "flex items-center gap-2 text-gray-500",
                    currentSize.text,
                    isRTL && "flex-row-reverse"
                  )}>
                    <Building2 className={cn(
                      size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3 w-3"
                    )} />
                    <span>
                      {showCountry && brandCountry && brandCountry}
                      {showCountry && brandCountry && establishedYear && " • "}
                      {establishedYear && `${t("since")} ${establishedYear}` || `Since ${establishedYear}`}
                    </span>
                  </div>
                ) : null}

                {/* Products Count */}
                {showProductCount && (
                  <div className={cn(
                    "flex items-center gap-2",
                    isRTL && "flex-row-reverse"
                  )}>
                    <Package className={cn(
                      "text-gray-500",
                      size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3 w-3"
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
            </div>
          </CardContent>
        )}

        {/* Logo-only variant brand name */}
        {variant === "logo-only" && (
          <CardContent className={currentVariant.content}>
            <h3 className={cn(
              "text-center line-clamp-1 transition-colors duration-200 group-hover:text-blue-600",
              currentSize.title
            )}>
              {brandName}
            </h3>
          </CardContent>
        )}
      </Link>
    </Card>
  );
};

BrandCard.displayName = "BrandCard";

export default BrandCard;
export { type BrandCardProps };