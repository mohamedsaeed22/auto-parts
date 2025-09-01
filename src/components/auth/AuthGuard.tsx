"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthGuard, AuthGuardOptions } from "@/hooks/useAuthGuard";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  options?: AuthGuardOptions;
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
}

// Default loading component
const DefaultLoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-gray-600">Checking authentication...</p>
    </div>
  </div>
);

// Default fallback component for when access is denied
const DefaultFallbackComponent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Access Denied
      </h2>
      <p className="text-gray-600">
        You don't have permission to access this page.
      </p>
    </div>
  </div>
);

/**
 * AuthGuard Component
 *
 * Wraps components/pages that require authentication and/or completed registration.
 * Shows loading state while checking auth, and handles redirects/fallbacks appropriately.
 *
 * @param children - The component to render if access is granted
 * @param options - Authentication requirements and behavior options
 * @param fallback - Component to show if access is denied (instead of redirecting)
 * @param loadingComponent - Component to show while checking authentication
 */
export function AuthGuard({
  children,
  options,
  fallback,
  loadingComponent,
}: AuthGuardProps) {
  const { isAuthenticated, isRegistrationComplete, isLoading, checkAccess } =
    useAuthGuard(options);

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      const access = checkAccess();
      setHasAccess(access);
    }
  }, [isLoading, checkAccess]);

  // Show loading state
  if (isLoading || hasAccess === null) {
    return loadingComponent || <DefaultLoadingComponent />;
  }

  // Show fallback if access is denied and fallback is provided
  if (!hasAccess && fallback) {
    return <>{fallback}</>;
  }

  // Show default fallback if access is denied and no custom fallback
  if (!hasAccess && !fallback) {
    return <DefaultFallbackComponent />;
  }

  // Render children if access is granted
  return <>{children}</>;
}

/**
 * Higher-Order Component for page-level protection
 */
export function withAuthGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: AuthGuardOptions
) {
  const AuthGuardedComponent = (props: P) => {
    return (
      <AuthGuard options={options}>
        <WrappedComponent {...props} />
      </AuthGuard>
    );
  };

  AuthGuardedComponent.displayName = `withAuthGuard(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return AuthGuardedComponent;
}

// Predefined AuthGuard components for common use cases
export const ProtectedPageGuard = ({ children }: { children: ReactNode }) => (
  <AuthGuard
    options={{
      requireAuth: true,
      requireCompleteRegistration: true,
      redirectOnAuthFail: "/",
      redirectOnIncompleteRegistration: "/complete-registration",
      showToastOnAuthFail: true,
      showToastOnIncompleteRegistration: true,
    }}
  >
    {children}
  </AuthGuard>
);

export const AuthOnlyGuard = ({ children }: { children: ReactNode }) => (
  <AuthGuard
    options={{
      requireAuth: true,
      requireCompleteRegistration: false,
      redirectOnAuthFail: "/",
      showToastOnAuthFail: true,
      showToastOnIncompleteRegistration: false,
    }}
  >
    {children}
  </AuthGuard>
);

export const SilentAuthGuard = ({ children }: { children: ReactNode }) => (
  <AuthGuard
    options={{
      requireAuth: true,
      requireCompleteRegistration: true,
      redirectOnAuthFail: "/",
      redirectOnIncompleteRegistration: "/complete-registration",
      showToastOnAuthFail: false,
      showToastOnIncompleteRegistration: false,
    }}
  >
    {children}
  </AuthGuard>
);
