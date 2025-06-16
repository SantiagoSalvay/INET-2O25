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
        try {
          // Verificar si el usuario ya existe
          const existingUser = await prisma.usuario.findUnique({
            where: { email: usuario.email }
          })

          if (!existingUser) {
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
          } else {
            console.log(`Usuario con email ${usuario.email} ya existe, omitiendo...`)
          }
        } catch (error) {
          console.error(`Error al migrar usuario ${usuario.email}:`, error)
        }
      }
      console.log('Usuarios migrados exitosamente')
    }

    // Migrar productos
    const productosPath = path.join(process.cwd(), 'data', 'productos.json')
    if (fs.existsSync(productosPath)) {
      const productosData = JSON.parse(fs.readFileSync(productosPath, 'utf-8'))
      console.log(`Migrando ${productosData.productos.length} productos...`)
      
      for (const producto of productosData.productos) {
        try {
          // Verificar si el producto ya existe
          const existingProduct = await prisma.producto.findUnique({
            where: { codigo: producto.codigo }
          })

          if (!existingProduct) {
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
          } else {
            console.log(`Producto con código ${producto.codigo} ya existe, omitiendo...`)
          }
        } catch (error) {
          console.error(`Error al migrar producto ${producto.codigo}:`, error)
        }
      }
      console.log('Productos migrados exitosamente')
    }

    // Migrar pedidos
    const pedidosPath = path.join(process.cwd(), 'data', 'pedidos.json')
    if (fs.existsSync(pedidosPath)) {
      const pedidosData = JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'))
      console.log(`Migrando ${pedidosData.pedidos.length} pedidos...`)
      
      for (const pedido of pedidosData.pedidos) {
        try {
          // Verificar si el pedido ya existe
          const existingPedido = await prisma.pedido.findUnique({
            where: { numero_pedido: pedido.numero_pedido }
          })

          if (!existingPedido) {
            // Buscar el usuario asociado al pedido
            const usuario = await prisma.usuario.findFirst({
              where: { email: pedido.cliente_email }
            })

            if (!usuario) {
              console.log(`No se encontró usuario para el pedido ${pedido.numero_pedido}, omitiendo...`)
              continue
            }

            await prisma.pedido.create({
              data: {
                numero_pedido: pedido.numero_pedido,
                cliente_nombre: pedido.cliente_nombre,
                cliente_email: pedido.cliente_email,
                fecha_pedido: new Date(pedido.fecha_pedido),
                estado: pedido.estado,
                total: pedido.total,
                detalles: pedido.detalles || {},
                usuarioId: usuario.id
              }
            })
          } else {
            console.log(`Pedido con número ${pedido.numero_pedido} ya existe, omitiendo...`)
          }
        } catch (error) {
          console.error(`Error al migrar pedido ${pedido.numero_pedido}:`, error)
        }
      }
      console.log('Pedidos migrados exitosamente')
    }

    console.log('Migración completada exitosamente')
  } catch (error) {
    console.error('Error durante la migración:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

migrateData() 