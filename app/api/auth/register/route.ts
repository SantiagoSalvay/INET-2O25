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

// Función simple de hash (debe coincidir con login)
function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `simple_hash_${Math.abs(hash)}_${password.length}`
}

// Lista de usuarios registrados (compartida con login)
const registeredUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    console.log("=== REGISTER API START ===")

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

    const { nombre, apellido, email, telefono, password } = body

    // Validar campos requeridos
    if (!nombre || !apellido || !email || !password) {
      return createJsonResponse(
        {
          error: "Todos los campos son requeridos",
          success: false,
        },
        400,
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return createJsonResponse(
        {
          error: "Formato de email inválido",
          success: false,
        },
        400,
      )
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return createJsonResponse(
        {
          error: "La contraseña debe tener al menos 6 caracteres",
          success: false,
        },
        400,
      )
    }

    console.log("Registration attempt for:", email)

    // Verificar si el usuario ya existe (incluyendo usuarios hardcodeados)
    const hardcodedEmails = ["admin@turismoweb.com", "cliente@test.com"]
    if (hardcodedEmails.includes(email.toLowerCase())) {
      return createJsonResponse(
        {
          error: "Este email ya está registrado en el sistema",
          success: false,
        },
        400,
      )
    }

    const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return createJsonResponse(
        {
          error: "El email ya está registrado",
          success: false,
        },
        400,
      )
    }

    // Crear hash de la contraseña usando nuestra función simple
    const hashedPassword = simpleHash(password)
    console.log("Password hashed successfully")

    // Crear usuario
    const newUser = {
      id: registeredUsers.length + 100, // Evitar conflictos con usuarios hardcodeados
      nombre,
      apellido,
      email,
      telefono: telefono || "",
      password: hashedPassword,
      rol: "cliente",
      activo: true,
      fecha_registro: new Date().toISOString(),
    }

    registeredUsers.push(newUser)

    // Remover password del objeto de respuesta
    const { password: _, ...userWithoutPassword } = newUser

    console.log("Registration successful for:", email)
    console.log("Total registered users:", registeredUsers.length)

    return createJsonResponse(
      {
        success: true,
        message: "Usuario registrado exitosamente",
        user: userWithoutPassword,
        timestamp: new Date().toISOString(),
      },
      201,
    )
  } catch (error) {
    console.error("=== REGISTER API ERROR ===")
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
      message: "Register endpoint",
      registered_users_count: registeredUsers.length,
      method: "Use POST to register",
      registered_users: registeredUsers.map((u) => ({ id: u.id, email: u.email, nombre: u.nombre })),
    },
    200,
  )
}
