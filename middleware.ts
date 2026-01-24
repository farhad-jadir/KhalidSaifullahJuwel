// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("sb-access-token");

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
