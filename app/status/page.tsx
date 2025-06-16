"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Server, CheckCircle, XCircle, FileText } from "lucide-react"

export default function StatusPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({ error: "Error de conexión", details: error })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Estado del Sistema</h1>
          <Button onClick={checkStatus} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Verificando..." : "Actualizar"}
          </Button>
        </div>

        {status && (
          <div className="space-y-6">
            {/* Estado General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Estado General
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Badge variant="default">Archivos JSON</Badge>
                  <span className="text-sm text-gray-600">{status.system?.message}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Última verificación: {new Date(status.timestamp).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            {/* Estado de Almacenamiento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Sistema de Archivos JSON
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {status.storage?.available ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">
                      {status.storage?.available ? "Funcionando correctamente" : "No disponible"}
                    </span>
                  </div>

                  {status.storage?.error && (
                    <Alert variant="destructive">
                      <AlertDescription>Error: {status.storage.error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="text-sm text-gray-600">
                    <p>✅ Usuarios almacenados en: /data/usuarios.json</p>
                    <p>✅ Productos almacenados en: /data/productos.json</p>
                    <p>✅ Pedidos almacenados en: /data/pedidos.json</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variables de Entorno */}
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">JWT_SECRET</span>
                    <Badge variant={status.environment?.JWT_SECRET_configured ? "default" : "destructive"}>
                      {status.environment?.JWT_SECRET_configured ? "Configurada" : "No configurada"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">NODE_ENV</span>
                    <Badge variant="outline">{status.environment?.NODE_ENV || "development"}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tipo de almacenamiento</span>
                    <Badge variant="secondary">Archivos JSON</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Debug */}
            {status.error && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive">
                    <AlertDescription>{status.error}</AlertDescription>
                  </Alert>
                  {status.details && (
                    <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                      <pre className="text-sm overflow-auto">{JSON.stringify(status.details, null, 2)}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* JSON completo para debug */}
            <Card>
              <CardHeader>
                <CardTitle>Debug Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">{JSON.stringify(status, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
