import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function cleanDb() {
  try {
    console.log('Eliminando pedidos...')
    await prisma.pedido.deleteMany({})
    console.log('Eliminando productos...')
    await prisma.producto.deleteMany({})
    console.log('Eliminando usuarios...')
    await prisma.usuario.deleteMany({})
    console.log('Base de datos limpia.')
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

cleanDb() 