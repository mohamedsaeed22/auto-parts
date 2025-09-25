import { Product } from "@/services/api/types";

/**
 * Validates if adding/updating a product quantity would exceed available stock
 */
export const validateStock = (
  product: Product,
  requestedQuantity: number,
  currentCartQuantity: number = 0
): {
  isValid: boolean;
  availableStock: number;
  maxCanAdd: number;
  errorMessage?: string;
} => {
  const availableStock = product.stock || 0;
  const maxCanAdd = Math.max(0, availableStock - currentCartQuantity);
  
  // If no stock information is available, allow the operation
  if (availableStock === 0 && product.stock === undefined) {
    return {
      isValid: true,
      availableStock: 0,
      maxCanAdd: requestedQuantity,
    };
  }

  // Check if requested quantity exceeds available stock
  if (currentCartQuantity + requestedQuantity > availableStock) {
    return {
      isValid: false,
      availableStock,
      maxCanAdd,
      errorMessage: `Cannot add more. Available stock: ${availableStock}. You already have ${currentCartQuantity} in your cart.`,
    };
  }

  return {
    isValid: true,
    availableStock,
    maxCanAdd,
  };
};

/**
 * Validates if updating to a specific quantity would exceed available stock
 */
export const validateStockForUpdate = (
  product: Product,
  newQuantity: number
): {
  isValid: boolean;
  availableStock: number;
  errorMessage?: string;
} => {
  const availableStock = product.stock || 0;
  
  // If no stock information is available, allow the operation
  if (availableStock === 0 && product.stock === undefined) {
    return {
      isValid: true,
      availableStock: 0,
    };
  }

  if (newQuantity > availableStock) {
    return {
      isValid: false,
      availableStock,
      errorMessage: `Cannot set quantity to ${newQuantity}. Only ${availableStock} items available in stock.`,
    };
  }

  return {
    isValid: true,
    availableStock,
  };
};

/**
 * Gets the maximum quantity that can be added to cart for a product
 */
export const getMaxAddableQuantity = (
  product: Product,
  currentCartQuantity: number = 0
): number => {
  const availableStock = product.stock || 0;
  
  // If no stock information is available, return a reasonable default
  if (availableStock === 0 && product.stock === undefined) {
    return 999; // Default max quantity when stock is unknown
  }

  return Math.max(0, availableStock - currentCartQuantity);
};

/**
 * Checks if a product is out of stock
 */
export const isOutOfStock = (product: Product): boolean => {
  const stock = product.stock;
  
  // If stock is undefined, assume it's available
  if (stock === undefined) {
    return false;
  }
  
  return stock <= 0;
};

/**
 * Checks if adding one more item would exceed stock
 */
export const canAddOneMore = (
  product: Product,
  currentCartQuantity: number = 0
): boolean => {
  const availableStock = product.stock || 0;
  
  // If no stock information is available, allow adding
  if (availableStock === 0 && product.stock === undefined) {
    return true;
  }

  return currentCartQuantity < availableStock;
};

/**
 * Gets stock status message for UI display
 */
export const getStockStatusMessage = (
  product: Product,
  currentCartQuantity: number = 0
): {
  message: string;
  type: 'success' | 'warning' | 'error';
} => {
  const availableStock = product.stock || 0;
  const remaining = availableStock - currentCartQuantity;

  // If no stock information is available
  if (availableStock === 0 && product.stock === undefined) {
    return {
      message: 'In Stock',
      type: 'success',
    };
  }

  if (remaining <= 0) {
    return {
      message: 'Out of Stock',
      type: 'error',
    };
  }

  if (remaining <= 5) {
    return {
      message: `Only ${remaining} left in stock`,
      type: 'warning',
    };
  }

  if (remaining <= 10) {
    return {
      message: `${remaining} in stock`,
      type: 'warning',
    };
  }

  return {
    message: 'In Stock',
    type: 'success',
  };
};