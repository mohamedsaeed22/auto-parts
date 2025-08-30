import { renderHook, act } from "@testing-library/react";
import { useProductFilters } from "./useProductFilters";

// Mock nuqs
jest.mock("nuqs", () => ({
  useQueryState: jest.fn((key: string, options: any) => {
    const mockState = {
      search: ["", jest.fn()],
      category_id: [null, jest.fn()],
      brand_id: [null, jest.fn()],
      min_price: ["", jest.fn()],
      max_price: ["", jest.fn()],
      description: ["", jest.fn()],
      sort_by: ["newest", jest.fn()],
      view_mode: ["grid", jest.fn()],
      page: [1, jest.fn()],
    };

    return mockState[key] || ["", jest.fn()];
  }),
}));

describe("useProductFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useProductFilters());

    expect(result.current.filters.search).toBe("");
    expect(result.current.filters.category_id).toBe(null);
    expect(result.current.filters.brand_id).toBe(null);
    expect(result.current.filters.sort_by).toBe("newest");
    expect(result.current.filters.view_mode).toBe("grid");
    expect(result.current.filters.page).toBe(1);
  });

  it("should update search filter", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.updateSearch("test search");
    });

    expect(result.current.apiFilters.search).toBe("test search");
  });

  it("should update category filter", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.updateCategory(123);
    });

    expect(result.current.apiFilters.category_id).toBe(123);
  });

  it("should update brand filter", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.updateBrand(456);
    });

    expect(result.current.apiFilters.brand_id).toBe(456);
  });

  it("should update price range", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.updatePriceRange("100", "500");
    });

    expect(result.current.apiFilters.min_price).toBe(100);
    expect(result.current.apiFilters.max_price).toBe(500);
  });

  it("should clear all filters", () => {
    const { result } = renderHook(() => useProductFilters());

    // Set some filters first
    act(() => {
      result.current.updateSearch("test");
      result.current.updateCategory(123);
    });

    // Clear all filters
    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.search).toBe("");
    expect(result.current.filters.category_id).toBe(null);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("should detect active filters", () => {
    const { result } = renderHook(() => useProductFilters());

    expect(result.current.hasActiveFilters).toBe(false);

    act(() => {
      result.current.updateSearch("test");
    });

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("should generate correct API filters", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.updateSearch("test");
      result.current.updateCategory(123);
      result.current.updatePriceRange("100", "500");
    });

    expect(result.current.apiFilters).toEqual({
      page: 1,
      per_page: 12,
      search: "test",
      category_id: 123,
      min_price: 100,
      max_price: 500,
    });
  });
});
