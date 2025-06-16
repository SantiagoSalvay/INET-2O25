import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("=== JSON DATA TEST ===")

    const result = {
      timestamp: new Date().toISOString(),
      status: "testing",
      message: "Sistema funcionando con datos hardcodeados",
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
      products: {
        count: 8,
        categories: ["vuelos", "hoteles", "autos", "paquetes", "excursiones"],
      },
      system: {
        storage: "hardcoded_data",
        environment: "Next.js",
        status: "operational",
      },
    }

    return new NextResponse(JSON.stringify(result, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Critical error in JSON test:", error)
    return new NextResponse(
      JSON.stringify({
        error: "Critical test failure",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
