"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CommonComponentProps, AnimationProps } from "@/types/component-props";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  CreditCard,
  MapPin,
  Eye,
  Download,
  RefreshCw,
  MessageSquare
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow, format } from "date-fns";

/**
 * Order status enum
 */
export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "cancelled" 
  | "refunded";

/**
 * Order item interface
 */
export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
  total: number;
  sku?: string;
}

/**
 * Order interface for type safety
 */
export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  currency?: string;
  created_at: string;
  updated_at?: string;
  estimated_delivery?: string;
  tracking_number?: string;
  payment_method?: string;
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: OrderItem[];
  items_count?: number;
  customer_name?: string;
  customer_email?: string;
  notes?: string;
}

/**
 * Enhanced OrderCard component props
 */
interface OrderCardProps extends CommonComponentProps, AnimationProps {
  /** Order data to display */
  order: Order;
  /** Card display variant */
  variant?: "default" | "compact" | "detailed" | "minimal";
  /** Card size */
  size?: "sm" | "md" | "lg";
  /** Whether to show order items */
  showItems?: boolean;
  /** Whether to show shipping address */
  showShippingAddress?: boolean;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Maximum number of items to display */
  maxItemsToShow?: number;
  /** Whether to show hover effects */
  hover?: boolean;
  /** Custom click handler */
  onClick?: (order: Order) => void;
  /** View order details handler */
  onViewDetails?: (orderId: number) => void;
  /** Track order handler */
  onTrackOrder?: (trackingNumber: string) => void;
  /** Reorder handler */
  onReorder?: (orderId: number) => void;
  /** Contact support handler */
  onContactSupport?: (orderId: number) => void;
  /** Download invoice handler */
  onDownloadInvoice?: (orderId: number) => void;
  /** Whether the card is in a loading state */
  loading?: boolean;
  /** Custom link href override */
  href?: string;
}

/**
 * OrderCard component for displaying order information
 * with status tracking and interactive features
 */
const OrderCard: React.FC<OrderCardProps> = ({
  order,
  variant = "default",
  size = "md",
  showItems = true,
  showShippingAddress = false,
  showActions = true,
  maxItemsToShow = 3,
  hover = true,
  onClick,
  onViewDetails,
  onTrackOrder,
  onReorder,
  onContactSupport,
  onDownloadInvoice,
  loading = false,
  href,
  className,
  animate = true,
  duration = 300,
  delay = 0,
  ...props
}) => {
  const { t, i18n } = useTranslation("orders");
  const isRTL = i18n.language === "ar";

  // Safe access to order properties
  const orderNumber = order.order_number || order.id.toString();
  const totalAmount = order.total_amount || 0;
  const currency = order.currency || "USD";
  const itemsCount = order.items_count || order.items?.length || 0;
  const orderDate = new Date(order.created_at);
  const estimatedDelivery = order.estimated_delivery ? new Date(order.estimated_delivery) : null;
  
  // Format dates
  const formattedOrderDate = format(orderDate, "MMM dd, yyyy");
  const timeAgo = formatDistanceToNow(orderDate, { addSuffix: true });
  const formattedDeliveryDate = estimatedDelivery ? format(estimatedDelivery, "MMM dd, yyyy") : null;

  // Generate link href
  const linkHref = href || `/orders/${order.id}`;

  // Status configuration
  const statusConfig = {
    pending: {
      label: t("pending") || "Pending",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock
    },
    confirmed: {
      label: t("confirmed") || "Confirmed",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: CheckCircle
    },
    processing: {
      label: t("processing") || "Processing",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: Package
    },
    shipped: {
      label: t("shipped") || "Shipped",
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: Truck
    },
    delivered: {
      label: t("delivered") || "Delivered",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle
    },
    cancelled: {
      label: t("cancelled") || "Cancelled",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle
    },
    refunded: {
      label: t("refunded") || "Refunded",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: RefreshCw
    }
  };

  const currentStatus = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  // Variant-based styling
  const variantStyles = {
    default: {
      card: "bg-white border border-gray-200",
      header: "pb-4",
      content: "py-0",
      footer: "pt-4"
    },
    compact: {
      card: "bg-gray-50 border border-gray-100",
      header: "pb-3",
      content: "py-0",
      footer: "pt-3"
    },
    detailed: {
      card: "bg-white border border-gray-200 shadow-sm",
      header: "pb-6",
      content: "py-0",
      footer: "pt-6"
    },
    minimal: {
      card: "bg-transparent border-0",
      header: "pb-2",
      content: "py-0",
      footer: "pt-2"
    }
  };

  // Size-based styling
  const sizeStyles = {
    sm: {
      text: "text-xs",
      title: "text-sm font-medium",
      amount: "text-lg font-bold",
      icon: "h-3 w-3",
      image: "h-8 w-8"
    },
    md: {
      text: "text-sm",
      title: "text-base font-semibold",
      amount: "text-xl font-bold",
      icon: "h-4 w-4",
      image: "h-10 w-10"
    },
    lg: {
      text: "text-base",
      title: "text-lg font-bold",
      amount: "text-2xl font-bold",
      icon: "h-5 w-5",
      image: "h-12 w-12"
    }
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(order);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(order.id);
    }
  };

  const handleTrackOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTrackOrder && order.tracking_number) {
      onTrackOrder(order.tracking_number);
    }
  };

  const handleReorder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onReorder) {
      onReorder(order.id);
    }
  };

  const handleContactSupport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContactSupport) {
      onContactSupport(order.id);
    }
  };

  const handleDownloadInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDownloadInvoice) {
      onDownloadInvoice(order.id);
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
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-20" />
          </div>
        </CardHeader>
        <CardContent className={currentVariant.content}>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
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
        hover && "hover:shadow-lg hover:border-gray-300",
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
          "flex items-start justify-between",
          isRTL && "flex-row-reverse"
        )}>
          {/* Order Info */}
          <div className={cn(
            "flex-1 min-w-0",
            isRTL && "text-right"
          )}>
            {/* Order Number and Date */}
            <div className="space-y-1">
              <h3 className={cn(
                "text-gray-900 truncate",
                currentSize.title
              )}>
                {t("order")} #{orderNumber}
              </h3>
              <div className={cn(
                "flex items-center gap-2 text-gray-500",
                currentSize.text,
                isRTL && "flex-row-reverse"
              )}>
                <Calendar className={currentSize.icon} />
                <span>{formattedOrderDate}</span>
                <span>•</span>
                <span>{timeAgo}</span>
              </div>
            </div>

            {/* Order Amount */}
            <div className={cn(
              "mt-2 text-gray-900",
              currentSize.amount
            )}>
              {currency} {totalAmount.toFixed(2)}
            </div>

            {/* Items Count */}
            <div className={cn(
              "flex items-center gap-2 mt-1 text-gray-600",
              currentSize.text,
              isRTL && "flex-row-reverse"
            )}>
              <Package className={currentSize.icon} />
              <span>
                {itemsCount} {itemsCount === 1 ? t("item") || "item" : t("items") || "items"}
              </span>
            </div>
          </div>

          {/* Order Status */}
          <div className="flex-shrink-0">
            <Badge className={cn(
              "flex items-center gap-1",
              currentStatus.color
            )}>
              <StatusIcon className={currentSize.icon} />
              {currentStatus.label}
            </Badge>
          </div>
        </div>

        {/* Tracking and Delivery Info */}
        {(order.tracking_number || estimatedDelivery) && (
          <div className={cn(
            "mt-4 space-y-2",
            isRTL && "text-right"
          )}>
            {order.tracking_number && (
              <div className={cn(
                "flex items-center gap-2 text-gray-600",
                currentSize.text,
                isRTL && "flex-row-reverse"
              )}>
                <Truck className={currentSize.icon} />
                <span>{t("tracking")}: {order.tracking_number}</span>
              </div>
            )}
            {estimatedDelivery && (
              <div className={cn(
                "flex items-center gap-2 text-gray-600",
                currentSize.text,
                isRTL && "flex-row-reverse"
              )}>
                <Clock className={currentSize.icon} />
                <span>{t("estimated_delivery")}: {formattedDeliveryDate}</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      {/* Order Items */}
      {showItems && order.items?.length > 0 && (
        <CardContent className={currentVariant.content}>
          <Separator className="mb-4" />
          <div className="space-y-3">
            <h4 className={cn(
              "font-medium text-gray-900",
              currentSize.text,
              isRTL && "text-right"
            )}>
              {t("order_items") || "Order Items"}
            </h4>
            <div className="space-y-2">
              {order.items.slice(0, maxItemsToShow).map((item) => (
                <div key={item.id} className={cn(
                  "flex items-center gap-3",
                  isRTL && "flex-row-reverse"
                )}>
                  {/* Product Image */}
                  <div className={cn(
                    "relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0",
                    currentSize.image
                  )}>
                    <Image
                      src={item.product_image || "/placeholder-product.jpg"}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>

                  {/* Product Info */}
                  <div className={cn(
                    "flex-1 min-w-0",
                    isRTL && "text-right"
                  )}>
                    <p className={cn(
                      "font-medium text-gray-900 truncate",
                      currentSize.text
                    )}>
                      {item.product_name}
                    </p>
                    <p className={cn(
                      "text-gray-500",
                      currentSize.text
                    )}>
                      {t("qty")}: {item.quantity} × {currency} {item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Item Total */}
                  <div className={cn(
                    "font-medium text-gray-900",
                    currentSize.text
                  )}>
                    {currency} {item.total.toFixed(2)}
                  </div>
                </div>
              ))}
              
              {/* Show more items indicator */}
              {order.items.length > maxItemsToShow && (
                <div className={cn(
                  "text-center py-2 text-gray-500",
                  currentSize.text
                )}>
                  +{order.items.length - maxItemsToShow} {t("more_items") || "more items"}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}

      {/* Shipping Address */}
      {showShippingAddress && order.shipping_address && (
        <CardContent className={currentVariant.content}>
          <Separator className="mb-4" />
          <div className="space-y-2">
            <h4 className={cn(
              "font-medium text-gray-900 flex items-center gap-2",
              currentSize.text,
              isRTL && "flex-row-reverse text-right"
            )}>
              <MapPin className={currentSize.icon} />
              {t("shipping_address") || "Shipping Address"}
            </h4>
            <div className={cn(
              "text-gray-600",
              currentSize.text,
              isRTL && "text-right"
            )}>
              <p>{order.shipping_address.street}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
              </p>
              <p>{order.shipping_address.country}</p>
            </div>
          </div>
        </CardContent>
      )}

      {/* Action Buttons */}
      {showActions && (
        <CardFooter className={currentVariant.footer}>
          <div className={cn(
            "flex flex-wrap gap-2 w-full",
            isRTL && "flex-row-reverse"
          )}>
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
                className="flex items-center gap-2"
              >
                <Eye className={currentSize.icon} />
                {t("view_details") || "View Details"}
              </Button>
            )}
            
            {onTrackOrder && order.tracking_number && order.status === "shipped" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTrackOrder}
                className="flex items-center gap-2"
              >
                <Truck className={currentSize.icon} />
                {t("track_order") || "Track Order"}
              </Button>
            )}
            
            {onReorder && order.status === "delivered" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReorder}
                className="flex items-center gap-2"
              >
                <RefreshCw className={currentSize.icon} />
                {t("reorder") || "Reorder"}
              </Button>
            )}
            
            {onDownloadInvoice && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2"
              >
                <Download className={currentSize.icon} />
                {t("invoice") || "Invoice"}
              </Button>
            )}
            
            {onContactSupport && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleContactSupport}
                className="flex items-center gap-2"
              >
                <MessageSquare className={currentSize.icon} />
                {t("support") || "Support"}
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

OrderCard.displayName = "OrderCard";

export default OrderCard;
export { type OrderCardProps, type Order, type OrderItem, type OrderStatus };