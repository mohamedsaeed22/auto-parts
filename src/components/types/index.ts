/**
 * Common component types and interfaces for the auto-parts application
 * This file provides consistent TypeScript interfaces across all components
 */

import { LucideIcon } from "lucide-react";
import { ReactNode, HTMLAttributes, ButtonHTMLAttributes } from "react";

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Common UI component props
export interface UIComponentProps extends BaseComponentProps {
  variant?: string;
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
}

// Icon-related props
export interface IconProps {
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  iconSize?: number;
}

// Layout props
export interface LayoutProps {
  fullWidth?: boolean;
  centered?: boolean;
  direction?: "ltr" | "rtl";
}

// Form-related props
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

// Product-related types
export interface Product {
  id: number;
  name: string;
  price: string | number;
  final_price?: number;
  primary_image?: string;
  category?: {
    id: number;
    name: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  discount_type?: string;
  offer?: boolean;
  discount_info?: string;
  in_favourites?: boolean;
  in_wishlist?: boolean;
}

// Category-related types
export interface Category {
  id: number;
  name: string;
  image?: string;
  products_count?: number;
  description?: string;
}

// Brand-related types
export interface Brand {
  id: number;
  name: string;
  image?: string;
  products_count?: number;
  description?: string;
}

// Cart-related types
export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  brand?: string;
}

// User-related types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

// Address-related types
export interface Address {
  id: number;
  title: string;
  address: string;
  city: string;
  country: string;
  isDefault?: boolean;
}

// Notification types
export interface Notification {
  id: number;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
}

// Component state types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Theme and styling types
export interface ThemeProps {
  theme?: "light" | "dark" | "auto";
  colorScheme?: "blue" | "green" | "purple" | "orange";
}

// Responsive breakpoint types
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface ResponsiveProps {
  breakpoint?: Breakpoint;
  hideOn?: Breakpoint[];
  showOn?: Breakpoint[];
}

// Animation and transition types
export interface AnimationProps {
  animate?: boolean;
  duration?: number;
  delay?: number;
  easing?: "ease" | "ease-in" | "ease-out" | "ease-in-out";
}

// Accessibility props
export interface AccessibilityProps {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
}

// Event handler types
export interface EventHandlers {
  onClick?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

// Combined common props for most components
export interface CommonComponentProps 
  extends BaseComponentProps,
    LayoutProps,
    AccessibilityProps,
    EventHandlers {
  id?: string;
  testId?: string;
}

// Enhanced button props (extending the existing ButtonProps)
export interface EnhancedButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    UIComponentProps,
    IconProps,
    AnimationProps {
  asChild?: boolean;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

// Card component props
export interface CardProps extends CommonComponentProps {
  variant?: "default" | "elevated" | "outlined" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  interactive?: boolean;
}

// Modal/Dialog props
export interface ModalProps extends CommonComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  backdrop?: "blur" | "transparent" | "opaque";
}

// Toast notification props
export interface ToastProps extends CommonComponentProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

export interface FormFieldState {
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: number;
  brand?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "date" | "popularity";
  sortOrder?: "asc" | "desc";
}

// Pagination types
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

export default {
  // Export all types for easy importing
};