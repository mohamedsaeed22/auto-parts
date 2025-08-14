import React from "react";
import {
  Clock,
  X,
  Shield,
  RefreshCw,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  currentStep: number;
  total: number;
  couponCode: string;
  couponDiscount: number;
  isApplyingCoupon: boolean;
  couponError: string;
  isProcessing: boolean;
  onCouponCodeChange: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onPlaceOrder: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  currentStep,
  total,
  couponCode,
  couponDiscount,
  isApplyingCoupon,
  couponError,
  isProcessing,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  onPlaceOrder,
}) => {
  const finalTotal = total * 1.15 - couponDiscount;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">ملخص الطلب</h3>
      </div>

      <div className="p-6">
        {/* Delivery Info */}
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <div className="flex items-center text-green-800 mb-2">
            <Clock className="w-4 h-4 ml-2" />
            <span className="font-medium text-sm">توصيل مجاني خلال يومين</span>
          </div>
          <p className="text-xs text-green-700">اطلب خلال 5 ساعات و 23 دقيقة</p>
        </div>

        {/* Coupon Section - Only show in first 3 steps */}
        {currentStep < 4 && (
          <div className="mb-6">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="أدخل كوبون الخصم"
                value={couponCode}
                onChange={(e) => onCouponCodeChange(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={couponDiscount > 0}
              />
              {couponDiscount > 0 ? (
                <Button
                  onClick={onRemoveCoupon}
                  variant="outline"
                  size="sm"
                  className="px-4"
                >
                  <X className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={onApplyCoupon}
                  disabled={!couponCode.trim() || isApplyingCoupon}
                  size="sm"
                  className="px-3 py-2 text-xs bg-black hover:bg-gray-800 text-white"
                >
                  {isApplyingCoupon ? "جاري..." : "تطبيق"}
                </Button>
              )}
            </div>
            {couponError && (
              <p className="text-xs text-red-600 mt-2">{couponError}</p>
            )}
            {couponDiscount > 0 && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between text-sm text-green-800">
                  <span>تم تطبيق الخصم</span>
                  <span className="font-medium">
                    -{couponDiscount.toFixed(2)} ريال
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">المجموع الفرعي</span>
            <span className="font-medium">{total.toFixed(2)} ريال</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">الشحن</span>
            <span className="font-medium text-green-600">مجاناً</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">الضريبة المضافة</span>
            <span className="font-medium">
              {(total * 0.15).toFixed(2)} ريال
            </span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>الخصم</span>
              <span className="font-medium">
                -{couponDiscount.toFixed(2)} ريال
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>المجموع الكلي</span>
            <span className="text-orange-600">
              {finalTotal.toFixed(2)} ريال
            </span>
          </div>
        </div>

        {currentStep === 4 && (
          <Button
            onClick={onPlaceOrder}
            disabled={isProcessing}
            className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-medium text-lg shadow-lg"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                جاري معالجة الطلب...
              </div>
            ) : (
              <>
                تأكيد الطلب
                <CheckCircle className="w-5 h-5 mr-2" />
              </>
            )}
          </Button>
        )}

        {/* Security Features */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-600 ml-2" />
            <span>دفع آمن ومشفر 256-bit SSL</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <RefreshCw className="w-4 h-4 text-blue-600 ml-2" />
            <span>إمكانية الإرجاع خلال 30 يوماً</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 text-purple-600 ml-2" />
            <span>دعم عملاء على مدار الساعة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
