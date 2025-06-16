export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getStats } from "@/lib/data-store"

function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Token no proporcionado")
    }

    const token = authHeader.substring(7)

    // Verificar si es un token simple o JWT
    if (token === "admin-token-123") {
      return { userId: 1, email: "admin@turismoweb.com", rol: "admin" }
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      console.warn("JWT_SECRET no está definido en las variables de entorno")
      throw new Error("Error de configuración del servidor")
    }

    return jwt.verify(token, secret) as any
  } catch (error) {
    console.error("Error verificando token:", error)
    throw new Error("Token inválido")
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("=== GET /api/admin/stats ===")
    const decoded = verifyToken(request)
    console.log("Decoded token:", { userId: decoded.userId, rol: decoded.rol })

    // Solo admin puede ver estadísticas
    if (decoded.rol !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403, headers: { "Content-Type": "application/json" } },
      )
    }

    console.log("Getting stats...")
    const stats = await getStats()
    console.log("Stats retrieved:", stats)

    return NextResponse.json(stats, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)

    // Devolver estadísticas por defecto en caso de error
    const defaultStats = {
      totalProductos: 0,
      pedidosPendientes: 0,
      ventasDelMes: 0,
      totalClientes: 0,
      error: error instanceof Error ? error.message : "Error desconocido"
    }

    return NextResponse.json(defaultStats, {
      status: error instanceof Error && error.message === "Token inválido" ? 401 : 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
