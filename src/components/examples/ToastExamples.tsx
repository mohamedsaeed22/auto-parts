"use client";

import { Button } from "@/components/ui/button";
import {
  showSuccess,
  showError,
  showLoading,
  showPromise,
  dismissAll,
} from "@/lib/toast";

export default function ToastExamples() {
  const handleSuccessToast = () => {
    showSuccess("تم حفظ البيانات بنجاح!");
  };

  const handleErrorToast = () => {
    showError("حدث خطأ أثناء حفظ البيانات");
  };

  const handleLoadingToast = () => {
    const loadingToast = showLoading("جاري التحميل...");

    // Simulate async operation
    setTimeout(() => {
      dismissAll();
      showSuccess("تم التحميل بنجاح!");
    }, 2000);
  };

  const handlePromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve("تم بنجاح!");
        } else {
          reject(new Error("حدث خطأ!"));
        }
      }, 2000);
    });

    showPromise(promise, {
      loading: "جاري المعالجة...",
      success: "تمت العملية بنجاح!",
      error: "فشلت العملية",
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Toast Examples</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button
          onClick={handleSuccessToast}
          className="bg-green-600 hover:bg-green-700"
        >
          Success Toast
        </Button>

        <Button
          onClick={handleErrorToast}
          className="bg-red-600 hover:bg-red-700"
        >
          Error Toast
        </Button>

        <Button
          onClick={handleLoadingToast}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Loading Toast
        </Button>

        <Button
          onClick={handlePromiseToast}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Promise Toast
        </Button>

        <Button onClick={dismissAll} variant="outline">
          Dismiss All
        </Button>
      </div>
    </div>
  );
}
