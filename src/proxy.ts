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
    data: { user },
  } = await supabase.auth.getUser()

  const url = new URL(req.url)

  /* EMERGENCY BYPASS FOR REVIEW - COMMENTING OUT REDIRECTS 
  // 1. If not logged in and trying to access protected routes, redirect to /auth
  if (!user && (
    url.pathname.startsWith('/dashboard') || 
    url.pathname.startsWith('/recruiter') || 
    url.pathname.startsWith('/onboarding')
  )) {
    const redirectRes = NextResponse.redirect(new URL('/auth', req.url))
    res.cookies.getAll().forEach(cookie => redirectRes.cookies.set(cookie.name, cookie.value, cookie))
    return redirectRes
  }

  // 2. If logged in, check role for specific routes
  if (user) {
    const role = user.user_metadata?.role

    if (role === 'job_seeker' && url.pathname.startsWith('/recruiter')) {
      const redirectRes = NextResponse.redirect(new URL('/dashboard', req.url))
      res.cookies.getAll().forEach(cookie => redirectRes.cookies.set(cookie.name, cookie.value, cookie))
      return redirectRes
    }

    if (role === 'recruiter' && url.pathname.startsWith('/dashboard')) {
      const redirectRes = NextResponse.redirect(new URL('/recruiter', req.url))
      res.cookies.getAll().forEach(cookie => redirectRes.cookies.set(cookie.name, cookie.value, cookie))
      return redirectRes
    }
    
    if (url.pathname === '/auth') {
      const redirectRes = NextResponse.redirect(new URL(role === 'recruiter' ? '/recruiter' : '/dashboard', req.url))
      res.cookies.getAll().forEach(cookie => redirectRes.cookies.set(cookie.name, cookie.value, cookie))
      return redirectRes
    }
  }
  */

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/recruiter/:path*', '/onboarding/:path*', '/auth'],
}
