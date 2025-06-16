# 🏆 Sistema de Carrito de Compras - Olimpíada Nacional de Programación 2025

Sistema completo de e-commerce para paquetes turísticos desarrollado para la Olimpíada Nacional de ETP 2025.

## 🚀 Características

- ✅ **Carrito de compras** completo con gestión de productos
- ✅ **Autenticación segura** con JWT y bcrypt
- ✅ **Panel administrativo** para jefe de ventas
- ✅ **Almacenamiento en archivos JSON** (sin base de datos)
- ✅ **Envío de emails** automático
- ✅ **Responsive design** con Tailwind CSS
- ✅ **Manual de usuario** integrado

## 🛠️ Tecnologías

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Almacenamiento:** Archivos JSON locales
- **Autenticación:** JWT + bcrypt
- **UI:** shadcn/ui components

## 🔧 Configuración Local

1. **Clonar el repositorio**
\`\`\`bash
git clone <tu-repositorio>
cd olimpiada-turismo-2025
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env.local
# Editar .env.local con tu JWT_SECRET
\`\`\`

4. **Ejecutar en desarrollo**
\`\`\`bash
npm run dev
\`\`\`

## 🚀 Deploy

### Variables de Entorno Requeridas:

\`\`\`bash
JWT_SECRET=olimpiada_turismo_2025_jwt_secret_key_muy_segura
NEXTAUTH_SECRET=olimpiada_turismo_2025_nextauth_secret
NEXTAUTH_URL=https://tu-app.vercel.app
\`\`\`

### Pasos para Deploy:

1. **Conectar repositorio a Vercel/Railway**
2. **Configurar variables de entorno**
3. **Deploy automático**

## 👥 Credenciales de Prueba

### Jefe de Ventas (Admin)
- **Email:** admin@turismoweb.com
- **Contraseña:** admin123

### Cliente
- **Email:** cliente@test.com
- **Contraseña:** cliente123

## 📊 Estructura de Datos

- `data/usuarios.json` - Clientes y administradores
- `data/productos.json` - Catálogo de paquetes turísticos
- `data/pedidos.json` - Órdenes de compra

## 🎯 Funcionalidades

### Para Clientes:
- ✅ Registro y autenticación
- ✅ Exploración de productos por categorías
- ✅ Carrito de compras interactivo
- ✅ Gestión de pedidos
- ✅ Historial de compras

### Para Jefe de Ventas:
- ✅ Dashboard con estadísticas
- ✅ CRUD de productos
- ✅ Gestión de pedidos
- ✅ Reportes de ventas
- ✅ Estado de cuenta

## 📱 Capturas de Pantalla

El sistema incluye:
- Página de inicio responsive con carruseles
- Formularios de registro/login
- Dashboard de cliente con carrito
- Panel administrativo completo
- Manual de usuario integrado

## 📞 Soporte

Para soporte técnico:
- **Email:** soporte@turismoweb.com
- **Teléfono:** +54 11 1234-5678

## 📄 Licencia

Desarrollado para la Olimpíada Nacional de Programación 2025 - INET
\`\`\`

Ahora voy a simplificar completamente el sistema de login para que funcione solo con archivos JSON:
