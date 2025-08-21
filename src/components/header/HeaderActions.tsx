import { User, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LoginDialog from "../LoginDialog";

interface HeaderActionsProps {
  totalItems: number;
  onCartClick: () => void;
  isRTL: boolean;
}

export default function HeaderActions({
  totalItems,
  onCartClick,
  isRTL,
}: HeaderActionsProps) {
  const { t } = useTranslation("header");

  return (
    <>
      {/* Account */}
      <LoginDialog
        trigger={
          <button className="flex items-center gap-2 text-gray-700 hover:text-logo-gold transition-colors">
            <User size={20} />
            <span className="text-sm font-medium">
              {t("actions.account") || "Account"}
            </span>
          </button>
        }
      />

      {/* Cart */}
      <button
        onClick={onCartClick}
        className="relative flex items-center gap-2 text-gray-700 hover:text-logo-gold transition-colors"
      >
        <div className="relative">
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -top-2 ${
                isRTL ? "-left-2" : "-right-2"
              } bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center`}
            >
              {totalItems}
            </motion.span>
          )}
        </div>
      </button>
    </>
  );
}
