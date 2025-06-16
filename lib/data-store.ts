import { promises as fs } from "fs"
import path from "path"
import { PrismaClient, Producto } from '../lib/generated/prisma'

// Rutas de los archivos JSON
const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "usuarios.json")
const PRODUCTS_FILE = path.join(DATA_DIR, "productos.json")
const ORDERS_FILE = path.join(DATA_DIR, "pedidos.json")

// Interfaces
interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono?: string
  password: string
  rol: "cliente" | "admin" | "empleado"
  fecha_registro: string
  activo: boolean
  departamento: string
}

interface Pedido {
  id: number
  numero_pedido: string
  usuario_id: number
  fecha_pedido: string
  estado: "pendiente" | "entregado" | "cancelado"
  total: number
  items: Array<{
    producto_id: number
    producto_descripcion: string
    cantidad: number
    precio_unitario: number
  }>
  cliente_nombre?: string
  cliente_email?: string
}

// Función para logging seguro
function safeLog(message: string, data?: any) {
  try {
    if (data) {
      console.log(`[DATA-STORE] ${message}:`, JSON.stringify(data, null, 2))
    } else {
      console.log(`[DATA-STORE] ${message}`)
    }
  } catch (error) {
    console.log(`[DATA-STORE] ${message}: [Error logging data]`)
  }
}

// Función para asegurar que el directorio existe
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
    console.log("Created data directory:", DATA_DIR)
  }
}

// Función para leer archivo JSON con reintentos
async function readJsonFile<T>(filePath: string, defaultData: T): Promise<T> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(filePath, "utf-8")
    const parsed = JSON.parse(data)
    console.log(
      `Successfully read ${path.basename(filePath)}:`,
      Array.isArray(parsed) ? `${parsed.length} items` : "object",
    )
    return parsed
  } catch (error) {
    console.log(`File ${path.basename(filePath)} not found or invalid, creating with default data`)
    await writeJsonFile(filePath, defaultData)
    return defaultData
  }
}

// Función para escribir archivo JSON con validación
async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    await ensureDataDir()
    const jsonString = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonString, "utf-8")
    console.log(`Successfully wrote ${path.basename(filePath)}`)
  } catch (error) {
    console.error(`Error writing ${path.basename(filePath)}:`, error)
    throw error
  }
}

// Datos iniciales actualizados con más productos
export const initialProducts: Producto[] = [
  {
    id: 1,
    codigo: "VUE001",
    descripcion: "Vuelo Buenos Aires - Bariloche (ida y vuelta)",
    precio: 85000,
    categoria: "vuelos",
    detalles: null,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    codigo: "VUE002",
    descripcion: "Vuelo Buenos Aires - Mendoza (ida y vuelta)",
    precio: 75000,
    categoria: "vuelos",
    detalles: null,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    codigo: "VUE003",
    descripcion: "Vuelo Buenos Aires - Miami (ida y vuelta)",
    precio: 450000,
    categoria: "vuelos",
    detalles: null,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    codigo: "HOT001",
    descripcion: "Hotel 4 estrellas Bariloche (3 noches)",
    precio: 120000,
    categoria: "hoteles",
    detalles: null,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    codigo: "HOT002",
    descripcion: "Hotel 5 estrellas Mendoza (2 noches)",
    precio: 180000,
    categoria: "hoteles",
    detalles: null,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    codigo: "AUTO001",
    descripcion: "Alquiler auto económico (7 días)",
    precio: 45000,
    categoria: "autos",
    detalles: null,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 7,
    codigo: "PAQ001",
    descripcion: "Paquete Bariloche Completo (vuelo + hotel + auto)",
    precio: 220000,
    categoria: "paquetes",
    detalles: null,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    codigo: "EXC001",
    descripcion: "Excursión Glaciar Perito Moreno",
    precio: 35000,
    categoria: "excursiones",
    detalles: null,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 9,
    codigo: "CRU001",
    descripcion: "Crucero por el Mediterráneo (7 días)",
    precio: 850000,
    categoria: "cruceros",
    detalles: null,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 10,
    codigo: "SEG001",
    descripcion: "Seguro de viaje internacional",
    precio: 15000,
    categoria: "seguros",
    detalles: null,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const initialUsers: Usuario[] = [
  {
    id: 1,
    nombre: "Admin",
    apellido: "Sistema",
    email: "admin@turismoweb.com",
    telefono: "+54 11 1234-5678",
    password: "$2b$10$CSqG17jGrLu45aXAYvgp0.I6TsMSbu21mDHPyh3/PqD.w0gvO1Xzq", // admin123
    rol: "admin",
    fecha_registro: new Date().toISOString(),
    activo: true,
    departamento: "Sin departamento",
  },
  {
    id: 2,
    nombre: "Cliente",
    apellido: "Prueba",
    email: "cliente@test.com",
    telefono: "+54 11 9876-5432",
    password: "$2b$10$CSqG17jGrLu45aXAYvgp0.I6TsMSbu21mDHPyh3/PqD.w0gvO1Xzq", // cliente123
    rol: "cliente",
    fecha_registro: new Date().toISOString(),
    activo: true,
    departamento: "Sin departamento",
  },
]

const prisma = new PrismaClient()

// Funciones para usuarios
export async function getUsers() {
  return await prisma.usuario.findMany();
}

export async function getUserByEmail(email: string) {
  return await prisma.usuario.findUnique({ where: { email } });
}

export async function createUser(userData: Omit<import('../lib/generated/prisma').Usuario, 'id' | 'createdAt' | 'updatedAt'>) {
  return await prisma.usuario.create({ data: userData });
}

// Funciones para productos
export async function getProducts() {
  return await prisma.producto.findMany()
}

export async function createProduct(productData: Omit<Producto, "id" | "createdAt" | "updatedAt">) {
  return await prisma.producto.create({ data: productData })
}

export async function updateProduct(id: number, productData: Partial<Omit<Producto, "id">>) {
  return await prisma.producto.update({ where: { id }, data: productData })
}

export async function getProductByCode(codigo: string) {
  return await prisma.producto.findUnique({ where: { codigo } })
}

export async function deleteProduct(id: number) {
  await prisma.producto.delete({ where: { id } })
}

// Funciones para pedidos
export async function getOrders() {
  return await prisma.pedido.findMany();
}

export async function getOrdersByUser(userId: number) {
  return await prisma.pedido.findMany({ where: { usuarioId: userId } });
}

export async function createOrder(orderData: Omit<import('../lib/generated/prisma').Pedido, 'id' | 'numero_pedido' | 'createdAt' | 'updatedAt'> & { detalles?: any }) {
  return await prisma.pedido.create({
    data: {
      ...orderData,
      numero_pedido: `PED-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      fecha_pedido: new Date(),
      detalles: orderData.detalles || {},
    },
  });
}

export async function updateOrderStatus(id: number, estado: string) {
  await prisma.pedido.update({ where: { id }, data: { estado } });
}

// Función para obtener estadísticas
export async function getStats() {
  try {
    const products = await readJsonFile(PRODUCTS_FILE, initialProducts)
    const orders = await getOrders()
    const users = await getUsers()

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const ventasDelMes = orders
      .filter((o) => {
        const orderDate = new Date(o.fecha_pedido)
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
      })
      .reduce((sum, o) => sum + o.total, 0)

    return {
      totalProductos: products.filter((p) => p.activo).length,
      pedidosPendientes: orders.filter((o) => o.estado === "pendiente").length,
      ventasDelMes,
      totalClientes: users.filter((u) => u.rol === "cliente" && u.activo).length,
    }
  } catch (error) {
    console.error("Error getting stats:", error)
    return {
      totalProductos: 10,
      pedidosPendientes: 0,
      ventasDelMes: 0,
      totalClientes: 1,
    }
  }
}
