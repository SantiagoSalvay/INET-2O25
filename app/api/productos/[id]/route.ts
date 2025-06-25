export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { deleteProduct, updateProduct } from "@/lib/data-store"

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token no proporcionado")
  }

  const token = authHeader.substring(7)
  return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key") as any
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)

    // Solo admin puede eliminar productos
    if (decoded.rol !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403, headers: { "Content-Type": "application/json" } },
      )
    }

    const productId = Number.parseInt(params.id)
    await deleteProduct(productId)

    return NextResponse.json(
      { message: "Producto eliminado exitosamente" },
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error("Error eliminando producto:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        debug: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const decoded = verifyToken(request)

    // Solo admin puede actualizar productos
    if (decoded.rol !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403, headers: { "Content-Type": "application/json" } },
      )
    }

    const body = await request.text()
    const productData = JSON.parse(body)
    const productId = Number.parseInt(params.id)

    const updatedProduct = await updateProduct(productId, productData)

    return NextResponse.json(updatedProduct, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error actualizando producto:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        debug: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
