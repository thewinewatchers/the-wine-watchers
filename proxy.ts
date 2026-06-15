import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    const queryUrl =
      `${supabaseUrl}/rest/v1/redirects` +
      `?source_path=eq.${encodeURIComponent(pathname)}` +
      `&active=eq.true` +
      `&select=destination_path,permanent` +
      `&limit=1`;

    const response = await fetch(queryUrl, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const redirect = data[0];

        if (
          redirect.destination_path &&
          redirect.destination_path !== pathname
        ) {
          const url = request.nextUrl.clone();
          url.pathname = redirect.destination_path;

          return NextResponse.redirect(
            url,
            redirect.permanent ? 308 : 307
          );
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|images|favicon.ico).*)"],
};