"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, LogOut, Plus, User, ShoppingBag } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Cliente {
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
}

interface Pedido {
  id: number
  numero_pedido: string
  fecha_pedido: string
  estado: string
  total: number
  items: Array<{
    producto_descripcion: string
    cantidad: number
    precio_unitario: number
  }>
}

export default function ClienteDashboard() {
  const [user, setUser] = useState<Cliente | null>(null)
  const [productos, setProductos] = useState<Producto[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [carrito, setCarrito] = useState<Array<{ producto: Producto; cantidad: number }>>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.rol !== "cliente") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    fetchProductos()
    fetchPedidos()
  }, [router])

  useEffect(() => {
    document.title = "Panel Cliente";
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch("/api/productos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProductos(data)
      }
    } catch (error) {
      console.error("Error fetching productos:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPedidos = async () => {
    try {
      const response = await fetch("/api/pedidos/cliente", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setPedidos(data)
      }
    } catch (error) {
      console.error("Error fetching pedidos:", error)
    }
  }

  const agregarAlCarrito = (producto: Producto) => {
    const existente = carrito.find((item) => item.producto.id === producto.id)
    if (existente) {
      setCarrito(
        carrito.map((item) => (item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)),
      )
    } else {
      setCarrito([...carrito, { producto, cantidad: 1 }])
    }
  }

  const getUniqueCategories = () => {
    const categories = productos.map(p => p.categoria);
    return ["Todas", ...Array.from(new Set(categories))];
  };

  const filteredProducts = productos.filter(producto => {
    if (selectedCategory === "Todas") {
      return true;
    }
    return producto.categoria === selectedCategory;
  });

  const removerDelCarrito = (productoId: number) => {
    setCarrito(carrito.filter((item) => item.producto.id !== productoId))
  }

  const actualizarCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removerDelCarrito(productoId)
    } else {
      setCarrito(carrito.map((item) => (item.producto.id === productoId ? { ...item, cantidad } : item)))
    }
  }

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.producto.precio * item.cantidad, 0)
  }

  const realizarPedido = async () => {
    if (carrito.length === 0) return

    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: carrito.map((item) => ({
            producto_id: item.producto.id,
            cantidad: item.cantidad,
            precio_unitario: item.producto.precio,
          })),
        }),
      })

      if (response.ok) {
        setCarrito([])
        fetchPedidos()
        alert("Pedido realizado con éxito")
      }
    } catch (error) {
      console.error("Error realizando pedido:", error)
      alert("Error al realizar el pedido")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const navigateToProfile = () => {
    router.push("/cliente/datos-personales")
  }

  const navigateToOrders = () => {
    router.push("/cliente/compras")
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-extrabold text-white tracking-wide">Panel Cliente</h1>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-purple-500 transition-all duration-300">
                    <Avatar className="h-9 w-9 border border-gray-700 bg-purple-600">
                      <AvatarFallback className="text-white font-bold text-lg">
                        {user?.nombre ? user.nombre.charAt(0).toUpperCase() : ""}{user?.apellido ? user.apellido.charAt(0).toUpperCase() : ""}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 text-gray-50 border border-gray-700 shadow-lg" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal border-b border-gray-700 pb-2 mb-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user?.nombre} {user?.apellido}</p>
                      <p className="text-xs leading-none text-gray-400">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={navigateToProfile} className="cursor-pointer hover:bg-gray-700 transition-colors duration-200 py-2">
                    <User className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Datos Personales</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={navigateToOrders} className="cursor-pointer hover:bg-gray-700 transition-colors duration-200 py-2">
                    <ShoppingBag className="mr-2 h-4 w-4 text-green-400" />
                    <span>Compras</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer hover:bg-red-700 text-red-400 hover:text-white transition-colors duration-200 py-2">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productos */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 text-gray-50 border border-gray-700 rounded-xl shadow-lg">
              <CardHeader className="border-b border-gray-700 pb-4 mb-4">
                <CardTitle className="text-2xl font-bold text-white">Productos Disponibles</CardTitle>
                <CardDescription className="text-gray-400">Selecciona los productos que deseas agregar a tu carrito</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex flex-wrap gap-3">
                  {getUniqueCategories().map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${selectedCategory === category ? "bg-purple-600 text-white hover:bg-purple-500" : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white"}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map((producto) => (
                    <div key={producto.id} className="bg-gray-700 border border-gray-600 rounded-lg p-5 shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-white text-lg">{producto.descripcion}</h3>
                        <Badge variant="secondary" className="bg-purple-600 text-white hover:bg-purple-700 px-3 py-1 rounded-full text-xs">
                          {producto.categoria}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">Código: {producto.codigo}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-400">${producto.precio.toLocaleString()}</span>
                        <Button size="sm" onClick={() => agregarAlCarrito(producto)} className="bg-purple-700 hover:bg-purple-600 text-white rounded-md px-4 py-2 flex items-center transition-colors duration-200">
                          <Plus className="h-4 w-4 mr-1" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carrito */}
          <div>
            <Card className="mb-6 bg-gray-800 text-gray-50 border border-gray-700 rounded-xl shadow-lg">
              <CardHeader className="border-b border-gray-700 pb-4 mb-4">
                <CardTitle className="flex items-center text-xl font-bold text-white">
                  <ShoppingCart className="h-5 w-5 mr-2 text-blue-400" />
                  Carrito ({carrito.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {carrito.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Tu carrito está vacío</p>
                ) : (
                  <div className="space-y-4">
                    {carrito.map((item) => (
                      <div key={item.producto.id} className="flex justify-between items-center p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm">
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{item.producto.descripcion}</p>
                          <p className="text-xs text-gray-400">${item.producto.precio.toLocaleString()} c/u</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                            className="w-8 h-8 rounded-full text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white transition-colors duration-200"
                          >
                            -
                          </Button>
                          <span className="font-medium text-white">{item.cantidad}</span>
                          <Button
                            size="sm"
                            onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                            className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition-colors duration-200"
                          >
                            +
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removerDelCarrito(item.producto.id)}
                            className="text-red-400 hover:bg-gray-600 rounded-md transition-colors duration-200"
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-600 mt-4">
                      <span className="text-lg font-bold text-white">Total:</span>
                      <span className="text-2xl font-extrabold text-green-400">${calcularTotal().toLocaleString()}</span>
                    </div>
                    <Button
                      onClick={realizarPedido}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold mt-4 transition-colors duration-200"
                      disabled={carrito.length === 0}
                    >
                      Realizar Pedido
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mis Pedidos */}
            <Card className="bg-gray-800 text-gray-50 border border-gray-700 rounded-xl shadow-lg mt-8">
              <CardHeader className="border-b border-gray-700 pb-4 mb-4">
                <CardTitle className="flex items-center text-xl font-bold text-white">
                  <Package className="h-5 w-5 mr-2 text-yellow-400" />
                  Mis Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pedidos.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No tienes pedidos aún</p>
                ) : (
                  <div className="space-y-4">
                    {pedidos.map((pedido) => (
                      <div key={pedido.id} className="bg-gray-700 border border-gray-600 rounded-md p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-white">Pedido #{pedido.numero_pedido}</h4>
                          <Badge
                            variant="outline"
                            className={`px-3 py-1 rounded-full text-xs ${
                              pedido.estado === "Completado" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                            }`}
                          >
                            {pedido.estado}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">Fecha: {new Date(pedido.fecha_pedido).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-400 mb-2">Total: <span className="font-bold text-green-400">${pedido.total.toLocaleString()}</span></p>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                          {pedido.items.map((item, index) => (
                            <li key={index}>
                              {item.producto_descripcion} (x{item.cantidad}) - ${item.precio_unitario.toLocaleString()} c/u
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
