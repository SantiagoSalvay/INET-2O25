import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getOrders, createOrder, getUserByEmail, getProducts, getUsers } from "@/lib/data-store"
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token no proporcionado")
  }

  const token = authHeader.substring(7)

  // Verificar si es un token simple o JWT
  if (token === "admin-token-123") {
    return { userId: 1, email: "admin@turismoweb.com", rol: "admin" }
  }

  return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key") as any
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  ) {
    const err = error as { message: string };
    return err.message;
  }
  return "Error desconocido";
}

export async function GET(request: NextRequest) {
  try {
    console.log("=== GET /api/pedidos ===")
    const decoded = verifyToken(request)
    console.log("Decoded token:", { userId: decoded.userId, rol: decoded.rol })

    // Solo admin puede ver todos los pedidos
    if (decoded.rol !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403, headers: { "Content-Type": "application/json" } },
      )
    }

    const pedidos = await getOrders()
    console.log("Orders loaded:", pedidos.length)

    // Obtener todos los usuarios para enriquecer los datos
    const usuarios = await getUsers()
    console.log("Users loaded:", usuarios.length)

    // Enriquecer con datos del cliente
    const pedidosEnriquecidos = pedidos.map((pedido) => {
      const usuario = usuarios.find((u) => u.id === pedido.usuarioId)
      return {
        ...pedido,
        cliente_nombre: usuario ? `${usuario.nombre} ${usuario.apellido}` : "Cliente Desconocido",
        cliente_email: usuario?.email || "email@desconocido.com",
      }
    })

    console.log("Enriched orders:", pedidosEnriquecidos.length)

    return NextResponse.json(pedidosEnriquecidos, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: unknown) {
    console.error("Error obteniendo pedidos:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        debug: getErrorMessage(error),
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const {
      userId,
      cantidad,
      asientos,
      fecha,
      total,
      precio,
      comprobanteNombre
    } = data

    const pedido = await prisma.pedido.create({
      data: {
        numero_pedido: uuidv4(),
        cliente_nombre: data.cliente_nombre || '',
        cliente_email: data.cliente_email || '',
        fecha_pedido: new Date(),
        estado: 'pendiente',
        total,
        detalles: {
          cantidad,
          asientos,
          fecha,
          precio,
          comprobanteNombre
        },
        usuarioId: userId,
      },
    })
    return NextResponse.json({ success: true, pedido })
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.message || 'Error al crear pedido' }, { status: 500 })
  }
}
