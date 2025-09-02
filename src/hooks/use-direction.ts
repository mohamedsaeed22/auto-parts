import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  getDirection,
  getTextAlign,
  getOppositeTextAlign,
  getFlexDirection,
  getOppositeFlexDirection,
} from "@/lib/i18n/config";

export function useDirection() {
  const { i18n } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  const direction = getDirection(i18n.language as "ar" | "en");
  const isRTL = direction === "rtl";

  const textAlign = getTextAlign(i18n.language as "ar" | "en");
  const oppositeTextAlign = getOppositeTextAlign(i18n.language as "ar" | "en");

  const flexDirection = getFlexDirection(i18n.language as "ar" | "en");
  const oppositeFlexDirection = getOppositeFlexDirection(i18n.language as "ar" | "en");

  return {
    direction,
    isRTL,
    textAlign,
    oppositeTextAlign,
    flexDirection,
    oppositeFlexDirection,
    isMobile,
    isTablet,
    isDesktop,
    // Utility classes
    classes: {
      textAlign: isRTL ? "text-right" : "text-left",
      oppositeTextAlign: isRTL ? "text-left" : "text-right",
      flexDirection: isRTL ? "flex-row-reverse" : "flex-row",
      oppositeFlexDirection: isRTL ? "flex-row" : "flex-row-reverse",
      // Margin utilities
      marginStart: (value: number) => isRTL ? `ml-${value}` : `mr-${value}`,
      marginEnd: (value: number) => isRTL ? `mr-${value}` : `ml-${value}`,
      // Padding utilities
      paddingStart: (value: number) => isRTL ? `pl-${value}` : `pr-${value}`,
      paddingEnd: (value: number) => isRTL ? `pr-${value}` : `pl-${value}`,
      // Border utilities
      borderStart: (width: number = 1) => isRTL ? `border-l-${width}` : `border-r-${width}`,
      borderEnd: (width: number = 1) => isRTL ? `border-r-${width}` : `border-l-${width}`,
      // Responsive utilities
      responsiveClasses: {
        flexDirection: isRTL
          ? "flex-col md:flex-row-reverse"
          : "flex-col md:flex-row",
        oppositeFlexDirection: isRTL
          ? "flex-col md:flex-row"
          : "flex-col md:flex-row-reverse",
      },
    },
  };
}