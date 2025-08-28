import { User, ShoppingCart, Heart, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LoginDialog from "../LoginDialog";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

      {/* Favourites */}
      <button
        onClick={() => router.push("/favourites")}
        className="flex items-center gap-2 text-gray-700 hover:text-logo-gold transition-colors"
        title={t("actions.favourites") || "Favourites"}
      >
        <Heart size={20} />
        <span className="text-sm font-medium hidden sm:inline">
          {t("actions.favourites") || "Favourites"}
        </span>
      </button>

      {/* Wishlist */}
      <button
        onClick={() => router.push("/wishlist")}
        className="flex items-center gap-2 text-gray-700 hover:text-logo-gold transition-colors"
        title={t("actions.wishlist") || "Wishlist"}
      >
        <Bookmark size={20} />
        <span className="text-sm font-medium hidden sm:inline">
          {t("actions.wishlist") || "Wishlist"}
        </span>
      </button>

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
