"use client";

import React from "react";
import RegistrationErrorHandler from "./RegistrationErrorHandler";
import ProtectedRoute from "./ProtectedRoute";

interface WithRegistrationErrorHandlingProps {
  error?: any;
  children: React.ReactNode;
}

/**
 * Higher-Order Component that wraps a component with both ProtectedRoute and RegistrationErrorHandler
 * This makes it easy to add registration error handling to any protected page
 */
export function withRegistrationErrorHandling<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(
    props: P & WithRegistrationErrorHandlingProps
  ) {
    const { error, ...componentProps } = props;

    return (
      <ProtectedRoute>
        <RegistrationErrorHandler error={error}>
          <Component {...(componentProps as P)} />
        </RegistrationErrorHandler>
      </ProtectedRoute>
    );
  };
}

/**
 * Simple wrapper component for pages that need registration error handling
 * Usage: <ProtectedPageWithErrorHandling error={error}>content</ProtectedPageWithErrorHandling>
 */
export function ProtectedPageWithErrorHandling({
  error,
  children,
}: WithRegistrationErrorHandlingProps) {
  return (
    <ProtectedRoute>
      <RegistrationErrorHandler error={error}>
        {children}
      </RegistrationErrorHandler>
    </ProtectedRoute>
  );
}
