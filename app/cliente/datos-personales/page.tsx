"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User, Home, ShoppingBag } from "lucide-react"
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
}

export default function DatosPersonales() {
  const [user, setUser] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    const parsedUser: Cliente = JSON.parse(userData)
    setUser(parsedUser)
    setLoading(false)
  }, [router])

  useEffect(() => {
    document.title = "Datos Personales";
  }, []);

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const navigateToDashboard = () => {
    router.push("/cliente/dashboard")
  }

  const navigateToOrders = () => {
    router.push("/cliente/compras")
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
            <h1 className="text-3xl font-extrabold text-white tracking-wide">Datos Personales</h1>
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
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-700 transition-colors duration-200 py-2">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gray-800 text-gray-50 border border-gray-700 rounded-xl shadow-lg">
          <CardHeader className="border-b border-gray-700 pb-4 mb-4">
            <CardTitle className="text-2xl font-bold text-white">Mi Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Nombre:</p>
              <p className="text-white text-lg font-medium">{user?.nombre}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Apellido:</p>
              <p className="text-white text-lg font-medium">{user?.apellido}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email:</p>
              <p className="text-white text-lg font-medium">{user?.email}</p>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold mt-4 transition-colors duration-200">
              Modificar Datos (Función Eliminada)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 