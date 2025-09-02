import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface OrderCompleteProps {
  onBackToShopping: () => void;
}

const OrderComplete: React.FC<OrderCompleteProps> = ({ onBackToShopping }) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          {t("orderComplete.title")}
        </h2>
        <p className="text-gray-600 mb-2 text-center">
          {t("orderComplete.orderNumber")}
        </p>
        <p className="text-gray-600 mb-8 text-center">
          {t("orderComplete.deliveryTime")}
        </p>
        <div className="space-y-3">
          <Button
            onClick={onBackToShopping}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-full font-medium"
          >
            {t("orderComplete.backToShopping")}
          </Button>
          <Button
            variant="outline"
            className="w-full border-2 border-gray-300 py-3 rounded-full font-medium"
          >
            {t("orderComplete.trackOrder")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderComplete;
