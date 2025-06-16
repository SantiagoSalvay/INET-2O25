import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import bcrypt from "bcrypt"

// Función para crear respuesta JSON segura
function createJsonResponse(data: any, status = 200) {
  try {
    return new NextResponse(JSON.stringify(data), {
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

// Función para verificar contraseñas con bcrypt
async function verifyPassword(plainPassword: string, hashedPasswordFromDb: string): Promise<boolean> {
  console.log("Verifying password with bcrypt...")
  return await bcrypt.compare(plainPassword, hashedPasswordFromDb)
}

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log("=== LOGIN API START ===")

    // Parsear el body de forma segura
    let body: any
    try {
      const text = await request.text()
      body = JSON.parse(text)
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return createJsonResponse(
        {
          error: "Invalid request format",
          success: false,
        },
        400,
      )
    }

    const { email, password } = body

    // Validar campos requeridos
    if (!email || !password) {
      return createJsonResponse(
        {
          error: "Email y contraseña son requeridos",
          success: false,
        },
        400,
      )
    }

    console.log("Login attempt for:", email)

    // Buscar usuario en la base de datos
    const user = await prisma.usuario.findUnique({ where: { email: email.toLowerCase() } })

    if (!user || !user.activo) {
      console.log("User not found or inactive:", email)
      return createJsonResponse(
        {
          error: "Credenciales inválidas",
          success: false,
        },
        401,
      )
    }

    // Verificar contraseña con bcrypt
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      console.log("Invalid password for:", email)
      return createJsonResponse(
        {
          error: "Credenciales inválidas",
          success: false,
        },
        401,
      )
    }

    // Generar token simple (sin JWT si no está disponible)
    let token = ""
    try {
      const jwt = await import("jsonwebtoken")
      token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          rol: user.rol,
          timestamp: Date.now(),
        },
        process.env.JWT_SECRET || "olimpiada-turismo-2025-secret-key",
        { expiresIn: "24h" },
      )
      console.log("JWT token generated successfully")
    } catch (jwtError) {
      console.log("JWT not available, using simple token")
      // Token simple pero funcional
      token = `simple_token_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Preparar respuesta exitosa
    const { password: _, ...userWithoutPassword } = user

    console.log("=== LOGIN SUCCESS ===")
    console.log("User:", email, "Role:", user.rol)
    console.log("Token generated:", token.substring(0, 20) + "...")

    return createJsonResponse({
      success: true,
      token,
      user: userWithoutPassword,
      message: "Login exitoso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("=== LOGIN API ERROR ===")
    console.error("Error:", error)

    return createJsonResponse(
      {
        error: "Error interno del servidor",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      500,
    )
  }
}

// Manejar otros métodos HTTP
export async function GET() {
  return createJsonResponse(
    {
      message: "Login endpoint",
      method: "Use POST to login",
      available_users: [
        { email: "admin@turismoweb.com", password: "admin123", rol: "admin" },
        { email: "cliente@test.com", password: "cliente123", rol: "cliente" },
      ],
    },
    200,
  )
}
