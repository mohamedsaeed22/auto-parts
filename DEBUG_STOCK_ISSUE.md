# Debug: Stock Not Persisting for Logged-in Users

## Problem

Despite adding `stock: item.product.stock` to the CartSyncService, the stock field is still not appearing in localStorage for logged-in users.

## Expected vs Actual

### API Response ✅

```json
{
  "cart_items": [
    {
      "product": {
        "id": 78,
        "stock": 7 // ← Stock is in API response
      },
      "quantity": 7
    }
  ]
}
```

### Expected in localStorage ✅

```json
{
  "items": "[{
    \"id\": 78,
    \"stock\": 7,  // ← Should be here
    \"quantity\": 7
  }]"
}
```

### Actual in localStorage ❌

```json
{
  "items": "[{
    \"id\": 78,
    \"quantity\": 7
    // ❌ stock field is missing!
  }]"
}
```

## Debug Changes Made

### File 1: `src/services/cartSyncService.ts`

Added console logging in `syncAPICartToLocal()`:

```typescript
const cartItems: CartItem[] = response.data.cart_items.map((item) => {
  console.log("🔍 Syncing cart item from API:", {
    productId: item.product.id,
    productName: item.product.name,
    stock: item.product.stock, // ← Check if stock exists
    quantity: item.quantity,
  });
  return {
    id: item.product.id,
    title: item.product.name,
    stock: item.product.stock, // ← Extracting stock
    // ... other fields
  };
});

console.log("🔍 Cart items to be added to Redux:", cartItems);
```

Added console logging in `handleLoginSync()`:

```typescript
const cartItems: CartItem[] = response.data.cart_items.map((item) => {
  console.log("🔍 [handleLoginSync] Syncing cart item from API:", {
    productId: item.product.id,
    stock: item.product.stock, // ← Check if stock exists
  });
  return {
    stock: item.product.stock, // ← Extracting stock
    // ... other fields
  };
});

console.log("🔍 [handleLoginSync] Cart items to be added to Redux:", cartItems);
```

### File 2: `src/store/slices/cartSlice.ts`

Added console logging in `addMultipleToCart` reducer:

```typescript
addMultipleToCart: (state, action: PayloadAction<CartItem[]>) => {
  console.log("🔍 [addMultipleToCart] Received items:", action.payload);

  action.payload.forEach((newItem) => {
    console.log("🔍 [addMultipleToCart] Processing item:", {
      id: newItem.id,
      title: newItem.title,
      quantity: newItem.quantity,
      stock: newItem.stock, // ← Check if stock is received
    });

    const existing = state.items.find((i) => i.id === newItem.id);
    if (existing) {
      existing.quantity += newItem.quantity;
      // Update stock if provided
      if (newItem.stock !== undefined) {
        existing.stock = newItem.stock; // ← Update stock for existing items
      }
    } else {
      state.items.push(newItem); // ← Push entire item (with stock)
    }
  });

  console.log("🔍 [addMultipleToCart] Final state.items:", state.items);
};
```

## Testing Steps

### Step 1: Clear Everything

1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear localStorage:
   ```javascript
   localStorage.clear();
   ```
4. Hard refresh page (Ctrl + Shift + R)

### Step 2: Login and Check Console

1. Login to your account
2. Watch the console for these logs:
   ```
   🔍 [handleLoginSync] Syncing cart item from API: {productId: 78, stock: 7, ...}
   🔍 [handleLoginSync] Cart items to be added to Redux: [{id: 78, stock: 7, ...}]
   🔍 [addMultipleToCart] Received items: [{id: 78, stock: 7, ...}]
   🔍 [addMultipleToCart] Processing item: {id: 78, stock: 7, ...}
   🔍 [addMultipleToCart] Final state.items: [{id: 78, stock: 7, ...}]
   ```

### Step 3: Check localStorage

1. In DevTools, go to Application tab
2. Click on Local Storage → your domain
3. Find key `persist:cart-storage`
4. Check if `stock` field exists in items array

### Step 4: Check Redux State

1. Install Redux DevTools Extension (if not installed)
2. Open Redux DevTools
3. Look at `cart` state
4. Check if `items[0].stock` exists

## Possible Issues

### Issue 1: API Not Returning Stock

**Check:** Look at first console log

```
🔍 Syncing cart item from API: {stock: undefined}
```

**Solution:** API might not be returning stock - check API endpoint

### Issue 2: Stock is `undefined` or `null`

**Check:** Look at console logs

```
🔍 Syncing cart item from API: {stock: null}
```

**Solution:** Update mapping to handle null/undefined:

```typescript
stock: item.product.stock !== undefined ? item.product.stock : undefined;
```

### Issue 3: Redux Persist Not Saving

**Check:** Stock is in Redux but not in localStorage

```
Redux: {items: [{stock: 7}]}
localStorage: {items: [{stock: undefined}]}
```

**Solution:** Check redux-persist configuration

### Issue 4: Stock Being Removed Later

**Check:** Stock appears briefly then disappears
**Solution:** Another action/reducer is clearing it

## Expected Console Output

When everything works correctly, you should see:

```console
🔍 [handleLoginSync] Syncing cart item from API:
  {productId: 78, productName: "فلتر هواء تيجو 5 وكالة", stock: 7, quantity: 7}

🔍 [handleLoginSync] Cart items to be added to Redux:
  [{
    id: 78,
    title: "فلتر هواء تيجو 5 وكالة",
    price: 75,
    image: "https://...",
    quantity: 7,
    category: "قطع المحرك",
    description: "",
    stock: 7  // ✅ Stock should be here
  }]

🔍 [addMultipleToCart] Received items:
  [{ id: 78, title: "...", quantity: 7, stock: 7 }]  // ✅

🔍 [addMultipleToCart] Processing item:
  {id: 78, title: "...", quantity: 7, stock: 7}  // ✅

🔍 [addMultipleToCart] Final state.items:
  [{id: 78, title: "...", quantity: 7, stock: 7}]  // ✅
```

## Next Steps

1. **Run the test** and check console logs
2. **Share the console output** so I can see where the stock is being lost
3. **Check localStorage** to see if stock appears there
4. **Test the buttons** - they should disable when quantity >= stock

## After Finding the Issue

Once we identify where the stock is being lost, we can:

1. Fix the specific issue
2. Remove all console.log statements
3. Test the final solution

---

**Please run the test now and share the console output!** 🔍
