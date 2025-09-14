# Favorites/Wishlist Cache Invalidation Solution

## Problem

When users add products to favorites or wishlist, the product's `in_favorites` and `in_wishlist` status was not being updated across the entire application. Specifically, the sections endpoint (`/api/sections`) would not reflect the updated status, causing inconsistent UI states.

## Root Cause

The issue was in the RTK Query cache invalidation configuration. When favorites or wishlist mutations were performed, only the `["Favourites"]` and `["Wishlist"]` tags were being invalidated, but the `["Sections"]` tag was not included. This meant that sections data containing products with outdated favorites/wishlist status remained cached.

## Solution

Updated the cache invalidation tags in the favorites and wishlist API endpoints to include:

- `"Sections"` - to invalidate sections data
- `"Products"` - to invalidate products list data
- `{ type: "Products", id: productId }` - to invalidate specific product data

Additionally, created a new query endpoint for products that provides individual product tags for proper cache invalidation.

### Files Modified

#### 1. `src/services/api/favouritesApi.ts`

- Updated `addFavourite`, `removeFavourite`, and `toggleFavourite` mutations
- Added `"Sections"` and specific product tags to `invalidatesTags`

#### 2. `src/services/api/wishlistApi.ts`

- Updated `addToWishlist`, `removeFromWishlist`, and `toggleWishlist` mutations
- Added `"Sections"` and specific product tags to `invalidatesTags`

#### 3. `src/services/api/sectionsApi.ts`

- Updated `SectionProduct` interface to include `in_favorites` and `in_wishlist` fields
- Enhanced `getSections` query to provide granular product tags for better cache invalidation

#### 4. `src/services/api/productsApi.ts`

- Added new `getProductsList` query endpoint that provides individual product tags
- This allows the `/api/products` endpoint to be properly invalidated when favorites/wishlist change

#### 5. `src/services/hooks.ts`

- Exported the new `useGetProductsListQuery` hook for use in components

#### 6. Updated Components to Use Query Instead of Mutation

- `src/app/[locale]/products/page.tsx` - Updated to use `useGetProductsListQuery`
- `src/app/[locale]/brands/[id]/page.tsx` - Updated to use `useGetProductsListQuery`
- `src/components/product/ProductsList.tsx` - Updated to use `useGetProductsListQuery`
- `src/components/swiper/CategorySwiper.tsx` - Updated to use `useGetProductsListQuery`

**Why this was necessary**: The original components were using `useGetProductsMutation` (a mutation), but mutations don't provide tags for cache invalidation. By switching to `useGetProductsListQuery` (a query), the products data now provides the "Products" tag that can be invalidated when favorites/wishlist change.

### Key Changes

**Before:**

```typescript
invalidatesTags: ["Favourites"];
```

**After:**

```typescript
invalidatesTags: (result, error, arg) => [
  "Favourites",
  "Sections",
  "Products",
  { type: "Products", id: arg.product_id },
];
```

## How It Works

1. **User Action**: User clicks favorite/wishlist button on a product
2. **API Call**: Mutation is sent to add/remove product from favorites/wishlist
3. **Cache Invalidation**: RTK Query invalidates multiple cache entries:
   - `"Favourites"` - refreshes favorites list
   - `"Sections"` - refreshes sections data (including product status)
   - `"Products"` - refreshes products list data
   - `{ type: "Products", id: productId }` - refreshes specific product data
4. **Automatic Refetch**: All components using this data automatically refetch and update
5. **UI Update**: Product cards across the app show updated favorite/wishlist status

## Testing

A comprehensive test component has been created at `src/components/debug/FavoritesWishlistTest.tsx` that:

- Displays both sections data (`/api/sections`) and products data (`/api/products`) with current favorites/wishlist status
- Provides buttons to toggle favorites/wishlist for each product
- Shows real-time updates when cache invalidation works correctly
- Tests both endpoints to ensure they reflect changes immediately without page reload

## Benefits

1. **Consistent UI**: Product status is now consistent across all pages
2. **Automatic Updates**: No manual refresh needed - changes propagate automatically
3. **Efficient Caching**: Only invalidates relevant cache entries, not all data
4. **Better UX**: Users see immediate feedback with optimistic updates

## Usage

The solution works automatically with the existing codebase. No changes are needed in components that use:

- `useGetSectionsQuery()` - sections data will auto-refresh
- `useGetProductsListQuery()` - products data will auto-refresh (new query endpoint)
- `useFavouritesWishlist()` - mutations will trigger cache invalidation
- `ProductCard` component - will show updated status automatically

**Note**: For components currently using `useGetProductsMutation()`, consider switching to `useGetProductsListQuery()` for better cache invalidation support.

## API Endpoints Affected

- `{{baseUrl}}/api/sections` - Now refreshes when favorites/wishlist change
- `{{baseUrl}}/api/products` - Individual product data refreshes
- `{{baseUrl}}/api/favourites` - Favorites list refreshes
- `{{baseUrl}}/api/wishlist` - Wishlist refreshes
