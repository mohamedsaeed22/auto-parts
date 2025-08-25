# API Services Documentation

This directory contains all API-related services using Redux Toolkit Query (RTK Query) for efficient data fetching, caching, and state management.

## 📁 File Structure

```
src/services/
├── api/
│   ├── baseApi.ts          # Base API configuration with auth
│   ├── types.ts            # TypeScript type definitions
│   ├── authApi.ts          # Authentication endpoints
│   ├── productsApi.ts      # Products, categories, brands
│   ├── cartApi.ts          # Cart, wishlist, favourites
│   ├── ordersApi.ts        # Orders management
│   ├── addressesApi.ts     # User addresses
│   ├── requestsApi.ts      # Custom part requests
│   ├── settingsApi.ts      # App settings and legal pages
│   └── index.ts            # Main exports
├── hooks.ts                # Centralized hook exports
└── README.md               # This documentation
```

## 🚀 Quick Start

### 1. Import hooks in your components:

```typescript
import {
  useGetProductsQuery,
  useAddToCartMutation,
  useGetProfileQuery,
} from "@/services/hooks";
```

### 2. Use in components:

```typescript
function ProductsList() {
  // Query with loading states
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsQuery({
    category_id: 1,
    per_page: 20,
  });

  // Mutation with loading states
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart({ product_id: productId, quantity: 1 }).unwrap();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {products?.data?.data?.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button
            onClick={() => handleAddToCart(product.id)}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 📋 Available Endpoints

### 🔐 Authentication (`authApi.ts`)

| Hook                                | Method | Endpoint                          | Description                |
| ----------------------------------- | ------ | --------------------------------- | -------------------------- |
| `useSendOtpMutation`                | POST   | `/auth/send-otp`                  | Send OTP to phone          |
| `useVerifyOtpMutation`              | POST   | `/auth/verify-otp`                | Verify OTP code            |
| `useGoogleLoginMutation`            | POST   | `/auth/google-login`              | Login with Google          |
| `useCompleteRegistrationMutation`   | POST   | `/auth/complete-registration`     | Complete user registration |
| `useGetProfileQuery`                | GET    | `/auth/profile`                   | Get user profile           |
| `useUpdateProfileMutation`          | POST   | `/auth/update-profile`            | Update user profile        |
| `useUpdatePasswordMutation`         | POST   | `/auth/update-password`           | Change password            |
| `useForgotPasswordMutation`         | POST   | `/auth/forgot-password`           | Request password reset     |
| `useVerifyResetPasswordOtpMutation` | POST   | `/auth/verify-reset-password-otp` | Verify reset OTP           |
| `useChangeLanguageMutation`         | POST   | `/auth/change-language`           | Change app language        |
| `useLogoutMutation`                 | POST   | `/auth/logout`                    | Logout user                |

### 🛍️ Products & Catalog (`productsApi.ts`)

| Hook                     | Method | Endpoint         | Description            |
| ------------------------ | ------ | ---------------- | ---------------------- |
| `useGetProductsMutation` | POST   | `/products`      | Search/filter products |
| `useGetProductQuery`     | GET    | `/products/{id}` | Get single product     |
| `useGetCategoriesQuery`  | GET    | `/categories`    | Get product categories |
| `useGetBrandsQuery`      | GET    | `/brands`        | Get product brands     |
| `useGetBannersQuery`     | GET    | `/banners`       | Get app banners        |
| `useGetOffersQuery`      | GET    | `/offers`        | Get all offers         |
| `useGetOfferQuery`       | GET    | `/offers/{id}`   | Get single offer       |
| `useGetSectionsQuery`    | GET    | `/sections`      | Get app sections       |
| `useGetSectionQuery`     | GET    | `/sections/{id}` | Get single section     |
| `useGetPartnersQuery`    | GET    | `/partners`      | Get business partners  |

### 🛒 Cart & Wishlist (`cartApi.ts`)

| Hook                         | Method | Endpoint             | Description                |
| ---------------------------- | ------ | -------------------- | -------------------------- |
| `useGetCartQuery`            | GET    | `/cart`              | Get user cart              |
| `useAddToCartMutation`       | POST   | `/cart/add`          | Add item to cart           |
| `useUpdateCartItemMutation`  | PUT    | `/cart/update/{id}`  | Update cart item quantity  |
| `useClearCartMutation`       | DELETE | `/cart/clear`        | Clear entire cart          |
| `useApplyCouponMutation`     | POST   | `/cart/apply-coupon` | Apply discount coupon      |
| `useGetWishlistQuery`        | GET    | `/wishlist`          | Get user wishlist          |
| `useToggleWishlistMutation`  | POST   | `/wishlist/toggle`   | Add/remove from wishlist   |
| `useGetFavouritesQuery`      | GET    | `/favourites`        | Get user favourites        |
| `useToggleFavouriteMutation` | POST   | `/favourites/toggle` | Add/remove from favourites |

### 📦 Orders (`ordersApi.ts`)

| Hook                         | Method | Endpoint                | Description                  |
| ---------------------------- | ------ | ----------------------- | ---------------------------- |
| `useGetOrdersQuery`          | GET    | `/orders`               | Get user orders with filters |
| `useCreateOrderMutation`     | POST   | `/orders`               | Create new order             |
| `useGetOrderQuery`           | GET    | `/orders/{orderNumber}` | Get single order             |
| `useGetOrderStatisticsQuery` | GET    | `/orders/statistics`    | Get order statistics         |

### 📍 Addresses (`addressesApi.ts`)

| Hook                       | Method | Endpoint          | Description        |
| -------------------------- | ------ | ----------------- | ------------------ |
| `useGetAddressesQuery`     | GET    | `/addresses`      | Get user addresses |
| `useGetAddressQuery`       | GET    | `/addresses/{id}` | Get single address |
| `useCreateAddressMutation` | POST   | `/addresses`      | Create new address |
| `useUpdateAddressMutation` | PUT    | `/addresses/{id}` | Update address     |
| `useDeleteAddressMutation` | DELETE | `/addresses/{id}` | Delete address     |

### 📋 Custom Requests (`requestsApi.ts`)

| Hook                       | Method | Endpoint    | Description              |
| -------------------------- | ------ | ----------- | ------------------------ |
| `useGetRequestsQuery`      | GET    | `/requests` | Get custom part requests |
| `useCreateRequestMutation` | POST   | `/requests` | Create new request       |

### ⚙️ Settings (`settingsApi.ts`)

| Hook                        | Method | Endpoint                           | Description           |
| --------------------------- | ------ | ---------------------------------- | --------------------- |
| `useGetSettingsQuery`       | GET    | `/settings`                        | Get app settings      |
| `useGetLegalContentQuery`   | GET    | `/settings/legal`                  | Get all legal content |
| `useGetTermsOfServiceQuery` | GET    | `/settings/legal/terms_of_service` | Get terms of service  |
| `useGetPrivacyPolicyQuery`  | GET    | `/settings/legal/privacy_policy`   | Get privacy policy    |
| `useGetRefundPolicyQuery`   | GET    | `/settings/legal/refund_policy`    | Get refund policy     |
| `useGetShippingPolicyQuery` | GET    | `/settings/legal/shipping_policy`  | Get shipping policy   |

## 🔄 Common Patterns

### Error Handling

```typescript
const { data, error, isLoading } = useGetProductsQuery();

if (error) {
  if ("status" in error) {
    // FetchBaseQueryError
    const errMsg = "error" in error ? error.error : JSON.stringify(error.data);
    console.error("API Error:", errMsg);
  } else {
    // SerializedError
    console.error("Network Error:", error.message);
  }
}
```

### Conditional Queries

```typescript
const { data: profile } = useGetProfileQuery(undefined, {
  skip: !isAuthenticated, // Skip if user not authenticated
});
```

### Manual Trigger

```typescript
const [trigger, result] = useLazyGetProductsQuery();

const handleSearch = (searchTerm: string) => {
  trigger({ search: searchTerm });
};
```

### Optimistic Updates

```typescript
const [updateProfile] = useUpdateProfileMutation();

const handleUpdateProfile = async (profileData) => {
  try {
    await updateProfile(profileData).unwrap();
    // Profile will automatically update in cache
  } catch (error) {
    console.error("Update failed:", error);
  }
};
```

## 🏷️ Type Safety

All endpoints are fully typed. Import types as needed:

```typescript
import type {
  Product,
  User,
  Order,
  CreateOrderRequest,
} from "@/services/hooks";
```

## 🔧 Configuration

The base API is configured with:

- Base URL: `https://iseek.name/api`
- Automatic token attachment from auth state
- Form data handling for file uploads
- Automatic cache invalidation with tags
- Error handling for 401 responses

## 📝 Notes

1. **Authentication**: Most endpoints require authentication. Tokens are automatically attached from the auth state.

2. **File Uploads**: File upload endpoints use `FormData` and proper content-type headers.

3. **Caching**: RTK Query automatically caches responses and provides optimistic updates.

4. **Error States**: All hooks provide `isLoading`, `error`, and `isSuccess` states.

5. **Refetching**: Use `refetch()` method or invalidate tags to refresh data.

6. **Background Refetching**: RTK Query automatically refetches data when the window regains focus or network reconnects.
