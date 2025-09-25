import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart, Trash } from 'lucide-react';
import { useStockAwareCart } from '@/hooks/useStockAwareCart';
import { Product } from '@/services/api/types';

interface StockTestComponentProps {
  product: Product;
}

/**
 * Test component to demonstrate and verify stock validation
 * Shows real-time stock validation feedback
 */
export const StockTestComponent: React.FC<StockTestComponentProps> = ({ product }) => {
  const {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    canAddToCart,
    canIncreaseQuantity,
    isProductOutOfStock,
    getProductStockStatus,
    isItemLoading
  } = useStockAwareCart();

  const cartItem = items.find(item => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const isInCart = currentQuantity > 0;
  const stockStatus = getProductStockStatus(product);

  const handleAddToCart = async () => {
    await addToCart(product);
  };

  const handleIncrease = async () => {
    if (cartItem) {
      await updateQuantity(product.id, cartItem.quantity + 1, product);
    }
  };

  const handleDecrease = async () => {
    if (cartItem && cartItem.quantity > 1) {
      await updateQuantity(product.id, cartItem.quantity - 1, product);
    } else if (cartItem && cartItem.quantity === 1) {
      await removeFromCart(product.id);
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">Product ID: {product.id}</p>
      </div>

      {/* Stock Information */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <h4 className="font-semibold text-sm">Stock Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Available Stock:</span>
            <span className="ml-2 font-medium">{product.stock}</span>
          </div>
          <div>
            <span className="text-gray-600">In Cart:</span>
            <span className="ml-2 font-medium">{currentQuantity}</span>
          </div>
          <div>
            <span className="text-gray-600">Can Add:</span>
            <span className={`ml-2 font-medium ${canAddToCart(product) ? 'text-green-600' : 'text-red-600'}`}>
              {canAddToCart(product) ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Can Increase:</span>
            <span className={`ml-2 font-medium ${canIncreaseQuantity(product) ? 'text-green-600' : 'text-red-600'}`}>
              {canIncreaseQuantity(product) ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
        <div className={`text-sm font-medium ${
          stockStatus.type === 'error' 
            ? 'text-red-600' 
            : stockStatus.type === 'warning' 
            ? 'text-orange-600' 
            : 'text-green-600'
        }`}>
          Status: {stockStatus.message}
        </div>
      </div>

      {/* Cart Controls */}
      <div className="space-y-3">
        {!isInCart ? (
          <Button
            onClick={handleAddToCart}
            disabled={isItemLoading(product.id) || isProductOutOfStock(product) || !canAddToCart(product)}
            className="w-full flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isItemLoading(product.id) ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <ShoppingCart size={16} />
            )}
            <span>
              {isProductOutOfStock(product) ? 'Out of Stock' : 'Add to Cart'}
            </span>
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={handleDecrease}
              size="sm"
              variant="outline"
              disabled={isItemLoading(product.id)}
              className="w-10 h-10 p-0"
            >
              {isItemLoading(product.id) ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
              ) : currentQuantity === 1 ? (
                <Trash size={14} />
              ) : (
                <Minus size={14} />
              )}
            </Button>

            <div className="px-4 py-2 bg-gray-100 rounded-md min-w-[60px] text-center">
              <span className="font-semibold">{currentQuantity}</span>
            </div>

            <Button
              onClick={handleIncrease}
              size="sm"
              variant="outline"
              disabled={isItemLoading(product.id) || !canIncreaseQuantity(product)}
              className="w-10 h-10 p-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isItemLoading(product.id) ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
              ) : (
                <Plus size={14} />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs">
          <h5 className="font-semibold text-yellow-800 mb-2">Debug Info</h5>
          <div className="space-y-1 text-yellow-700">
            <div>Current Quantity: {currentQuantity}</div>
            <div>Product Stock: {product.stock}</div>
            <div>Is Out of Stock: {isProductOutOfStock(product) ? 'true' : 'false'}</div>
            <div>Can Add to Cart: {canAddToCart(product) ? 'true' : 'false'}</div>
            <div>Can Increase: {canIncreaseQuantity(product) ? 'true' : 'false'}</div>
            <div>Remaining Stock: {(product.stock || 0) - currentQuantity}</div>
          </div>
        </div>
      )}
    </div>
  );
};