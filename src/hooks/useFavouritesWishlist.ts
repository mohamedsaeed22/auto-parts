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

  const setLoading = (key: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: loading }));
  };

  const handleToggleFavourite = async (productId: number) => {
    const key = `favourite-${productId}`;
    setLoading(key, true);
    try {
      await toggleFavourite({ product_id: productId }).unwrap();
    } catch (error) {
      console.error("Failed to toggle favourite:", error);
    } finally {
      setLoading(key, false);
    }
  };

  const handleToggleWishlist = async (productId: number) => {
    const key = `wishlist-${productId}`;
    setLoading(key, true);
    try {
      await toggleWishlist({ product_id: productId }).unwrap();
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    } finally {
      setLoading(key, false);
    }
  };

  const handleAddFavourite = async (productId: number) => {
    const key = `favourite-${productId}`;
    setLoading(key, true);
    try {
      await addFavourite({ product_id: productId }).unwrap();
    } catch (error) {
      console.error("Failed to add favourite:", error);
    } finally {
      setLoading(key, false);
    }
  };

  const handleRemoveFavourite = async (productId: number) => {
    const key = `favourite-${productId}`;
    setLoading(key, true);
    try {
      await removeFavourite({ product_id: productId }).unwrap();
    } catch (error) {
      console.error("Failed to remove favourite:", error);
    } finally {
      setLoading(key, false);
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    const key = `wishlist-${productId}`;
    setLoading(key, true);
    try {
      await addToWishlist({ product_id: productId }).unwrap();
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    } finally {
      setLoading(key, false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    const key = `wishlist-${productId}`;
    setLoading(key, true);
    try {
      await removeFromWishlist({ product_id: productId }).unwrap();
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
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
