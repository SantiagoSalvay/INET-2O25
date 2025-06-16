"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAuthPage() {
  const [authData, setAuthData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkAuth = () => {
    setLoading(true)
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    setAuthData({
      timestamp: new Date().toISOString(),
      localStorage: {
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 30) + "..." : "none",
        hasUser: !!user,
        userPreview: user ? JSON.parse(user) : null,
      },
      cookies: document.cookie,
      location: window.location.href,
    })
    setLoading(false)
  }

  const clearAuth = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setAuthData(null)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Test de Autenticación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button onClick={checkAuth} disabled={loading}>
                  {loading ? "Verificando..." : "Verificar Auth"}
                </Button>
                <Button variant="destructive" onClick={clearAuth}>
                  Limpiar Auth
                </Button>
              </div>

              {authData && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">{JSON.stringify(authData, null, 2)}</pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
