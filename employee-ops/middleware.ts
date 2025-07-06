// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow public access to auth pages
    if (pathname.startsWith("/auth/")) {
      return NextResponse.next();
    }

    // Redirect to signin if not authenticated
    if (!token) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Role-based access control
    const userRole = token.role as string;

    // Admin-only routes
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Operations routes (Operations Manager and Admin)
    if (
      pathname.startsWith("/operations") &&
      !["operations", "admin"].includes(userRole)
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Settings routes (Admin only)
    if (pathname.startsWith("/settings") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Users routes (Admin only)
    if (pathname.startsWith("/users") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to auth pages
        if (pathname.startsWith("/auth/")) {
          return true;
        }

        // Require authentication for all other pages
        return !!token;
      },
    },
  }
);

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
