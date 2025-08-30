# Google OAuth Integration Setup Guide

## Overview

This guide explains how to set up Google OAuth login in your auto-parts application. The integration includes:

- Google Identity Services for authentication
- Backend API integration
- Error handling and user feedback

## Files Created/Modified

### 1. `src/lib/googleAuth.ts`

- Google OAuth utility functions
- JWT token decoding
- Backend API communication

### 2. `src/components/auth/LoginForm.tsx`

- Integrated Google OAuth button
- Automatic Google script loading
- Response handling

### 3. `src/app/api/auth/google-login/route.ts`

- Next.js API route for handling Google login
- Backend communication
- Error handling

### 4. `src/app/[locale]/test-google/page.tsx`

- Test page for verifying OAuth functionality
- Debug information display

## Setup Steps

### 1. Google Cloud Console Configuration

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project** or create a new one
3. **Enable APIs**:

   - Go to "APIs & Services" → "Library"
   - Search for "Google Identity Services"
   - Click "Enable"

4. **Configure OAuth Consent Screen**:

   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in required information:
     - App name: "Auto Parts"
     - User support email: your email
     - Developer contact information: your email
   - Add scopes: `email`, `profile`
   - Add test users if in testing mode

5. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:3001
     https://yourdomain.com (if deployed)
     ```
   - Copy the Client ID

### 2. Environment Variables

Create or update your `.env.local` file:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Base URL (for your backend)
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
```

### 3. Backend API Endpoint

Your backend should have an endpoint to handle Google login:

```
POST /api/auth/google-login
Content-Type: application/json

{
  "google_id": "user_google_id_here"
}
```

Expected response:

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "token": "jwt_token_here"
}
```

## How It Works

### 1. **Frontend Flow**:

1. User clicks Google login button
2. Google Identity Services opens OAuth popup
3. User authenticates with Google
4. Google returns JWT token with user info
5. Frontend decodes JWT and extracts Google ID
6. Frontend sends Google ID to Next.js API route
7. Next.js API route forwards request to your backend
8. Backend processes authentication and returns user data
9. Frontend handles success/error response

### 2. **Backend Integration**:

- The Next.js API route (`/api/auth/google-login`) acts as a proxy
- It forwards the Google ID to your actual backend server
- You can modify the API route to match your backend requirements

## Testing

### 1. **Test Page**:

Visit `/test-google` to test the OAuth integration:

- Shows the Google sign-in button
- Displays debug information
- Shows success/error messages

### 2. **Login Form**:

The main login form now includes Google OAuth:

- Integrated into the existing login flow
- Handles both phone and Google authentication
- Provides user feedback

## Customization

### 1. **Styling the Google Button**:

Modify the `renderGoogleButton` function in `googleAuth.ts`:

```typescript
window.google.accounts.id.renderButton(document.getElementById(elementId), {
  theme: "outline", // or "filled_blue", "filled_black"
  size: "large", // or "medium", "small"
  type: "standard", // or "icon"
  text: "signin_with", // or "signup_with", "continue_with"
});
```

### 2. **Backend API Customization**:

Update the API route in `route.ts` to match your backend:

```typescript
const backendResponse = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google-login`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${yourAuthToken}`,
      // Add any additional headers
    },
    body: JSON.stringify({
      google_id: googleId,
      // Add any additional data
    }),
  }
);
```

### 3. **Error Handling**:

Customize error messages in `LoginForm.tsx`:

```typescript
} catch (error) {
  console.error("Google login error:", error);
  showError("Custom error message here");
}
```

## Troubleshooting

### Common Issues:

1. **403 Forbidden Error**:

   - Check authorized JavaScript origins in Google Cloud Console
   - Ensure OAuth consent screen is configured
   - Verify API is enabled

2. **Button Not Rendering**:

   - Check browser console for errors
   - Verify Google script is loading
   - Ensure element ID matches

3. **Backend Communication Issues**:
   - Check API endpoint URL
   - Verify request format
   - Check network tab for errors

### Debug Steps:

1. **Check Browser Console**:

   - Look for JavaScript errors
   - Check network requests
   - Verify Google script loading

2. **Test API Endpoint**:

   - Use Postman or similar tool
   - Test with sample Google ID
   - Verify response format

3. **Verify Configuration**:
   - Check environment variables
   - Verify Google Cloud Console settings
   - Test with different browsers

## Security Considerations

1. **Client ID Security**:

   - Client ID is public and safe to expose
   - Keep server-side secrets secure
   - Use environment variables for sensitive data

2. **Token Validation**:

   - Always validate JWT tokens on backend
   - Check token expiration
   - Verify token signature

3. **CORS Configuration**:
   - Configure CORS properly on your backend
   - Allow only necessary origins
   - Handle preflight requests

## Support

If you encounter issues:

1. **Check the test page** (`/test-google`) for debugging info
2. **Review browser console** for error messages
3. **Verify Google Cloud Console** configuration
4. **Test API endpoints** independently
5. **Check network tab** for failed requests

## Next Steps

After successful integration:

1. **Add user state management** (Redux, Context, etc.)
2. **Implement user profile pages**
3. **Add logout functionality**
4. **Handle token refresh**
5. **Add loading states and better UX**
