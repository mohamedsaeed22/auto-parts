import React from "react";
import { motion } from "framer-motion";
import { CreditCard, Truck, ArrowLeft, ArrowRight } from "lucide-react";
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

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <CreditCard className="w-6 h-6 mx-3" />
          {t("payment.title")}
        </h2>
        <p className="text-gray-600 mt-1">{t("payment.description")}</p>
      </div>

      <div className="p-6">
        <div className="space-y-4 mb-6">
          <div
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              paymentMethod === "card"
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onPaymentMethodChange("card")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-6 h-6 text-gray-600 mx-3" />
                <div>
                  <span className="font-medium text-gray-900 text-lg">
                    {t("payment.creditCard")}
                  </span>
                  <p className="text-sm text-gray-600">
                    {t("payment.creditCardDesc")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                  MC
                </div>
              </div>
            </div>
          </div>

          <div
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              paymentMethod === "cod"
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onPaymentMethodChange("cod")}
          >
            <div className="flex items-center">
              <Truck className="w-6 h-6 text-gray-600 mx-3" />
              <div>
                <span className="font-medium text-gray-900 text-lg">
                  {t("payment.cashOnDelivery")}
                </span>
                <p className="text-sm text-gray-600">
                  {t("payment.cashOnDeliveryDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {paymentMethod === "card" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 mb-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("payment.cardNumber")}
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                dir="ltr"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("payment.expiryDate")}
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("payment.cvv")}
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("payment.cardholderName")}
              </label>
              <input
                type="text"
                placeholder={t("payment.cardholderPlaceholder")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
          </motion.div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 py-3 flex items-center"
          >
            {isRTL ? (
              <>
                {t("payment.back")}
                <ArrowRight className="w-4 h-4 mx-2" />
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
            className="flex-1 bg-black hover:bg-gray-800 text-white py-3 flex items-center justify-center"
          >
            {isRTL ? (
              <>
                <ArrowLeft className="w-4 h-4 mx-2" />
                {t("payment.orderReview")}
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 mx-2" />
                {t("payment.orderReview")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
