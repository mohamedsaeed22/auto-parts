import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { storage } from "@/lib/storage";
import type { RegistrationIncompleteErrorResponse } from "@/services/api/baseApi";

export function useRegistrationStatus() {
  const [isRegistrationIncomplete, setIsRegistrationIncomplete] =
    useState(false);
  const [registrationCode, setRegistrationCode] = useState<string | null>(null);
  const router = useRouter();
  const { currentLocale } = useLocale();

  useEffect(() => {
    // Check if user has incomplete registration
    const authData = storage.getAuth();
    const storedCode = storage.getRegistrationCode();

    if (authData && !authData.is_registration_complete) {
      setIsRegistrationIncomplete(true);
      setRegistrationCode(storedCode);
    } else {
      setIsRegistrationIncomplete(false);
      setRegistrationCode(null);
    }
  }, []);

  const handleRegistrationIncomplete = (
    error: RegistrationIncompleteErrorResponse
  ) => {
    console.log("Registration incomplete detected, redirecting...");

    setIsRegistrationIncomplete(true);
    if (error.data.data.user?.code) {
      setRegistrationCode(error.data.data.user.code);
      storage.setRegistrationCode(error.data.data.user.code);
    }

    // Store current page URL before redirecting
    const currentPath = window.location.pathname;
    storage.setPreviousPage(currentPath);
    console.log("Stored previous page:", currentPath);

    // Redirect to complete registration page
    router.push(`/${currentLocale}/complete-registration`);
  };

  const clearRegistrationIncomplete = () => {
    setIsRegistrationIncomplete(false);
    setRegistrationCode(null);
    storage.clearRegistrationCode();
    storage.clearPreviousPage(); // Also clear the previous page URL
  };

  const isErrorRegistrationIncomplete = (
    error: unknown
  ): error is RegistrationIncompleteErrorResponse => {
    return (
      error &&
      "status" in error &&
      error.status === 403 &&
      "data" in error &&
      error.data?.data?.is_registration_complete === false
    );
  };

  return {
    isRegistrationIncomplete,
    registrationCode,
    handleRegistrationIncomplete,
    clearRegistrationIncomplete,
    isErrorRegistrationIncomplete,
  };
}
