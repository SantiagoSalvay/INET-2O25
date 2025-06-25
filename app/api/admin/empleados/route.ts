export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import bcrypt from "bcryptjs"

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

// Función para leer usuarios del archivo JSON
function readUsers() {
  try {
    const filePath = path.join(process.cwd(), "data", "usuarios.json")
    if (!fs.existsSync(filePath)) {
      // Si el archivo no existe, crear uno nuevo con estructura inicial
      writeUsers([])
      return []
    }
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const data = JSON.parse(fileContent)
    return data.usuarios || []
  } catch (error) {
    console.error("Error reading users file:", error)
    return []
  }
}

// Función para escribir usuarios en el archivo JSON
function writeUsers(users: any[]) {
  try {
    const filePath = path.join(process.cwd(), "data", "usuarios.json")
    const directory = path.dirname(filePath)
    
    // Asegurarse de que el directorio existe
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
    
    fs.writeFileSync(filePath, JSON.stringify({ usuarios: users }, null, 2))
  } catch (error) {
    console.error("Error writing users file:", error)
    throw error
  }
}

// Función para hashear contraseña
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== CREATE EMPLOYEE API ===")

    // Verificar autorización (simplificado)
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return createJsonResponse({ error: "No autorizado", success: false }, 401)
    }

    // Parsear el body
    let body: any
    try {
      const text = await request.text()
      body = JSON.parse(text)
    } catch (parseError) {
      return createJsonResponse({ error: "Invalid request format", success: false }, 400)
    }

    const { nombre, apellido, email, telefono, departamento, password } = body

    // Validaciones
    if (!nombre || !apellido || !email || !departamento || !password) {
      return createJsonResponse({ error: "Todos los campos son requeridos", success: false }, 400)
    }

    // Leer usuarios existentes
    const usuarios = readUsers()

    // Verificar si el email ya existe
    const existingEmployee = usuarios.find((e: any) => e.email.toLowerCase() === email.toLowerCase())
    if (existingEmployee) {
      return createJsonResponse({ error: "El email ya está registrado", success: false }, 400)
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password)

    // Crear empleado
    const newEmployee = {
      id: usuarios.length + 200, // Evitar conflictos
      nombre,
      apellido,
      email,
      telefono: telefono || "",
      password: hashedPassword,
      rol: "empleado",
      departamento,
      fecha_ingreso: new Date().toISOString(),
      activo: true,
    }

    // Agregar nuevo empleado y guardar
    usuarios.push(newEmployee)
    writeUsers(usuarios)

    // Respuesta sin contraseña
    const { password: _, ...employeeWithoutPassword } = newEmployee

    console.log("Employee created:", email)

    return createJsonResponse(
      {
        success: true,
        message: "Empleado creado exitosamente",
        employee: employeeWithoutPassword,
      },
      201,
    )
  } catch (error) {
    console.error("Error creating employee:", error)
    return createJsonResponse(
      {
        error: "Error interno del servidor",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    )
  }
}

export async function GET() {
  try {
    const usuarios = readUsers()
    return createJsonResponse(
      {
        message: "Employees endpoint",
        employees_count: usuarios.length,
        employees: usuarios.map((e: any) => ({ 
          id: e.id, 
          email: e.email, 
          nombre: e.nombre, 
          departamento: e.departamento 
        })),
      },
      200,
    )
  } catch (error) {
    console.error("Error getting employees:", error)
    return createJsonResponse(
      {
        error: "Error interno del servidor",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    )
  }
}
