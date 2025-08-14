import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCartProps {
  onBackToShopping: () => void;
}

const EmptyCart: React.FC<EmptyCartProps> = ({ onBackToShopping }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          عربة التسوق فارغة
        </h2>
        <p className="text-gray-600 mb-8">لا توجد منتجات في عربة التسوق</p>
        <Button
          onClick={onBackToShopping}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-medium shadow-lg"
        >
          العودة للتسوق
        </Button>
      </motion.div>
    </div>
  );
};

export default EmptyCart;
