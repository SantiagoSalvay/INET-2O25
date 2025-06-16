"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, Package, User, Home, ShoppingBag } from "lucide-react"
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

export default function Compras() {
  const [user, setUser] = useState<Cliente | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
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
    fetchPedidos()
  }, [router])

  useEffect(() => {
    document.title = "Mis Compras";
  }, []);

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
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const navigateToDashboard = () => {
    router.push("/cliente/dashboard")
  }

  const navigateToProfile = () => {
    router.push("/cliente/datos-personales")
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-50">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-extrabold text-white tracking-wide">Mis Compras</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={navigateToDashboard} className="text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
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
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 transition-colors duration-200 py-2">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gray-800 text-gray-50 border border-gray-700 rounded-xl shadow-lg">
          <CardHeader className="border-b border-gray-700 pb-4 mb-4">
            <CardTitle className="text-2xl font-bold text-white">Historial de Compras</CardTitle>
          </CardHeader>
          <CardContent>
            {pedidos.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No has realizado ninguna compra aún.</p>
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
  )
} 