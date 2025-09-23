import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setLocale } from "@/store/slices/localeSlice";
import { RootState } from "@/store";
import { i18nConfig } from "@/lib/i18n";
import { api } from "@/services/api";
import { setCurrentLocale } from "@/lib/localeService";
import { useAuth } from "@/hooks/useAuth";
import { useChangeLanguageMutation } from "@/services/api/authApi";
import { axiosInstance } from "@/lib/axios";

export const useLocale = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const invalidationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isAuthenticated } = useAuth();
  const [changeLanguageMutation] = useChangeLanguageMutation();

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
      const timeoutId = invalidationTimeoutRef.current;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const changeLocale = useCallback(async (newLocale: string) => {
    console.log(
      "useLocale - changeLocale called with:",
      newLocale,
      "isAuthenticated:",
      isAuthenticated
    );

    // If user is authenticated, update language preference in backend FIRST
    if (isAuthenticated) {
      try {
        console.log(
          "useLocale - Updating language preference in backend FIRST for authenticated user"
        );
        await changeLanguageMutation({
          locale: newLocale as "ar" | "en",
        }).unwrap();
        console.log(
          "useLocale - Language preference updated successfully in backend, now updating UI"
        );
      } catch (error) {
        console.error(
          "useLocale - Failed to update language preference in backend:",
          error
        );
        // Continue with frontend language change even if backend update fails
      }
    } else {
      console.log(
        "useLocale - User not authenticated, updating frontend locale only"
      );
    }

    // NOW update the UI after backend is updated (or if not authenticated)
    console.log("useLocale - Updating UI after backend response");

    // Update locale service FIRST (for immediate API requests)
    setCurrentLocale(newLocale);
    console.log("useLocale - Locale service updated to:", newLocale);

    // Update i18n to reflect UI language immediately
    try {
      await i18n.changeLanguage(newLocale);
    } catch (e) {
      console.warn("useLocale - Failed to change i18n language:", e);
    }

    // Update axios default locale header for immediate subsequent requests
    try {
      axiosInstance.defaults.headers.common["locale"] = newLocale;
      axiosInstance.defaults.headers.common["Accept-Language"] = newLocale;
      console.log("useLocale - Axios headers updated to:", newLocale);
    } catch (error) {
      console.warn("useLocale - Failed to update axios headers:", error);
    }

    // Update Redux state
    dispatch(setLocale(newLocale));

    // Set a cookie for next-i18n-router to read the new locale
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // Invalidate cached queries to force refetch with new locale from backend
    console.log(
      "useLocale - Invalidating queries to fetch data with new locale"
    );
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
    console.log("useLocale - Query invalidation dispatched");

    // Also invalidate React Query cache for language-dependent data
    queryClient.invalidateQueries({
      queryKey: ["notifications"],
      exact: false,
    });

    // Compute new path with updated locale
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + pathname);
    } else {
      router.push(pathname.replace(`/${currentLocale}`, `/${newLocale}`));
    }

    // Queries are already invalidated above for immediate effect

    router.refresh();
  }, [isAuthenticated, changeLanguageMutation, i18n, dispatch, queryClient, currentLocale, pathname, router]);

  return {
    currentLocale,
    changeLocale,
    isRTL: currentLocale === "ar",
  };
};
