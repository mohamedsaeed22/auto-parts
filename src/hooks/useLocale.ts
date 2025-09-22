import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setLocale } from "@/store/slices/localeSlice";
import { RootState } from "@/store";
import { i18nConfig } from "@/lib/i18n";
import { api } from "@/services/api";

export const useLocale = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const invalidationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (invalidationTimeoutRef.current) {
        clearTimeout(invalidationTimeoutRef.current);
      }
    };
  }, []);

  const changeLocale = (newLocale: string) => {
    // Update Redux state first
    dispatch(setLocale(newLocale));

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

    // Clear any existing invalidation timeout to prevent multiple invalidations
    if (invalidationTimeoutRef.current) {
      clearTimeout(invalidationTimeoutRef.current);
    }

    // Invalidate cached queries after navigation to prevent duplicate requests
    // Use setTimeout to ensure Redux state is updated and navigation is complete
    invalidationTimeoutRef.current = setTimeout(() => {
      // Only invalidate specific tags that need language updates
      // This prevents unnecessary refetches of data that doesn't depend on language
      dispatch(
        api.util.invalidateTags([
          "Products",
          "Categories",
          "Brands",
          "Banners",
          "Offers",
          "Sections",
          "Partners",
        ])
      );

      // Also invalidate React Query cache for language-dependent data
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
        exact: false, // This will invalidate all notification queries regardless of parameters
      });
    }, 100); // Small delay to ensure state is updated

    router.refresh();
  };

  return {
    currentLocale,
    changeLocale,
    isRTL: currentLocale === "ar",
  };
};
