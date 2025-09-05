# Search Autocomplete Implementation

## Overview

This implementation adds a search autocomplete feature to the header search bar that provides real-time product suggestions as users type.

## Features

### 1. Real-time Search Suggestions

- Shows product suggestions as users type (minimum 2 characters)
- Debounced search requests (300ms delay) to avoid excessive API calls
- Displays up to 5 product suggestions in a dropdown

### 2. Rich Product Information

Each suggestion displays:

- Product image (thumbnail)
- Product name
- Category and brand information
- Final price with discount information

### 3. Keyboard Navigation

- Arrow keys (↑/↓) to navigate through suggestions
- Enter key to select a suggestion or submit search
- Escape key to close suggestions
- Click outside to close suggestions

### 4. Responsive Design

- Works on both desktop and mobile
- RTL (Right-to-Left) support for Arabic language
- Proper styling that matches the existing design system

## Implementation Details

### API Integration

- **Endpoint**: `POST /api/products`
- **Body**: Form data with `name` field containing search query
- **Response**: Standard product list response with pagination

### Components

#### SearchAutocomplete.tsx

Main component that handles:

- Input management
- API calls for suggestions
- Keyboard navigation
- Click handling
- Dropdown display logic

#### Updated Header.tsx

- Replaced `HeaderSearch` with `SearchAutocomplete` for both desktop and mobile
- Maintains existing search functionality while adding autocomplete

### Hooks Used

- `useDebounce`: Delays API calls to prevent excessive requests
- `useSearchProductsMutation`: RTK Query mutation for search API
- `useLocale`: For RTL support and locale-aware navigation
- `useHeaderSearch`: Existing search state management

## Usage

### For Users

1. Start typing in the search bar (minimum 2 characters)
2. See product suggestions appear in dropdown
3. Click on a suggestion or use keyboard navigation
4. Selected suggestion navigates to products page with search query
5. Or press Enter to search with current input

### For Developers

The component accepts the same props as the original `HeaderSearch`:

```tsx
<SearchAutocomplete
  searchQuery={searchQuery}
  setSearchQuery={updateSearchQuery}
  onSubmit={handleSearchSubmit}
  onClear={clearSearch}
  isRTL={isRTL}
  placeholder="Search products..."
  isDesktop={true}
  autoFocus={false}
/>
```

## API Response Format

The search API returns products in this format:

```json
{
  "code": 200,
  "message": "Products retrieved successfully",
  "errors": [],
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Product Name",
        "price": "100.00",
        "final_price": 86,
        "discount_info": "$14.00 (Offer)",
        "brand": { "id": 1, "name": "Brand Name" },
        "category": { "id": 1, "name": "Category Name" },
        "primary_image": "https://...",
        "images": ["https://..."]
      }
    ],
    "pagination": { ... }
  }
}
```

## Navigation

When a user selects a suggestion, they are navigated to:
`/{locale}/products?search={product_name}`

This maintains consistency with the existing search functionality and allows the products page to handle the search query properly.

## Performance Considerations

- Debounced API calls (300ms) prevent excessive requests
- Limited to 5 suggestions to keep dropdown manageable
- Proper cleanup of event listeners and timeouts
- Efficient re-rendering with proper dependency arrays

## Accessibility

- Keyboard navigation support
- Proper ARIA attributes (can be enhanced further)
- Focus management
- Screen reader friendly structure
