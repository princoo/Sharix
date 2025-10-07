import { NextResponse } from "next/server";
import { auth } from "../auth";
import { protectedRoutes, publicPaths } from "@/lib/constants/routes";
import { RolesEnum } from "@/enum/role";

export default auth(async function middleware(req) {
  const user = req.auth;
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!req.auth;
  const authenticatedRole = req.auth?.user?.role as RolesEnum;

  console.log(pathname);
  // 1. Allow public routes
  if (publicPaths.includes(pathname)) {
    // If user is logged in and tries to access login/register, redirect to dashboard
    if (
      isAuthenticated &&
      ["/auth/login", "/auth/setup-password"].includes(pathname)
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 2. Protected routes
  const matchedRoute = protectedRoutes.find(({ url }) => url === pathname);

  if (isAuthenticated) {
    if (matchedRoute) {
      // Check if user has the correct role
      if (matchedRoute.role.includes(authenticatedRole!)) {
        return NextResponse.next();
      } else {
        // Authenticated but unauthorized
        const errorMessage = encodeURIComponent(
          "You don't have permission to access this page"
        );
        return NextResponse.redirect(
          new URL(`/unauthorized?error=${errorMessage}`, req.url)
        );
      }
    } else {
      // If no specific match, allow access (optional — can be restricted if you prefer)
      return NextResponse.next();
    }
  }

  // 3. User is not authenticated
  return NextResponse.redirect(new URL("/auth/login", req.url));
  //     // Role-based route protection
  //     const userRole = ?.role as string;

  //     // Manager-only routes
  //     const managerRoutes = [
  //       "/dashboard/users",
  //       "/dashboard/manage-shares",
  //       "/dashboard/manage-payments",
  //     ];
  //     if (
  //       managerRoutes.some((route) => pathname.startsWith(route)) &&
  //       userRole !== "manager"
  //     ) {
  //       return NextResponse.redirect(new URL("/dashboard", req.url));
  //     }

  //     // Member-only routes
  //     const memberRoutes = ["/dashboard/my-shares", "/dashboard/my-payments"];
  //     if (
  //       memberRoutes.some((route) => pathname.startsWith(route)) &&
  //       userRole !== "member"
  //     ) {
  //       return NextResponse.redirect(new URL("/dashboard", req.url));
  //     }

  //     return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
