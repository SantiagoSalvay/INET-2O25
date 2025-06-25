export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("=== DEBUG PRODUCTOS API ===")

    const authHeader = request.headers.get("authorization")

    const debugInfo = {
      timestamp: new Date().toISOString(),
      endpoint: "/api/debug/productos",
      headers: {
        authorization: authHeader ? authHeader.substring(0, 30) + "..." : "none",
        contentType: request.headers.get("content-type"),
        userAgent: request.headers.get("user-agent")?.substring(0, 50) + "...",
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRET_exists: !!process.env.JWT_SECRET,
      },
      api_status: "operational",
      available_endpoints: {
        GET: "/api/productos - Obtener lista de productos",
        POST: "/api/productos - Crear nuevo producto",
        PUT: "/api/productos/[id] - Actualizar producto",
        DELETE: "/api/productos/[id] - Eliminar producto",
      },
      required_fields_for_POST: {
        codigo: "string - Código único del producto",
        descripcion: "string - Descripción del producto",
        precio: "number - Precio del producto",
        categoria: "string - Categoría del producto",
      },
      available_categories: [
        "vuelos",
        "hoteles",
        "autos",
        "paquetes",
        "excursiones",
        "cruceros",
        "seguros",
        "traslados",
      ],
    }

    return NextResponse.json(debugInfo, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug endpoint error",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    return NextResponse.json({
      message: "Debug POST endpoint",
      received_body: body.substring(0, 200) + (body.length > 200 ? "..." : ""),
      body_length: body.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug POST error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
