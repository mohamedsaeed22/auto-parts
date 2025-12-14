import React, { useEffect } from "react";
import { CreditCard, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Image from "next/image";

interface PaymentStepProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentMethod,
  onPaymentMethodChange,
  onNext,
  onBack,
}) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";
  const selectedMethod = paymentMethod || "credit_card";

  // Auto-select first payment method if none selected
  useEffect(() => {
    if (!paymentMethod) {
      onPaymentMethodChange("credit_card");
    }
  }, [paymentMethod, onPaymentMethodChange]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="p-6 border-b border-logo-gold/30">
        <h2 className="text-2xl font-bold text-logo-black flex items-center">
          <CreditCard className="w-6 h-6 mx-3 text-logo-gold" />
          {t("payment.title")}
        </h2>
        <p className="text-neutral-600 mt-1">{t("payment.description")}</p>
      </div>

      <div className="p-6">
        <div className="space-y-4 mb-6">
          {[
            {
              key: "credit_card",
              icon: CreditCard,
              title: t("payment.creditCard"),
              desc: t("payment.creditCardDesc"),
            },
          ].map(({ key, icon: Icon, title, desc }) => (
            <div
              key={key}
              onClick={() => onPaymentMethodChange(key)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === key
                  ? "border-logo-gold bg-logo-gold/10 shadow-md"
                  : "border-neutral-200 hover:border-logo-gold/40"
              }`}
            >
              <div className="flex items-center">
                <Icon className="w-6 h-6 text-logo-black mx-3" />
                <div>
                  <span className="font-medium text-logo-black text-lg">
                    {title}
                  </span>
                  <p className="text-sm text-neutral-600">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 py-3 flex items-center border-logo-gold text-logo-black hover:bg-logo-gold/10 hover:text-logo-black"
          >
            {isRTL ? (
              <>
                <ArrowRight className="w-4 h-4 mx-2" />
                {t("payment.back")}
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 mx-2" />
                {t("payment.back")}
              </>
            )}
          </Button>
          <Button
            onClick={onNext}
            className="flex-1 bg-logo-gold hover:bg-logo-gold/90 text-white py-3 flex items-center justify-center"
          >
            {isRTL ? (
              <>
                {t("payment.orderReview")}
                <ArrowLeft className="w-4 h-4 mx-2" />
              </>
            ) : (
              <>
                {t("payment.orderReview")}
                <ArrowRight className="w-4 h-4 mx-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
