"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommonComponentProps, AnimationProps } from "@/types/component-props";
import { 
  Percent, 
  DollarSign, 
  Clock, 
  Package, 
  ArrowRight, 
  Calendar,
  Tag,
  Eye
} from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Offer interface for type safety
 */
export interface Offer {
  id: number;
  title?: string;
  description?: string;
  image?: string;
  discount_type?: "percentage" | "fixed" | "buy_one_get_one";
  discount_amount?: string | number;
  discount_info?: string;
  products_count?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  slug?: string;
  terms_conditions?: string;
  min_purchase_amount?: number;
}

/**
 * Enhanced OfferCard component props
 */
interface OfferCardProps extends CommonComponentProps, AnimationProps {
  /** Offer data to display */
  offer: Offer;
  /** Card display variant */
  variant?: "default" | "compact" | "featured" | "minimal" | "banner";
  /** Card size */
  size?: "sm" | "md" | "lg";
  /** Whether to show product count */
  showProductCount?: boolean;
  /** Whether to show expiry date */
  showExpiryDate?: boolean;
  /** Whether to show description */
  showDescription?: boolean;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Whether to show hover effects */
  hover?: boolean;
  /** Custom click handler */
  onClick?: (offer: Offer) => void;
  /** Custom view offer handler */
  onViewOffer?: (offer: Offer) => void;
  /** Whether the card is in a loading state */
  loading?: boolean;
  /** Custom link href override */
  href?: string;
}

/**
 * OfferCard component for displaying promotional offers
 * with various layouts and interactive features
 */
const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  variant = "default",
  size = "md",
  showProductCount = true,
  showExpiryDate = true,
  showDescription = false,
  showActions = true,
  hover = true,
  onClick,
  onViewOffer,
  loading = false,
  href,
  className,
  animate = true,
  duration = 300,
  delay = 0,
  ...props
}) => {
  const { t, i18n } = useTranslation("offers");
  const isRTL = i18n.language === "ar";

  // Safe access to offer properties
  const offerTitle = offer.title || `${t("offer")} #${offer.id}` || `Offer #${offer.id}`;
  const offerDescription = offer.description || "";
  const offerImage = offer.image || "/placeholder-offer.jpg";
  const productsCount = offer.products_count || 0;
  const discountInfo = offer.discount_info || "";
  const discountType = offer.discount_type || "percentage";
  const offerSlug = offer.slug || offer.id.toString();
  
  // Generate link href
  const linkHref = href || `/offers/${offerSlug}`;

  // Check if offer is expiring soon (within 3 days)
  const isExpiringSoon = React.useMemo(() => {
    if (!offer.end_date) return false;
    const endDate = new Date(offer.end_date);
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    return endDate <= threeDaysFromNow && endDate > now;
  }, [offer.end_date]);

  // Check if offer is expired
  const isExpired = React.useMemo(() => {
    if (!offer.end_date) return false;
    return new Date(offer.end_date) < new Date();
  }, [offer.end_date]);

  // Format expiry date
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Variant-based styling
  const variantStyles = {
    default: {
      card: "bg-white border border-gray-200 hover:border-gray-300",
      image: "aspect-[4/3]",
      content: "p-4"
    },
    compact: {
      card: "bg-white border border-gray-100 hover:border-gray-200",
      image: "aspect-[3/2]",
      content: "p-3"
    },
    featured: {
      card: "bg-gradient-to-br from-red-50 to-orange-100 border-2 border-red-200 hover:border-red-300",
      image: "aspect-[5/3]",
      content: "p-6"
    },
    minimal: {
      card: "bg-transparent hover:bg-gray-50",
      image: "aspect-square",
      content: "p-2"
    },
    banner: {
      card: "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0",
      image: "aspect-[2/1]",
      content: "p-6"
    }
  };

  // Size-based styling
  const sizeStyles = {
    sm: {
      text: "text-sm",
      title: "text-base font-medium",
      description: "text-xs",
      badge: "text-xs px-2 py-1",
      button: "text-xs px-2 py-1"
    },
    md: {
      text: "text-sm",
      title: "text-lg font-semibold",
      description: "text-sm",
      badge: "text-sm px-3 py-1",
      button: "text-sm px-3 py-2"
    },
    lg: {
      text: "text-base",
      title: "text-xl font-bold",
      description: "text-base",
      badge: "text-base px-4 py-2",
      button: "text-base px-4 py-3"
    }
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(offer);
    }
  };

  const handleViewOffer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewOffer) {
      onViewOffer(offer);
    }
  };

  // Get discount icon
  const getDiscountIcon = () => {
    switch (discountType) {
      case "percentage":
        return Percent;
      case "fixed":
        return DollarSign;
      case "buy_one_get_one":
        return Tag;
      default:
        return Percent;
    }
  };

  const DiscountIcon = getDiscountIcon();

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
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            {showDescription && <div className="h-3 bg-gray-200 rounded w-full" />}
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16" />
              <div className="h-6 bg-gray-200 rounded w-20" />
            </div>
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
        isExpired && "opacity-60 grayscale",
        className
      )}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`
      }}
      hover={hover && !isExpired}
      interactive={!isExpired}
      onClick={handleClick}
      {...props}
    >
      <Link href={linkHref} className={cn("block", isExpired && "pointer-events-none")}>
        {/* Offer Image */}
        <div className={cn(
          "relative overflow-hidden bg-gray-100",
          currentVariant.image
        )}>
          <Image
            src={offerImage}
            alt={offerTitle}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Discount Badge */}
          {discountInfo && (
            <div className={cn(
              "absolute top-4 left-4 bg-red-500 text-white rounded-full shadow-lg flex items-center gap-1 font-bold",
              currentSize.badge
            )}>
              <DiscountIcon className={cn(
                size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
              )} />
              {discountInfo}
            </div>
          )}

          {/* Products Count Badge */}
          {showProductCount && productsCount > 0 && (
            <div className={cn(
              "absolute top-4 right-4 bg-black bg-opacity-70 text-white rounded-full font-medium",
              currentSize.badge
            )}>
              {productsCount} {productsCount === 1 ? t("product") || "Product" : t("products") || "Products"}
            </div>
          )}

          {/* Expiry Warning */}
          {isExpiringSoon && (
            <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {t("expiringSoon") || "Expiring Soon"}
            </div>
          )}

          {/* Expired Badge */}
          {isExpired && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                {t("expired") || "EXPIRED"}
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>

        {/* Offer Content */}
        <CardContent className={currentVariant.content}>
          <div className="space-y-3">
            {/* Offer Title */}
            <h3 className={cn(
              "line-clamp-2 transition-colors duration-200",
              variant === "banner" ? "text-white" : "text-gray-900 group-hover:text-blue-600",
              currentSize.title,
              isRTL && "text-right"
            )}>
              {offerTitle}
            </h3>

            {/* Offer Description */}
            {showDescription && offerDescription && (
              <p className={cn(
                "line-clamp-2",
                variant === "banner" ? "text-white text-opacity-90" : "text-gray-600",
                currentSize.description,
                isRTL && "text-right"
              )}>
                {offerDescription}
              </p>
            )}

            {/* Offer Details */}
            <div className={cn(
              "flex flex-wrap items-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
              {/* Discount Type Badge */}
              <Badge 
                variant={variant === "banner" ? "secondary" : "outline"}
                className={cn(
                  currentSize.badge,
                  variant === "banner" && "bg-white bg-opacity-20 text-white border-white border-opacity-30"
                )}
              >
                {t(`discountType.${discountType}`) || discountType}
              </Badge>

              {/* Expiry Date */}
              {showExpiryDate && offer.end_date && (
                <div className={cn(
                  "flex items-center gap-1",
                  variant === "banner" ? "text-white text-opacity-80" : "text-gray-500",
                  currentSize.text
                )}>
                  <Calendar className={cn(
                    size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
                  )} />
                  <span>{formatExpiryDate(offer.end_date)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Action Buttons */}
        {showActions && !isExpired && (
          <CardFooter className={cn(
            "pt-0",
            currentVariant.content
          )}>
            <div className={cn(
              "flex gap-2 w-full",
              isRTL && "flex-row-reverse"
            )}>
              <Button
                variant={variant === "banner" ? "secondary" : "default"}
                size={size === "sm" ? "sm" : "default"}
                className={cn(
                  "flex-1 transition-all duration-200",
                  currentSize.button
                )}
                onClick={handleViewOffer}
              >
                <Eye className={cn(
                  "mr-2",
                  size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4",
                  isRTL && "mr-0 ml-2"
                )} />
                {t("viewOffer") || "View Offer"}
              </Button>
              
              <Button
                variant="outline"
                size={size === "sm" ? "sm" : "default"}
                className={cn(
                  "transition-all duration-200",
                  currentSize.button,
                  variant === "banner" && "border-white border-opacity-30 text-white hover:bg-white hover:text-gray-900"
                )}
              >
                <ArrowRight className={cn(
                  size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
                )} />
              </Button>
            </div>
          </CardFooter>
        )}
      </Link>
    </Card>
  );
};

OfferCard.displayName = "OfferCard";

export default OfferCard;
export { type OfferCardProps };