import { NextResponse, type NextRequest } from 'next/server'
import { fetchApi } from '@/lib/api'

async function validateToken(token: string | undefined): Promise<boolean> {
  if (!token) return false

  try {
    const response = await fetchApi('/auth/me', { method: 'GET' }, token)
    return response.status === 200
  } catch (error) {
    console.error('Token validation failed in middleware:', error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  const isLoginPage = pathname.startsWith('/login')
  const isProtectedPath = pathname.startsWith('/backside')

  let isValidToken = false
  if (token) {
    isValidToken = await validateToken(token)
  }

  const response = NextResponse.next()

  if (isProtectedPath) {
    if (!token || !isValidToken) {
      response.cookies.delete('token')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // ✅ Token valid → perpanjang masa hidup cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 hari
    })

    return response
  }

  if (isLoginPage && token && isValidToken) {
    return NextResponse.redirect(new URL('/backside', request.url))
  }

  return response
}

export const config = {
  matcher: ['/login', '/backside/:path*'],
}
