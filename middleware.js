import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_ROUTES = ["/auth/signin", "/auth/signup"];
const ADMIN_PREFIX = "/admin";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAdminPath = pathname.startsWith(ADMIN_PREFIX);
  const isAuthPath = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const userIsAdmin = token?.role === "admin";

  if (!token) {
    if (isAdminPath || !isAuthPath) {
      const url = req.nextUrl.clone();
      url.pathname = AUTH_ROUTES[0];
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isAuthPath) {
    const url = req.nextUrl.clone();
    url.pathname = userIsAdmin ? ADMIN_PREFIX : "/";
    return NextResponse.redirect(url);
  }

  if (isAdminPath) {
    if (!userIsAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } else {
    if (userIsAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = ADMIN_PREFIX;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
