export default function RootPage() {
  // Locale routing handled by middleware (i18nRouter) via rewrite.
  // This file intentionally returns null to avoid redirects that can confuse social scrapers.
  return null;
}
