//middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Check auth status
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Protected routes
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = request.nextUrl.pathname === '/admin/login'
    const isApiRoute = request.nextUrl.pathname.startsWith('/api/admin')

    // If user is not logged in and trying to access admin routes
    if (!session && (isAdminRoute || isApiRoute) && !isLoginPage) {
      console.log('🚫 Unauthorized access attempt to:', request.nextUrl.pathname)
      const redirectUrl = new URL('/admin/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in and trying to access login page
    if (session && isLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // Add user info to headers for API routes
    if (session && isApiRoute) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', session.user.id)
      requestHeaders.set('x-user-email', session.user.email || '')
      
      supabaseResponse = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    // If middleware fails, redirect to login for safety
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ]
}