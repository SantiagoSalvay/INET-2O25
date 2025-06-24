import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { sendVerificationEmail } from '@/lib/send-email'
import crypto from 'crypto'

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

// Función simple de hash (ELIMINAR después de migrar usuarios existentes)
/*
function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `simple_hash_${Math.abs(hash)}_${password.length}`
}
*/

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

    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await prisma.usuario.findUnique({ where: { email: email.toLowerCase() } })
    if (existingUser) {
      return createJsonResponse(
        {
          error: "El email ya está registrado",
          success: false,
        },
        400,
      )
    }

    // Hashear la contraseña con bcrypt
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    console.log("Password hashed with bcrypt successfully")

    // Generar token de verificación y expiración (1 día)
    const tokenVerificacion = crypto.randomBytes(32).toString('hex')
    const tokenVerificacionExpira = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Crear usuario en la base de datos
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        email: email.toLowerCase(),
        telefono: telefono || "",
        password: hashedPassword,
        rol: "cliente",
        departamento: "", // Campo requerido en la BD, se puede dejar vacío para clientes
        fecha_ingreso: new Date(), // Campo requerido en la BD
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerificado: false,
        tokenVerificacion,
        tokenVerificacionExpira,
      },
    })

    // Enviar email de verificación
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verificar-email?token=${tokenVerificacion}`
    await sendVerificationEmail({
      to: newUser.email,
      nombre: newUser.nombre,
      verificationUrl
    })

    // Remover password y token del objeto de respuesta
    const { password: _, tokenVerificacion: __, tokenVerificacionExpira: ___, ...userWithoutSensitive } = newUser

    console.log("Registration successful for:", email)

    return createJsonResponse(
      {
        success: true,
        message: "Usuario registrado exitosamente. Por favor verifica tu email para activar la cuenta.",
        user: userWithoutSensitive,
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
      method: "Use POST to register",
    },
    200,
  )
}
