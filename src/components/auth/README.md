# Authentication Middleware System

A comprehensive authentication and authorization system for the auto parts application that handles user login, registration completion, and route protection.

## Features

- ✅ **Route Protection**: Protect pages that require authentication and/or completed registration
- ✅ **Automatic Error Handling**: Handle 401 (unauthorized) and 403 (registration incomplete) API responses
- ✅ **Toast Notifications**: Show user-friendly error messages
- ✅ **Automatic Redirects**: Redirect users to login or registration completion pages
- ✅ **Previous Page Storage**: Remember where users were trying to go and redirect back after auth
- ✅ **Flexible Configuration**: Multiple protection levels and custom behaviors
- ✅ **TypeScript Support**: Full type safety and IntelliSense
- ✅ **Bilingual Support**: Error messages in English and Arabic

## Components Overview

### 1. `useAuthGuard` Hook

The main hook for authentication logic. Use this when you need custom authentication behavior.

```typescript
import { useAuthGuard, AUTH_GUARD_CONFIGS } from "@/hooks/useAuthGuard";

function MyComponent() {
  const {
    isAuthenticated,
    isRegistrationComplete,
    isLoading,
    checkAccess,
    redirectToLogin,
    redirectToCompleteRegistration,
  } = useAuthGuard(AUTH_GUARD_CONFIGS.PROTECTED_PAGE);

  // Your component logic
}
```

### 2. `AuthGuard` Component

A wrapper component that protects its children based on authentication requirements.

```typescript
import { AuthGuard } from "@/components/auth/AuthGuard";

function MyPage() {
  return (
    <AuthGuard
      options={{
        requireAuth: true,
        requireCompleteRegistration: true,
        showToastOnAuthFail: true,
      }}
    >
      <div>Protected content here</div>
    </AuthGuard>
  );
}
```

### 3. Predefined Guard Components

Ready-to-use components for common protection scenarios:

```typescript
import {
  ProtectedPageGuard,
  AuthOnlyGuard,
  SilentAuthGuard
} from "@/components/auth/AuthGuard";

// Full protection (auth + complete registration)
<ProtectedPageGuard>
  <div>Fully protected content</div>
</ProtectedPageGuard>

// Auth only (registration can be incomplete)
<AuthOnlyGuard>
  <div>Auth-only content</div>
</AuthOnlyGuard>

// Silent protection (no toast messages)
<SilentAuthGuard>
  <div>Silently protected content</div>
</SilentAuthGuard>
```

### 4. API Error Handling Hooks

Handle authentication errors from API calls automatically:

```typescript
import {
  useApiErrorHandler,
  useMutationErrorHandler,
} from "@/hooks/useApiErrorHandler";

function MyComponent() {
  // Automatic error handling for queries
  const { data, error } = useGetSomeDataQuery();
  useApiErrorHandler(error);

  // Manual error handling for mutations
  const [mutate] = useSomeMutation();
  const { handleError } = useMutationErrorHandler();

  const handleSubmit = async () => {
    try {
      await mutate(data).unwrap();
    } catch (error) {
      handleError(error); // Handles 401/403 automatically
    }
  };
}
```

## Configuration Options

### AuthGuardOptions

```typescript
interface AuthGuardOptions {
  requireAuth?: boolean; // Default: true
  requireCompleteRegistration?: boolean; // Default: true
  redirectOnAuthFail?: string; // Default: "/"
  redirectOnIncompleteRegistration?: string; // Default: "/complete-registration"
  showToastOnAuthFail?: boolean; // Default: true
  showToastOnIncompleteRegistration?: boolean; // Default: true
}
```

### Predefined Configurations

```typescript
import { AUTH_GUARD_CONFIGS } from "@/hooks/useAuthGuard";

// Full protection
AUTH_GUARD_CONFIGS.PROTECTED_PAGE;

// Auth only
AUTH_GUARD_CONFIGS.AUTH_ONLY;

// Silent redirects
AUTH_GUARD_CONFIGS.SILENT_REDIRECT;

// Optional auth (status checking only)
AUTH_GUARD_CONFIGS.OPTIONAL_AUTH;
```

## Usage Examples

### 1. Protecting a Full Page

```typescript
// pages/favourites/page.tsx
import { ProtectedPageGuard } from "@/components/auth/AuthGuard";

export default function FavouritesPage() {
  return (
    <ProtectedPageGuard>
      <div>Your favourites content</div>
    </ProtectedPageGuard>
  );
}
```

### 2. Protecting with Custom Options

```typescript
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function MyPage() {
  return (
    <AuthGuard
      options={{
        requireAuth: true,
        requireCompleteRegistration: false, // Allow incomplete registration
        redirectOnAuthFail: "/custom-login",
        showToastOnAuthFail: false, // No toast messages
      }}
    >
      <div>Custom protected content</div>
    </AuthGuard>
  );
}
```

### 3. Using Hook for Custom Logic

```typescript
import { useAuthGuard } from "@/hooks/useAuthGuard";

function MyComponent() {
  const { isAuthenticated, isRegistrationComplete, checkAccess } = useAuthGuard(
    {
      requireAuth: true,
      requireCompleteRegistration: true,
    }
  );

  const handleAction = () => {
    if (!checkAccess()) {
      // Access denied, user will be redirected automatically
      return;
    }

    // Proceed with action
    performProtectedAction();
  };

  return <button onClick={handleAction}>Protected Action</button>;
}
```

### 4. API Error Handling

```typescript
import { useGetFavouritesQuery } from "@/services/api";
import { useApiErrorHandler } from "@/hooks/useApiErrorHandler";

function FavouritesList() {
  const { data, error, isLoading } = useGetFavouritesQuery();

  // This will automatically handle 401/403 errors
  useApiErrorHandler(error);

  if (isLoading) return <div>Loading...</div>;

  return <div>{/* Render favourites */}</div>;
}
```

### 5. Higher-Order Component

```typescript
import { withAuthGuard } from "@/components/auth/AuthGuard";

const MyProtectedComponent = withAuthGuard(
  ({ data }: { data: string }) => <div>{data}</div>,
  { requireAuth: true, requireCompleteRegistration: true }
);

// Usage
<MyProtectedComponent data="Protected data" />;
```

## Error Handling Flow

### 401 Unauthorized Response

1. Clear authentication data from localStorage
2. Dispatch auth change event
3. Store current page for redirect after login
4. Show toast notification (if enabled)
5. Redirect to login page (if enabled)

### 403 Registration Incomplete Response

1. Update auth data with incomplete registration status
2. Store user code for registration completion
3. Dispatch auth change event
4. Show toast notification (if enabled)
5. Redirect to complete registration page (if enabled)

## Integration with Existing Code

### BaseAPI Integration

The system is already integrated with your `baseApi.ts`:

```typescript
// src/services/api/baseApi.ts
// Automatically handles 401 and 403 responses
// Updates localStorage and dispatches events
// Works with all RTK Query endpoints
```

### Storage Integration

Uses your existing storage utility:

```typescript
// src/lib/storage.ts
// Stores auth data, registration codes, and previous pages
// Provides authentication status checking
// Maintains user session state
```

## Toast Messages

The system uses your existing `react-hot-toast` setup:

- **English**: "Please login to access this page"
- **Arabic**: "يرجى تسجيل الدخول للوصول إلى هذه الصفحة"

## Migration Guide

### From Old System

Replace old components:

```typescript
// Old
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RegistrationErrorHandler from "@/components/auth/RegistrationErrorHandler";

// New
import { ProtectedPageGuard } from "@/components/auth/AuthGuard";
import { useApiErrorHandler } from "@/hooks/useApiErrorHandler";
```

### Update Pages

```typescript
// Old
<ProtectedRoute>
  <RegistrationErrorHandler error={error}>
    <div>Content</div>
  </RegistrationErrorHandler>
</ProtectedRoute>

// New
<ProtectedPageGuard>
  <div>Content</div>
</ProtectedPageGuard>

// Add error handling
useApiErrorHandler(error);
```

## Best Practices

1. **Use Predefined Guards**: Use `ProtectedPageGuard` for most cases
2. **Handle API Errors**: Always use `useApiErrorHandler` with RTK Query
3. **Custom Logic**: Use `useAuthGuard` hook for complex authentication logic
4. **Error Boundaries**: Combine with React error boundaries for robust error handling
5. **Testing**: Mock the storage utility and auth hooks in tests
6. **Performance**: Guards check authentication on mount and storage changes only

## Troubleshooting

### Common Issues

1. **Infinite Redirects**: Check that redirect URLs don't have their own auth guards
2. **Toast Spam**: Use silent guards or disable toasts for automatic retries
3. **Storage Issues**: Ensure localStorage is available (SSR considerations)
4. **Event Listeners**: Guards automatically clean up event listeners

### Debug Mode

Enable debug logging:

```typescript
// In your component
useEffect(() => {
  window.addEventListener("authChange", () => {
    console.log("Auth changed:", storage.getAuth());
  });
}, []);
```

## TypeScript Support

All components and hooks are fully typed:

```typescript
import type { AuthGuardOptions, AuthStatus } from "@/hooks/useAuthGuard";
import type { ApiError } from "@/hooks/useApiErrorHandler";
```

## Browser Support

- Modern browsers with localStorage support
- React 18+ with hooks support
- Next.js 13+ with app router support
