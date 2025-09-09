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
      className="min-h-screen bg-logo-gold/5 flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-logo-gold/30 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-logo-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-10 h-10 text-logo-black" />
        </div>
        <h2 className="text-3xl font-bold text-logo-black mb-4 text-center">
          {t("orderComplete.title")}
        </h2>
        <p className="text-neutral-600 mb-2 text-center">
          {t("orderComplete.orderNumber")}
        </p>
        <p className="text-neutral-600 mb-8 text-center">
          {t("orderComplete.deliveryTime")}
        </p>
        <div className="space-y-3">
          <Button
            onClick={onBackToShopping}
            className="w-full bg-logo-gold hover:bg-logo-gold/90 text-white py-3 rounded-full font-medium"
          >
            {t("orderComplete.backToShopping")}
          </Button>
          <Button
            variant="outline"
            className="w-full border-2 border-logo-gold/50 text-logo-black hover:bg-logo-gold/10 hover:text-logo-black py-3 rounded-full font-medium"
          >
            {t("orderComplete.trackOrder")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderComplete;
