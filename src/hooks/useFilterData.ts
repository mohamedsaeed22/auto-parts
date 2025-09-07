import { useGetCategoriesQuery, useGetBrandsQuery } from "@/services/hooks";
import { useMemo } from "react";
import type { Category, Brand } from "@/lib/types/filters";

export const useFilterData = () => {
  // Fetch categories
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();

  // Fetch brands
  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useGetBrandsQuery({
      per_page: 100, // Get all brands for filter
    });

  // Process categories data
  const categories = useMemo(() => {
    if (!categoriesResponse?.data?.categories) return [];

    return categoriesResponse.data.categories.map(
      (category: {
        id: number;
        name: string;
        level: number;
        parent?: { id: number; name: string };
      }) => ({
        id: category.id,
        name: category.name,
        level: category.level,
        parent: category.parent,
      })
    ) as Category[];
  }, [categoriesResponse]);

  // Process brands data
  const brands = useMemo(() => {
    if (!brandsResponse?.data?.items) return [];

    return brandsResponse.data.items.map(
      (brand: { id: number; name: string; image?: string }) => ({
        id: brand.id,
        name: brand.name,
        image: brand.image,
      })
    ) as Brand[];
  }, [brandsResponse]);

  // Get all subcategories (for advanced filtering)
  const allSubcategories = useMemo(() => {
    // Since Category interface doesn't have children, return empty array for now
    // This can be updated when the API provides hierarchical category data
    return [] as Category[];
  }, []);

  return {
    categories,
    brands,
    allSubcategories,
    isLoadingCategories,
    isLoadingBrands,
    isLoading: isLoadingCategories || isLoadingBrands,
  };
};
