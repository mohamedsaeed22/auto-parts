import {
  useAddFavouriteMutation,
  useRemoveFavouriteMutation,
  useToggleFavouriteMutation,
} from "@/services/api/favouritesApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useToggleWishlistMutation,
} from "@/services/api/wishlistApi";
import { useState } from "react";
import { storage } from "@/lib/storage";
import { showError, showWarning } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { useTranslation } from "react-i18next";

export const useFavouritesWishlist = () => {
  const [addFavourite] = useAddFavouriteMutation();
  const [removeFavourite] = useRemoveFavouriteMutation();
  const [toggleFavourite] = useToggleFavouriteMutation();

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [toggleWishlist] = useToggleWishlistMutation();

  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const router = useRouter();
  const { currentLocale } = useLocale();
  const { t } = useTranslation("product");

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: loading }));
  };

  // Check authentication status only (registration not required)
  const checkAuthStatus = () => {
    const isAuthenticated = storage.isAuthenticated();
    return { isAuthenticated };
  };

  // Handle authentication check for favourites/wishlist actions
  const handleAuthCheck = () => {
    const { isAuthenticated } = checkAuthStatus();

    if (!isAuthenticated) {
      showError(t("auth.loginRequired"));
      return false;
    }

    return true;
  };

  const handleToggleFavourite = async (
    productId: number
  ): Promise<boolean | void> => {
    // Check authentication first
    if (!handleAuthCheck()) {
      return;
    }

    const key = `favourite-${productId}`;
    setLoading(key, true);
    try {
      const res = await toggleFavourite({ product_id: productId }).unwrap();
      const next = Boolean(res?.data?.is_favourited);
      // Broadcast update so other components can sync UI
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("productStateUpdated", {
            detail: { productId, in_favorites: next },
          })
        );
      }
      return next;
    } catch (error) {
      showError("Failed to update favourites. Please try again.");
    } finally {
      setLoading(key, false);
    }
  };

  const handleToggleWishlist = async (
    productId: number
  ): Promise<boolean | void> => {
    // Check authentication first
    if (!handleAuthCheck()) {
      return;
    }

    const key = `wishlist-${productId}`;
    setLoading(key, true);
    try {
      const res = await toggleWishlist({ product_id: productId }).unwrap();
      const next = Boolean(res?.data?.is_in_wishlist);
      // Broadcast update so other components can sync UI
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("productStateUpdated", {
            detail: { productId, in_wishlist: next },
          })
        );
      }
      return next;
    } catch (error) {
      showError("Failed to update wishlist. Please try again.");
    } finally {
      setLoading(key, false);
    }
  };

  const handleAddFavourite = async (productId: number) => {
    // Check authentication first
    if (!handleAuthCheck()) {
      return;
    }

    const key = `favourite-${productId}`;
    setLoading(key, true);
    try {
      await addFavourite({ product_id: productId }).unwrap();
    } catch (error) {
      showError("Failed to add to favourites. Please try again.");
    } finally {
      setLoading(key, false);
    }
  };

  const handleRemoveFavourite = async (productId: number) => {
    // Check authentication first
    if (!handleAuthCheck()) {
      return;
    }

    const key = `favourite-${productId}`;
    setLoading(key, true);
    try {
      await removeFavourite({ product_id: productId }).unwrap();
    } catch (error) {
      showError("Failed to remove from favourites. Please try again.");
    } finally {
      setLoading(key, false);
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    // Check authentication first
    if (!handleAuthCheck()) {
      return;
    }

    const key = `wishlist-${productId}`;
    setLoading(key, true);
    try {
      await addToWishlist({ product_id: productId }).unwrap();
    } catch (error) {
      showError("Failed to add to wishlist. Please try again.");
    } finally {
      setLoading(key, false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    // Check authentication first
    if (!handleAuthCheck()) {
      return;
    }

    const key = `wishlist-${productId}`;
    setLoading(key, true);
    try {
      await removeFromWishlist({ product_id: productId }).unwrap();
    } catch (error) {
      showError("Failed to remove from wishlist. Please try again.");
    } finally {
      setLoading(key, false);
    }
  };

  const isLoading = (key: string) => loadingStates[key] || false;

  return {
    handleToggleFavourite,
    handleToggleWishlist,
    handleAddFavourite,
    handleRemoveFavourite,
    handleAddToWishlist,
    handleRemoveFromWishlist,
    isLoading,
  };
};
