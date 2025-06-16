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
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      server: {
        runtime: "Next.js API Routes",
        environment: "Vercel/Next.js",
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV || "development",
        has_jwt_secret: !!process.env.JWT_SECRET,
        storage_type: "hardcoded_data",
      },
      dependencies: {
        bcryptjs: "checking...",
        jsonwebtoken: "checking...",
        system: "operational",
      },
      endpoints: {
        login: "/api/auth/login",
        register: "/api/auth/register",
        health: "/api/health",
        status: "/api/status",
      },
      users: {
        admin: "admin@turismoweb.com",
        cliente: "cliente@test.com",
      },
    }

    // Test dependencies
    try {
      await import("bcryptjs")
      health.dependencies.bcryptjs = "available"
    } catch {
      health.dependencies.bcryptjs = "not available"
    }

    try {
      await import("jsonwebtoken")
      health.dependencies.jsonwebtoken = "available"
    } catch {
      health.dependencies.jsonwebtoken = "not available"
    }

    return createJsonResponse(health)
  } catch (error) {
    return createJsonResponse(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
}
