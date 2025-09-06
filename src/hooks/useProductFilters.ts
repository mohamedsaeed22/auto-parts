import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import type { ProductFilters, FilterState } from "@/lib/types/filters";

export const useProductFilters = () => {
  // URL state management with nuqs
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [categoryId, setCategoryId] = useQueryState("category_id", {
    defaultValue: null,
    parse: (value) => (value ? parseInt(value, 10) : null),
    serialize: (value) => value?.toString() || "",
  });
  const [brandId, setBrandId] = useQueryState("brand_id", {
    defaultValue: null,
    parse: (value) => (value ? parseInt(value, 10) : null),
    serialize: (value) => value?.toString() || "",
  });
  const [minPrice, setMinPrice] = useQueryState("min_price", {
    defaultValue: "",
  });
  const [maxPrice, setMaxPrice] = useQueryState("max_price", {
    defaultValue: "",
  });

  const [description, setDescription] = useQueryState("description", {
    defaultValue: "",
  });
  const [sortBy, setSortBy] = useQueryState("sort_by", {
    defaultValue: "newest",
  });
  const [viewMode, setViewMode] = useQueryState("view_mode", {
    defaultValue: "grid" as "grid" | "list",
  });
  const [page, setPage] = useQueryState("page", {
    defaultValue: 1,
    parse: (value) => parseInt(value, 10),
    serialize: (value) => value.toString(),
  });

  // Current filter state
  const filters: FilterState = useMemo(
    () => ({
      search: search || "",
      category_id: categoryId,
      brand_id: brandId,
      min_price: minPrice || "",
      max_price: maxPrice || "",
      description: description || "",
      sort_by: sortBy || "newest",
      view_mode: viewMode || "grid",
    }),
    [
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      description,
      sortBy,
      viewMode,
    ]
  );

  // API request filters (cleaned and converted)
  const apiFilters: ProductFilters = useMemo(() => {
    const apiFilters: ProductFilters = {
      page: page,
      per_page: 12, // Default items per page
    };

    // Add filters only if they have values
    if (search) apiFilters.search = search;
    if (categoryId) apiFilters.category_id = categoryId;
    if (brandId) apiFilters.brand_id = brandId;

    // Validate and add price filters
    if (minPrice && parseFloat(minPrice) >= 0) {
      apiFilters.min_price = parseFloat(minPrice);
    }
    if (maxPrice && parseFloat(maxPrice) >= 0) {
      apiFilters.max_price = parseFloat(maxPrice);
    }

    if (description) apiFilters.description = description;
    if (sortBy)
      apiFilters.sort_by = sortBy as
        | "price_asc"
        | "price_desc"
        | "newest"
        | "rating";

    return apiFilters;
  }, [
    search,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    description,
    sortBy,
    page,
  ]);

  // Filter update functions
  const updateSearch = useCallback(
    (value: string) => {
      setSearch(value || null);
      setPage(1); // Reset to first page when searching
    },
    [setSearch, setPage]
  );

  const updateCategory = useCallback(
    (value: number | null) => {
      setCategoryId(value);
      setPage(1);
    },
    [setCategoryId, setPage]
  );

  const updateBrand = useCallback(
    (value: number | null) => {
      setBrandId(value);
      setPage(1);
    },
    [setBrandId, setPage]
  );

  const updatePriceRange = useCallback(
    (min: string, max: string) => {
      setMinPrice(min || null);
      setMaxPrice(max || null);
      setPage(1);
    },
    [setMinPrice, setMaxPrice, setPage]
  );

  const updateDescription = useCallback(
    (value: string) => {
      setDescription(value || null);
      setPage(1);
    },
    [setDescription, setPage]
  );

  const updateSortBy = useCallback(
    (value: string) => {
      setSortBy(value as "price_asc" | "price_desc" | "newest" | "rating");
      setPage(1);
    },
    [setSortBy, setPage]
  );

  const updateViewMode = useCallback(
    (value: "grid" | "list") => {
      setViewMode(value);
    },
    [setViewMode]
  );

  const updatePage = useCallback(
    (value: number) => {
      setPage(value);
    },
    [setPage]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearch(null);
    setCategoryId(null);
    setBrandId(null);
    setMinPrice(null);
    setMaxPrice(null);
    setDescription(null);
    setSortBy("newest");
    setPage(1);
  }, [
    setSearch,
    setCategoryId,
    setBrandId,
    setMinPrice,
    setMaxPrice,
    setDescription,
    setSortBy,
    setPage,
  ]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      search ||
      categoryId ||
      brandId ||
      minPrice ||
      maxPrice ||
      description ||
      sortBy !== "newest"
    );
  }, [search, categoryId, brandId, minPrice, maxPrice, description, sortBy]);

  return {
    // State
    filters,
    apiFilters,
    hasActiveFilters,

    // Update functions
    updateSearch,
    updateCategory,
    updateBrand,
    updatePriceRange,
    updateDescription,
    updateSortBy,
    updateViewMode,
    updatePage,
    clearFilters,
  };
};
