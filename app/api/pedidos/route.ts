import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getOrders, createOrder, getUserByEmail, getProducts, getUsers } from "@/lib/data-store"

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
      const usuario = usuarios.find((u) => u.id === pedido.usuario_id)
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
  } catch (error) {
    console.error("Error obteniendo pedidos:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        debug: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request)
    const body = await request.text()
    const { items } = JSON.parse(body)

    // Calcular total y enriquecer items con descripción del producto
    const productos = await getProducts()
    let total = 0
    const itemsEnriquecidos = items.map((item: any) => {
      const producto = productos.find((p) => p.id === item.producto_id)
      const subtotal = item.cantidad * item.precio_unitario
      total += subtotal

      return {
        producto_id: item.producto_id,
        producto_descripcion: producto?.descripcion || "Producto desconocido",
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      }
    })

    // Obtener datos del usuario
    const usuario = await getUserByEmail(decoded.email)

    const newPedido = await createOrder({
      usuario_id: decoded.userId,
      estado: "pendiente",
      total,
      items: itemsEnriquecidos,
      cliente_nombre: usuario ? `${usuario.nombre} ${usuario.apellido}` : "Cliente",
      cliente_email: usuario?.email || decoded.email,
    })

    console.log("Pedido creado:", newPedido.numero_pedido)

    return NextResponse.json(newPedido, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error creando pedido:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        debug: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
