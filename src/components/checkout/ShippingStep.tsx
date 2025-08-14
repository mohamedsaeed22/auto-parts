import React from "react";
import { Truck, ArrowLeft, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Address {
  id: number;
  label: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

interface ShippingStepProps {
  savedAddresses: Address[];
  selectedAddress: number;
  onAddressSelect: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const ShippingStep: React.FC<ShippingStepProps> = ({
  savedAddresses,
  selectedAddress,
  onAddressSelect,
  onNext,
  onBack,
}) => {
  return (
    <div>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Truck className="w-6 h-6 ml-3" />
          معلومات الشحن
        </h2>
        <p className="text-gray-600 mt-1">
          اختر عنوان التوصيل أو أضف عنواناً جديداً
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4 mb-6">
          {savedAddresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedAddress === address.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => onAddressSelect(address.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <span className="font-semibold text-gray-900">
                      {address.label}
                    </span>
                    {address.isDefault && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        افتراضي
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 font-medium">{address.name}</p>
                  <p className="text-gray-600">{address.address}</p>
                  <p className="text-gray-600">{address.city}</p>
                  <p className="text-gray-600">{address.phone}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  تعديل
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mb-6 border-2 border-dashed border-gray-300 py-4 text-gray-600 hover:border-gray-400"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة عنوان جديد
        </Button>

        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <div className="flex items-center text-green-800 mb-2">
            <Clock className="w-5 h-5 ml-2" />
            <span className="font-medium">توصيل مجاني خلال يومين</span>
          </div>
          <p className="text-sm text-green-700">
            اطلب خلال 5 ساعات و 23 دقيقة للحصول على التوصيل في موعدك المحدد
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="flex-1 py-3">
            رجوع
          </Button>
          <Button
            onClick={onNext}
            className="flex-1 bg-black hover:bg-gray-800 text-white py-3"
          >
            طريقة الدفع
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShippingStep;
