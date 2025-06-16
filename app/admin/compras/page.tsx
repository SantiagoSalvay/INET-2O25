"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Search,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react"

// Datos de ejemplo para las compras
const compras = [
  {
    id: "123456789",
    fecha: "2024-02-20",
    estado: "Pendiente",
    cliente: "Juan Pérez",
    email: "juan@example.com",
    producto: {
      nombre: "Bariloche Premium",
      precio: 85000,
      fechaViaje: "2024-03-01",
      personas: 2
    },
    total: 170000,
    comprobante: "/placeholder.svg?height=200&width=300"
  },
  {
    id: "987654321",
    fecha: "2024-02-19",
    estado: "Confirmado",
    cliente: "María García",
    email: "maria@example.com",
    producto: {
      nombre: "Miami Beach",
      precio: 120000,
      fechaViaje: "2024-04-15",
      personas: 2
    },
    total: 240000,
    comprobante: "/placeholder.svg?height=200&width=300"
  },
  // ... más compras
]

export default function AdminComprasPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompra, setSelectedCompra] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const handleEstadoChange = (compraId: string, nuevoEstado: string) => {
    // Aquí iría la lógica para actualizar el estado de la compra
    console.log(`Actualizando compra ${compraId} a estado ${nuevoEstado}`)
  }

  const handleVerDetalles = (compra: any) => {
    setSelectedCompra(compra)
    setShowDetailsDialog(true)
  }

  const filteredCompras = compras.filter(compra => 
    compra.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compra.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compra.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Administración de Compras
          </h1>
          <p className="text-gray-600">
            Gestiona y actualiza el estado de las compras realizadas por los clientes.
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por ID, cliente o email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla de Compras */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompras.map((compra) => (
                  <TableRow key={compra.id}>
                    <TableCell className="font-medium">{compra.id}</TableCell>
                    <TableCell>{new Date(compra.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{compra.cliente}</div>
                        <div className="text-sm text-gray-500">{compra.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{compra.producto.nombre}</div>
                        <div className="text-sm text-gray-500">
                          {compra.producto.personas} personas
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${compra.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        className={`${
                          compra.estado === "Pendiente" 
                            ? "bg-yellow-100 text-yellow-800"
                            : compra.estado === "Confirmado"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {compra.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerDetalles(compra)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select
                          defaultValue={compra.estado}
                          onValueChange={(value) => handleEstadoChange(compra.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Cambiar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendiente">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                                Pendiente
                              </div>
                            </SelectItem>
                            <SelectItem value="Confirmado">
                              <div className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                Confirmado
                              </div>
                            </SelectItem>
                            <SelectItem value="Cancelado">
                              <div className="flex items-center">
                                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                Cancelado
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Diálogo de Detalles */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalles de la Compra</DialogTitle>
              <DialogDescription>
                Información detallada de la compra y el comprobante de pago.
              </DialogDescription>
            </DialogHeader>

            {selectedCompra && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Información del Cliente</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nombre:</span> {selectedCompra.cliente}</p>
                      <p><span className="font-medium">Email:</span> {selectedCompra.email}</p>
                      <p><span className="font-medium">Fecha de Compra:</span> {new Date(selectedCompra.fecha).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Detalles del Producto</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Producto:</span> {selectedCompra.producto.nombre}</p>
                      <p><span className="font-medium">Fecha de Viaje:</span> {new Date(selectedCompra.producto.fechaViaje).toLocaleDateString()}</p>
                      <p><span className="font-medium">Personas:</span> {selectedCompra.producto.personas}</p>
                      <p><span className="font-medium">Total:</span> ${selectedCompra.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Comprobante de Pago</h3>
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={selectedCompra.comprobante}
                      alt="Comprobante de pago"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
} 