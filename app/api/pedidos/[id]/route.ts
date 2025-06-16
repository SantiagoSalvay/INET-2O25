import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { updateOrderStatus } from "@/lib/data-store"

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token no proporcionado")
  }

  const token = authHeader.substring(7)
  return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key") as any
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)

    // Solo admin puede actualizar pedidos
    if (decoded.rol !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403, headers: { "Content-Type": "application/json" } },
      )
    }

    const body = await request.text()
    const { estado } = JSON.parse(body)
    const pedidoId = Number.parseInt(params.id)

    await updateOrderStatus(pedidoId, estado)

    return NextResponse.json(
      { message: "Pedido actualizado exitosamente" },
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error("Error actualizando pedido:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        debug: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
