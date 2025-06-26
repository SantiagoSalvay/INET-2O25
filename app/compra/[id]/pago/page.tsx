"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  Users,
  Mail,
  User,
  UploadCloud
} from "lucide-react"

export default function PagoCompraPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [pedido, setPedido] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState("")
  const [comprobanteUrl, setComprobanteUrl] = useState<string | null>(null)

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null
    setFile(f)
    setPreview(f ? URL.createObjectURL(f) : null)
    setUploadMsg("")
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/pedidos/${params.id}/comprobante`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.comprobanteUrl) {
        setUploadMsg("Comprobante subido correctamente. Será verificado por un administrador.");
        setComprobanteUrl(data.comprobanteUrl);
        // Refrescar el pedido para que el admin lo vea actualizado
        const pedidoRes = await fetch(`/api/pedidos/${params.id}`);
        const pedidoData = await pedidoRes.json();
        setPedido(pedidoData);
      } else {
        setUploadMsg(data.error || "Error al subir el comprobante");
      }
    } catch (err) {
      setUploadMsg("Error al subir el comprobante. Intenta nuevamente.");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-700 font-bold text-xl">Cargando compra...</div>
  }
  if (error || !pedido) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">{error || "Compra no encontrada"}</div>
  }

  const detalles = pedido.detalles || {}

  // Utilidades para mostrar datos aunque estén en pedido o detalles
  const getDato = (campo: string) => {
    if (detalles && typeof detalles[campo] !== 'undefined' && detalles[campo] !== null && detalles[campo] !== '') return detalles[campo]
    if (pedido && typeof pedido[campo] !== 'undefined' && pedido[campo] !== null && pedido[campo] !== '') return pedido[campo]
    return '-'
  }
  const getFecha = (campo: string) => {
    const val = getDato(campo)
    if (val && val !== '-') return new Date(val).toLocaleDateString()
    return '-'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botón Volver */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button
          variant="ghost"
          className="flex items-center space-x-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver atrás</span>
        </Button>
      </div>

      {/* Detalles de la Compra */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Pago de tu compra</h1>

          {/* Información de la Compra */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {detalles.producto || pedido.cliente_nombre}
                  </h2>
                  <p className="text-gray-600">Token de Compra: <span className="font-mono text-xs">{pedido.numero_pedido}</span></p>
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
                    <Users className="h-5 w-5 mr-2" />
                    <span>Personas: {
                      detalles.cantidad || pedido.cantidad || pedido.personas || '-'
                    }</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-2" />
                    <span>Asientos: {
                      Array.isArray(detalles.asientos) && detalles.asientos.length > 0
                        ? detalles.asientos.join(', ')
                        : Array.isArray(pedido.asientos) && pedido.asientos.length > 0
                          ? pedido.asientos.join(', ')
                          : '-'
                    }</span>
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
                      <span>{detalles.cantidad || pedido.cantidad || pedido.personas || '-'}</span>
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

          {/* Información de Pago */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 text-lg text-blue-700">Datos para realizar el pago</h3>
              <div className="space-y-2 text-gray-700 text-sm">
                <div><b>CBU:</b> 0000003100098765432100</div>
                <div><b>Alias:</b> TURISMO.PAGOS.BANCO</div>
                <div><b>Banco:</b> Banco de Ejemplo S.A.</div>
                <div><b>Titular:</b> Turismo Web S.A.</div>
                <div className="text-xs text-gray-500 mt-2">Recuerda adjuntar el comprobante de pago para que podamos verificar tu compra.</div>
              </div>
            </CardContent>
          </Card>

          {/* Subir Comprobante */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 text-lg text-blue-700 flex items-center"><UploadCloud className="h-5 w-5 mr-2" /> Subir comprobante de pago</h3>
              <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="mb-4" />
              {preview && !comprobanteUrl && (
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Vista previa local:</div>
                  <img src={preview} alt="Comprobante" className="max-h-48 rounded shadow border" />
                </div>
              )}
              {comprobanteUrl && (
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Comprobante subido:</div>
                  {comprobanteUrl.match(/\.(pdf)$/i) ? (
                    <>
                      <iframe
                        src={(comprobanteUrl.startsWith('http') ? comprobanteUrl : `${window.location.origin}${comprobanteUrl}`) + `?t=${Date.now()}`}
                        title="Comprobante PDF"
                        className="w-full max-w-md h-64 border rounded mb-2"
                      />
                      <a
                        href={comprobanteUrl.startsWith('http') ? comprobanteUrl : `${window.location.origin}${comprobanteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        Descargar PDF
                      </a>
                    </>
                  ) : (
                    <img
                      src={(comprobanteUrl.startsWith('http') ? comprobanteUrl : `${window.location.origin}${comprobanteUrl}`) + `?t=${Date.now()}`}
                      alt="Comprobante subido"
                      className="max-h-48 rounded shadow border"
                    />
                  )}
                </div>
              )}
              <Button onClick={handleUpload} disabled={!file || uploading} className="bg-blue-600 hover:bg-blue-700">
                {uploading ? "Subiendo..." : "Enviar comprobante"}
              </Button>
              {uploadMsg && <div className="text-green-700 font-semibold mt-3">{uploadMsg}</div>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 