const { PrismaClient } = require('../lib/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const validFields = {
  usuario: [
    'nombre', 'apellido', 'email', 'telefono', 'password', 'rol', 'departamento', 'fecha_ingreso', 'activo'
  ],
  producto: [
    'codigo', 'descripcion', 'precio', 'categoria', 'detalles', 'activo'
  ],
  pedido: [
    'numero_pedido', 'cliente_nombre', 'cliente_email', 'fecha_pedido', 'estado', 'total', 'detalles'
  ]
};

const filterFields = (obj, allowed) => {
  const filtered = {};
  for (const key of allowed) {
    if (obj[key] !== undefined) filtered[key] = obj[key];
  }
  return filtered;
};

async function migrateData() {
  try {
    console.log('Iniciando migración de datos...');

    // Migrar usuarios
    const usuariosPath = path.join(__dirname, '../data/usuarios.json');
    if (fs.existsSync(usuariosPath)) {
      const usuariosData = JSON.parse(fs.readFileSync(usuariosPath, 'utf8'));
      if (Array.isArray(usuariosData) && usuariosData.length > 0) {
        console.log(`Migrando ${usuariosData.length} usuarios...`);
        for (const usuario of usuariosData) {
          await prisma.usuario.create({ data: filterFields(usuario, validFields.usuario) });
        }
        console.log('Usuarios migrados exitosamente');
      } else {
        console.log('usuarios.json está vacío o no es un array.');
      }
    } else {
      console.log('usuarios.json no existe.');
    }

    // Migrar productos
    const productosPath = path.join(__dirname, '../data/productos.json');
    if (fs.existsSync(productosPath)) {
      const productosData = JSON.parse(fs.readFileSync(productosPath, 'utf8'));
      if (Array.isArray(productosData) && productosData.length > 0) {
        console.log(`Migrando ${productosData.length} productos...`);
        for (const producto of productosData) {
          // Verificar si el producto ya existe por código
          const existing = await prisma.producto.findUnique({ where: { codigo: producto.codigo } });
          if (existing) {
            console.log(`Producto con código ${producto.codigo} ya existe, se omite.`);
            continue;
          }
          await prisma.producto.create({ data: filterFields(producto, validFields.producto) });
        }
        console.log('Productos migrados exitosamente');
      } else {
        console.log('productos.json está vacío o no es un array.');
      }
    } else {
      console.log('productos.json no existe.');
    }

    // Migrar pedidos
    const pedidosPath = path.join(__dirname, '../data/pedidos.json');
    if (fs.existsSync(pedidosPath)) {
      const pedidosData = JSON.parse(fs.readFileSync(pedidosPath, 'utf8'));
      if (Array.isArray(pedidosData) && pedidosData.length > 0) {
        console.log(`Migrando ${pedidosData.length} pedidos...`);
        for (const pedido of pedidosData) {
          // Buscar usuario por email o id
          let usuario = null;
          if (pedido.cliente_email) {
            usuario = await prisma.usuario.findUnique({ where: { email: pedido.cliente_email } });
          }
          if (!usuario && pedido.usuario_id) {
            usuario = await prisma.usuario.findUnique({ where: { id: pedido.usuario_id } });
          }
          if (!usuario) {
            console.log(`No se encontró usuario para el pedido ${pedido.numero_pedido}, se omite.`);
            continue;
          }
          await prisma.pedido.create({
            data: {
              numero_pedido: pedido.numero_pedido,
              cliente_nombre: pedido.cliente_nombre,
              cliente_email: pedido.cliente_email,
              fecha_pedido: new Date(pedido.fecha_pedido),
              estado: pedido.estado,
              total: pedido.total,
              detalles: pedido.items || pedido.detalles || {},
              usuarioId: usuario.id,
            },
          });
        }
        console.log('Pedidos migrados exitosamente');
      } else {
        console.log('pedidos.json está vacío o no es un array.');
      }
    } else {
      console.log('pedidos.json no existe.');
    }

    console.log('Migración completada exitosamente');
  } catch (error) {
    console.error('Error durante la migración:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

migrateData(); 