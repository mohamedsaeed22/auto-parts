# Stock Validation Implementation

This document describes the stock validation system implemented to prevent users from adding products to cart beyond available stock levels.

## Overview

The system prevents users from:
- Adding out-of-stock products to cart
- Adding more items than available in stock
- Increasing cart quantity beyond stock limits

## Key Components

### 1. Stock Validation Utilities (`src/utils/stockValidation.ts`)

Core functions for stock validation:

- `validateStock()` - Validates if adding items would exceed stock
- `validateStockForUpdate()` - Validates quantity updates
- `getMaxAddableQuantity()` - Gets maximum addable quantity
- `isOutOfStock()` - Checks if product is out of stock
- `canAddOneMore()` - Checks if one more item can be added
- `getStockStatusMessage()` - Gets user-friendly stock status

### 2. Stock-Aware Cart Hook (`src/hooks/useStockAwareCart.ts`)

Enhanced cart hook that wraps `useEnhancedCart` with stock validation:

- `addToCartWithStock()` - Add to cart with stock validation
- `updateQuantityWithStock()` - Update quantity with validation
- `increaseQuantityWithStock()` - Increase quantity safely
- `decreaseQuantityWithStock()` - Decrease quantity (no validation needed)
- `canAddToCart()` - Check if product can be added
- `canIncreaseQuantity()` - Check if quantity can be increased

### 3. Updated Product Type

Added `stock: number` field to the Product interface in `src/services/api/types.ts`.

### 4. Updated Cart Item Type

Added optional `stock?: number` field to CartItem interface for reference.

## UI Integration

### Product Card (`src/components/product/ProductCard.tsx`)

- Add to Cart button disabled when out of stock or at stock limit
- Increase quantity button disabled when at stock limit
- Stock status indicator showing remaining stock
- Visual feedback with appropriate styling

### Product Details Page (`src/app/[locale]/product/[id]/page.tsx`)

- Enhanced stock indicator with real-time status
- Add to Cart button disabled when appropriate
- Quantity increase button disabled at stock limit
- Stock-aware quantity controls

## Usage Examples

### Basic Stock Validation

```typescript
import { validateStock } from '@/utils/stockValidation';

const product = { stock: 10, /* other product fields */ };
const currentCartQuantity = 5;

const validation = validateStock(product, 2, currentCartQuantity);
if (!validation.isValid) {
  console.log(validation.errorMessage);
}
```

### Using Stock-Aware Cart

```typescript
import { useStockAwareCart } from '@/hooks/useStockAwareCart';

function ProductComponent({ product }) {
  const { 
    addToCart, 
    canAddToCart, 
    isProductOutOfStock,
    getProductStockStatus 
  } = useStockAwareCart();

  const handleAdd = async () => {
    if (canAddToCart(product)) {
      await addToCart(product);
    }
  };

  const stockStatus = getProductStockStatus(product);
  
  return (
    <button 
      onClick={handleAdd}
      disabled={!canAddToCart(product)}
    >
      {isProductOutOfStock(product) ? 'Out of Stock' : 'Add to Cart'}
    </button>
  );
}
```

## Backend Integration

The system expects the API to return product objects with a `stock` field:

```json
{
  "id": 52,
  "name": "Product Name",
  "stock": 35,
  "price": "4800.00",
  "final_price": 4224,
  // ... other fields
}
```

## Error Handling

- Stock validation errors are shown to users via toast notifications
- Buttons are disabled when stock limits are reached
- Visual indicators show stock status (in stock, low stock, out of stock)

## Stock Status Messages

The system provides user-friendly messages:

- "In Stock" - When plenty of stock is available
- "X in stock" - When 5-10 items remaining
- "Only X left in stock" - When 1-5 items remaining
- "Out of Stock" - When no stock available

## Testing

A debug component is available at `src/components/debug/StockValidationTest.tsx` for testing stock validation logic.

## Future Enhancements

Potential improvements:
- Real-time stock updates via WebSocket
- Reservation system for cart items
- Stock alerts for low inventory
- Bulk stock validation for multiple items