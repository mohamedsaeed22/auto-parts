"use client";

import { useTranslation } from "react-i18next";
import { FieldError } from "react-hook-form";

/**
 * Custom hook to translate React Hook Form error messages
 * @returns Function to translate error messages
 */
export const useFormErrorTranslation = () => {
  const { t } = useTranslation("validation");

  /**
   * Translates a React Hook Form error object to a localized string
   * @param error - The error object from React Hook Form
   * @returns Translated error message or undefined if no error
   */
  const translateError = (
    error: FieldError | undefined
  ): string | undefined => {
    if (!error) return undefined;

    // If the error message is already a translation key, translate it
    if (error.message && error.message.startsWith("validation.")) {
      return t(error.message.replace("validation.", ""));
    }

    // For backward compatibility, return the original message if it's not a key
    return error.message;
  };

  /**
   * Gets a translated validation message by key
   * @param key - Translation key (e.g., "phone.required")
   * @returns Translated message
   */
  const getValidationMessage = (key: string): string => {
    return t(key);
  };

  return {
    translateError,
    getValidationMessage,
    t,
  };
};

export default useFormErrorTranslation;
