"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  UserPlus,
  BarChart3,
  Search,
  Filter,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Calendar,
  TrendingUp,
  FileText,
  Mail,
  Phone,
} from "lucide-react"

interface User {
  id: number
  nombre: string
  apellido: string
  email: string
  rol: string
}

interface Producto {
  id: number
  codigo: string
  descripcion: string
  precio: number
  categoria: string
  activo: boolean
}

interface Empleado {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  rol: string
  departamento: string
  fecha_ingreso: string
  activo: boolean
}

interface Pedido {
  id: number
  numero_pedido: string
  fecha_pedido: string
  estado: string
  total: number
  cliente_nombre: string
  cliente_email: string
  items: Array<{
    producto_descripcion: string
    cantidad: number
    precio_unitario: number
  }>
}

const CATEGORIAS = [
  { value: "vuelos", label: "Vuelos" },
  { value: "hoteles", label: "Hoteles" },
  { value: "autos", label: "Alquiler de Autos" },
  { value: "paquetes", label: "Paquetes Completos" },
  { value: "excursiones", label: "Excursiones" },
  { value: "cruceros", label: "Cruceros" },
  { value: "seguros", label: "Seguros de Viaje" },
  { value: "traslados", label: "Traslados" },
]

const DEPARTAMENTOS = [
  { value: "ventas", label: "Ventas" },
  { value: "atencion_cliente", label: "Atención al Cliente" },
  { value: "operaciones", label: "Operaciones" },
  { value: "marketing", label: "Marketing" },
  { value: "contabilidad", label: "Contabilidad" },
]

const ESTADOS_PEDIDO = [
  { value: "pendiente", label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  { value: "entregado", label: "Entregado", color: "bg-green-100 text-green-800" },
  { value: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
]

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [productos, setProductos] = useState<Producto[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [stats, setStats] = useState({
    totalProductos: 0,
    pedidosPendientes: 0,
    ventasDelMes: 0,
    totalClientes: 0,
    totalEmpleados: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("all")
  const [filterEstado, setFilterEstado] = useState("all")
  const [filterDepartamento, setFilterDepartamento] = useState("all")
  const [message, setMessage] = useState({ type: "", text: "" })

  // Estados para formularios
  const [nuevoProducto, setNuevoProducto] = useState({
    codigo: "",
    descripcion: "",
    precio: "",
    categoria: "",
    detalles: "",
  })

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    departamento: "",
    password: "",
  })

  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<Empleado | null>(null)
  const [viewingOrder, setViewingOrder] = useState<Pedido | null>(null)

  const router = useRouter()

  // Función para leer cookies
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null
    return null
  }

  useEffect(() => {
    console.log("=== ADMIN DASHBOARD INIT ===")

    // Verificar autenticación desde cookies primero, luego localStorage
    let token = getCookie("token")
    let userData = getCookie("user")

    if (!token) {
      token = localStorage.getItem("token")
      userData = localStorage.getItem("user")
    }

    console.log("Token exists:", !!token)
    console.log("User data exists:", !!userData)

    if (!token || !userData) {
      console.log("Missing auth data, redirecting to login")
      window.location.href = "/login"
      return
    }

    let parsedUser
    try {
      parsedUser = JSON.parse(userData)
      console.log("Parsed user:", parsedUser)
    } catch (error) {
      console.error("Error parsing user data:", error)
      // Limpiar todo
      localStorage.clear()
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=")
        const name = eqPos > -1 ? c.substr(0, eqPos) : c
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      })
      window.location.href = "/login"
      return
    }

    if (parsedUser.rol !== "admin") {
      console.log("User is not admin, redirecting")
      window.location.href = "/login"
      return
    }

    console.log("✅ Admin authenticated successfully")
    setUser(parsedUser)

    // Cargar datos después de verificar autenticación
    loadInitialData()
  }, [router])

  const loadInitialData = async () => {
    try {
      console.log("Loading initial data...")

      // Cargar empleados simulados
      setEmpleados([
        {
          id: 1,
          nombre: "María",
          apellido: "González",
          email: "maria.gonzalez@turismoweb.com",
          telefono: "+54 11 2345-6789",
          rol: "empleado",
          departamento: "ventas",
          fecha_ingreso: "2024-01-15",
          activo: true,
        },
        {
          id: 2,
          nombre: "Carlos",
          apellido: "Rodríguez",
          email: "carlos.rodriguez@turismoweb.com",
          telefono: "+54 11 3456-7890",
          rol: "empleado",
          departamento: "atencion_cliente",
          fecha_ingreso: "2024-02-01",
          activo: true,
        },
        {
          id: 3,
          nombre: "Ana",
          apellido: "Martínez",
          email: "ana.martinez@turismoweb.com",
          telefono: "+54 11 4567-8901",
          rol: "empleado",
          departamento: "operaciones",
          fecha_ingreso: "2024-03-10",
          activo: true,
        },
      ])

      // Cargar datos de APIs
      await fetchData()
    } catch (error) {
      console.error("Error loading initial data:", error)
      showMessage("error", "Error al cargar los datos iniciales")
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      const token = getCookie("token") || localStorage.getItem("token")
      if (!token) {
        console.log("No token available for fetchData")
        return
      }

      console.log("Fetching data with token:", token.substring(0, 20) + "...")

      const [productosRes, pedidosRes, statsRes] = await Promise.all([
        fetch("/api/productos", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/pedidos", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      console.log("API responses:", {
        productos: productosRes.status,
        pedidos: pedidosRes.status,
        stats: statsRes.status,
      })

      if (productosRes.ok) {
        const productosData = await productosRes.json()
        console.log("Products loaded:", productosData.length)
        setProductos(productosData)
      } else {
        console.error("Error loading products:", productosRes.status)
      }

      if (pedidosRes.ok) {
        const pedidosData = await pedidosRes.json()
        console.log("Orders loaded:", pedidosData.length)
        setPedidos(pedidosData)
      } else {
        console.error("Error loading orders:", pedidosRes.status)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        console.log("Stats loaded:", statsData)
        setStats({
          ...statsData,
          totalEmpleados: empleados.length,
        })
      } else {
        console.error("Error loading stats:", statsRes.status)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      showMessage("error", "Error al cargar los datos")
    }
  }

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: "", text: "" }), 5000)
  }

  // ===== FUNCIONES DE PRODUCTOS =====
  const crearProducto = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones del frontend
    if (!nuevoProducto.codigo || !nuevoProducto.descripcion || !nuevoProducto.precio || !nuevoProducto.categoria) {
      showMessage("error", "Todos los campos son requeridos")
      return
    }

    if (isNaN(Number.parseFloat(nuevoProducto.precio)) || Number.parseFloat(nuevoProducto.precio) <= 0) {
      showMessage("error", "El precio debe ser un número mayor a 0")
      return
    }

    try {
      const token = getCookie("token") || localStorage.getItem("token")
      if (!token) {
        showMessage("error", "No hay token de autenticación")
        return
      }

      console.log("Creating product:", nuevoProducto)

      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...nuevoProducto,
          precio: Number.parseFloat(nuevoProducto.precio),
        }),
      })

      console.log("Response status:", response.status)

      // Obtener el texto de la respuesta
      const responseText = await response.text()
      console.log("Response text:", responseText.substring(0, 200))

      // Verificar si es HTML (error de servidor)
      if (responseText.includes("<html>") || responseText.includes("<!DOCTYPE")) {
        showMessage("error", "Error del servidor - respuesta HTML recibida")
        return
      }

      // Parsear JSON
      let data: any
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        showMessage("error", "Respuesta del servidor no es JSON válida")
        return
      }

      if (response.ok) {
        setNuevoProducto({ codigo: "", descripcion: "", precio: "", categoria: "", detalles: "" })
        fetchData()
        showMessage("success", "Producto creado exitosamente")
      } else {
        showMessage("error", data.error || "Error al crear producto")
      }
    } catch (error) {
      console.error("Error creando producto:", error)
      showMessage("error", "Error de conexión al crear producto")
    }
  }

  const editarProducto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      const token = getCookie("token") || localStorage.getItem("token")
      const response = await fetch(`/api/productos/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      })

      if (response.ok) {
        setEditingProduct(null)
        fetchData()
        showMessage("success", "Producto actualizado exitosamente")
      } else {
        showMessage("error", "Error al actualizar producto")
      }
    } catch (error) {
      console.error("Error actualizando producto:", error)
      showMessage("error", "Error al actualizar producto")
    }
  }

  const eliminarProducto = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    try {
      const token = getCookie("token") || localStorage.getItem("token")
      const response = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchData()
        showMessage("success", "Producto eliminado exitosamente")
      } else {
        showMessage("error", "Error al eliminar producto")
      }
    } catch (error) {
      console.error("Error eliminando producto:", error)
      showMessage("error", "Error al eliminar producto")
    }
  }

  // ===== FUNCIONES DE EMPLEADOS =====
  const crearEmpleado = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = getCookie("token") || localStorage.getItem("token")
      const response = await fetch("/api/admin/empleados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...nuevoEmpleado,
          rol: "empleado",
        }),
      })

      if (response.ok) {
        const newEmployee = await response.json()
        setEmpleados([...empleados, newEmployee.employee])
        setNuevoEmpleado({
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          departamento: "",
          password: "",
        })
        showMessage("success", "Empleado creado exitosamente")
      } else {
        const error = await response.json()
        showMessage("error", error.error || "Error al crear empleado")
      }
    } catch (error) {
      console.error("Error creando empleado:", error)
      showMessage("error", "Error al crear empleado")
    }
  }

  const editarEmpleado = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEmployee) return

    try {
      // Simular actualización (en un sistema real sería una API call)
      setEmpleados(empleados.map((emp) => (emp.id === editingEmployee.id ? { ...editingEmployee } : emp)))
      setEditingEmployee(null)
      showMessage("success", "Empleado actualizado exitosamente")
    } catch (error) {
      console.error("Error actualizando empleado:", error)
      showMessage("error", "Error al actualizar empleado")
    }
  }

  const eliminarEmpleado = async (id: number) => {
    if (!confirm("¿Estás seguro de desactivar este empleado?")) return

    try {
      setEmpleados(empleados.map((emp) => (emp.id === id ? { ...emp, activo: false } : emp)))
      showMessage("success", "Empleado desactivado exitosamente")
    } catch (error) {
      console.error("Error desactivando empleado:", error)
      showMessage("error", "Error al desactivar empleado")
    }
  }

  // ===== FUNCIONES DE PEDIDOS =====
  const actualizarEstadoPedido = async (pedidoId: number, nuevoEstado: string) => {
    try {
      const token = getCookie("token") || localStorage.getItem("token")
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      if (response.ok) {
        fetchData()
        showMessage("success", "Estado del pedido actualizado")
      } else {
        showMessage("error", "Error al actualizar pedido")
      }
    } catch (error) {
      console.error("Error actualizando pedido:", error)
      showMessage("error", "Error al actualizar pedido")
    }
  }

  // ===== FUNCIONES DE REPORTES =====
  const exportarReporte = (tipo: string) => {
    let data: any[] = []
    let filename = ""

    switch (tipo) {
      case "productos":
        data = productos.map((p) => ({
          Código: p.codigo,
          Descripción: p.descripcion,
          Precio: p.precio,
          Categoría: p.categoria,
          Estado: p.activo ? "Activo" : "Inactivo",
        }))
        filename = "productos.csv"
        break
      case "empleados":
        data = empleados.map((e) => ({
          Nombre: `${e.nombre} ${e.apellido}`,
          Email: e.email,
          Teléfono: e.telefono,
          Departamento: e.departamento,
          "Fecha Ingreso": new Date(e.fecha_ingreso).toLocaleDateString(),
          Estado: e.activo ? "Activo" : "Inactivo",
        }))
        filename = "empleados.csv"
        break
      case "pedidos":
        data = pedidos.map((p) => ({
          "Número Pedido": p.numero_pedido,
          Cliente: p.cliente_nombre,
          Email: p.cliente_email,
          Fecha: new Date(p.fecha_pedido).toLocaleDateString(),
          Estado: p.estado,
          Total: p.total,
        }))
        filename = "pedidos.csv"
        break
    }

    if (data.length === 0) {
      showMessage("error", "No hay datos para exportar")
      return
    }

    // Convertir a CSV
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((row) => Object.values(row).join(","))
    const csv = [headers, ...rows].join("\n")

    // Descargar archivo
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)

    showMessage("success", `Reporte ${tipo} exportado exitosamente`)
  }

  const logout = () => {
    // Limpiar localStorage
    localStorage.clear()

    // Limpiar cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=")
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    })

    window.location.href = "/"
  }

  // ===== FILTROS =====
  const productosFiltrados = productos.filter((producto) => {
    const matchesSearch =
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategoria === "all" || producto.categoria === filterCategoria
    return matchesSearch && matchesCategory
  })

  const empleadosFiltrados = empleados.filter((empleado) => {
    const matchesSearch =
      empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartamento === "all" || empleado.departamento === filterDepartamento
    return matchesSearch && matchesDepartment && empleado.activo
  })

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchesSearch =
      pedido.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filterEstado === "all" || pedido.estado === filterEstado
    return matchesSearch && matchesEstado
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando panel administrativo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
              <Badge variant="default">Jefe de Ventas</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user?.nombre} {user?.apellido}
                </span>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="empleados">Empleados</TabsTrigger>
            <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProductos}</div>
                  <p className="text-xs text-muted-foreground">Activos en catálogo</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pedidosPendientes}</div>
                  <p className="text-xs text-muted-foreground">Requieren atención</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.ventasDelMes.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Ingresos mensuales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{empleados.filter((e) => e.activo).length}</div>
                  <p className="text-xs text-muted-foreground">Personal activo</p>
                </CardContent>
              </Card>
            </div>

            {/* Resumen por categorías */}
            <Card>
              <CardHeader>
                <CardTitle>Productos por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CATEGORIAS.map((categoria) => {
                    const count = productos.filter((p) => p.categoria === categoria.value && p.activo).length
                    return (
                      <div key={categoria.value} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{count}</div>
                        <div className="text-sm text-gray-600">{categoria.label}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Productos Tab */}
          <TabsContent value="productos">
            <div className="space-y-6">
              {/* Filtros y búsqueda */}
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Productos</CardTitle>
                  <CardDescription>Administra el catálogo completo de productos turísticos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar productos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                      <SelectTrigger className="w-full md:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrar por categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {CATEGORIAS.map((categoria) => (
                          <SelectItem key={categoria.value} value={categoria.value}>
                            {categoria.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de productos */}
                  <div className="space-y-4">
                    {productosFiltrados.map((producto) => (
                      <div
                        key={producto.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{producto.descripcion}</h3>
                            <Badge variant="secondary">
                              {CATEGORIAS.find((c) => c.value === producto.categoria)?.label || producto.categoria}
                            </Badge>
                            {!producto.activo && <Badge variant="destructive">Inactivo</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">Código: {producto.codigo}</p>
                          <p className="text-lg font-bold text-green-600">${producto.precio.toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingProduct(producto)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => eliminarProducto(producto.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Formulario crear producto */}
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nuevo Producto</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={crearProducto} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="codigo">Código del Producto</Label>
                        <Input
                          id="codigo"
                          value={nuevoProducto.codigo}
                          onChange={(e) => setNuevoProducto({ ...nuevoProducto, codigo: e.target.value })}
                          placeholder="Ej: VUE001"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select
                          value={nuevoProducto.categoria}
                          onValueChange={(value) => setNuevoProducto({ ...nuevoProducto, categoria: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIAS.map((categoria) => (
                              <SelectItem key={categoria.value} value={categoria.value}>
                                {categoria.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Input
                        id="descripcion"
                        value={nuevoProducto.descripcion}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                        placeholder="Descripción del producto"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="precio">Precio</Label>
                      <Input
                        id="precio"
                        type="number"
                        step="0.01"
                        value={nuevoProducto.precio}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="detalles">Detalles Adicionales</Label>
                      <Textarea
                        id="detalles"
                        value={nuevoProducto.detalles}
                        onChange={(e) => setNuevoProducto({ ...nuevoProducto, detalles: e.target.value })}
                        placeholder="Información adicional del producto..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Producto
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Modal de edición */}
              {editingProduct && (
                <Card>
                  <CardHeader>
                    <CardTitle>Editar Producto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={editarProducto} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Código</Label>
                          <Input
                            value={editingProduct.codigo}
                            onChange={(e) => setEditingProduct({ ...editingProduct, codigo: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Categoría</Label>
                          <Select
                            value={editingProduct.categoria}
                            onValueChange={(value) => setEditingProduct({ ...editingProduct, categoria: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIAS.map((categoria) => (
                                <SelectItem key={categoria.value} value={categoria.value}>
                                  {categoria.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Input
                          value={editingProduct.descripcion}
                          onChange={(e) => setEditingProduct({ ...editingProduct, descripcion: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Precio</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editingProduct.precio}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, precio: Number.parseFloat(e.target.value) })
                          }
                          required
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Empleados Tab */}
          <TabsContent value="empleados">
            <div className="space-y-6">
              {/* Filtros y búsqueda */}
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Empleados</CardTitle>
                  <CardDescription>Administra el personal de la empresa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar empleados..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={filterDepartamento} onValueChange={setFilterDepartamento}>
                      <SelectTrigger className="w-full md:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrar por departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los departamentos</SelectItem>
                        {DEPARTAMENTOS.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value}>
                            {dept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de empleados */}
                  <div className="space-y-4">
                    {empleadosFiltrados.map((empleado) => (
                      <div
                        key={empleado.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">
                              {empleado.nombre} {empleado.apellido}
                            </h3>
                            <Badge variant="secondary">
                              {DEPARTAMENTOS.find((d) => d.value === empleado.departamento)?.label ||
                                empleado.departamento}
                            </Badge>
                            {!empleado.activo && <Badge variant="destructive">Inactivo</Badge>}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {empleado.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {empleado.telefono}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Ingreso: {new Date(empleado.fecha_ingreso).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingEmployee(empleado)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => eliminarEmpleado(empleado.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Formulario crear empleado */}
              <Card>
                <CardHeader>
                  <CardTitle>Agregar Nuevo Empleado</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={crearEmpleado} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emp-nombre">Nombre</Label>
                        <Input
                          id="emp-nombre"
                          value={nuevoEmpleado.nombre}
                          onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emp-apellido">Apellido</Label>
                        <Input
                          id="emp-apellido"
                          value={nuevoEmpleado.apellido}
                          onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, apellido: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emp-email">Email</Label>
                        <Input
                          id="emp-email"
                          type="email"
                          value={nuevoEmpleado.email}
                          onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emp-telefono">Teléfono</Label>
                        <Input
                          id="emp-telefono"
                          value={nuevoEmpleado.telefono}
                          onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, telefono: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emp-departamento">Departamento</Label>
                        <Select
                          value={nuevoEmpleado.departamento}
                          onValueChange={(value) => setNuevoEmpleado({ ...nuevoEmpleado, departamento: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTAMENTOS.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emp-password">Contraseña Temporal</Label>
                        <Input
                          id="emp-password"
                          type="password"
                          value={nuevoEmpleado.password}
                          onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, password: e.target.value })}
                          placeholder="Mínimo 6 caracteres"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Agregar Empleado
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Modal de edición de empleado */}
              {editingEmployee && (
                <Card>
                  <CardHeader>
                    <CardTitle>Editar Empleado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={editarEmpleado} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nombre</Label>
                          <Input
                            value={editingEmployee.nombre}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, nombre: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Apellido</Label>
                          <Input
                            value={editingEmployee.apellido}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, apellido: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={editingEmployee.email}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Teléfono</Label>
                          <Input
                            value={editingEmployee.telefono}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, telefono: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Departamento</Label>
                        <Select
                          value={editingEmployee.departamento}
                          onChange={(e) => setEditingEmployee({ ...editingEmployee, departamento: e.target.value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTAMENTOS.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex space-x-2">
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setEditingEmployee(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Pedidos Tab */}
          <TabsContent value="pedidos">
            <div className="space-y-6">
              {/* Filtros y búsqueda */}
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Pedidos</CardTitle>
                  <CardDescription>Administra los pedidos de los clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar pedidos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={filterEstado} onValueChange={setFilterEstado}>
                      <SelectTrigger className="w-full md:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        {ESTADOS_PEDIDO.map((estado) => (
                          <SelectItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de pedidos */}
                  <div className="space-y-4">
                    {pedidosFiltrados.map((pedido) => (
                      <div key={pedido.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">Pedido #{pedido.numero_pedido}</h3>
                            <p className="text-sm text-gray-600">
                              Cliente: {pedido.cliente_nombre} ({pedido.cliente_email})
                            </p>
                            <p className="text-sm text-gray-600">
                              Fecha: {new Date(pedido.fecha_pedido).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={
                                ESTADOS_PEDIDO.find((e) => e.value === pedido.estado)?.color ||
                                "bg-gray-100 text-gray-800"
                              }
                            >
                              {ESTADOS_PEDIDO.find((e) => e.value === pedido.estado)?.label || pedido.estado}
                            </Badge>
                            <span className="font-bold text-green-600">${pedido.total.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h4 className="font-medium mb-2">Items:</h4>
                          <div className="space-y-1">
                            {pedido.items.map((item, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                {item.cantidad}x {item.producto_descripcion} - ${item.precio_unitario.toLocaleString()}{" "}
                                c/u
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            {pedido.estado === "pendiente" && (
                              <>
                                <Button size="sm" onClick={() => actualizarEstadoPedido(pedido.id, "entregado")}>
                                  <Check className="h-4 w-4 mr-1" />
                                  Marcar como Entregado
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => actualizarEstadoPedido(pedido.id, "cancelado")}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancelar
                                </Button>
                              </>
                            )}
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setViewingOrder(pedido)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Modal de detalles del pedido */}
              {viewingOrder && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detalles del Pedido #{viewingOrder.numero_pedido}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Información del Cliente</h4>
                          <p className="text-sm">Nombre: {viewingOrder.cliente_nombre}</p>
                          <p className="text-sm">Email: {viewingOrder.cliente_email}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Información del Pedido</h4>
                          <p className="text-sm">Fecha: {new Date(viewingOrder.fecha_pedido).toLocaleDateString()}</p>
                          <p className="text-sm">Estado: {viewingOrder.estado}</p>
                          <p className="text-sm font-bold">Total: ${viewingOrder.total.toLocaleString()}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Items del Pedido</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">Producto</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Cantidad</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Precio Unitario</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {viewingOrder.items.map((item, index) => (
                                <tr key={index} className="border-t">
                                  <td className="px-4 py-2 text-sm">{item.producto_descripcion}</td>
                                  <td className="px-4 py-2 text-sm">{item.cantidad}</td>
                                  <td className="px-4 py-2 text-sm">${item.precio_unitario.toLocaleString()}</td>
                                  <td className="px-4 py-2 text-sm font-medium">
                                    ${(item.cantidad * item.precio_unitario).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline" onClick={() => setViewingOrder(null)}>
                          Cerrar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Reportes Tab */}
          <TabsContent value="reportes">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Reportes y Estadísticas
                  </CardTitle>
                  <CardDescription>Genera reportes y analiza el rendimiento del negocio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Exportar reportes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Exportar Datos</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => exportarReporte("productos")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Exportar Productos
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => exportarReporte("empleados")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Exportar Empleados
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => exportarReporte("pedidos")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Exportar Pedidos
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Estadísticas rápidas */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Estadísticas del Mes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Pedidos Totales:</span>
                          <span className="font-medium">{pedidos.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Pedidos Entregados:</span>
                          <span className="font-medium">{pedidos.filter((p) => p.estado === "entregado").length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Tasa de Conversión:</span>
                          <span className="font-medium">
                            {pedidos.length > 0
                              ? Math.round(
                                  (pedidos.filter((p) => p.estado === "entregado").length / pedidos.length) * 100,
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Ticket Promedio:</span>
                          <span className="font-medium">
                            $
                            {pedidos.length > 0
                              ? Math.round(
                                  pedidos.reduce((sum, p) => sum + p.total, 0) / pedidos.length,
                                ).toLocaleString()
                              : 0}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Acciones rápidas */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Generar Reporte Mensual
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Análisis de Ventas
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          Programar Reporte
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Gráficos y análisis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Ventas por Categoría</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {CATEGORIAS.map((categoria) => {
                            const productosCategoria = productos.filter((p) => p.categoria === categoria.value)
                            const totalVentas = productosCategoria.reduce((sum, p) => sum + p.precio, 0)
                            const maxVentas = Math.max(
                              ...CATEGORIAS.map((c) =>
                                productos.filter((p) => p.categoria === c.value).reduce((sum, p) => sum + p.precio, 0),
                              ),
                            )
                            const percentage = maxVentas > 0 ? (totalVentas / maxVentas) * 100 : 0

                            return (
                              <div key={categoria.value}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{categoria.label}</span>
                                  <span className="text-sm text-gray-600">${totalVentas.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Personal por Departamento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {DEPARTAMENTOS.map((dept) => {
                            const empleadosDept = empleados.filter((e) => e.departamento === dept.value && e.activo)
                            const maxEmpleados = Math.max(
                              ...DEPARTAMENTOS.map(
                                (d) => empleados.filter((e) => e.departamento === d.value && e.activo).length,
                              ),
                            )
                            const percentage = maxEmpleados > 0 ? (empleadosDept.length / maxEmpleados) * 100 : 0

                            return (
                              <div key={dept.value}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{dept.label}</span>
                                  <span className="text-sm text-gray-600">{empleadosDept.length} empleados</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Resumen de actividad reciente */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Actividad Reciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium">Productos activos en catálogo</p>
                              <p className="text-xs text-gray-600">Total de productos disponibles para venta</p>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-blue-600">
                            {productos.filter((p) => p.activo).length}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center">
                            <ShoppingCart className="h-5 w-5 text-yellow-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium">Pedidos pendientes de procesamiento</p>
                              <p className="text-xs text-gray-600">Requieren atención inmediata</p>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-yellow-600">
                            {pedidos.filter((p) => p.estado === "pendiente").length}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium">Empleados activos</p>
                              <p className="text-xs text-gray-600">Personal trabajando actualmente</p>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-green-600">
                            {empleados.filter((e) => e.activo).length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
