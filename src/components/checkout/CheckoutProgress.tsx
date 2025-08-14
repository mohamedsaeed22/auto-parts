import React from "react";
import { ShoppingBag, Truck, CreditCard, CheckCircle } from "lucide-react";

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
}

interface CheckoutProgressProps {
  currentStep: number;
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  const steps: Step[] = [
    {
      id: 1,
      title: "مراجعة السلة",
      icon: ShoppingBag,
      desc: "تأكيد المنتجات والكميات",
    },
    { id: 2, title: "معلومات الشحن", icon: Truck, desc: "عنوان التوصيل" },
    {
      id: 3,
      title: "طريقة الدفع",
      icon: CreditCard,
      desc: "اختيار طريقة الدفع",
    },
    {
      id: 4,
      title: "مراجعة الطلب",
      icon: CheckCircle,
      desc: "التأكيد النهائي",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? "bg-black border-black text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`mr-3 text-sm font-medium ${
                currentStep >= step.id ? "text-black" : "text-gray-400"
              }`}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-6 ${
                  currentStep > step.id ? "bg-black" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;
