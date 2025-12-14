/**
 * Utility functions for route management and protection
 */

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  "/favourites",
  "/wishlist",
  "/userprofile",
  "/orders",
  "/returns",
  "/notifications",
];

/**
 * Check if a given pathname is a protected route
 * @param pathname - The pathname to check (e.g., '/en/userprofile')
 * @returns boolean - true if the route is protected
 */
export function isProtectedRoute(pathname: string): boolean {
  // Remove locale prefix (e.g., '/en' or '/ar') from pathname
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

  return PROTECTED_ROUTES.some((route) => pathWithoutLocale.startsWith(route));
}

/**
 * Get the current pathname without locale prefix
 * @param pathname - The full pathname
 * @returns string - Pathname without locale
 */
export function getPathWithoutLocale(pathname: string): string {
  return pathname.replace(/^\/[a-z]{2}/, "");
}

/**
 * Check if current page should redirect to home on logout
 * @param pathname - The current pathname
 * @returns boolean - true if should redirect to home, false if should stay on current page
 */
export function shouldRedirectToHomeOnLogout(pathname: string): boolean {
  return isProtectedRoute(pathname);
}
