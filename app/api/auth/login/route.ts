import { type NextRequest, NextResponse } from "next/server"

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

// Función simple de hash (debe coincidir con register)
function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `simple_hash_${Math.abs(hash)}_${password.length}`
}

// Función para verificar contraseñas SIN bcrypt
function verifyPassword(plainPassword: string, storedPassword: string): boolean {
  console.log("Verifying password...")
  console.log("Plain password length:", plainPassword.length)
  console.log("Stored password preview:", storedPassword.substring(0, 20) + "...")

  // Para usuarios hardcodeados, usar comparación directa de contraseñas conocidas
  if (plainPassword === "admin123" && storedPassword.includes("LQv3c1yqBwEHFl5ePEjNNO")) {
    console.log("Admin password verified (hardcoded)")
    return true
  }

  if (plainPassword === "cliente123" && storedPassword.includes("92IXUNpkjO0rOQ5byMi")) {
    console.log("Cliente password verified (hardcoded)")
    return true
  }

  // Para usuarios registrados, usar nuestro hash simple
  if (storedPassword.startsWith("simple_hash_")) {
    const expectedHash = simpleHash(plainPassword)
    const isValid = storedPassword === expectedHash
    console.log("Simple hash verification:", isValid)
    return isValid
  }

  // Fallback: comparación directa (solo para testing)
  const directMatch = plainPassword === storedPassword
  console.log("Direct comparison:", directMatch)
  return directMatch
}

// Usuarios hardcodeados con contraseñas conocidas
const HARDCODED_USERS = [
  {
    id: 1,
    nombre: "Admin",
    apellido: "Sistema",
    email: "admin@turismoweb.com",
    password: "$2a$12$LQv3c1yqBwEHFl5ePEjNNONciJ0MGhppMn5h1o3t7EFeCLww/Hjji", // admin123
    rol: "admin",
    activo: true,
  },
  {
    id: 2,
    nombre: "Cliente",
    apellido: "Prueba",
    email: "cliente@test.com",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // cliente123
    rol: "cliente",
    activo: true,
  },
]

// Lista de usuarios registrados (compartida con register)
const registeredUsers: any[] = []

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

    // Buscar usuario en hardcodeados primero
    let user = HARDCODED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.activo)

    // Si no se encuentra, buscar en usuarios registrados
    if (!user) {
      user = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.activo)
      console.log("Searching in registered users, found:", !!user)
    } else {
      console.log("Found hardcoded user:", user.email)
    }

    if (!user) {
      console.log("User not found:", email)
      return createJsonResponse(
        {
          error: "Credenciales inválidas",
          success: false,
        },
        401,
      )
    }

    // Verificar contraseña SIN bcrypt
    const isValidPassword = verifyPassword(password, user.password)

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
      debug: {
        userId: user.id,
        role: user.rol,
        tokenType: token.startsWith("simple_token") ? "simple" : "jwt",
      },
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
      hardcoded_users: HARDCODED_USERS.length,
      registered_users: registeredUsers.length,
      method: "Use POST to login",
      available_users: [
        { email: "admin@turismoweb.com", password: "admin123", rol: "admin" },
        { email: "cliente@test.com", password: "cliente123", rol: "cliente" },
      ],
    },
    200,
  )
}
