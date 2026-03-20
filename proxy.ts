import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  let res = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isAdmin = req.nextUrl.pathname.startsWith('/admin')
  const isAuthPage = ['/login', '/signup', '/pricing'].includes(req.nextUrl.pathname)

  // Not logged in → redirect to login
  if ((isDashboard || isAdmin) && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Logged in but on auth page → redirect to dashboard
  if (isAuthPage && user && req.nextUrl.pathname !== '/pricing') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
}