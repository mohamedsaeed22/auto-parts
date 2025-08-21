import React from "react";
import { ShoppingBag, Truck, CreditCard, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Step {
  id: number;
  titleKey: string;
  icon: React.ComponentType<{ className?: string }>;
  descKey: string;
}

interface CheckoutProgressProps {
  currentStep: number;
}

const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";

  const steps: Step[] = [
    {
      id: 1,
      titleKey: "progress.cartReview",
      icon: ShoppingBag,
      descKey: "progress.cartReviewDesc",
    },
    {
      id: 2,
      titleKey: "progress.shippingInfo",
      icon: Truck,
      descKey: "progress.shippingInfoDesc",
    },
    {
      id: 3,
      titleKey: "progress.paymentMethod",
      icon: CreditCard,
      descKey: "progress.paymentMethodDesc",
    },
    {
      id: 4,
      titleKey: "progress.orderReview",
      icon: CheckCircle,
      descKey: "progress.orderReviewDesc",
    },
  ];

  return (
    <div
      className="bg-white rounded-2xl shadow-sm p-6 mb-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center min-w-max">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div className="flex items-center">
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
                  className={`mx-3 text-sm font-medium ${
                    currentStep >= step.id ? "text-black" : "text-gray-400"
                  } whitespace-nowrap`}
                >
                  {t(step.titleKey)}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-3 flex-shrink-0 ${
                    currentStep > step.id ? "bg-black" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
