import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = ['/login', '/signup', '/auth'];
const apiRoutes = '/api';

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API routes to pass through
  if (publicRoutes.some(route => pathname.startsWith(route)) || pathname.startsWith(apiRoutes)) {
    return NextResponse.next({ request });
  }

  const supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured, skip the auth refresh and pass through.
  if (!url || !anonKey) {
    return supabaseResponse;
  }

  try {
    let response = supabaseResponse;
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();

    // If no session and not on public route, redirect to login
    if (!session && pathname !== '/' && !publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Refresh session so it doesn't expire while user is active
    await supabase.auth.getUser();
    return response;
  } catch {
    // Never let an auth hiccup crash the entire edge middleware
    return supabaseResponse;
  }
}
