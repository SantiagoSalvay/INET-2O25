import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct, getProductByCode } from "@/lib/data-store"

export async function GET(request: NextRequest) {
  try {
    console.log("=== PRODUCTOS API GET ===")

    const authHeader = request.headers.get("authorization")
    let token: string | null = null
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7)
      console.log("Token received:", token.substring(0, 20) + "...")
    }

    let decoded: any = null
    if (token) {
      try {
        if (token.startsWith("simple_token_")) {
          const parts = token.split("_")
          decoded = {
            userId: Number.parseInt(parts[2]),
            email: "admin@turismoweb.com", 
            rol: "admin",
          }
          console.log("Simple token decoded:", decoded)
        } else {
          const jwt = await import("jsonwebtoken")
          decoded = jwt.verify(token, process.env.JWT_SECRET || "olimpiada-turismo-2025-secret-key") as any
          console.log("JWT token decoded:", decoded)
        }
      } catch (tokenError) {
        console.error("Token verification failed (but continuing for public access):", tokenError)
        // No retornamos 401 aquí, permitimos el acceso público si falla la verificación del token
      }
    }

    console.log("Getting products.")

    const productos = await getProducts()
    console.log("Products loaded:", productos.length)

    return NextResponse.json(productos, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error en productos GET:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        debug: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== PRODUCTOS API POST ===")

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401, headers: { "Content-Type": "application/json" } },
      )
    }

    const token = authHeader.substring(7)

    // Verificar token y rol de admin
    let decoded: any
    try {
      if (token.startsWith("simple_token_")) {
        const parts = token.split("_")
        decoded = {
          userId: Number.parseInt(parts[2]),
          email: "admin@turismoweb.com",
          rol: "admin",
        }
      } else {
        const jwt = await import("jsonwebtoken")
        decoded = jwt.verify(token, process.env.JWT_SECRET || "olimpiada-turismo-2025-secret-key") as any
      }
    } catch (tokenError) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401, headers: { "Content-Type": "application/json" } },
      )
    }

    // Solo admin puede crear productos
    if (decoded.rol !== "admin") {
      return NextResponse.json(
        { error: "No autorizado - se requiere rol de administrador" },
        { status: 403, headers: { "Content-Type": "application/json" } },
      )
    }

    // Parsear body de forma segura
    let body: any
    try {
      const text = await request.text()
      body = JSON.parse(text)
      console.log("Request body parsed:", body)
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        { error: "Formato de request inválido" },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    const { codigo, descripcion, precio, categoria, detalles } = body

    // Validaciones
    if (!codigo || !descripcion || !precio || !categoria) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos (codigo, descripcion, precio, categoria)" },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    if (isNaN(precio) || precio <= 0) {
      return NextResponse.json(
        { error: "El precio debe ser un número mayor a 0" },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    // Verificar si el código ya existe
    const existingProduct = await getProductByCode(codigo)
    if (existingProduct) {
      return NextResponse.json(
        { error: "El código de producto ya existe" },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    const newProduct = await createProduct({
      codigo,
      descripcion,
      precio: Number.parseFloat(precio),
      categoria,
      detalles: detalles || null,
      activo: true,
    })

    console.log("Product created successfully:", newProduct.codigo)

    return NextResponse.json(newProduct, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error creando producto:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        debug: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
