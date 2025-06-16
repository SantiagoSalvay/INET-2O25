import { type NextRequest, NextResponse } from "next/server"

// Función para crear respuesta JSON segura
function createJsonResponse(data: any, status = 200) {
  try {
    return new NextResponse(JSON.stringify(data, null, 2), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Error creating response",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("=== SYSTEM STATUS CHECK ===")

    const status = {
      timestamp: new Date().toISOString(),
      environment: {
        runtime: "Next.js API Routes",
        NODE_ENV: process.env.NODE_ENV || "development",
        JWT_SECRET_configured: !!process.env.JWT_SECRET,
      },
      storage: {
        type: "hardcoded_data",
        available: true,
        error: null,
        description: "Usuarios almacenados en código",
      },
      system: {
        mode: "simplified_hardcoded",
        message: "Sistema completamente funcional con datos hardcodeados",
        status: "operational",
      },
      users: {
        admin: {
          email: "admin@turismoweb.com",
          password: "admin123",
          rol: "admin",
        },
        cliente: {
          email: "cliente@test.com",
          password: "cliente123",
          rol: "cliente",
        },
      },
      api_endpoints: {
        login: "/api/auth/login",
        register: "/api/auth/register",
        health: "/api/health",
        status: "/api/status",
      },
    }

    return createJsonResponse(status)
  } catch (error) {
    console.error("Error checking system status:", error)
    return createJsonResponse(
      {
        error: "Error checking system status",
        debug: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
}
