"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAuthGuard, AUTH_GUARD_CONFIGS } from "@/hooks/useAuthGuard";
import {
  AuthGuard,
  ProtectedPageGuard,
  AuthOnlyGuard,
} from "@/components/auth/AuthGuard";
import {
  useApiErrorHandler,
  useMutationErrorHandler,
} from "@/hooks/useApiErrorHandler";
import {
  useGetFavouritesQuery,
  useAddToFavouritesMutation,
} from "@/services/api";

/**
 * Example 1: Using useAuthGuard hook directly in a component
 */
export function AuthGuardHookExample() {
  const {
    isAuthenticated,
    isRegistrationComplete,
    isLoading,
    checkAccess,
    redirectToLogin,
    redirectToCompleteRegistration,
  } = useAuthGuard(AUTH_GUARD_CONFIGS.PROTECTED_PAGE);

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-4">
        <p className="mb-4">You need to be logged in to see this content.</p>
        <Button onClick={redirectToLogin}>Login</Button>
      </div>
    );
  }

  if (!isRegistrationComplete) {
    return (
      <div className="text-center p-4">
        <p className="mb-4">
          Please complete your registration to access this feature.
        </p>
        <Button onClick={redirectToCompleteRegistration}>
          Complete Registration
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Protected Content</h3>
      <p>
        This content is only visible to authenticated users with complete
        registration.
      </p>
      <Button
        onClick={() => {
          const hasAccess = checkAccess();
          if (hasAccess) {
            alert("You have access to perform this action!");
          }
        }}
      >
        Check Access
      </Button>
    </div>
  );
}

/**
 * Example 2: Using AuthGuard component wrapper
 */
export function AuthGuardComponentExample() {
  return (
    <AuthGuard options={AUTH_GUARD_CONFIGS.PROTECTED_PAGE}>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          AuthGuard Protected Content
        </h3>
        <p>
          This content is automatically protected by the AuthGuard component.
        </p>
      </div>
    </AuthGuard>
  );
}

/**
 * Example 3: Using predefined AuthGuard components
 */
export function PredefinedGuardExamples() {
  return (
    <div className="space-y-6">
      {/* Full protection - requires auth + complete registration */}
      <ProtectedPageGuard>
        <div className="p-4 border rounded">
          <h4 className="font-semibold">Protected Page Content</h4>
          <p>Requires authentication and completed registration</p>
        </div>
      </ProtectedPageGuard>

      {/* Auth only - registration can be incomplete */}
      <AuthOnlyGuard>
        <div className="p-4 border rounded">
          <h4 className="font-semibold">Auth Only Content</h4>
          <p>Only requires authentication, registration can be incomplete</p>
        </div>
      </AuthOnlyGuard>
    </div>
  );
}

/**
 * Example 4: API Error Handling with RTK Query
 */
export function ApiErrorHandlingExample() {
  const { data: favourites, error, isLoading } = useGetFavouritesQuery();
  const [addToFavourites, { error: mutationError }] =
    useAddToFavouritesMutation();

  // Handle query errors automatically
  useApiErrorHandler(error);

  // Handle mutation errors manually
  const { handleError } = useMutationErrorHandler();

  const handleAddToFavourites = async (productId: number) => {
    try {
      await addToFavourites({ product_id: productId }).unwrap();
      alert("Added to favourites!");
    } catch (error) {
      // This will handle 401, 403 errors automatically
      handleError(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">API Error Handling Example</h3>
      <p className="mb-4">
        This component automatically handles authentication errors from API
        calls.
      </p>

      <Button onClick={() => handleAddToFavourites(1)} className="mb-4">
        Test Add to Favourites (May trigger auth errors)
      </Button>

      {favourites && (
        <div>
          <h4 className="font-semibold">Favourites:</h4>
          <pre className="text-sm bg-gray-100 p-2 rounded">
            {JSON.stringify(favourites, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Manual error handling with custom behavior
 */
export function CustomErrorHandlingExample() {
  const [addToFavourites] = useAddToFavouritesMutation();

  const handleAddWithCustomError = async (productId: number) => {
    try {
      await addToFavourites({ product_id: productId }).unwrap();
      alert("Success!");
    } catch (error: any) {
      // Custom handling for different error types
      if (error.status === 401) {
        alert("Custom: Please login first");
        // Custom redirect logic
        window.location.href = "/";
      } else if (
        error.status === 403 &&
        error.data?.data?.is_registration_complete === false
      ) {
        alert("Custom: Please complete your registration");
        // Custom redirect logic
        window.location.href = "/complete-registration";
      } else {
        alert("An error occurred");
      }
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Custom Error Handling</h3>
      <p className="mb-4">
        This example shows custom error handling instead of using the hooks.
      </p>

      <Button onClick={() => handleAddWithCustomError(1)}>
        Test with Custom Error Handling
      </Button>
    </div>
  );
}

/**
 * Main component showcasing all examples
 */
export default function AuthenticationExamples() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Authentication System Examples
        </h1>
        <p className="text-gray-600 mb-6">
          This page demonstrates different ways to use the authentication
          middleware system.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. useAuthGuard Hook</h2>
          <AuthGuardHookExample />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. AuthGuard Component</h2>
          <AuthGuardComponentExample />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Predefined Guards</h2>
          <PredefinedGuardExamples />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. API Error Handling</h2>
          <ApiErrorHandlingExample />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            5. Custom Error Handling
          </h2>
          <CustomErrorHandlingExample />
        </section>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Usage Guidelines</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>
            • Use <code>ProtectedPageGuard</code> for pages requiring full
            authentication
          </li>
          <li>
            • Use <code>AuthOnlyGuard</code> for pages that only need login
            (registration can be incomplete)
          </li>
          <li>
            • Use <code>useApiErrorHandler</code> for automatic error handling
            in components
          </li>
          <li>
            • Use <code>useMutationErrorHandler</code> for manual error handling
            in mutations
          </li>
          <li>
            • Use <code>useAuthGuard</code> hook for custom authentication logic
          </li>
        </ul>
      </div>
    </div>
  );
}
