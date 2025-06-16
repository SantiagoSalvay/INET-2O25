"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Clock,
  ArrowLeft,
  Check,
  Upload
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Datos de ejemplo para el producto
const producto = {
  id: 1,
  nombre: "Bariloche Premium",
  imagen: "/placeholder.svg?height=400&width=600",
  descripcion: "Paquete premium en Bariloche con alojamiento de lujo",
  precio: 85000,
  rating: 4.8,
  categoria: "Nacional",
  duracion: "7 días",
  personas: "2 personas",
  incluye: [
    "Vuelos ida y vuelta",
    "Alojamiento 5 estrellas",
    "Desayuno incluido",
    "Traslados aeropuerto-hotel",
    "Excursiones guiadas",
    "Seguro de viaje"
  ],
  detalles: "Disfruta de una experiencia premium en Bariloche con este paquete todo incluido. Incluye alojamiento en hotel 5 estrellas, excursiones guiadas y más.",
  fechasDisponibles: [
    "2024-03-01",
    "2024-03-15",
    "2024-04-01",
    "2024-04-15"
  ]
}

// Datos de ejemplo para productos relacionados
const productosRelacionados = [
  {
    id: 2,
    nombre: "Mendoza Premium",
    imagen: "/placeholder.svg?height=200&width=300",
    descripcion: "Paquete premium en Mendoza con alojamiento de lujo",
    precio: 75000,
    rating: 4.7,
    categoria: "Nacional",
  },
  // ... más productos
]

export default function ProductoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [comprobante, setComprobante] = useState<File | null>(null)

  const handleComprar = () => {
    setShowPaymentDialog(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setComprobante(event.target.files[0])
    }
  }

  const handleSubmitPayment = () => {
    // Aquí iría la lógica para procesar el pago
    router.push(`/compra/${Date.now()}`) // Redirige a la página de confirmación con un ID único
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botón Volver */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button
          variant="ghost"
          className="flex items-center space-x-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>
      </div>

      {/* Detalles del Producto */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen y Detalles Básicos */}
          <div>
            <div className="relative rounded-lg overflow-hidden mb-6">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-[400px] object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm">
                {producto.categoria}
              </Badge>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium ml-1">{producto.rating}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{producto.duracion}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2" />
                <span>{producto.personas}</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{producto.nombre}</h1>
            <p className="text-gray-600 mb-6">{producto.detalles}</p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Incluye:</h3>
              <ul className="space-y-2">
                {producto.incluye.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Formulario de Compra */}
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ${producto.precio.toLocaleString()}
                  </h2>
                  <p className="text-gray-600">por persona</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selecciona una fecha
                    </label>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una fecha" />
                      </SelectTrigger>
                      <SelectContent>
                        {producto.fechasDisponibles.map((fecha) => (
                          <SelectItem key={fecha} value={fecha}>
                            {new Date(fecha).toLocaleDateString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!selectedDate}
                      >
                        Comprar Ahora
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Información de Pago</DialogTitle>
                        <DialogDescription>
                          Por favor, realiza la transferencia y sube el comprobante
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">Datos de Transferencia</h3>
                          <p className="text-sm text-gray-600">
                            Banco: Banco Ejemplo<br />
                            Cuenta: 1234567890<br />
                            CBU: 1234567890123456789012<br />
                            Titular: TravelEase S.A.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subir Comprobante
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                >
                                  <span>Subir archivo</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileUpload}
                                  />
                                </label>
                                <p className="pl-1">o arrastrar y soltar</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, PDF hasta 10MB
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={handleSubmitPayment}
                          disabled={!comprobante}
                        >
                          Confirmar Pago
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Productos Relacionados */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">También te puede interesar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosRelacionados.map((producto) => (
              <Card key={producto.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors duration-300">
                    {producto.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{producto.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      ${producto.precio.toLocaleString()}
                    </span>
                    <Button 
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      onClick={() => router.push(`/producto/${producto.id}`)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
} 