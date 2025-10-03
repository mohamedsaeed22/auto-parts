import { storage } from "./storage";

/**
 * Utility function to redirect to complete registration while preserving the current page context
 * @param currentPath - The current pathname (e.g., "/userprofile")
 * @param activeTab - The active tab/page within the current route (e.g., "requests", "profile")
 * @param router - Next.js router instance
 * @param currentLocale - Current locale (e.g., "en", "ar")
 */
export function redirectToCompleteRegistration(
  currentPath: string,
  activeTab: string | null,
  router: any,
  currentLocale: string
) {
  // Store current page URL with active tab before redirecting to complete registration
  let pathWithTab = currentPath;

  // Add the active tab as a query parameter to preserve the user's location
  if (activeTab) {
    pathWithTab = `${currentPath}?tab=${activeTab}`;
  }

  storage.setPreviousPage(pathWithTab);
  router.push(`/complete-registration`);
}
