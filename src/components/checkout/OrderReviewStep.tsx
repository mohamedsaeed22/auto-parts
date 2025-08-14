import React from "react";
import {
  Package,
  ShoppingBag,
  MapPin,
  CreditCard,
  Shield,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Address {
  id: number;
  label: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

interface OrderReviewStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  totalItems: number;
  selectedAddress: Address;
  paymentMethod: string;
  isProcessing: boolean;
  onPlaceOrder: () => void;
  onBack: () => void;
}

const OrderReviewStep: React.FC<OrderReviewStepProps> = ({
  items,
  totalItems,
  selectedAddress,
  paymentMethod,
  isProcessing,
  onPlaceOrder,
  onBack,
}) => {
  return (
    <div>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Package className="w-6 h-6 ml-3" />
          مراجعة الطلب النهائية
        </h2>
        <p className="text-gray-600 mt-1">تأكد من جميع التفاصيل قبل التأكيد</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Order Items Summary */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <ShoppingBag className="w-4 h-4 ml-2" />
            المنتجات ({totalItems})
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 space-x-reverse"
              >
                <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    الكمية: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {(item.price * item.quantity).toFixed(2)} ريال
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <MapPin className="w-4 h-4 ml-2" />
            عنوان التوصيل
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">{selectedAddress.name}</p>
            <p>{selectedAddress.address}</p>
            <p>{selectedAddress.city}</p>
            <p>{selectedAddress.phone}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <CreditCard className="w-4 h-4 ml-2" />
            طريقة الدفع
          </h3>
          <p className="text-sm text-gray-600">
            {paymentMethod === "card"
              ? "بطاقة ائتمان/خصم"
              : "الدفع عند الاستلام"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="flex-1 py-3">
            رجوع
          </Button>
          <Button
            onClick={onPlaceOrder}
            disabled={isProcessing}
            className="flex-1 bg-black hover:bg-gray-800 text-white py-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري معالجة الطلب...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                تأكيد الطلب
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderReviewStep;
