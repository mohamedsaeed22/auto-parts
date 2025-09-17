import { User, ShoppingCart, Heart, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LoginDialog from "../LoginDialog";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
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
            <button
              className="p-2 text-neutral-700 hover:text-primary transition-colors"
              title={t("actions.account") || "Account"}
            >
              <User size={20} />
            </button>
          }
        />
      )}

      {/* Notifications - Only show if authenticated */}
      {isAuthenticated && <NotificationDropdown isRTL={isRTL} />}

      {/* Favourites - Only show if authenticated */}
      {isAuthenticated && (
        <button
          onClick={() => router.push("/favourites")}
          className="p-2 text-neutral-700 hover:text-primary transition-colors"
          title={t("actions.favourites") || "Favourites"}
        >
          <Heart size={20} />
        </button>
      )}

      {/* Wishlist - Only show if authenticated */}
      {isAuthenticated && (
        <button
          onClick={() => router.push("/wishlist")}
          className="p-2 text-neutral-700 hover:text-primary transition-colors"
          title={t("actions.wishlist") || "Wishlist"}
        >
          <Bookmark size={20} />
        </button>
      )}

      {/* Cart */}
      <button
        onClick={onCartClick}
        className="relative p-2 text-neutral-700 hover:text-primary transition-colors"
        title={t("cart.cart") || "Cart"}
      >
        <div className="relative">
          <ShoppingCart size={20} />
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
