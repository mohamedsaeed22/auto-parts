"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetProductsMutation } from "@/services/hooks";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Package,
  Star,
  Clock,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  Search,
  Flame,
  Award,
  Zap,
  Shield,
  CheckCircle,
  Globe,
  Car,
  Settings,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  SortAsc,
  SortDesc,
  DollarSign,
  Percent,
  Tag,
  Building2,
  FolderOpen,
  ShoppingCart,
  Heart,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      <p className="text-gray-600">Loading products...</p>
    </div>
  </div>
);

// Error Component
const ErrorMessage = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  </div>
);

// Hero Section Component
const HeroSection = ({
  isRTL,
  t,
}: {
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`text-center ${isRTL ? "text-right" : "text-left"}`}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Package className="h-8 w-8 text-green-200" />
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("hero.title") || "Premium Products"}
          </h1>
          <Award className="h-8 w-8 text-green-200" />
        </div>
        <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-6">
          {t("hero.subtitle") ||
            "Discover high-quality automotive parts and accessories for your vehicle"}
        </p>
        <div className="flex items-center justify-center gap-6 text-green-100">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>{t("hero.feature1") || "Quality Assured"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            <span>{t("hero.feature2") || "Premium Parts"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <span>{t("hero.feature3") || "Global Brands"}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Search Bar Component
const SearchBar = ({
  isRTL,
  t,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}: {
  isRTL: boolean;
  t: (key: string) => string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}) => (
  <div className="bg-white border-b border-gray-200 py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={
                t("searchPlaceholder") ||
                "Search for products, parts, brands..."
              }
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSearchSubmit()}
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                isRTL ? "text-right" : "text-left"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            onClick={onSearchSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
          >
            {t("search") || "Search"}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Filter Sidebar Component
const FilterSidebar = ({
  isRTL,
  t,
  filters,
  onFilterChange,
  isOpen,
  onToggle,
}: {
  isRTL: boolean;
  t: (key: string) => string;
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="lg:hidden">
    <Button
      onClick={onToggle}
      variant="outline"
      className="w-full mb-4 flex items-center justify-between"
    >
      <span className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        {t("filters") || "Filters"}
      </span>
      {isOpen ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
  </div>
);

// Filter Panel Component
const FilterPanel = ({
  isRTL,
  t,
  filters,
  onFilterChange,
  onClearFilters,
}: {
  isRTL: boolean;
  t: (key: string) => string;
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
    <div
      className={`flex items-center justify-between mb-4 ${
        isRTL ? "flex-row-reverse" : ""
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Filter className="h-5 w-5" />
        {t("filters") || "Filters"}
      </h3>
      <Button
        onClick={onClearFilters}
        variant="outline"
        size="sm"
        className="text-gray-600 hover:text-gray-900"
      >
        {t("clearAll") || "Clear All"}
      </Button>
    </div>

    <div className="space-y-6">
      {/* Categories Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          {t("categories") || "Categories"}
        </h4>
        <div className="space-y-2">
          {[
            "Primary Category 1",
            "Primary Category 2",
            "Primary Category 3",
          ].map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onFilterChange("categories", [
                      ...filters.categories,
                      category,
                    ]);
                  } else {
                    onFilterChange(
                      "categories",
                      filters.categories.filter((c: string) => c !== category)
                    );
                  }
                }}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {t("brands") || "Brands"}
        </h4>
        <div className="space-y-2">
          {["Brand 1", "Brand 2", "Brand 3", "Brand 4"].map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onFilterChange("brands", [...filters.brands, brand]);
                  } else {
                    onFilterChange(
                      "brands",
                      filters.brands.filter((b: string) => b !== brand)
                    );
                  }
                }}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          {t("priceRange") || "Price Range"}
        </h4>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 items-center">
            <input
              type="number"
              placeholder={t("minPrice") || "Min"}
              value={filters.minPrice}
              onChange={(e) => onFilterChange("minPrice", e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="text-gray-500 text-center text-sm">-</span>
            <input
              type="number"
              placeholder={t("maxPrice") || "Max"}
              value={filters.maxPrice}
              onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Discount Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Percent className="h-4 w-4" />
          {t("discount") || "Discount"}
        </h4>
        <div className="space-y-2">
          {[
            { label: "10% or more", value: "10" },
            { label: "20% or more", value: "20" },
            { label: "30% or more", value: "30" },
            { label: "50% or more", value: "50" },
          ].map((discount) => (
            <label
              key={discount.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="discount"
                value={discount.value}
                checked={filters.discount === discount.value}
                onChange={(e) => onFilterChange("discount", e.target.value)}
                className="border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{discount.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Package className="h-4 w-4" />
          {t("availability") || "Availability"}
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => onFilterChange("inStock", e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">
              {t("inStock") || "In Stock"}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onSale}
              onChange={(e) => onFilterChange("onSale", e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">
              {t("onSale") || "On Sale"}
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

// Sort Options Component
const SortOptions = ({
  isRTL,
  t,
  sortBy,
  onSortChange,
}: {
  isRTL: boolean;
  t: (key: string) => string;
  sortBy: string;
  onSortChange: (value: string) => void;
}) => (
  <div className="flex items-center gap-4 mb-6">
    <span className="text-sm font-medium text-gray-700">
      {t("sortBy") || "Sort by"}:
    </span>
    <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value)}
      className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <option value="newest">{t("newest") || "Newest"}</option>
      <option value="price-low">
        {t("priceLowToHigh") || "Price: Low to High"}
      </option>
      <option value="price-high">
        {t("priceHighToLow") || "Price: High to Low"}
      </option>
      <option value="name-asc">{t("nameAZ") || "Name: A-Z"}</option>
      <option value="name-desc">{t("nameZA") || "Name: Z-A"}</option>
      <option value="popularity">{t("popularity") || "Popularity"}</option>
    </select>
  </div>
);

// View Mode Toggle Component
const ViewModeToggle = ({
  isRTL,
  t,
  viewMode,
  onViewModeChange,
}: {
  isRTL: boolean;
  t: (key: string) => string;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-gray-700">
      {t("viewMode") || "View Mode"}:
    </span>
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange("grid")}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "grid"
            ? "bg-white text-green-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <Grid3X3 size={18} />
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "list"
            ? "bg-white text-green-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <List size={18} />
      </button>
    </div>
  </div>
);

export default function ProductsPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation("products");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    minPrice: "",
    maxPrice: "",
    discount: "",
    inStock: false,
    onSale: false,
  });

  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  // Scroll to top when component mounts
  useScrollToTop();

  // API Hooks
  const [getProducts, { data: productsResponse, isLoading, error }] =
    useGetProductsMutation();

  const products = productsResponse?.data?.items || [];

  // Load products on component mount
  React.useEffect(() => {
    getProducts({});
  }, [getProducts]);

  const handleGoBack = () => {
    router.back();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = () => {
    // TODO: Implement search logic
    console.log("Searching for:", searchQuery);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      minPrice: "",
      maxPrice: "",
      discount: "",
      inStock: false,
      onSale: false,
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // TODO: Implement sort logic
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div dir={direction}>
        <HeroSection isRTL={isRTL} t={t} />
        <SearchBar
          isRTL={isRTL}
          t={t}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    let errorMessage = "Failed to load products";
    if ("status" in error) {
      errorMessage = `Error ${error.status}: Failed to load products`;
    } else if ("message" in error) {
      errorMessage = error.message || errorMessage;
    }

    return (
      <div dir={direction}>
        <HeroSection isRTL={isRTL} t={t} />
        <SearchBar
          isRTL={isRTL}
          t={t}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage
            message={errorMessage}
            onRetry={() => getProducts({})}
          />
        </div>
      </div>
    );
  }

  return (
    <div dir={direction}>
      {/* Hero Section */}
      <HeroSection isRTL={isRTL} t={t} />

      {/* Search Bar */}
      <SearchBar
        isRTL={isRTL}
        t={t}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav
          className={`flex items-center gap-2 text-sm text-gray-500 mb-8 ${
            isRTL ? "flex-row" : ""
          }`}
        >
          <button
            onClick={handleGoBack}
            className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {isRTL ? (
              <>
                <span>{t("backButton") || "Back"}</span>
                <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
              </>
            ) : (
              <>
                <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
                <span>{t("backButton") || "Back"}</span>
              </>
            )}
          </button>
          <span>/</span>
          <span className="text-gray-900">{t("products") || "Products"}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              isRTL={isRTL}
              t={t}
              filters={filters}
              onFilterChange={handleFilterChange}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
            />

            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <FilterPanel
                isRTL={isRTL}
                t={t}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Mobile Filters */}
            {isFilterOpen && (
              <div className="lg:hidden">
                <FilterPanel
                  isRTL={isRTL}
                  t={t}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Sort and View Controls */}
            <div
              className={`flex items-center justify-between mb-6 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <SortOptions
                isRTL={isRTL}
                t={t}
                sortBy={sortBy}
                onSortChange={handleSortChange}
              />
              <ViewModeToggle
                isRTL={isRTL}
                t={t}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>

            {/* Products Count */}
            <div className={`mb-6 ${isRTL ? "text-right" : "text-left"}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("foundProducts") || "Found Products"}
              </h2>
              <p className="text-gray-600">
                {t("productsCount") || `${products.length} products available`}
              </p>
            </div>

            {/* Products Grid/List */}
            {products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {t("noProducts") || "No products found"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t("noProductsDesc") ||
                    "Try adjusting your search or filter criteria."}
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  {t("clearFilters") || "Clear Filters"}
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {products.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      final_price: product.final_price,
                      primary_image: product.primary_image,
                      description: product.description,
                      product_identifier: product.product_identifier,
                      discount_info: product.discount_info,
                      offer: product.offer,
                      brand: product.brand,
                      category: product.category,
                      discount_type: product.discount_type,
                      discount_amount: product.discount_amount,
                      images: product.images,
                      hover_text: product.hover_text,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="mt-12 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    {t("previous") || "Previous"}
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-500 text-white"
                    >
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    {t("next") || "Next"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
