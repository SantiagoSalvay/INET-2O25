"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plane, Car, Hotel, Star, ChevronLeft, ChevronRight, Calendar, Users, Clock } from "lucide-react"

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
    const interval = setInterval(nextSlide, 5000) // Auto-advance cada 5 segundos
    return () => clearInterval(interval)
  }, [maxIndex])

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {children.map((child, index) => (
            <div key={index} className={`flex-shrink-0 px-2`} style={{ width: `${100 / itemsPerView}%` }}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Controles */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:bg-gray-50"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:bg-gray-50"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Indicadores */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">TurismoWeb</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-6">
            Descubre el mundo
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Destinos Populares</h3>
            <p className="text-xl text-gray-600">Los lugares más elegidos por nuestros viajeros</p>
          </div>

          <Carousel itemsPerView={3}>
            {destinosPopulares.map((destino) => (
              <Card
                key={destino.id}
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={destino.imagen || "/placeholder.svg"}
                    alt={destino.nombre}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-600">{destino.categoria}</Badge>
                  <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">{destino.rating}</span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{destino.nombre}</CardTitle>
                  <CardDescription>{destino.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{destino.precio}</span>
                    <Button size="sm">Ver más</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Paquetes Destacados */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Paquetes Destacados</h3>
            <p className="text-xl text-gray-600">Ofertas especiales con todo incluido</p>
          </div>

          <Carousel itemsPerView={2}>
            {paquetesDestacados.map((paquete) => (
              <Card key={paquete.id} className="hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={paquete.imagen || "/placeholder.svg"}
                    alt={paquete.titulo}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg px-3 py-1 flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-600 mr-1" />
                      <span className="text-sm">{paquete.duracion}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-600 mr-1" />
                      <span className="text-sm">{paquete.personas}</span>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{paquete.titulo}</CardTitle>
                  <CardDescription>{paquete.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Incluye:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {paquete.incluye.map((item, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <span className="text-sm text-gray-500">Desde</span>
                        <div className="text-2xl font-bold text-blue-600">${paquete.precio.toLocaleString()}</div>
                      </div>
                      <Button>Reservar ahora</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Experiencias Únicas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Experiencias Únicas</h3>
            <p className="text-xl text-gray-600">Aventuras y excursiones que no puedes perderte</p>
          </div>

          <Carousel itemsPerView={4}>
            {experienciasUnicas.map((experiencia) => (
              <Card key={experiencia.id} className="hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={experiencia.imagen || "/placeholder.svg"}
                    alt={experiencia.titulo}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      experiencia.dificultad === "Fácil"
                        ? "bg-green-500"
                        : experiencia.dificultad === "Difícil"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }`}
                  >
                    {experiencia.dificultad}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{experiencia.titulo}</CardTitle>
                  <CardDescription className="text-sm">{experiencia.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {experiencia.duracion}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">${experiencia.precio.toLocaleString()}</span>
                    <Button size="sm" variant="outline">
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-extrabold text-white mb-6">¿Listo para tu próxima aventura?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de viajeros que ya confían en nosotros para crear experiencias inolvidables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Crear cuenta gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600"
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
