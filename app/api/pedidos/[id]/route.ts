import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { updateOrderStatus } from "@/lib/data-store"
import { sendOrderStatusEmail } from '@/lib/send-email'
import { prisma } from '@/lib/prisma'

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token no proporcionado")
  }

  const token = authHeader.substring(7)
  return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key") as any
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    let pedido = null;
    if (/^[0-9]+$/.test(params.id)) {
      // Buscar por id numérico
      pedido = await prisma.pedido.findUnique({ where: { id: Number(params.id) } })
    } else {
      // Buscar por numero_pedido (UUID)
      pedido = await prisma.pedido.findUnique({ where: { numero_pedido: params.id } })
    }
    if (!pedido) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }
    return NextResponse.json(pedido)
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
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

    // Obtener el pedido actualizado y usuario
    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } })
    const usuario = pedido ? await prisma.usuario.findUnique({ where: { id: pedido.usuarioId } }) : null
    if (pedido && usuario) {
      await sendOrderStatusEmail({
        to: usuario.email,
        nombre: usuario.nombre,
        estado,
        pedido
      })
    }

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
