import { PrismaClient } from '../lib/generated/prisma'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function migrateData() {
  try {
    console.log('Iniciando migración de datos...')

    // Migrar usuarios
    const usuariosPath = path.join(process.cwd(), 'data', 'usuarios.json')
    if (fs.existsSync(usuariosPath)) {
      const usuariosData = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'))
      console.log(`Migrando ${usuariosData.usuarios.length} usuarios...`)
      
      for (const usuario of usuariosData.usuarios) {
        await prisma.usuario.create({
          data: {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            telefono: usuario.telefono || '',
            password: usuario.password,
            rol: usuario.rol,
            departamento: usuario.departamento,
            fecha_ingreso: new Date(usuario.fecha_ingreso),
            activo: usuario.activo
          }
        })
      }
      console.log('Usuarios migrados exitosamente')
    }

    // Migrar productos
    const productosPath = path.join(process.cwd(), 'data', 'productos.json')
    if (fs.existsSync(productosPath)) {
      const productosData = JSON.parse(fs.readFileSync(productosPath, 'utf-8'))
      console.log(`Migrando ${productosData.productos.length} productos...`)
      
      for (const producto of productosData.productos) {
        await prisma.producto.create({
          data: {
            codigo: producto.codigo,
            descripcion: producto.descripcion,
            precio: producto.precio,
            categoria: producto.categoria,
            detalles: producto.detalles,
            activo: producto.activo
          }
        })
      }
      console.log('Productos migrados exitosamente')
    }

    // Migrar pedidos
    const pedidosPath = path.join(process.cwd(), 'data', 'pedidos.json')
    if (fs.existsSync(pedidosPath)) {
      const pedidosData = JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'))
      console.log(`Migrando ${pedidosData.pedidos.length} pedidos...`)
      
      for (const pedido of pedidosData.pedidos) {
        await prisma.pedido.create({
          data: {
            numero_pedido: pedido.numero_pedido,
            cliente_nombre: pedido.cliente_nombre,
            cliente_email: pedido.cliente_email,
            fecha_pedido: new Date(pedido.fecha_pedido),
            estado: pedido.estado,
            total: pedido.total,
            detalles: pedido.detalles || {}
          }
        })
      }
      console.log('Pedidos migrados exitosamente')
    }

    console.log('Migración completada exitosamente')
  } catch (error) {
    console.error('Error durante la migración:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateData() 