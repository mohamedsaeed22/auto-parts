import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface EmptyCartProps {
  onBackToShopping: () => void;
}

const EmptyCart: React.FC<EmptyCartProps> = ({ onBackToShopping }) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";

  return (
    <div
      className="min-h-screen bg-logo-gold/5 flex items-center justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-logo-gold/20 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-logo-gold" />
        </div>
        <h2 className="text-2xl font-bold text-logo-black mb-2 text-center">
          {t("emptyCart.title")}
        </h2>
        <p className="text-neutral-600 mb-8 text-center">
          {t("emptyCart.description")}
        </p>
        <Button
          onClick={onBackToShopping}
          className="bg-logo-gold hover:bg-logo-gold/90 text-white px-8 py-3 rounded-full font-medium shadow-lg"
        >
          {t("emptyCart.backToShopping")}
        </Button>
      </motion.div>
    </div>
  );
};

export default EmptyCart;
