// middleware.js
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken");
  const refreshToken = req.cookies.get("refreshToken");
  const url = req.nextUrl;
  const hasToken = accessToken || refreshToken;

  const isAuthPage = url.pathname.startsWith("/login") || url.pathname.startsWith("/signup");

  // Allow /auth-success page
  if (url.pathname.startsWith("/auth-success")) {
    return NextResponse.next();
  }

  if (hasToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!hasToken && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*", "/auth-success"],
};
