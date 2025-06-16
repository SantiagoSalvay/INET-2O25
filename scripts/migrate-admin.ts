import { PrismaClient } from '../lib/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const adminUser = {
  nombre: 'Admin',
  apellido: 'Sistema',
  email: 'admin@turismoweb.com',
  telefono: '+54 11 1234-5678',
  password: 'admin123',
  rol: 'admin',
  departamento: 'Sin departamento',
  activo: true,
  fecha_registro: new Date().toISOString(),
}

async function migrateAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(adminUser.password, 10)
    await prisma.usuario.upsert({
      where: { email: adminUser.email },
      update: {
        nombre: adminUser.nombre,
        apellido: adminUser.apellido,
        telefono: adminUser.telefono,
        password: hashedPassword,
        rol: adminUser.rol,
        departamento: adminUser.departamento,
        activo: adminUser.activo,
        fecha_ingreso: new Date(adminUser.fecha_registro),
        updatedAt: new Date(),
      },
      create: {
        nombre: adminUser.nombre,
        apellido: adminUser.apellido,
        email: adminUser.email,
        telefono: adminUser.telefono,
        password: hashedPassword,
        rol: adminUser.rol,
        departamento: adminUser.departamento,
        fecha_ingreso: new Date(adminUser.fecha_registro),
        activo: adminUser.activo,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    console.log('Usuario administrador migrado/actualizado exitosamente')
  } catch (error) {
    console.error('Error al migrar el usuario administrador:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

migrateAdmin() 