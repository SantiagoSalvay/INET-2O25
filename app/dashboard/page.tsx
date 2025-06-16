"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  LogOut, 
  Settings, 
  ShoppingBag, 
  Search,
  ChevronDown,
  Star,
  MapPin,
  Calendar,
  Users as UsersIcon,
  Clock,
  Heart,
  ArrowRight,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Package,
  Sparkles
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Datos de ejemplo para las categorías
const categorias = [
  {
    id: 1,
    nombre: "Destinos Nacionales",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Explora los mejores destinos dentro del país",
    icon: MapPin,
  },
  {
    id: 2,
    nombre: "Destinos Internacionales",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Descubre destinos alrededor del mundo",
    icon: Globe,
  },
  {
    id: 3,
    nombre: "Paquetes Todo Incluido",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Viajes con todo incluido para tu comodidad",
    icon: Package,
  },
  {
    id: 4,
    nombre: "Experiencias Únicas",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Vivencias inolvidables y aventuras",
    icon: Sparkles,
  },
]

// Datos de ejemplo para productos recomendados
const productosRecomendados = [
  {
    id: 1,
    nombre: "Bariloche Premium",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Paquete premium en Bariloche con alojamiento de lujo",
    precio: 85000,
    rating: 4.8,
    categoria: "Nacional",
    duracion: "7 días",
    personas: "2 personas",
    incluye: ["Alojamiento", "Desayuno", "Traslados"],
  },
  {
    id: 2,
    nombre: "Miami Beach",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Vacaciones en las mejores playas de Miami",
    precio: 450000,
    rating: 4.9,
    categoria: "Internacional",
    duracion: "10 días",
    personas: "2 personas",
    incluye: ["Vuelos", "Hotel", "Desayuno"],
  },
]

// Datos de ejemplo para ofertas especiales
const ofertasEspeciales = [
  {
    id: 1,
    titulo: "Descuento del 20%",
    descripcion: "En todos los paquetes nacionales",
    codigo: "NACIONAL20",
    validoHasta: "31/12/2024",
  },
  {
    id: 2,
    titulo: "2x1 en Vuelos",
    descripcion: "Comprá un pasaje y llevá un acompañante gratis",
    codigo: "2X1VUELOS",
    validoHasta: "30/06/2024",
  },
]

export default function DashboardPage() {
  const [userInitials, setUserInitials] = useState("JD")
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y Búsqueda */}
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">TravelEase</span>
              </Link>
              <div className="hidden md:flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar destinos, paquetes..."
                  className="bg-transparent border-none focus:outline-none text-sm w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Perfil y Menú */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {userInitials}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>Mis Compras</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Banner Principal */}
      <div className="relative h-[500px] bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Descubre tu próximo destino
            </h1>
            <p className="text-xl mb-8">
              Encuentra las mejores ofertas en viajes y experiencias inolvidables
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Explorar Destinos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Ofertas Especiales */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ofertasEspeciales.map((oferta) => (
              <Card key={oferta.id} className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">{oferta.titulo}</CardTitle>
                  <CardDescription className="text-white/80">{oferta.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Código: {oferta.codigo}</p>
                      <p className="text-sm text-white/60">Válido hasta: {oferta.validoHasta}</p>
                    </div>
                    <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                      Aplicar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categorías */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explora por Categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categorias.map((categoria) => (
              <Link href={`/categoria/${categoria.id}`} key={categoria.id}>
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={categoria.imagen}
                      alt={categoria.nombre}
                      className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <categoria.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">
                      {categoria.nombre}
                    </CardTitle>
                    <CardDescription>{categoria.descripcion}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Productos Recomendados */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recomendados para ti</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosRecomendados.map((producto) => (
              <Link href={`/producto/${producto.id}`} key={producto.id}>
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Badge className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm">
                      {producto.categoria}
                    </Badge>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{producto.rating}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">
                      {producto.nombre}
                    </CardTitle>
                    <CardDescription>{producto.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{producto.duracion}</span>
                        </div>
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          <span>{producto.personas}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {producto.incluye.map((item, index) => (
                          <Badge key={index} variant="secondary">
                            {item}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ${producto.precio.toLocaleString()}
                        </span>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TravelEase</h3>
              <p className="text-gray-400">
                Tu compañero de viaje perfecto para descubrir el mundo.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +54 11 1234-5678
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@travelease.com
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/destinos">Destinos</Link></li>
                <li><Link href="/paquetes">Paquetes</Link></li>
                <li><Link href="/ofertas">Ofertas</Link></li>
                <li><Link href="/contacto">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Youtube className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TravelEase. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 