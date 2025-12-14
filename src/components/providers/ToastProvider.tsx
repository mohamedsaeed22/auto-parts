"use client";

import { memo } from "react";
import { Toaster } from "react-hot-toast";

// Hoist constant objects to avoid new references on each render
const CONTAINER_STYLE = {} as const;

const TOAST_OPTIONS = {
  // Default options for all toasts
  duration: 4000,
  style: {
    background: "#ffffff",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  // Success toast
  success: {
    duration: 4000,
    style: {
      background: "#f0fdf4",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
    iconTheme: {
      primary: "#16a34a",
      secondary: "#f0fdf4",
    },
  },
  // Error toast
  error: {
    duration: 5000,
    style: {
      background: "#fef2f2",
      color: "#dc2626",
      border: "1px solid #fecaca",
    },
    iconTheme: {
      primary: "#dc2626",
      secondary: "#fef2f2",
    },
  },
  // Loading toast
  loading: {
    style: {
      background: "#f8fafc",
      color: "#475569",
      border: "1px solid #e2e8f0",
    },
  },
  // Custom toast for primary theme color
  custom: {
    style: {
      background: "#fef7ed",
      color: "#b45309",
      border: "1px solid #fed7aa",
    },
    iconTheme: {
      primary: "#b3984a",
      secondary: "#fef7ed",
    },
  },
} as const;

function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={CONTAINER_STYLE}
      toastOptions={TOAST_OPTIONS}
    />
  );
}

export default memo(ToastProvider);
