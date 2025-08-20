import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/admin",
  "/admin/dashboard",
  "/admin/logs",
  "/faculties",
  "/volunteers",
];

const apiRoutes = [
  "/api/check-duplicates",
  "/api/create-user",
  "/api/delete-user",
  "/api/sync-to-sheet",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const response = NextResponse.next();
    response.headers.set("x-protected-route", "true");
    response.headers.set("x-route-path", pathname);
    return response;
  }

  if (apiRoutes.some((route) => pathname.startsWith(route))) {
    const response = NextResponse.next();
    response.headers.set("x-api-route", "true");
    response.headers.set("x-route-path", pathname);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
