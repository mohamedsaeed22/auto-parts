import toast from "react-hot-toast";
import { getCurrentLocale } from "@/lib/localeService";

// Track recent toast messages to prevent duplicates
const recentToasts = new Map<string, number>();
const TOAST_COOLDOWN = 3000; // 3 seconds cooldown between identical messages

// Helper function to check if toast should be shown
const shouldShowToast = (message: string): boolean => {
  const now = Date.now();
  const lastShown = recentToasts.get(message);

  if (lastShown && now - lastShown < TOAST_COOLDOWN) {
    return false;
  }

  recentToasts.set(message, now);
  return true;
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [message, timestamp] of recentToasts.entries()) {
    if (now - timestamp > TOAST_COOLDOWN) {
      recentToasts.delete(message);
    }
  }
}, TOAST_COOLDOWN);

// Success toast
export const showSuccess = (message: string) => {
  if (shouldShowToast(message)) {
    return toast.success(message);
  }
  return null;
};

// Error toast with translation support
export const showError = (message: string) => {
  // Check if message is a translation key (contains dots or starts with namespace)
  const isTranslationKey =
    message.includes(".") || message.startsWith("errors.");

  let displayMessage = message;

  if (isTranslationKey) {
    // Simple translation mapping for cart errors
    const translations: Record<string, Record<string, string>> = {
      ar: {
        "errors.syncFailed": "فشل في مزامنة السلة",
        "errors.quantityUpdateFailed": "فشل في تحديث الكمية",
      },
      en: {
        "errors.syncFailed": "Failed to sync cart",
        "errors.quantityUpdateFailed": "Failed to update quantity",
      },
    };

    const currentLocale = getCurrentLocale();
    const localeTranslations =
      translations[currentLocale] || translations["ar"];
    displayMessage = localeTranslations[message] || message;
  }

  if (shouldShowToast(displayMessage)) {
    return toast.error(displayMessage);
  }
  return null;
};

// Warning toast
export const showWarning = (message: string) => {
  if (shouldShowToast(message)) {
    return toast(message, {
      icon: "⚠️",
      style: {
        background: "#fff7ed",
        color: "#9a3412",
        border: "1px solid #fdba74",
      },
    });
  }
  return null;
};

// Loading toast
export const showLoading = (message: string) => {
  if (shouldShowToast(message)) {
    return toast.loading(message);
  }
  return null;
};

// Promise toast for async operations
export const showPromise = <T>(
  promise: Promise<T>,
  {
    loading = "جاري التحميل...",
    success = "تم بنجاح!",
    error = "حدث خطأ!",
  }: {
    loading?: string;
    success?: string;
    error?: string;
  } = {}
) => {
  return toast.promise(promise, {
    loading,
    success,
    error,
  });
};

// Dismiss all toasts
export const dismissAll = () => {
  toast.dismiss();
};

// Dismiss specific toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Clear toast history (useful for testing or when user logs out)
export const clearToastHistory = () => {
  recentToasts.clear();
};
