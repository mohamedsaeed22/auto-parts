"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function PaymentAlert() {
  const { i18n } = useTranslation();
  const processedRef = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Check if already processed
    if (processedRef.current) return;

    // Get URL params
    const urlParams = new URLSearchParams(window.location.search);
    const paymentMethod = urlParams.get("payment_method");
    const transactionId = urlParams.get("transaction_id");

    // If no payment params, do nothing
    if (!paymentMethod) return;

    // Mark as processed immediately
    processedRef.current = true;

    const isArabic = (i18n?.language || "ar").startsWith("ar");

    // Show appropriate toast message
    let message = "";
    if (paymentMethod === "success") {
      message = isArabic
        ? transactionId
          ? `تمت عملية الدفع بنجاح. رقم العملية: ${transactionId}`
          : "تمت عملية الدفع بنجاح."
        : transactionId
        ? `Payment successful. Transaction ID: ${transactionId}`
        : "Payment successful.";

      toast.success(message, { duration: 3000 });
    } else if (paymentMethod === "failed") {
      message = isArabic
        ? "فشلت عملية الدفع. يرجى المحاولة مرة أخرى."
        : "Payment failed. Please try again.";
      toast.error(message, { duration: 3000 });
    }

    // Clean URL immediately after showing toast
    setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.delete("payment_method");
      url.searchParams.delete("transaction_id");

      // Replace the URL in browser history
      window.history.replaceState({}, "", url.toString());
    }, 3100); // Slightly after toast disappears
  }, [i18n?.language]);

  return null;
}
