import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { setLocale } from "@/store/slices/localeSlice";
import { RootState } from "@/store";
import { i18nConfig } from "@/lib/i18n";
import { api } from "@/services/api";

export const useLocale = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();

  // Get current locale from Redux state
  const currentLocale = useSelector(
    (state: RootState) => state.locale.currentLocale
  );

  // Sync Redux state with i18n language
  useEffect(() => {
    if (i18n.language !== currentLocale) {
      dispatch(setLocale(i18n.language));
    }
  }, [i18n.language, currentLocale, dispatch]);

  const changeLocale = (newLocale: string) => {
    // Update Redux state
    dispatch(setLocale(newLocale));

    // Invalidate cached queries so components refetch with the new locale
    dispatch(
      api.util.invalidateTags([
        "Auth",
        "Profile",
        "Products",
        "Categories",
        "Brands",
        "Cart",
        "Wishlist",
        "Favourites",
        "Orders",
        "Addresses",
        "Requests",
        "Banners",
        "Offers",
        "Sections",
        "Partners",
        "Settings",
      ])
    );

    // Set a cookie for next-i18n-router to read the new locale
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // Compute new path with updated locale
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + pathname);
    } else {
      router.push(pathname.replace(`/${currentLocale}`, `/${newLocale}`));
    }

    router.refresh();
  };

  return {
    currentLocale,
    changeLocale,
    isRTL: currentLocale === "ar",
  };
};
