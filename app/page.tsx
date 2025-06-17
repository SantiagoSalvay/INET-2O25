"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plane, Car, Hotel, Star, ChevronLeft, ChevronRight, Calendar, Users, Clock, Menu, X, LogOut, User, Check } from "lucide-react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Product {
  id: number;
  codigo: string;
  descripcion: string;
  precio: number;
  categoria: string;
  detalles: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string; // Para usar en el frontend si es necesario
}

// Componente Carrusel reutilizable
function Carousel({ children, itemsPerView = { default: 1, sm: 2, md: 3, lg: 3 } }: 
  { 
    children: React.ReactNode[]; 
    itemsPerView?: { default: number, sm?: number, md?: number, lg?: number, xl?: number }
  }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [effectiveItemsPerView, setEffectiveItemsPerView] = useState(itemsPerView.default);
  const totalItems = children.length
  const maxIndex = Math.max(0, totalItems - effectiveItemsPerView)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024 && itemsPerView.lg) {
        setEffectiveItemsPerView(itemsPerView.lg);
      } else if (width >= 768 && itemsPerView.md) {
        setEffectiveItemsPerView(itemsPerView.md);
      } else if (width >= 640 && itemsPerView.sm) {
        setEffectiveItemsPerView(itemsPerView.sm);
      } else {
        setEffectiveItemsPerView(itemsPerView.default);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [maxIndex, effectiveItemsPerView]) // Add effectiveItemsPerView to dependencies

  return (
    <div className="relative group perspective-1000">
      <div className="overflow-hidden rounded-2xl backdrop-blur-sm bg-white/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/10">
        <div
          className="flex transition-all duration-700 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / effectiveItemsPerView)}%)`,
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
              style={{ width: `${100 / effectiveItemsPerView}%` }}
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
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [errorProducts, setErrorProducts] = useState<string | null>(null)
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

    const fetchAllProducts = async () => {
      setLoadingProducts(true);
      setErrorProducts(null);
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/productos', {
          headers,
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch products');
        }
        const data: Product[] = await response.json();
        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching all products:", err);
        setErrorProducts(err instanceof Error ? err.message : 'Error desconocido al cargar productos');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchAllProducts();

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(heroWordInterval)
    }
  }, [])

  // Filtrar productos para cada sección del carrusel
  const destinosPopulares = allProducts.filter(p => p.categoria === 'vuelos' || p.categoria === 'hoteles').map(p => ({
    id: p.id,
    nombre: p.descripcion,
    imagen: p.imageUrl || '/placeholder.jpg',
    descripcion: p.detalles || p.descripcion,
    precio: `Desde $${p.precio.toLocaleString()}`,
    categoria: p.categoria,
    rating: 4.5, // Placeholder rating
  }));

  const paquetesDestacados = allProducts.filter(p => p.categoria === 'paquetes').map(p => ({
    id: p.id,
    titulo: p.descripcion,
    descripcion: p.detalles || p.descripcion,
    precio: p.precio,
    imagen: p.imageUrl || '/placeholder.jpg',
    incluye: ['Vuelo', 'Hotel', 'Actividades'], // Placeholder
    duracion: 'X días', // Placeholder
    personas: 'Y personas', // Placeholder
  }));

  const experienciasUnicas = allProducts.filter(p => p.categoria === 'excursiones').map(p => ({
    id: p.id,
    titulo: p.descripcion,
    descripcion: p.detalles || p.descripcion,
    precio: p.precio,
    imagen: p.imageUrl || '/placeholder.jpg',
    duracion: 'X horas', // Placeholder
    dificultad: 'Fácil', // Placeholder
  }));

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
              <Link href="/productos" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Productos
              </Link>
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
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                        Iniciar Sesión
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/register">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                        Registrarse
                      </Button>
                    </motion.div>
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
              <Link 
                href="/" 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/productos" 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link 
                href="/destinos" 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Destinos
              </Link>
              <Link 
                href="/paquetes" 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Paquetes
              </Link>
              <Link 
                href="/experiencias" 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Experiencias
              </Link>
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
      <section id="hero" className="py-20 relative overflow-hidden">
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
            <Link href="/productos">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="text-lg px-8 py-4">
                  Comenzar a explorar
                </Button>
              </motion.div>
            </Link>
            <Link href="/manual">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  Ver manual
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Destinos Populares Section */}
      <section id="destinos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-gray-900 text-center mb-12"
          >
            Destinos Populares
          </motion.h2>
          {loadingProducts ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Cargando destinos...</p>
            </div>
          ) : errorProducts ? (
            <div className="text-center py-10 text-red-600">
              Error: {errorProducts}
            </div>
          ) : destinosPopulares.length > 0 ? (
            <Carousel itemsPerView={{ default: 1, sm: 2, md: 3, lg: 3 }}>
              {destinosPopulares.map((destino) => (
                <Card key={destino.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={destino.imagen}
                    alt={destino.nombre}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardContent className="p-4">
                    <CardTitle className="text-xl font-bold mb-2 truncate">{destino.nombre}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm mb-2">{destino.descripcion}</CardDescription>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                      <span className="text-gray-700">{destino.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-blue-600 text-lg font-semibold mb-4">{destino.precio}</p>
                    <Button 
                      onClick={() => handleViewMore(destino.id, 'destino')}
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                    >
                      Ver Detalles <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Carousel>
          ) : (
            <div className="text-center py-10 text-gray-600">
              No se encontraron destinos populares.
            </div>
          )}
        </div>
      </section>

      {/* Paquetes Destacados Section */}
      <section id="paquetes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-gray-900 text-center mb-12"
          >
            Paquetes Destacados
          </motion.h2>
          {loadingProducts ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Cargando paquetes...</p>
            </div>
          ) : errorProducts ? (
            <div className="text-center py-10 text-red-600">
              Error: {errorProducts}
            </div>
          ) : paquetesDestacados.length > 0 ? (
            <Carousel itemsPerView={{ default: 1, sm: 2, md: 2, lg: 2 }}>
              {paquetesDestacados.map((paquete) => (
                <Card key={paquete.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={paquete.imagen}
                    alt={paquete.titulo}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardContent className="p-4">
                    <CardTitle className="text-xl font-bold mb-2 truncate">{paquete.titulo}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm mb-2">{paquete.descripcion}</CardDescription>
                    <ul className="text-gray-700 text-sm mb-4 space-y-1">
                      {paquete.incluye.map((item, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> {paquete.duracion}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" /> {paquete.personas}
                      </div>
                    </div>
                    <p className="text-blue-600 text-lg font-semibold mb-4">${paquete.precio.toLocaleString()}</p>
                    <Button 
                      onClick={() => handleViewMore(paquete.id, 'paquete')}
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                    >
                      Ver Detalles <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Carousel>
          ) : (
            <div className="text-center py-10 text-gray-600">
              No se encontraron paquetes destacados.
            </div>
          )}
        </div>
      </section>

      {/* Experiencias Únicas Section */}
      <section id="experiencias" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-gray-900 text-center mb-12"
          >
            Experiencias Únicas
          </motion.h2>
          {loadingProducts ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Cargando experiencias...</p>
            </div>
          ) : errorProducts ? (
            <div className="text-center py-10 text-red-600">
              Error: {errorProducts}
            </div>
          ) : experienciasUnicas.length > 0 ? (
            <Carousel itemsPerView={{ default: 1, sm: 2, md: 3, lg: 3 }}>
              {experienciasUnicas.map((experiencia) => (
                <Card key={experiencia.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={experiencia.imagen}
                    alt={experiencia.titulo}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardContent className="p-4">
                    <CardTitle className="text-xl font-bold mb-2 truncate">{experiencia.titulo}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm mb-2">{experiencia.descripcion}</CardDescription>
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> {experiencia.duracion}
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-xs py-1 px-2 rounded-full">{experiencia.dificultad}</Badge>
                      </div>
                    </div>
                    <p className="text-blue-600 text-lg font-semibold mb-4">${experiencia.precio.toLocaleString()}</p>
                    <Button 
                      onClick={() => handleViewMore(experiencia.id, 'experiencia')}
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                    >
                      Ver Detalles <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Carousel>
          ) : (
            <div className="text-center py-10 text-gray-600">
              No se encontraron experiencias únicas.
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
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
