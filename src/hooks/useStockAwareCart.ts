import { useCallback } from "react";
import { useEnhancedCart } from "./useEnhancedCart";
import { Product } from "@/services/api/types";
import { 
  validateStock, 
  validateStockForUpdate, 
  getMaxAddableQuantity, 
  isOutOfStock, 
  canAddOneMore,
  getStockStatusMessage 
} from "@/utils/stockValidation";
import { showError } from "@/lib/toast";
import { useTranslation } from "react-i18next";

/**
 * Enhanced cart hook with stock validation
 * This hook wraps the existing useEnhancedCart and adds stock validation logic
 */
export const useStockAwareCart = () => {
  const cart = useEnhancedCart();
  const { t } = useTranslation("cart");

  /**
   * Add item to cart with stock validation
   */
  const addToCartWithStock = useCallback(
    async (product: Product) => {
      const currentItem = cart.items.find(item => item.id === product.id);
      const currentQuantity = currentItem?.quantity || 0;

      // Validate stock
      const validation = validateStock(product, 1, currentQuantity);
      
      if (!validation.isValid) {
        showError(t("errors.stockExceeded", { stock: product.stock }));
        return false;
      }

      // Call the original addToCart function
      await cart.addToCart({
        id: product.id,
        title: product.name || "Product",
        price: Number(product.final_price) || Number(product.price) || 0,
        image: product.primary_image || "",
        category: product.category?.name || "Unknown Category",
        description: product.description || "",
        stock: product.stock,
      }, { stock: product.stock });

      return true;
    },
    [cart, t]
  );

  /**
   * Update cart item quantity with stock validation
   */
  const updateQuantityWithStock = useCallback(
    async (productId: number, newQuantity: number, product?: Product) => {
      if (!product) {
        // If no product info, fall back to original function
        await cart.updateQuantity(productId, newQuantity);
        return true;
      }

      // Validate stock for update
      const validation = validateStockForUpdate(product, newQuantity);
      
      if (!validation.isValid) {
        showError(t("errors.stockExceeded", { stock: product.stock }));
        return false;
      }

      // Call the original updateQuantity function
      await cart.updateQuantity(productId, newQuantity, product.stock);
      return true;
    },
    [cart, t]
  );

  /**
   * Increase quantity by 1 with stock validation
   */
  const increaseQuantityWithStock = useCallback(
    async (product: Product) => {
      const currentItem = cart.items.find(item => item.id === product.id);
      const currentQuantity = currentItem?.quantity || 0;
      
      return await updateQuantityWithStock(product.id, currentQuantity + 1, product);
    },
    [updateQuantityWithStock, cart.items]
  );

  /**
   * Decrease quantity by 1 (no stock validation needed for decrease)
   */
  const decreaseQuantityWithStock = useCallback(
    async (product: Product) => {
      const currentItem = cart.items.find(item => item.id === product.id);
      const currentQuantity = currentItem?.quantity || 0;
      
      if (currentQuantity <= 1) {
        // Remove from cart
        await cart.removeFromCart(product.id);
        return true;
      } else {
        // Decrease quantity
        await cart.updateQuantity(product.id, currentQuantity - 1, product.stock);
        return true;
      }
    },
    [cart]
  );

  /**
   * Check if product can be added to cart (not out of stock and not at max quantity)
   */
  const canAddToCart = useCallback(
    (product: Product): boolean => {
      if (isOutOfStock(product)) {
        return false;
      }

      const currentItem = cart.items.find(item => item.id === product.id);
      const currentQuantity = currentItem?.quantity || 0;
      
      // If already in cart, check if we can add one more
      if (currentQuantity > 0) {
        return typeof product.stock === 'number' ? currentQuantity < product.stock : true;
      }
      
      // If not in cart yet, check if stock is available
      return canAddOneMore(product, currentQuantity);
    },
    [cart.items]
  );

  /**
   * Check if quantity can be increased (current quantity < stock)
   */
  const canIncreaseQuantity = useCallback(
    (product: Product): boolean => {
      if (isOutOfStock(product)) {
        return false;
      }

      const currentItem = cart.items.find(item => item.id === product.id);
      const currentQuantity = currentItem?.quantity || 0;
      
      // Check if current quantity is already at or above stock limit
      if (typeof product.stock === 'number' && currentQuantity >= product.stock) {
        return false;
      }
      
      return canAddOneMore(product, currentQuantity);
    },
    [cart.items]
  );

  /**
   * Get maximum quantity that can be added to cart
   */
  const getMaxQuantity = useCallback(
    (product: Product): number => {
      const currentItem = cart.items.find(item => item.id === product.id);
      const currentQuantity = currentItem?.quantity || 0;
      
      return getMaxAddableQuantity(product, currentQuantity) + currentQuantity;
    },
    [cart.items]
  );

  /**
   * Get stock status for a product
   */
  const getProductStockStatus = useCallback(
    (product: Product) => {
      const currentItem = cart.items.find(item => item.id === product.id);
      const currentQuantity = currentItem?.quantity || 0;
      
      return getStockStatusMessage(product, currentQuantity);
    },
    [cart.items]
  );

  /**
   * Check if product is out of stock
   */
  const isProductOutOfStock = useCallback(
    (product: Product): boolean => {
      return isOutOfStock(product);
    },
    []
  );

  return {
    // Original cart functions and state
    ...cart,
    
    // Stock-aware functions (override the original ones)
    addToCart: addToCartWithStock,
    updateQuantity: updateQuantityWithStock,
    increaseQuantity: increaseQuantityWithStock,
    decreaseQuantity: decreaseQuantityWithStock,
    
    // Stock validation utilities
    canAddToCart,
    canIncreaseQuantity,
    getMaxQuantity,
    getProductStockStatus,
    isProductOutOfStock,
  };
};