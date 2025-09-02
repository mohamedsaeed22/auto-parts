"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CommonComponentProps, AnimationProps } from "@/types/component-props";
import { Star, ThumbsUp, ThumbsDown, Shield, Calendar, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";

/**
 * Review interface for type safety
 */
export interface Review {
  id: number;
  rating: number;
  title?: string;
  comment: string;
  author_name: string;
  author_avatar?: string;
  created_at: string;
  verified_purchase?: boolean;
  helpful_votes?: number;
  total_votes?: number;
  product_id?: number;
  product_name?: string;
  images?: string[];
  pros?: string[];
  cons?: string[];
  recommended?: boolean;
}

/**
 * Enhanced ReviewCard component props
 */
interface ReviewCardProps extends CommonComponentProps, AnimationProps {
  /** Review data to display */
  review: Review;
  /** Card display variant */
  variant?: "default" | "compact" | "detailed" | "minimal";
  /** Card size */
  size?: "sm" | "md" | "lg";
  /** Whether to show product information */
  showProduct?: boolean;
  /** Whether to show helpful votes */
  showHelpfulVotes?: boolean;
  /** Whether to show pros and cons */
  showProsAndCons?: boolean;
  /** Whether to show review images */
  showImages?: boolean;
  /** Whether to show hover effects */
  hover?: boolean;
  /** Custom click handler */
  onClick?: (review: Review) => void;
  /** Helpful vote handler */
  onHelpfulVote?: (reviewId: number, helpful: boolean) => void;
  /** Whether the card is in a loading state */
  loading?: boolean;
  /** Whether to show action buttons */
  showActions?: boolean;
}

/**
 * ReviewCard component for displaying customer reviews
 * with rating, content, and interactive features
 */
const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  variant = "default",
  size = "md",
  showProduct = false,
  showHelpfulVotes = true,
  showProsAndCons = false,
  showImages = false,
  hover = true,
  onClick,
  onHelpfulVote,
  loading = false,
  showActions = true,
  className,
  animate = true,
  duration = 300,
  delay = 0,
  ...props
}) => {
  const { t, i18n } = useTranslation("reviews");
  const isRTL = i18n.language === "ar";

  // Safe access to review properties
  const rating = Math.max(0, Math.min(5, review.rating || 0));
  const authorName = review.author_name || "Anonymous";
  const comment = review.comment || "";
  const title = review.title || "";
  const helpfulVotes = review.helpful_votes || 0;
  const totalVotes = review.total_votes || 0;
  const reviewDate = new Date(review.created_at);
  const authorInitials = authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  // Format date
  const formattedDate = formatDistanceToNow(reviewDate, { addSuffix: true });

  // Variant-based styling
  const variantStyles = {
    default: {
      card: "bg-white border border-gray-200",
      header: "pb-3",
      content: "pt-0"
    },
    compact: {
      card: "bg-gray-50 border border-gray-100",
      header: "pb-2",
      content: "pt-0"
    },
    detailed: {
      card: "bg-white border border-gray-200 shadow-sm",
      header: "pb-4",
      content: "pt-0"
    },
    minimal: {
      card: "bg-transparent border-0",
      header: "pb-2",
      content: "pt-0"
    }
  };

  // Size-based styling
  const sizeStyles = {
    sm: {
      text: "text-xs",
      title: "text-sm font-medium",
      comment: "text-sm",
      avatar: "h-8 w-8",
      star: "h-3 w-3",
      icon: "h-3 w-3"
    },
    md: {
      text: "text-sm",
      title: "text-base font-semibold",
      comment: "text-sm",
      avatar: "h-10 w-10",
      star: "h-4 w-4",
      icon: "h-4 w-4"
    },
    lg: {
      text: "text-base",
      title: "text-lg font-bold",
      comment: "text-base",
      avatar: "h-12 w-12",
      star: "h-5 w-5",
      icon: "h-5 w-5"
    }
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(review);
    }
  };

  const handleHelpfulVote = (helpful: boolean) => {
    if (onHelpfulVote) {
      onHelpfulVote(review.id, helpful);
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
        <CardHeader className={currentVariant.header}>
          <div className="flex items-start gap-3">
            <div className={cn("bg-gray-200 rounded-full", currentSize.avatar)} />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </CardHeader>
        <CardContent className={currentVariant.content}>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group transition-all duration-300",
        currentVariant.card,
        hover && "hover:shadow-md hover:border-gray-300",
        animate && "animate-in fade-in slide-in-from-bottom-4",
        className
      )}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`
      }}
      hover={hover}
      interactive={!!onClick}
      onClick={handleClick}
      {...props}
    >
      <CardHeader className={currentVariant.header}>
        <div className={cn(
          "flex items-start gap-3",
          isRTL && "flex-row-reverse"
        )}>
          {/* Author Avatar */}
          <Avatar className={currentSize.avatar}>
            <AvatarImage src={review.author_avatar} alt={authorName} />
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {authorInitials || <User className={currentSize.icon} />}
            </AvatarFallback>
          </Avatar>

          {/* Review Header Info */}
          <div className={cn(
            "flex-1 min-w-0",
            isRTL && "text-right"
          )}>
            {/* Author Name and Verification */}
            <div className={cn(
              "flex items-center gap-2 mb-1",
              isRTL && "flex-row-reverse"
            )}>
              <h4 className={cn(
                "font-medium text-gray-900 truncate",
                currentSize.text
              )}>
                {authorName}
              </h4>
              {review.verified_purchase && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Shield className="h-3 w-3 mr-1" />
                  {t("verified") || "Verified"}
                </Badge>
              )}
            </div>

            {/* Rating Stars */}
            <div className={cn(
              "flex items-center gap-2 mb-1",
              isRTL && "flex-row-reverse"
            )}>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      currentSize.star,
                      i < rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className={cn(
                "text-gray-600 font-medium",
                currentSize.text
              )}>
                {rating}/5
              </span>
            </div>

            {/* Date and Product */}
            <div className={cn(
              "flex items-center gap-2 text-gray-500",
              currentSize.text,
              isRTL && "flex-row-reverse"
            )}>
              <Calendar className={currentSize.icon} />
              <span>{formattedDate}</span>
              {showProduct && review.product_name && (
                <>
                  <span>•</span>
                  <span className="truncate">{review.product_name}</span>
                </>
              )}
            </div>
          </div>

          {/* Recommendation Badge */}
          {review.recommended !== undefined && (
            <div className="flex-shrink-0">
              <Badge 
                className={cn(
                  review.recommended
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                )}
              >
                {review.recommended ? t("recommended") || "Recommended" : t("not_recommended") || "Not Recommended"}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={currentVariant.content}>
        <div className="space-y-4">
          {/* Review Title */}
          {title && (
            <h5 className={cn(
              "font-semibold text-gray-900",
              currentSize.title,
              isRTL && "text-right"
            )}>
              {title}
            </h5>
          )}

          {/* Review Comment */}
          <p className={cn(
            "text-gray-700 leading-relaxed",
            variant === "compact" ? "line-clamp-3" : "line-clamp-none",
            currentSize.comment,
            isRTL && "text-right"
          )}>
            {comment}
          </p>

          {/* Pros and Cons */}
          {showProsAndCons && (review.pros?.length || review.cons?.length) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {review.pros?.length && (
                <div>
                  <h6 className={cn(
                    "font-medium text-green-700 mb-2",
                    currentSize.text
                  )}>
                    {t("pros") || "Pros"}
                  </h6>
                  <ul className="space-y-1">
                    {review.pros.map((pro, index) => (
                      <li key={index} className={cn(
                        "text-gray-600 flex items-start gap-2",
                        currentSize.text,
                        isRTL && "flex-row-reverse text-right"
                      )}>
                        <span className="text-green-500 mt-0.5">+</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {review.cons?.length && (
                <div>
                  <h6 className={cn(
                    "font-medium text-red-700 mb-2",
                    currentSize.text
                  )}>
                    {t("cons") || "Cons"}
                  </h6>
                  <ul className="space-y-1">
                    {review.cons.map((con, index) => (
                      <li key={index} className={cn(
                        "text-gray-600 flex items-start gap-2",
                        currentSize.text,
                        isRTL && "flex-row-reverse text-right"
                      )}>
                        <span className="text-red-500 mt-0.5">-</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Review Images */}
          {showImages && review.images?.length && (
            <div className="flex gap-2 overflow-x-auto">
              {review.images.map((image, index) => (
                <div key={index} className="flex-shrink-0">
                  <img
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Helpful Votes */}
          {showActions && (showHelpfulVotes || onHelpfulVote) && (
            <div className={cn(
              "flex items-center justify-between pt-3 border-t border-gray-100",
              isRTL && "flex-row-reverse"
            )}>
              {showHelpfulVotes && (
                <div className={cn(
                  "flex items-center gap-2 text-gray-500",
                  currentSize.text,
                  isRTL && "flex-row-reverse"
                )}>
                  <span>
                    {helpfulVotes} {t("of")} {totalVotes} {t("found_helpful") || "found this helpful"}
                  </span>
                </div>
              )}

              {onHelpfulVote && (
                <div className={cn(
                  "flex items-center gap-2",
                  isRTL && "flex-row-reverse"
                )}>
                  <span className={cn(
                    "text-gray-600",
                    currentSize.text
                  )}>
                    {t("was_this_helpful") || "Was this helpful?"}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpfulVote(true)}
                      className="h-8 px-2 hover:bg-green-50 hover:text-green-700"
                    >
                      <ThumbsUp className={currentSize.icon} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpfulVote(false)}
                      className="h-8 px-2 hover:bg-red-50 hover:text-red-700"
                    >
                      <ThumbsDown className={currentSize.icon} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

ReviewCard.displayName = "ReviewCard";

export default ReviewCard;
export { type ReviewCardProps };