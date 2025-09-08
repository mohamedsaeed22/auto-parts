import { store } from "@/store";
import { clearCart, addMultipleToCart } from "@/store/slices/cartSlice";
import { selectCartItems } from "@/store/selectors/cartSelectors";
import { cartApi } from "./api/cartApi";
import type { CartItem } from "@/store/slices/cartSlice";
import { toast } from "react-hot-toast";

/**
 * Cart Synchronization Service
 * 
 * Handles cart synchronization between local storage and API
 * based on user authentication and registration status
 */
export class CartSyncService {
  /**
   * Sync local cart to API when user logs in with complete registration
   */
  static async syncLocalCartToAPI(): Promise<boolean> {
    try {
      const state = store.getState();
      const localCartItems = selectCartItems(state);
      
      if (localCartItems.length === 0) {
        return true; // Nothing to sync
      }

      const product_ids = localCartItems.map(item => item.id);
      const quantities = localCartItems.map(item => item.quantity);
      
      // Use the add-many endpoint to sync all items at once
      const response = await store.dispatch(
        cartApi.endpoints.addManyToCart.initiate({
          product_ids,
          quantities,
        })
      ).unwrap();
      
      if (response.code === 200) {
        // Clear local cart after successful sync
        store.dispatch(clearCart());
        toast.success("Cart synced successfully");
        return true;
      } else {
        throw new Error(response.message || "Failed to sync cart");
      }
    } catch (error) {
      console.error("Failed to sync local cart to API:", error);
      toast.error("Failed to sync cart");
      return false;
    }
  }

  /**
   * Sync API cart to local storage when user logs in but registration incomplete
   */
  static async syncAPICartToLocal(): Promise<boolean> {
    try {
      // Get cart from API
      const response = await store.dispatch(
        cartApi.endpoints.getCart.initiate()
      ).unwrap();
      
      // Clear local cart first to avoid quantity conflicts
      store.dispatch(clearCart());
      
      if (response.code === 200 && response.data?.cart_items) {
        const cartItems: CartItem[] = response.data.cart_items.map(item => ({
          id: item.product.id,
          title: item.product.name,
          price: Number(item.product.final_price) || Number(item.product.price) || 0,
          image: item.product.primary_image || "",
          quantity: item.quantity,
          category: item.product.category?.name || "Unknown Category",
          description: item.product.description || "",
        }));

        // Add items to local cart (now empty, so no conflicts)
        store.dispatch(addMultipleToCart(cartItems));
        return true;
      }
      
      return true; // Empty cart is also a success
    } catch (error) {
      console.error("Failed to sync API cart to local:", error);
      // Don't show error to user as this is a background operation
      return false;
    }
  }

  /**
   * Handle cart synchronization on login
   * 
   * @param isRegistrationComplete - Whether user has completed registration
   */
  static async handleLoginSync(isRegistrationComplete: boolean): Promise<void> {
    const state = store.getState();
    const localCartItems = selectCartItems(state);
    const hasLocalItems = localCartItems.length > 0;

    if (isRegistrationComplete) {
      // User has completed registration - sync everything to API
      if (hasLocalItems) {
        // Sync local cart to API
        await this.syncLocalCartToAPI();
      } else {
        // No local items, sync API cart to local for immediate UI update
        await this.syncAPICartToLocal();
      }
    } else {
      // User hasn't completed registration - sync API cart to local storage
      await this.syncAPICartToLocal();
    }
  }

  /**
   * Handle cart synchronization when registration is completed
   */
  static async handleRegistrationComplete(): Promise<void> {
    // When registration is completed, sync local cart to API
    await this.syncLocalCartToAPI();
  }

  /**
   * Merge local and API carts (advanced scenario)
   * This handles cases where user has items in both local storage and API
   */
  static async mergeLocalAndAPICart(): Promise<boolean> {
    try {
      const state = store.getState();
      const localCartItems = selectCartItems(state);
      
      if (localCartItems.length === 0) {
        // No local items, just sync API to local
        return await this.syncAPICartToLocal();
      }

      // Get API cart
      const response = await store.dispatch(
        cartApi.endpoints.getCart.initiate()
      ).unwrap();
      
      if (response.code === 200 && response.data?.cart_items) {
        const apiCartItems = response.data.cart_items;
        
        // Create a map of API items for easy lookup
        const apiItemsMap = new Map(
          apiCartItems.map(item => [item.product.id, item.quantity])
        );
        
        // Prepare items for bulk add/update
        const product_ids: number[] = [];
        const quantities: number[] = [];
        
        // Process local items
        localCartItems.forEach(localItem => {
          const apiQuantity = apiItemsMap.get(localItem.id) || 0;
          const totalQuantity = localItem.quantity + apiQuantity;
          
          product_ids.push(localItem.id);
          quantities.push(totalQuantity);
        });
        
        // Add API items that are not in local cart
        apiCartItems.forEach(apiItem => {
          const hasLocalItem = localCartItems.some(local => local.id === apiItem.product.id);
          if (!hasLocalItem) {
            product_ids.push(apiItem.product.id);
            quantities.push(apiItem.quantity);
          }
        });
        
        // Clear API cart first
        await store.dispatch(
          cartApi.endpoints.clearCart.initiate()
        ).unwrap();
        
        // Add merged items
        await store.dispatch(
          cartApi.endpoints.addManyToCart.initiate({
            product_ids,
            quantities,
          })
        ).unwrap();
        
        // Clear local cart
        store.dispatch(clearCart());
        
        toast.success("Carts merged successfully");
        return true;
      }
      
      // No API items, just sync local to API
      return await this.syncLocalCartToAPI();
    } catch (error) {
      console.error("Failed to merge carts:", error);
      toast.error("Failed to merge carts");
      return false;
    }
  }

  /**
   * Clear all cart data (both local and API)
   */
  static async clearAllCarts(): Promise<void> {
    try {
      // Clear local cart
      store.dispatch(clearCart());
      
      // Clear API cart if user is authenticated
      await store.dispatch(
        cartApi.endpoints.clearCart.initiate()
      ).unwrap();
    } catch (error) {
      console.error("Failed to clear carts:", error);
      // Still clear local cart even if API fails
      store.dispatch(clearCart());
    }
  }
}