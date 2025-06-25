export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getOrdersByUser } from "@/lib/data-store"

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token no proporcionado")
  }

  const token = authHeader.substring(7)
  return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key") as any
}

export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request)

    const pedidos = await getOrdersByUser(decoded.userId)

    return NextResponse.json(pedidos, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error obteniendo pedidos del cliente:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        debug: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
