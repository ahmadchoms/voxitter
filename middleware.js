import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const authRoutes = ["/auth/signin", "/auth/signup"];
const adminPrefix = "/admin";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token && !authRoutes.some((route) => pathname.startsWith(route))) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/signin";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (token && authRoutes.some((route) => pathname.startsWith(route))) {
      const url = req.nextUrl.clone();
      url.pathname = token.role === "admin" ? "/admin" : "/";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith(adminPrefix) && token?.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    const url = req.nextUrl.clone();
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
