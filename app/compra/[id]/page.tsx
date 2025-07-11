"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  FileText,
  Mail,
  User
} from "lucide-react"

export default function CompraPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPedido() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`/api/pedidos/${params.id}`)
        const data = await res.json()
        if (res.ok && data) {
          setPedido(data)
        } else {
          setError(data.error || "No se pudo cargar la compra")
        }
      } catch (e: any) {
        setError(e.message || "Error inesperado")
      } finally {
        setLoading(false)
      }
    }
    fetchPedido()
  }, [params.id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-700 font-bold text-xl">Cargando compra...</div>
  }
  if (error || !pedido) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">{error || "Compra no encontrada"}</div>
  }

  const detalles = pedido.detalles || {}
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botón Volver */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button
          variant="ghost"
          className="flex items-center space-x-2"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al Dashboard</span>
        </Button>
      </div>

      {/* Detalles de la Compra */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Compra Realizada con Éxito!
            </h1>
            <p className="text-gray-600">
              Tu compra ha sido procesada correctamente. A continuación encontrarás los detalles.
            </p>
          </div>

          {/* Información de la Compra */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {detalles.producto || pedido.cliente_nombre}
                  </h2>
                  <p className="text-gray-600">ID de Compra: {pedido.id}</p>
                  <p className="text-gray-600 flex items-center"><Mail className="h-4 w-4 mr-1" /> {pedido.cliente_email}</p>
                </div>
                <Badge
                  className={`$ {
                    pedido.estado === "pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : pedido.estado === "confirmado"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {pedido.estado}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Fecha de Compra: {new Date(pedido.fecha_pedido).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>Fecha de Viaje: {detalles.fecha ? new Date(detalles.fecha).toLocaleDateString() : '-'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>Personas: {detalles.cantidad || '-'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-2" />
                    <span>Asientos: {Array.isArray(detalles.asientos) ? detalles.asientos.join(', ') : '-'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Resumen de Pago</h3>
                    <div className="flex justify-between text-sm">
                      <span>Precio por persona:</span>
                      <span>${detalles.precio ? detalles.precio.toLocaleString() : '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cantidad de personas:</span>
                      <span>{detalles.cantidad || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Producto:</span>
                      <span>{detalles.producto || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Código:</span>
                      <span>{detalles.codigo || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Categoría:</span>
                      <span>{detalles.categoria || '-'}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${pedido.total ? pedido.total.toLocaleString() : '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comprobante de Pago */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 mr-2 text-gray-600" />
                <h3 className="text-lg font-semibold">Comprobante de Pago</h3>
              </div>
              <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                {/* Aquí podrías mostrar el comprobante real si existe */}
                <img
                  src={pedido.comprobante || "/placeholder.svg?height=200&width=300"}
                  alt="Comprobante de pago"
                  className="w-full h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="mt-8 flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Volver al Dashboard
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.print()}
            >
              Descargar Comprobante
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
} 