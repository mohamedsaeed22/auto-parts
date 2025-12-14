export interface ProductFilters {
  // Search
  search?: string;

  // Categories
  category_id?: number;

  // Brands
  brand_id?: number;

  // Price range
  min_price?: number;
  max_price?: number;

  // Product details
  description?: string;

  // Pagination
  page?: number;
  per_page?: number;

  // Sorting
  sort_by?:
    | "newest"
    | "price-low"
    | "price-high"
    | "name-asc"
    | "name-desc"
    | "popularity";

  // View mode
  view_mode?: "grid" | "list";
}

export interface FilterState {
  search: string;
  category_id: number | null;
  brand_id: number | null;
  min_price: string;
  max_price: string;
  description: string;
  sort_by: string;
  view_mode: "grid" | "list";
}

export interface Category {
  id: number;
  name: string;
  level: number;
  parent?: {
    id: number;
    name: string;
  };
}

export interface Brand {
  id: number;
  name: string;
  image?: string;
}

export interface SortOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}
