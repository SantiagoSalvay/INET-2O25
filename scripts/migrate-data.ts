import { PrismaClient } from '../lib/generated/prisma'
import fs from 'fs'
import path from 'path'
import { initialUsers, initialProducts } from '../lib/data-store' // Importar datos iniciales
import bcrypt from 'bcryptjs' // Importar bcryptjs en lugar de bcrypt

const prisma = new PrismaClient()

async function migrateData() {
  try {
    console.log('Iniciando migración de datos...')

    // Migrar usuarios
    console.log(`Migrando ${initialUsers.length} usuarios iniciales...`)
    for (const user of initialUsers) {
      try {
        const hashedPassword = await bcrypt.hash(user.password, 10) // Re-hash con bcrypt

        await prisma.usuario.upsert({
          where: { email: user.email },
          update: {
            nombre: user.nombre,
            apellido: user.apellido,
            telefono: user.telefono || '',
            password: hashedPassword,
            rol: user.rol,
            departamento: user.departamento || 'Sin departamento',
            activo: user.activo,
            fecha_ingreso: new Date(user.fecha_registro),
            updatedAt: new Date(),
          },
          create: {
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            telefono: user.telefono || '',
            password: hashedPassword,
            rol: user.rol,
            departamento: user.departamento || 'Sin departamento',
            fecha_ingreso: new Date(user.fecha_registro),
            activo: user.activo,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
        console.log(`Usuario ${user.email} migrado/actualizado exitosamente`)
      } catch (error) {
        console.error(`Error al migrar usuario ${user.email}:`, error)
      }
    }
    console.log('Usuarios iniciales migrados exitosamente')

    // Migrar productos
    console.log(`Migrando ${initialProducts.length} productos iniciales...`)
    for (const product of initialProducts) {
      try {
        await prisma.producto.upsert({
          where: { codigo: product.codigo },
          update: {
            descripcion: product.descripcion,
            precio: product.precio,
            categoria: product.categoria,
            detalles: product.detalles,
            activo: product.activo,
            updatedAt: new Date(),
          },
          create: {
            codigo: product.codigo,
            descripcion: product.descripcion,
            precio: product.precio,
            categoria: product.categoria,
            detalles: product.detalles,
            activo: product.activo,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
        console.log(`Producto ${product.codigo} migrado/actualizado exitosamente`)
      } catch (error) {
        console.error(`Error al migrar producto ${product.codigo}:`, error)
      }
    }
    console.log('Productos iniciales migrados exitosamente')

    // NOTA: No migraremos pedidos desde el JSON, ya que dependen de usuarios con IDs de BD.
    // Los pedidos deberían crearse a través de la aplicación una vez los usuarios existan.
    // Si necesitas migrar pedidos antiguos, tendrías que ajustar la lógica para buscar
    // el `usuarioId` en la BD basado en el email o alguna otra clave.
    console.log('Saltando migración de pedidos desde archivos JSON para evitar inconsistencias.')

    console.log('Migración completada exitosamente')
  } catch (error) {
    console.error('Error durante la migración:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

migrateData() 