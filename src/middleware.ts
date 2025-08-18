import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of protected routes that should be logged
const protectedRoutes = [
  "/admin",
  "/admin/dashboard",
  "/admin/logs",
  "/faculties",
  "/volunteers",
];

// List of API routes that should be logged
const apiRoutes = [
  "/api/check-duplicates",
  "/api/create-user",
  "/api/delete-user",
  "/api/sync-to-sheet",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log protected route access
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Add headers to identify this as a protected route access
    const response = NextResponse.next();
    response.headers.set("x-protected-route", "true");
    response.headers.set("x-route-path", pathname);
    return response;
  }

  // Log API route access
  if (apiRoutes.some((route) => pathname.startsWith(route))) {
    // Add headers to identify this as an API route access
    const response = NextResponse.next();
    response.headers.set("x-api-route", "true");
    response.headers.set("x-route-path", pathname);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
