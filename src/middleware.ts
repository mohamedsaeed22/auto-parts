import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./lib/i18n/index";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is a request to the root path without locale
  if (pathname === "/") {
    const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
    
    // If no cookie exists, set it to Arabic before processing
    if (!localeCookie) {
      const response = i18nRouter(request, i18nConfig);
      response.cookies.set("NEXT_LOCALE", "ar", {
        path: "/",
        maxAge: 365 * 24 * 60 * 60, // 1 year
        sameSite: "lax",
      });
      return response;
    }
  }
  
  return i18nRouter(request, i18nConfig);
}

// Apply middleware only to relevant routes (excluding API, static files, and internal Next.js paths)
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
