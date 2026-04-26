import { createServerClient, type CookieOptions } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  let res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = new URL(req.url)

  // 1. If not logged in and trying to access protected routes, redirect to /auth
  if (!session && (
    url.pathname.startsWith('/dashboard') || 
    url.pathname.startsWith('/recruiter') || 
    url.pathname.startsWith('/onboarding')
  )) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // 2. If logged in, check role for specific routes
  if (session) {
    const role = session.user.user_metadata?.role

    // If a job seeker tries to access recruiter routes
    if (role === 'job_seeker' && url.pathname.startsWith('/recruiter')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If a recruiter tries to access job seeker routes
    if (role === 'recruiter' && url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/recruiter', req.url))
    }
    
    // If logged in and on /auth, redirect to their dashboard
    if (url.pathname === '/auth') {
      return NextResponse.redirect(new URL(role === 'recruiter' ? '/recruiter' : '/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/recruiter/:path*', '/onboarding/:path*', '/auth'],
}
