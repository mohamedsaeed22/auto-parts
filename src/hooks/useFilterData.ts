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

    return categoriesResponse.data.categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      level: category.level,
      parent: category.parent,
      children: category.children || [],
    })) as Category[];
  }, [categoriesResponse]);

  // Process brands data
  const brands = useMemo(() => {
    if (!brandsResponse?.data?.items) return [];

    return brandsResponse.data.items.map((brand: any) => ({
      id: brand.id,
      name: brand.name,
      image: brand.image,
    })) as Brand[];
  }, [brandsResponse]);

  // Get all subcategories (for advanced filtering)
  const allSubcategories = useMemo(() => {
    const subcategories: Category[] = [];

    categories.forEach((category) => {
      if (category.children) {
        subcategories.push(...category.children);
      }
    });

    return subcategories;
  }, [categories]);

  return {
    categories,
    brands,
    allSubcategories,
    isLoadingCategories,
    isLoadingBrands,
    isLoading: isLoadingCategories || isLoadingBrands,
  };
};
