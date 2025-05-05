import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export default auth(async function middleware(req: NextRequest) {
  const session = await auth(); // Get the session
  const isAuthenticated = !!session?.user; // Check if user is authenticated
  const pathname = req.nextUrl.pathname;

  // Define public routes that don't require authentication
  const publicRoutes = ["/login"];

  // If user is unauthenticated and trying to access a non-public route, redirect to /login
  if (
    !isAuthenticated &&
    !publicRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow the request to proceed if authenticated or accessing a public route
  return NextResponse.next();
});

// Define which routes the middleware should apply to
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Apply to all routes except static assets and API
};
