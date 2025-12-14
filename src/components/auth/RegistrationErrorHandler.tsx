"use client";

import { useEffect } from "react";
import { useRegistrationStatus } from "@/hooks/useRegistrationStatus";

interface RegistrationErrorHandlerProps {
  children: React.ReactNode;
  error?: unknown;
}

export default function RegistrationErrorHandler({
  children,
  error,
}: RegistrationErrorHandlerProps) {
  const { handleRegistrationIncomplete, isErrorRegistrationIncomplete } =
    useRegistrationStatus();

  useEffect(() => {
    // Check if the error is a registration incomplete error
    if (error && isErrorRegistrationIncomplete(error)) {
      handleRegistrationIncomplete(error);
    }
  }, [error, handleRegistrationIncomplete, isErrorRegistrationIncomplete]);

  return <>{children}</>;
}
