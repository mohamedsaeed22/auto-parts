import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./lib/i18n/index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function middleware(request: any) {
  return i18nRouter(request, i18nConfig);
}

// Apply middleware only to relevant routes (excluding API, static files, and internal Next.js paths)
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};