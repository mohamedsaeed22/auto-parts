import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Truck,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Landmark,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

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
  const selectedMethod = paymentMethod || "cash";

  // Auto-select first payment method if none selected
  useEffect(() => {
    if (!paymentMethod) {
      onPaymentMethodChange("cash");
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
              key: "cash",
              icon: Truck,
              title: t("payment.cashOnDelivery"),
              desc: t("payment.cashOnDeliveryDesc"),
            },
            {
              key: "credit_card",
              icon: CreditCard,
              title: t("payment.creditCard"),
              desc: t("payment.creditCardDesc"),
            },
            {
              key: "paypal",
              icon: Wallet,
              title: "PayPal",
              desc: t("paymentMethod"),
            },
            {
              key: "stripe",
              icon: Banknote,
              title: "Stripe",
              desc: t("paymentMethod"),
            },
            {
              key: "bank_transfer",
              icon: Landmark,
              title: t("payment.bankTransfer", {
                defaultValue: "Bank Transfer",
              }),
              desc: t("paymentMethod"),
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
              <div className="flex items-center gap-2">
                {selectedMethod === key && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-logo-gold text-logo-black">
                    {t("selected", { defaultValue: "Selected" })}
                  </span>
                )}
                {key === "credit_card" && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-5 bg-black/80 rounded text-white text-xs flex items-center justify-center">
                      VISA
                    </div>
                    <div className="w-8 h-5 bg-logo-gold rounded text-black text-xs flex items-center justify-center">
                      MC
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedMethod === "credit_card" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 mb-6"
          >
            <div>
              <label className="block text-sm font-medium text-logo-black mb-2">
                {t("payment.cardNumber")}
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-logo-gold focus:border-logo-gold text-lg"
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-logo-black mb-2">
                  {t("payment.expiryDate")}
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-logo-gold focus:border-logo-gold text-lg"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-logo-black mb-2">
                  {t("payment.cvv")}
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-logo-gold focus:border-logo-gold text-lg"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-logo-black mb-2">
                {t("payment.cardholderName")}
              </label>
              <input
                type="text"
                placeholder={t("payment.cardholderPlaceholder")}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-logo-gold focus:border-logo-gold text-lg"
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
          </motion.div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 py-3 flex items-center border-logo-gold text-logo-black hover:bg-logo-gold/10"
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
            className="flex-1 bg-logo-gold hover:bg-logo-gold/90 text-logo-black py-3 flex items-center justify-center"
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
