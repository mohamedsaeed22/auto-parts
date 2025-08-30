import { User, ShoppingCart, Heart, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LoginDialog from "../LoginDialog";
import UserDropdown from "./UserDropdown";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

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
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Account - Show UserDropdown if logged in, LoginDialog if not */}
      {isAuthenticated ? (
        <UserDropdown isRTL={isRTL} />
      ) : (
        <LoginDialog
          trigger={
            <button className="flex items-center gap-2 text-neutral-700 hover:text-primary transition-colors">
              <User size={20} />
              <span className="text-sm font-medium">
                {t("actions.account") || "Account"}
              </span>
            </button>
          }
        />
      )}

      {/* Favourites - Only show if authenticated */}
      {isAuthenticated && (
        <button
          onClick={() => router.push("/favourites")}
          className="flex items-center gap-2 text-neutral-700 hover:text-primary transition-colors"
          title={t("actions.favourites") || "Favourites"}
        >
          <Heart size={20} />
          <span className="text-sm font-medium hidden sm:inline">
            {t("actions.favourites") || "Favourites"}
          </span>
        </button>
      )}

      {/* Wishlist - Only show if authenticated */}
      {isAuthenticated && (
        <button
          onClick={() => router.push("/wishlist")}
          className="flex items-center gap-2 text-neutral-700 hover:text-primary transition-colors"
          title={t("actions.wishlist") || "Wishlist"}
        >
          <Bookmark size={20} />
          <span className="text-sm font-medium hidden sm:inline">
            {t("actions.wishlist") || "Wishlist"}
          </span>
        </button>
      )}

      {/* Cart */}
      <button
        onClick={onCartClick}
        className="relative flex items-center gap-2 text-neutral-700 hover:text-primary transition-colors"
      >
        <div className="relative">
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -top-2 ${
                isRTL ? "-left-2" : "-right-2"
              } bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center`}
            >
              {totalItems}
            </motion.span>
          )}
        </div>
      </button>
    </>
  );
}
