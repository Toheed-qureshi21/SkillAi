// middleware.js
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req:NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const url = req.nextUrl;
  const pathname = url.pathname;

  const hasToken = accessToken || refreshToken;

  // Define page groups
  const authPages = ["/login", "/signup"];
  const publicPages = ["/auth-success"];
  const protectedPrefixes = ["/dashboard", "/onboard-user", "/profile"];

  // 1️⃣ Always allow public pages
  if (publicPages.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2️⃣ Redirect logged-in users away from auth pages
  if (hasToken && authPages.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3️⃣ Redirect unauthenticated users away from protected pages
  if (!hasToken && protectedPrefixes.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4️⃣ Default: allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware only to routes that might need auth
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/onboard-user/:path*",
    "/profile/:path*",
    "/auth-success",
  ],
};
