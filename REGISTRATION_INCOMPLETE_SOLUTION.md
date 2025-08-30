# Registration Incomplete Solution

## Overview

This solution provides a comprehensive workflow for handling incomplete user registration scenarios. When users navigate to protected pages (like favourites, wishlist, etc.) and receive a 403 error with `is_registration_complete: false`, the system automatically detects this and redirects users to a complete registration page.

## Problem Statement

When users try to access protected pages, they may receive a response like:

```json
{
  "code": 403,
  "message": "يرجى إكمال تسجيلك",
  "errors": [],
  "data": {
    "is_registration_complete": false,
    "user": {
      "id": 4,
      "code": "WYF6LT",
      "name": null,
      "email": null,
      "phone": "01018205801",
      "type": null,
      "manager_name": null,
      "address": null,
      "city": null,
      "state": null,
      "zip": null,
      "tax_number": null,
      "commercial_register": null,
      "avatar": null,
      "latitude": null,
      "longitude": null,
      "is_registration_complete": false,
      "is_google_user": false
    }
  }
}
```

## Solution Architecture

### 1. Enhanced API Error Handling

**File: `src/services/api/baseApi.ts`**

- Detects 403 errors with `is_registration_complete: false`
- Stores the user registration code for later use
- Returns a custom error type for registration incomplete scenarios

### 2. Storage Management

**File: `src/lib/storage.ts`**

- Added methods to store and retrieve registration codes
- `setRegistrationCode(code: string)`
- `getRegistrationCode(): string | null`
- `clearRegistrationCode(): void`

### 3. Custom Hook for Registration Status

**File: `src/hooks/useRegistrationStatus.ts`**

- Manages registration incomplete state
- Provides utilities for handling registration incomplete errors
- Handles automatic navigation to complete registration page

### 4. Complete Registration Page

**File: `src/app/[locale]/complete-registration/page.tsx`**

- Dedicated page for completing user registration
- Pre-filled with user code from the error response
- Comprehensive form with all required fields
- Automatic redirect after successful completion

### 5. Enhanced Protected Route

**File: `src/components/auth/ProtectedRoute.tsx`**

- Checks for incomplete registration status
- Automatically redirects to complete registration page
- Shows appropriate loading states

### 6. Error Handler Component

**File: `src/components/auth/RegistrationErrorHandler.tsx`**

- Higher-order component for handling registration incomplete errors
- Can be wrapped around any page to automatically handle these errors
- Provides seamless error handling without manual intervention

## Workflow Steps

### Step 1: User Navigation

1. User navigates to a protected page (e.g., `/favourites`)
2. Page loads with `ProtectedRoute` wrapper
3. API call is made to fetch data

### Step 2: Error Detection

1. API returns 403 error with `is_registration_complete: false`
2. `baseApi.ts` detects this specific error pattern
3. User registration code is stored in localStorage
4. Custom error type is returned

### Step 3: Error Handling

1. `RegistrationErrorHandler` component detects the error
2. `useRegistrationStatus` hook processes the error
3. User is automatically redirected to `/complete-registration`

### Step 4: Registration Completion

1. User sees the complete registration form
2. Form is pre-filled with their registration code
3. User completes all required fields
4. Form is submitted to complete registration API

### Step 5: Success Handling

1. Registration is completed successfully
2. Auth data is updated with `is_registration_complete: true`
3. Registration code is cleared from storage
4. User is redirected back to their original destination

## Implementation Details

### Type Definitions

```typescript
// Registration Incomplete Error Response
export interface RegistrationIncompleteError {
  code: 403;
  message: string;
  errors: string[];
  data: {
    is_registration_complete: false;
    user: {
      id: number;
      code: string;
      // ... other user fields
      is_registration_complete: false;
    };
  };
}
```

### Usage in Components

```typescript
// Wrap any protected page with RegistrationErrorHandler
<ProtectedRoute>
  <RegistrationErrorHandler error={error}>
    {/* Your page content */}
  </RegistrationErrorHandler>
</ProtectedRoute>
```

### Hook Usage

```typescript
const {
  isRegistrationIncomplete,
  registrationCode,
  handleRegistrationIncomplete,
  isErrorRegistrationIncomplete,
} = useRegistrationStatus();

// Check if error is registration incomplete
if (error && isErrorRegistrationIncomplete(error)) {
  handleRegistrationIncomplete(error);
}
```

## Performance Optimizations

1. **Lazy Loading**: Registration incomplete detection only runs when needed
2. **Caching**: Registration codes are cached in localStorage
3. **Minimal Re-renders**: State updates are optimized to prevent unnecessary re-renders
4. **Error Boundary**: Errors are handled gracefully without breaking the UI

## Security Considerations

1. **Token Validation**: All requests still require valid authentication tokens
2. **Code Storage**: Registration codes are stored securely in localStorage
3. **Automatic Cleanup**: Codes are cleared after successful registration
4. **Validation**: All form inputs are validated before submission

## Testing Scenarios

### Test Case 1: Direct Navigation

1. User with incomplete registration navigates to `/favourites`
2. Should be redirected to `/complete-registration`
3. Should see their registration code displayed

### Test Case 2: API Error Handling

1. API returns 403 with `is_registration_complete: false`
2. Error should be detected and handled automatically
3. User should be redirected to complete registration

### Test Case 3: Registration Completion

1. User fills out complete registration form
2. Form should submit successfully
3. User should be redirected back to original page

### Test Case 4: Already Complete Registration

1. User with complete registration navigates to protected pages
2. Should not be redirected to complete registration
3. Should see normal page content

## Files Modified/Created

### New Files

- `src/hooks/useRegistrationStatus.ts`
- `src/app/[locale]/complete-registration/page.tsx`
- `src/components/auth/RegistrationErrorHandler.tsx`
- `REGISTRATION_INCOMPLETE_SOLUTION.md`

### Modified Files

- `src/services/api/types.ts` - Added RegistrationIncompleteError interface
- `src/services/api/baseApi.ts` - Enhanced error handling
- `src/lib/storage.ts` - Added registration code methods
- `src/hooks/index.ts` - Exported new hook
- `src/components/auth/ProtectedRoute.tsx` - Enhanced with registration checks
- `src/app/[locale]/favourites/page.tsx` - Added error handler
- `src/app/[locale]/wishlist/page.tsx` - Added error handler

## Benefits

1. **Seamless UX**: Users are automatically guided to complete registration
2. **No Manual Intervention**: System handles everything automatically
3. **Consistent Behavior**: Same workflow across all protected pages
4. **Performance Optimized**: Minimal overhead and efficient error handling
5. **Maintainable**: Clean, modular code structure
6. **Extensible**: Easy to add to new protected pages

## Future Enhancements

1. **Progress Tracking**: Show registration completion progress
2. **Email Notifications**: Send reminders for incomplete registration
3. **Analytics**: Track registration completion rates
4. **A/B Testing**: Test different registration flows
5. **Mobile Optimization**: Enhanced mobile registration experience
