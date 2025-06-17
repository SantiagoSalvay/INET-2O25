"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plane, Car, Hotel, Star, ChevronLeft, ChevronRight, Calendar, Users, Clock, Menu, X, LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// Datos de ejemplo para los carruseles
const destinosPopulares = [
  {
    id: 1,
    nombre: "Bariloche",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Paisajes de montaña y lagos cristalinos",
    precio: "Desde $85.000",
    categoria: "Nacional",
    rating: 4.8,
  },
  {
    id: 2,
    nombre: "Mendoza",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Capital mundial del vino",
    precio: "Desde $75.000",
    categoria: "Nacional",
    rating: 4.7,
  },
  {
    id: 3,
    nombre: "Miami",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Playas paradisíacas y vida nocturna",
    precio: "Desde $450.000",
    categoria: "Internacional",
    rating: 4.9,
  },
  {
    id: 4,
    nombre: "Madrid",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Historia, cultura y gastronomía",
    precio: "Desde $650.000",
    categoria: "Internacional",
    rating: 4.6,
  },
  {
    id: 5,
    nombre: "Cancún",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Caribe mexicano todo incluido",
    precio: "Desde $850.000",
    categoria: "Internacional",
    rating: 4.8,
  },
  {
    id: 6,
    nombre: "Barcelona",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Arte, arquitectura y mediterráneo",
    precio: "Desde $320.000",
    categoria: "Internacional",
    rating: 4.7,
  },
]

const paquetesDestacados = [
  {
    id: 1,
    titulo: "Paquete Bariloche Completo",
    descripcion: "7 días con vuelo, hotel 4★ y auto incluido",
    precio: 220000,
    imagen: "/placeholder.svg?height=250&width=400",
    incluye: ["Vuelo ida y vuelta", "Hotel 4 estrellas", "Auto 7 días", "Desayuno"],
    duracion: "7 días",
    personas: "2 personas",
  },
  {
    id: 2,
    titulo: "Europa Clásico",
    descripcion: "15 días por Madrid, Barcelona y París",
    precio: 1200000,
    imagen: "/placeholder.svg?height=250&width=400",
    incluye: ["Vuelos internacionales", "Hoteles 4★", "Tours guiados", "Traslados"],
    duracion: "15 días",
    personas: "2 personas",
  },
  {
    id: 3,
    titulo: "Caribe Todo Incluido",
    descripcion: "10 días en resort 5★ en Cancún",
    precio: 950000,
    imagen: "/placeholder.svg?height=250&width=400",
    incluye: ["Vuelo directo", "Resort 5 estrellas", "Todo incluido", "Actividades"],
    duracion: "10 días",
    personas: "2 personas",
  },
  {
    id: 4,
    titulo: "Mendoza Gourmet",
    descripcion: "5 días con tours de vinos y gastronomía",
    precio: 280000,
    imagen: "/placeholder.svg?height=250&width=400",
    incluye: ["Vuelo ida y vuelta", "Hotel boutique", "Tours de vinos", "Cenas gourmet"],
    duracion: "5 días",
    personas: "2 personas",
  },
]

const experienciasUnicas = [
  {
    id: 1,
    titulo: "Glaciar Perito Moreno",
    descripcion: "Excursión al glaciar más famoso de Argentina",
    precio: 35000,
    imagen: "/placeholder.svg?height=200&width=300",
    duracion: "1 día",
    dificultad: "Fácil",
  },
  {
    id: 2,
    titulo: "Safari Península Valdés",
    descripcion: "Avistaje de ballenas y fauna patagónica",
    precio: 55000,
    imagen: "/placeholder.svg?height=200&width=300",
    duracion: "1 día",
    dificultad: "Fácil",
  },
  {
    id: 3,
    titulo: "Trekking Torres del Paine",
    descripcion: "Aventura en la Patagonia chilena",
    precio: 180000,
    imagen: "/placeholder.svg?height=200&width=300",
    duracion: "3 días",
    dificultad: "Difícil",
  },
  {
    id: 4,
    titulo: "City Tour Buenos Aires",
    descripcion: "Descubre la capital argentina",
    precio: 15000,
    imagen: "/placeholder.svg?height=200&width=300",
    duracion: "4 horas",
    dificultad: "Fácil",
  },
]

// Componente Carrusel reutilizable
function Carousel({ children, itemsPerView = 3 }: { children: React.ReactNode[]; itemsPerView?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalItems = children.length
  const maxIndex = Math.max(0, totalItems - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [maxIndex])

  return (
    <div className="relative group perspective-1000">
      <div className="overflow-hidden rounded-2xl backdrop-blur-sm bg-white/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/10">
        <div
          className="flex transition-all duration-700 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {children.map((child, index) => (
            <div 
              key={index} 
              className={`flex-shrink-0 px-2 transition-all duration-500 ${
                index === currentIndex 
                  ? 'scale-100 opacity-100 rotate-y-0' 
                  : 'scale-95 opacity-70 rotate-y-10'
              }`} 
              style={{ width: `${100 / itemsPerView}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Controles con efecto de aparición */}
      <div className="absolute inset-y-0 left-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 -translate-x-6 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.57)]"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 translate-x-6 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.57)]"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Indicadores mejorados */}
      <div className="flex justify-center mt-6 space-x-3">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-blue-500 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

const animatingWords = ["Web", "Fast", "Easy", "Safe"]

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<{ nombre: string; apellido: string; email: string; rol: string } | null>(null)
  const [currentHeroWordIndex, setCurrentHeroWordIndex] = useState(0)
  const router = useRouter()

  const heroWords = ["Descubre el mundo", "Viaja", "Conoce", "Disfruta"]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Error parsing user from localStorage", e)
        localStorage.removeItem('user')
      }
    }

    const heroWordInterval = setInterval(() => {
      setCurrentHeroWordIndex((prevIndex) => (prevIndex + 1) % heroWords.length)
    }, 4000) // Cambia cada 4 segundos

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(heroWordInterval)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Ajusta este valor según la altura de tu navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    document.title = "TurismoWeb";
  }, []);

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleViewMore = (id: number, type: string) => {
    if (user) {
      router.push(`/${type}/${id}`)
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TravelWeb</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('hero')} className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Inicio
              </button>
              <button onClick={() => scrollToSection('destinos')} className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Destinos
              </button>
              <button onClick={() => scrollToSection('paquetes')} className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Paquetes
              </button>
              <button onClick={() => scrollToSection('experiencias')} className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Experiencias
              </button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{`${user.nombre.charAt(0).toUpperCase()}${user.apellido.charAt(0).toUpperCase()}`}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.nombre} {user.apellido}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.rol === 'admin' && (
                      <DropdownMenuItem onClick={() => router.push('/admin/dashboard')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard Admin</span>
                      </DropdownMenuItem>
                    )}
                    {user.rol === 'cliente' && (
                      <DropdownMenuItem onClick={() => router.push('/cliente/dashboard')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard Cliente</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg py-4 px-4 border-b border-gray-200/20">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => scrollToSection('hero')} 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('destinos')} 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
              >
                Destinos
              </button>
              <button 
                onClick={() => scrollToSection('paquetes')} 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
              >
                Paquetes
              </button>
              <button 
                onClick={() => scrollToSection('experiencias')} 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
              >
                Experiencias
              </button>
              {user ? (
                <div className="px-3 py-2 space-y-2">
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.nombre}</span>
                  </Button>
                  {user.rol === 'admin' && (
                    <Link href="/admin/dashboard" className="block w-full">
                      <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                        Dashboard Admin
                      </Button>
                    </Link>
                  )}
                  {user.rol === 'cliente' && (
                    <Link href="/cliente/dashboard" className="block w-full">
                      <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                        Dashboard Cliente
                      </Button>
                    </Link>
                  )}
                  <Button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Link href="/login" className="block w-full">
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" className="block w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-6">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentHeroWordIndex}
                className="inline-block"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {heroWords[currentHeroWordIndex]}
              </motion.span>
            </AnimatePresence>
            <span className="text-blue-600"> con nosotros</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Paquetes turísticos nacionales e internacionales para pasajeros individuales, familias y grupos. Estadías,
            pasajes aéreos, alquiler de autos y paquetes completos.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-4">
                Comenzar a explorar
              </Button>
            </Link>
            <Link href="/manual">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Ver manual
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Nuestros Servicios</h3>
            <p className="text-xl text-gray-600">Todo lo que necesitas para tu viaje perfecto</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <Plane className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Pasajes Aéreos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Vuelos nacionales e internacionales con las mejores tarifas y horarios flexibles
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <Hotel className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Estadías</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Hoteles y alojamientos en los mejores destinos, desde económicos hasta lujo
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <Car className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Alquiler de Autos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Vehículos para que explores con total libertad, desde económicos hasta premium
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Paquetes Completos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Experiencias completas con todo incluido, diseñadas para cada tipo de viajero
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Destinos Populares */}
      <section id="destinos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Destinos Populares</h3>
            <p className="text-xl text-gray-600">Los lugares más elegidos por nuestros viajeros</p>
          </div>

          <Carousel itemsPerView={3}>
            {destinosPopulares.map((destino) => (
              <Card
                key={destino.id}
                className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={destino.imagen || "/placeholder.svg"}
                    alt={destino.nombre}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Badge className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md transform group-hover:scale-105 transition-transform duration-300 shadow-[0_4px_16px_rgba(37,99,235,0.3)]">{destino.categoria}</Badge>
                  <div className="absolute top-3 right-3 bg-white/10 backdrop-blur-md rounded-full px-2 py-1 flex items-center transform group-hover:scale-105 transition-transform duration-300 border border-white/20">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1 text-white">{destino.rating}</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">{destino.nombre}</CardTitle>
                  <CardDescription className="text-gray-600">{destino.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600 group-hover:scale-105 transition-transform duration-300">{destino.precio}</span>
                    <Button 
                      size="sm" 
                      className="bg-blue-600/90 hover:bg-blue-700 transform group-hover:scale-105 transition-all duration-300 backdrop-blur-sm shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.5)]"
                      onClick={() => handleViewMore(destino.id, 'destinos')}
                    >
                      Ver más
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Paquetes Destacados */}
      <section id="paquetes" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Paquetes Destacados</h3>
            <p className="text-xl text-gray-600">Ofertas especiales con todo incluido</p>
          </div>

          <Carousel itemsPerView={2}>
            {paquetesDestacados.map((paquete) => (
              <Card key={paquete.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={paquete.imagen || "/placeholder.svg"}
                    alt={paquete.titulo}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-md rounded-lg px-3 py-1 flex items-center space-x-4 transform group-hover:scale-105 transition-transform duration-300 border border-white/20">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-white mr-1" />
                      <span className="text-sm text-white">{paquete.duracion}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-white mr-1" />
                      <span className="text-sm text-white">{paquete.personas}</span>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">{paquete.titulo}</CardTitle>
                  <CardDescription className="text-gray-600">{paquete.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Incluye:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {paquete.incluye.map((item, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 transform group-hover:scale-125 transition-transform duration-300 shadow-[0_0_8px_rgba(37,99,235,0.3)]"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-sm text-gray-500">Desde</span>
                        <div className="text-2xl font-bold text-blue-600 group-hover:scale-105 transition-transform duration-300">${paquete.precio.toLocaleString()}</div>
                      </div>
                      <Button className="bg-blue-600/90 hover:bg-blue-700 transform group-hover:scale-105 transition-all duration-300 backdrop-blur-sm shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.5)]"
                        onClick={() => handleViewMore(paquete.id, 'paquetes')}
                      >
                        Reservar ahora
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Experiencias Únicas */}
      <section id="experiencias" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Experiencias Únicas</h3>
            <p className="text-xl text-gray-600">Aventuras y excursiones que no puedes perderte</p>
          </div>

          <Carousel itemsPerView={4}>
            {experienciasUnicas.map((experiencia) => (
              <Card key={experiencia.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={experiencia.imagen || "/placeholder.svg"}
                    alt={experiencia.titulo}
                    className="w-full h-40 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Badge
                    className={`absolute top-3 right-3 backdrop-blur-md transform group-hover:scale-105 transition-transform duration-300 border border-white/20 ${
                      experiencia.dificultad === "Fácil"
                        ? "bg-green-500/90 shadow-[0_4px_16px_rgba(34,197,94,0.3)]"
                        : experiencia.dificultad === "Difícil"
                          ? "bg-red-500/90 shadow-[0_4px_16px_rgba(239,68,68,0.3)]"
                          : "bg-yellow-500/90 shadow-[0_4px_16px_rgba(234,179,8,0.3)]"
                    }`}
                  >
                    {experiencia.dificultad}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300">{experiencia.titulo}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">{experiencia.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      <Clock className="h-4 w-4 mr-1 transform group-hover:scale-110 transition-transform duration-300" />
                      {experiencia.duracion}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600 group-hover:scale-105 transition-transform duration-300">${experiencia.precio.toLocaleString()}</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transform group-hover:scale-105 transition-all duration-300 shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.5)]"
                      onClick={() => handleViewMore(experiencia.id, 'experiencias')}
                    >
                      Ver más
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent animate-pulse"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h3 className="text-4xl font-extrabold text-white mb-6 transform hover:scale-105 transition-transform duration-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
            ¿Listo para tu próxima aventura?
          </h3>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
            Únete a miles de viajeros que ya confían en nosotros para crear experiencias inolvidables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-8 py-4 bg-white/90 backdrop-blur-md hover:bg-white transform hover:scale-105 transition-all duration-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.57)] border border-white/20"
              >
                Crear cuenta gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 text-white border-white/50 hover:border-white bg-transparent hover:bg-white/10 backdrop-blur-md transform hover:scale-105 transition-all duration-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.57)]"
              >
                Explorar ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <MapPin className="h-8 w-8 text-blue-400 mr-2" />
                <h3 className="text-2xl font-bold">TurismoWeb</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Tu agencia de viajes de confianza. Creamos experiencias únicas e inolvidables para cada tipo de viajero.
              </p>
              <p className="text-sm text-gray-500">Olimpíada Nacional de Programación 2025</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Vuelos nacionales</li>
                <li>Vuelos internacionales</li>
                <li>Hoteles y estadías</li>
                <li>Alquiler de autos</li>
                <li>Paquetes completos</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@turismoweb.com</li>
                <li>📞 +54 11 1234-5678</li>
                <li>📍 Buenos Aires, Argentina</li>
                <li>🕒 Lun-Vie 9:00-18:00</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TurismoWeb. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
