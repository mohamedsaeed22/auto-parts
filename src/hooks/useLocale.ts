import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setLocale } from "@/store/slices/localeSlice";
import { RootState } from "@/store";
import { i18nConfig } from "@/lib/i18n";
import { api } from "@/services/api";
import { setCurrentLocale, addLocaleChangeListener } from "@/lib/localeService";
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
  const [isChangingLocale, setIsChangingLocale] = useState(false);

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

  // Listen to locale service changes for immediate UI updates
  useEffect(() => {
    const unsubscribe = addLocaleChangeListener((newLocale) => {
      // Force immediate UI update
      if (i18n.language !== newLocale) {
        i18n.changeLanguage(newLocale).catch(console.warn);
      }
      if (currentLocale !== newLocale) {
        dispatch(setLocale(newLocale));
      }
    });

    return unsubscribe;
  }, [i18n, currentLocale, dispatch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      const timeoutId = invalidationTimeoutRef.current;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const changeLocale = useCallback(
    async (newLocale: string) => {
      if (isChangingLocale) {
        return;
      }

      setIsChangingLocale(true);

      try {
        // Step 1: Update locale service IMMEDIATELY (this triggers listeners)
        setCurrentLocale(newLocale);

        // Step 2: Update axios headers immediately for subsequent requests
        try {
          axiosInstance.defaults.headers.common["locale"] = newLocale;
          axiosInstance.defaults.headers.common["Accept-Language"] = newLocale;
        } catch (error) {}

        // Step 3: Update i18n immediately for UI
        try {
          await i18n.changeLanguage(newLocale);
        } catch (e) {}

        // Step 4: Update Redux state
        dispatch(setLocale(newLocale));

        // Step 5: Set cookie for persistence
        const days = 30;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = date.toUTCString();
        document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

        // Step 6: If user is authenticated, update backend preference
        if (isAuthenticated) {
          try {
            await changeLanguageMutation({
              locale: newLocale as "ar" | "en",
            }).unwrap();
          } catch (error) {
            // Don't fail the entire operation if backend update fails
          }
        }

        // Step 7: Invalidate all cached queries to force refetch with new locale

        // Invalidate RTK Query cache
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

        // Invalidate React Query cache
        queryClient.invalidateQueries({
          queryKey: ["notifications"],
          exact: false,
        });

        // Step 8: Update URL and refresh
        // Compute new path with updated locale
        // Preserve search parameters and hash
        const searchParams = typeof window !== "undefined" ? window.location.search : "";
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        
        let newPath = "";
        if (
          currentLocale === i18nConfig.defaultLocale &&
          !i18nConfig.prefixDefault
        ) {
          newPath = "/" + newLocale + pathname;
        } else {
          newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
        }
        
        // Add search parameters and hash back to the new path
        router.push(newPath + searchParams + hash);

        // Small delay to ensure all updates are processed before refresh
        setTimeout(() => {
          router.refresh();
        }, 100);
      } catch (error) {
        // Error during locale change
      } finally {
        // Reset changing flag after a delay to ensure all operations complete
        setTimeout(() => {
          setIsChangingLocale(false);
        }, 500);
      }
    },
    [
      isChangingLocale,
      isAuthenticated,
      changeLanguageMutation,
      i18n,
      dispatch,
      queryClient,
      currentLocale,
      pathname,
      router,
    ]
  );

  return {
    currentLocale,
    changeLocale,
    isRTL: currentLocale === "ar",
    isChangingLocale,
  };
};
