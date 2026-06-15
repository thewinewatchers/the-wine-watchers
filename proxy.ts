import { NextResponse, type NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/vin/") || pathname.startsWith("/vins/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/boutique/bordeaux";
    return NextResponse.redirect(url, 308);
  }

  if (
    pathname === "/primeurs" ||
    pathname === "/primeurs-2025" ||
    pathname === "/bordeaux-primeurs" ||
    pathname === "/boutique/bordeaux-primeurs"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/boutique/primeurs-2025";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}