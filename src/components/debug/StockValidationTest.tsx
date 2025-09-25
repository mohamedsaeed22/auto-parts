import React from "react";
import {
  validateStock,
  isOutOfStock,
  canAddOneMore,
  getStockStatusMessage,
} from "@/utils/stockValidation";
import { Product } from "@/services/api/types";

interface StockValidationTestProps {
  product: Product;
  currentCartQuantity?: number;
}

/**
 * Test component to demonstrate stock validation functionality
 * This can be used for debugging and testing purposes
 */
export const StockValidationTest: React.FC<StockValidationTestProps> = ({
  product,
  currentCartQuantity = 0,
}) => {
  const validation = validateStock(product, 1, currentCartQuantity);
  const outOfStock = isOutOfStock(product);
  const canAdd = canAddOneMore(product, currentCartQuantity);
  const stockStatus = getStockStatusMessage(product, currentCartQuantity);

  return (
    <div className="p-4 bg-gray-100 rounded-lg space-y-2 text-sm">
      <h4 className="font-bold">Stock Validation Test</h4>
      <div>
        <strong>Product:</strong> {product.name}
      </div>
      <div>
        <strong>Available Stock:</strong> {product.stock}
      </div>
      <div>
        <strong>Current Cart Quantity:</strong> {currentCartQuantity}
      </div>

      <div className="mt-3 space-y-1">
        <div>
          <strong>Is Out of Stock:</strong> {outOfStock ? "Yes" : "No"}
        </div>
        <div>
          <strong>Can Add One More:</strong> {canAdd ? "Yes" : "No"}
        </div>
        <div>
          <strong>Max Can Add:</strong> {validation.maxCanAdd}
        </div>
        <div
          className={`font-medium ${
            stockStatus.type === "error"
              ? "text-red-600"
              : stockStatus.type === "warning"
              ? "text-orange-600"
              : "text-green-600"
          }`}
        >
          <strong>Status:</strong> {stockStatus.message}
        </div>

        {!validation.isValid && (
          <div className="text-red-600">
            <strong>Validation Error:</strong> {validation.errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};
