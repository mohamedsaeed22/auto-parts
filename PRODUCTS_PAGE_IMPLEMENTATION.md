# Products Page Search and Filtration Implementation

## Overview

This implementation provides a comprehensive search and filtration system for the products page with URL state management, debounced search, and high-performance filtering.

## Features

### 🔍 Search Functionality

- **Header Search Integration**: Search from header navigates to products page with query params
- **URL State Management**: Search queries are preserved in URL parameters
- **Search Results Display**: Shows search term and results count
- **Clear Search Option**: Easy way to clear search and return to all products

### 🎯 Advanced Filtering

- **Categories**: Filter by primary categories with radio button selection
- **Brands**: Filter by brands with radio button selection
- **Price Range**: Min/max price filtering
- **Product Name**: Text-based product name filtering
- **Product Identifier**: Filter by product SKU/identifier
- **Description**: Search within product descriptions

### 📱 Responsive Design

- **Mobile-Friendly**: Collapsible filter sidebar on mobile
- **Desktop Layout**: Sidebar filters on desktop
- **RTL Support**: Full right-to-left language support
- **Loading States**: Loading only shows on products list, not entire page

### 🔄 State Management

- **URL Persistence**: All filters are saved in URL parameters
- **Deep Linking**: Share filtered results via URL
- **Browser Navigation**: Back/forward buttons work with filters

## Technical Implementation

### Core Hooks

#### `useProductFilters`

Manages all filter state with URL synchronization using `nuqs`.

```typescript
const {
  filters, // Current filter state
  apiFilters, // Cleaned filters for API calls
  hasActiveFilters, // Boolean indicating if any filters are active
  updateSearch, // Update search query
  updateCategory, // Update category filter
  updateBrand, // Update brand filter
  updatePriceRange, // Update price range
  clearFilters, // Clear all filters
  // ... more methods
} = useProductFilters();
```

#### `useFilterData`

Fetches categories and brands for filter dropdowns.

```typescript
const {
  categories, // Available categories
  brands, // Available brands
  isLoading, // Loading state
} = useFilterData();
```

### API Integration

The implementation uses the existing `useGetProductsMutation` hook with the following request structure:

```typescript
interface ProductsRequest {
  search?: string;
  category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  name?: string;
  product_identifier?: string;
  description?: string;
  page?: number;
  per_page?: number;
}
```

### URL Parameters

The following URL parameters are managed:

- `search`: Search query
- `category_id`: Selected category ID
- `brand_id`: Selected brand ID
- `min_price`: Minimum price
- `max_price`: Maximum price
- `name`: Product name filter
- `product_identifier`: Product identifier filter
- `description`: Description keywords
- `sort_by`: Sort order
- `view_mode`: Grid or list view
- `page`: Current page number

## Usage Examples

### Basic Usage

```typescript
import { useProductFilters, useFilterData } from "@/hooks";

function ProductsPage() {
  const { filters, apiFilters, updateSearch, clearFilters } =
    useProductFilters();
  const { categories, brands } = useFilterData();

  // Search is automatically debounced and synced with URL
  const handleSearch = (query: string) => {
    updateSearch(query);
  };

  // Clear all filters
  const handleClearFilters = () => {
    clearFilters();
  };
}
```

### Custom Filter Implementation

```typescript
// Update category filter
const handleCategoryChange = (categoryId: number | null) => {
  updateCategory(categoryId);
};

// Update price range
const handlePriceRangeChange = (min: string, max: string) => {
  updatePriceRange(min, max);
};
```

## Pagination Component

The existing `Pagination` component is fully integrated and supports:

- **Server-side pagination**: Uses API pagination data
- **Page navigation**: First, previous, next, last buttons
- **Page numbers**: Configurable visible page count
- **Info display**: Shows current range and total items
- **Responsive design**: Works on all screen sizes

### Pagination Props

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}
```

## Performance Optimizations

1. **URL State Management**: Efficient state persistence without localStorage
2. **Memoized Filters**: Prevents unnecessary re-renders
3. **Lazy Loading**: Categories and brands loaded on demand
4. **Targeted Loading**: Loading state only shows on products list, not entire page
5. **Efficient Navigation**: Header search directly navigates to products page

## Internationalization

The implementation supports full i18n with:

- **RTL Layout**: Right-to-left language support
- **Translation Keys**: All text is translatable
- **Locale Detection**: Automatic language detection

## Error Handling

- **Loading States**: Proper loading indicators for all async operations
- **Error Boundaries**: Graceful error handling with retry options
- **Empty States**: Helpful messages when no products are found
- **Network Errors**: User-friendly error messages

## Testing

The implementation includes comprehensive tests for:

- **Pagination Component**: All pagination functionality
- **Filter Logic**: Filter state management
- **URL Synchronization**: URL parameter handling
- **API Integration**: Request/response handling

## Future Enhancements

1. **Advanced Filters**: More filter options (availability, rating, etc.)
2. **Saved Filters**: User preference persistence
3. **Filter Presets**: Predefined filter combinations
4. **Analytics**: Filter usage tracking
5. **Performance**: Virtual scrolling for large product lists

## Dependencies

- `nuqs`: URL state management
- `react-i18next`: Internationalization
- `@reduxjs/toolkit`: API state management
- `lucide-react`: Icons
- `tailwindcss`: Styling

## Installation

The implementation uses the existing project dependencies. The only new dependency is:

```bash
npm install nuqs
```

## Conclusion

This implementation provides a robust, performant, and user-friendly search and filtration system that integrates seamlessly with the existing codebase while providing excellent user experience and maintainability.
