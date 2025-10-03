# Arabic as Default Language - Implementation

## Summary
Changed the default language of the application from English to Arabic. When users visit `http://localhost:3000/`, they will now see the Arabic version by default.

## Changes Made

### 1. Redux Store Configuration
**File**: `src/store/slices/localeSlice.ts`
- Changed `currentLocale: "en"` to `currentLocale: "ar"`
- Updated comment to reflect Arabic as default

### 2. i18n Configuration Files
**Files**: 
- `src/lib/i18n/index.ts`
- `src/lib/i18n/config.ts`

Added `localeDetector: false as const` to both configuration objects to:
- Disable automatic browser language detection
- Always use the default locale (Arabic) for first-time visitors
- Prevent the application from redirecting to `/en` based on browser settings

### 3. Middleware Enhancement
**File**: `src/middleware.ts`

Added logic to set the `NEXT_LOCALE` cookie to "ar" when:
- User visits the root path (`/`)
- No locale cookie exists

This ensures Arabic is set as the default language before the i18n router processes the request.

## Configuration Details

### Current i18n Configuration:
```typescript
{
  locales: ["ar", "en"],
  defaultLocale: "ar",
  prefixDefault: false,
  localeDetector: false // Key change - disables browser detection
}
```

### What Each Setting Does:
- `locales`: Available languages (Arabic and English)
- `defaultLocale`: The default language (Arabic)
- `prefixDefault: false`: The default locale (Arabic) won't have a prefix in the URL
  - Arabic: `http://localhost:3000/` (no prefix)
  - English: `http://localhost:3000/en` (has prefix)
- `localeDetector: false`: Disables automatic detection of browser language preferences

## Testing

### 1. Clear Browser Data (Important!)
Before testing, clear your browser's cookies and cache for `localhost:3000`:
- **Chrome/Edge**: DevTools → Application → Cookies → Delete `NEXT_LOCALE`
- **Firefox**: DevTools → Storage → Cookies → Delete `NEXT_LOCALE`
- Or use Incognito/Private mode

### 2. Test Scenarios

#### Test 1: First Visit
1. Clear browser cookies
2. Visit `http://localhost:3000/`
3. Expected: Should see Arabic content with RTL layout
4. URL should remain `http://localhost:3000/` (no `/ar` prefix)

#### Test 2: Switch to English
1. Click the language switcher to change to English
2. Expected: URL changes to `http://localhost:3000/en`
3. Content switches to English with LTR layout

#### Test 3: Return Visit
1. After switching to English, refresh the page
2. Expected: Stays on English (`/en`)
3. Clear cookies and visit root again
4. Expected: Back to Arabic default

#### Test 4: Direct URL Access
1. Visit `http://localhost:3000/en` directly
2. Expected: Shows English content
3. Visit `http://localhost:3000/` or `http://localhost:3000/ar`
4. Expected: Shows Arabic content

### 3. Verify Metadata
Check the page's metadata in browser DevTools (Elements/Inspector):
- `<html lang="ar" dir="rtl">` for Arabic
- `<html lang="en" dir="ltr">` for English
- Meta tags should be in the correct language

## Troubleshooting

### Issue: Still seeing English by default
**Solution**: 
1. Clear all cookies for `localhost:3000`
2. Clear browser cache
3. Restart the development server (`npm run dev`)
4. Try in incognito/private mode

### Issue: URL shows `/en` when visiting root
**Cause**: You have an existing `NEXT_LOCALE=en` cookie
**Solution**: Delete the cookie or use incognito mode

### Issue: Browser ignoring the default
**Cause**: Browser's `Accept-Language` header was being used (now disabled)
**Solution**: The `localeDetector: false` setting prevents this

## How It Works

1. User visits `http://localhost:3000/`
2. Middleware checks if `NEXT_LOCALE` cookie exists
3. If no cookie → Sets cookie to "ar"
4. `next-i18n-router` processes the request with `localeDetector: false`
5. Router uses `defaultLocale: "ar"` instead of browser language
6. User sees Arabic content without URL prefix
7. Cookie remembers user's language choice for future visits

## Files Modified

1. `src/store/slices/localeSlice.ts` - Redux store default
2. `src/lib/i18n/index.ts` - i18n configuration
3. `src/lib/i18n/config.ts` - i18n configuration
4. `src/middleware.ts` - Cookie handling for first visit

## Notes

- The root layout (`src/app/layout.tsx`) already had Arabic metadata as default
- All locale service files already defaulted to "ar" as fallback
- The main issue was browser language detection overriding the default
- With `localeDetector: false`, the application now ignores browser preferences
