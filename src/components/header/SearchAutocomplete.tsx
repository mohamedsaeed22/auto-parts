"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchProductsMutation } from "@/services/api/productsApi";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocale } from "@/hooks/useLocale";
import { Search, X } from "lucide-react";
import type { Product } from "@/services/api/types";

interface SearchAutocompleteProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  onSuggestionSelect?: (query: string) => void;
  isRTL: boolean;
  placeholder: string;
  isDesktop?: boolean;
  autoFocus?: boolean;
}

export default function SearchAutocomplete({
  searchQuery,
  setSearchQuery,
  onSubmit,
  onClear,
  onSuggestionSelect,
  isRTL,
  placeholder,
  isDesktop = false,
  autoFocus = false,
}: SearchAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { currentLocale } = useLocale();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchProducts] = useSearchProductsMutation();

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await searchProducts({
          name: debouncedSearchQuery.trim(),
        });
        if (result.data?.data?.items) {
          setSuggestions(result.data.data.items.slice(0, 5)); // Limit to 5 suggestions
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchQuery, searchProducts]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);

    if (value.trim().length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (product: Product) => {
    setShowSuggestions(false);
    setSuggestions([]);

    // Call the suggestion select callback if provided
    if (onSuggestionSelect) {
      onSuggestionSelect(product.name);
    }

    // Navigate to products page with search query
    router.push(
      `/${currentLocale}/products?search=${encodeURIComponent(product.name)}`
    );

    // Clear the search input after navigation
    setTimeout(() => {
      setSearchQuery("");
    }, 100);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        onSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          onSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear search and suggestions
  const handleClear = () => {
    setSearchQuery("");
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    onClear();
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={onSubmit} className="relative">
        <div className="relative">
          <Search
            className={`absolute top-1/2 transform -translate-y-1/2 text-neutral-400 ${
              isDesktop ? "w-5 h-5" : "w-4 h-4"
            } ${
              isRTL
                ? isDesktop
                  ? "right-4"
                  : "right-3"
                : isDesktop
                ? "left-4"
                : "left-3"
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            className={`w-full ${
              isDesktop
                ? isRTL
                  ? "pr-12 pl-12 text-right"
                  : "pl-12 pr-12 text-left"
                : isRTL
                ? "pr-10 pl-10 text-right"
                : "pl-10 pr-10 text-left"
            } ${
              isDesktop ? "py-3" : "py-3"
            } border-2 border-neutral-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
              isDesktop ? "bg-neutral-50 focus:bg-background" : ""
            } ${!isDesktop ? "rounded-lg border" : ""}`}
            autoFocus={autoFocus}
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className={`absolute top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 ${
                isRTL
                  ? isDesktop
                    ? "left-4"
                    : "left-3"
                  : isDesktop
                  ? "right-4"
                  : "right-3"
              }`}
            >
              <X className={isDesktop ? "w-4 h-4" : "w-4 h-4"} />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div
          className={`absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {isLoading ? (
            <div className="p-4 text-center text-neutral-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSuggestionClick(product)}
                  className={`w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors ${
                    index === selectedIndex ? "bg-neutral-50" : ""
                  } ${isRTL ? "text-right" : "text-left"}`}
                >
                  <div className="flex items-center gap-3">
                    {product.primary_image && (
                      <img
                        src={product.primary_image}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {product.category.name}
                        {product.brand && ` • ${product.brand.name}`}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      ${product.final_price}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : debouncedSearchQuery.trim().length >= 2 ? (
            <div className="p-4 text-center text-neutral-500">
              <p className="text-sm">
                No products found for "{debouncedSearchQuery}"
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
