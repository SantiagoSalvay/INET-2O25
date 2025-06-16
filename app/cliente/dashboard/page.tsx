"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, LogOut, Plus } from "lucide-react"
import Link from "next/link"

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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Panel Cliente</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-gray-500" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos Disponibles</CardTitle>
                <CardDescription>Selecciona los productos que deseas agregar a tu carrito</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productos.map((producto) => (
                    <div key={producto.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{producto.descripcion}</h3>
                        <Badge variant="secondary">{producto.categoria}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Código: {producto.codigo}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">${producto.precio.toLocaleString()}</span>
                        <Button size="sm" onClick={() => agregarAlCarrito(producto)}>
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
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Carrito ({carrito.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {carrito.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Tu carrito está vacío</p>
                ) : (
                  <div className="space-y-3">
                    {carrito.map((item) => (
                      <div key={item.producto.id} className="flex justify-between items-center p-2 border rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.producto.descripcion}</p>
                          <p className="text-xs text-gray-500">${item.producto.precio.toLocaleString()} c/u</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.cantidad}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center font-bold">
                        <span>Total:</span>
                        <span>${calcularTotal().toLocaleString()}</span>
                      </div>
                      <Button className="w-full mt-3" onClick={realizarPedido} disabled={carrito.length === 0}>
                        Realizar Pedido
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mis Pedidos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Mis Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pedidos.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tienes pedidos aún</p>
                ) : (
                  <div className="space-y-3">
                    {pedidos.slice(0, 3).map((pedido) => (
                      <div key={pedido.id} className="border rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">#{pedido.numero_pedido}</span>
                          <Badge variant={pedido.estado === "pendiente" ? "default" : "secondary"}>
                            {pedido.estado}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{new Date(pedido.fecha_pedido).toLocaleDateString()}</p>
                        <p className="font-bold text-green-600">${pedido.total.toLocaleString()}</p>
                      </div>
                    ))}
                    {pedidos.length > 3 && (
                      <Link href="/cliente/pedidos">
                        <Button variant="outline" className="w-full">
                          Ver todos los pedidos
                        </Button>
                      </Link>
                    )}
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
