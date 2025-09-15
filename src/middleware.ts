import { NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./lib/i18n/index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function middleware(request: any) {
  const url = request.nextUrl;
  const pathname: string = url.pathname || "/";

  // Ensure Arabic is the true default for root and non-locale paths
  const isLocalePrefixed =
    pathname.startsWith("/ar") || pathname.startsWith("/en");

  // If no locale prefix and path is root or generic path, set cookie to 'ar'
  if (!isLocalePrefixed) {
    const urlAr = new URL("/ar", url);
    const rewrite = NextResponse.rewrite(urlAr);
    rewrite.cookies.set("NEXT_LOCALE", "ar", { path: "/" });
    return rewrite;
  }

  return i18nRouter(request, i18nConfig);
}

// Apply middleware only to relevant routes (excluding API, static files, and internal Next.js paths)
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
