# 🏆 Sistema de Carrito de Compras - Olimpíada Nacional de Programación 2025

Sistema completo de e-commerce para paquetes turísticos desarrollado para la Olimpíada Nacional de ETP 2025.

---

## 🚀 Características Principales

- **Carrito de compras** completo con gestión de productos y pedidos
- **Autenticación segura** con JWT y bcrypt
- **Panel administrativo** para gestión de empleados, productos y pedidos
- **Persistencia en base de datos MySQL** (Railway) usando Prisma ORM
- **Migración automática de datos** desde archivos JSON a la base de datos
- **Envío de emails** automático (configurable)
- **Responsive design** con Tailwind CSS
- **Manual de usuario** integrado

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Prisma ORM
- **Base de datos:** MySQL (Railway)
- **ORM:** Prisma Client
- **Autenticación:** JWT + bcrypt
- **Despliegue:** Railway, Vercel

---

## 📦 Estructura del Proyecto

- `/app` - Rutas y páginas de Next.js (cliente y admin)
- `/lib` - Lógica de acceso a datos (ahora usando Prisma)
- `/prisma` - Esquema de base de datos y migraciones
- `/data` - Archivos JSON originales para migración de datos
- `/scripts` - Scripts utilitarios (ej: migración de datos)
- `/public` - Recursos estáticos

---

## ⚡ Instalación y Puesta en Marcha

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd INET-2O25
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**
   - Crea un archivo `.env` en la raíz con el siguiente contenido:
     ```
     DATABASE_URL="mysql://<usuario>:<password>@<host>:<puerto>/<db>"
     JWT_SECRET=inet_2025_super_secret_key_123456789
     ```
   - (Reemplaza los valores según tu instancia Railway/MySQL)

4. **Generar el cliente Prisma y aplicar el esquema**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Migrar los datos iniciales desde JSON a la base de datos**
   ```bash
   node scripts/migrate-data.js
   ```

6. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

---

## 📚 Dependencias Principales

- `next`, `react`, `typescript`
- `prisma`, `@prisma/client`
- `mysql2`
- `bcryptjs`, `jsonwebtoken`
- `tailwindcss`, `shadcn/ui`
- `ts-node`, `@types/node`

---

## 🗄️ Migración y Persistencia de Datos

- Todos los datos de productos, pedidos y usuarios se almacenan en MySQL.
- El script `scripts/migrate-data.js` permite importar datos desde archivos JSON originales.
- El modelo de datos está definido en `prisma/schema.prisma` y sincronizado con la base de datos vía Prisma.

---

## 👥 Credenciales de Prueba

**Jefe de Ventas (Admin)**
- Email: `admin@turismoweb.com`
- Contraseña: `admin123`

**Cliente**
- Email: `cliente@test.com`
- Contraseña: `cliente123`

---

## 🎯 Funcionalidades

### Para Clientes:
- Registro y autenticación
- Exploración de productos por categorías
- Carrito de compras interactivo
- Gestión y seguimiento de pedidos
- Historial de compras

### Para Jefe de Ventas:
- Dashboard con estadísticas
- CRUD de productos y empleados
- Gestión y actualización de pedidos
- Reportes de ventas

---

## 🖼️ Capturas de Pantalla

- Página de inicio responsive
- Formularios de registro/login
- Dashboard de cliente y panel administrativo
- Manual de usuario integrado

---

## 🚀 Deploy

1. **Conectar el repositorio a Railway y/o Vercel**
2. **Configurar variables de entorno en el panel de deploy**
3. **Deploy automático**

---

## 📞 Soporte

- Email: soporte@turismoweb.com
- Teléfono: +54 11 1234-5678

---

## 📄 Licencia

Desarrollado para la Olimpíada Nacional de Programación 2025 - INET
