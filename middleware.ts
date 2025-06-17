import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  console.log(`[MIDDLEWARE] ${pathname}`)

  // Rutas completamente públicas - no requieren verificación
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/manual",
    "/api/auth/login",
    "/api/auth/register",
    "/api/health",
    "/api/test-json",
    "/api/status",
    "/api/productos",
    "/test-auth",
  ]

  // Si es una ruta pública, permitir acceso sin verificación
  if (publicPaths.includes(pathname)) {
    console.log(`[MIDDLEWARE] Public path, allowing: ${pathname}`)
    return NextResponse.next()
  }

  // Solo aplicar middleware a rutas específicas que necesitan autenticación
  const protectedPaths = ["/admin", "/cliente", "/api/pedidos", "/api/admin"]
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

  if (!isProtectedPath) {
    console.log(`[MIDDLEWARE] Not protected path, allowing: ${pathname}`)
    return NextResponse.next()
  }

  // Para rutas protegidas, verificar token
  const authHeader = request.headers.get("authorization")
  const cookieToken = request.cookies.get("token")?.value

  console.log(`[MIDDLEWARE] Auth header exists: ${!!authHeader}`)
  console.log(`[MIDDLEWARE] Cookie token exists: ${!!cookieToken}`)

  const hasToken = authHeader?.startsWith("Bearer ") || cookieToken

  if (!hasToken) {
    console.log(`[MIDDLEWARE] No token found, redirecting to login`)
    return NextResponse.redirect(new URL("/login", request.url))
  }

  console.log(`[MIDDLEWARE] Token found, allowing access to: ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
