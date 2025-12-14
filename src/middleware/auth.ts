import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/favourites",
  "/wishlist",
  "/userprofile",
  "/orders",
  "/returns",
  "/notifications",
  "/paymentstatus",
];

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split("/")[1]; // Get locale from URL (en, ar)

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.includes(`/${locale}${route}`)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // Get user data from local storage
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      // Redirect to login if no user data or token
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    const user = JSON.parse(userData);

    if (!user.is_registration_complete) {
      // Redirect to registration completion if registration is not complete
      return NextResponse.redirect(
        new URL(`/${locale}/complete-registration`, request.url)
      );
    }

    // Allow access to protected route
    return NextResponse.next();
  } catch {
    // Handle any JSON parsing errors or other issues
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
