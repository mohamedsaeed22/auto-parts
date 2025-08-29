import toast from "react-hot-toast";

// Success toast
export const showSuccess = (message: string) => {
  return toast.success(message);
};

// Error toast
export const showError = (message: string) => {
  return toast.error(message);
};

// Loading toast
export const showLoading = (message: string) => {
  return toast.loading(message);
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
