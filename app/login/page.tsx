"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const message = searchParams.get("message")
    if (message) {
      setSuccessMessage(message)
    }
  }, [searchParams])

  // Función para guardar token en cookies
  const setCookie = (name: string, value: string, days = 7) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccessMessage("")

    console.log("=== LOGIN ATTEMPT ===")
    console.log("Email:", email)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Response status:", response.status)

      const responseText = await response.text()
      console.log("Response preview:", responseText.substring(0, 200))

      // Parsear JSON
      let data: any
      try {
        data = JSON.parse(responseText)
        console.log("JSON parsed:", data.success ? "success" : "failed")
      } catch (parseError) {
        setError("Error del servidor")
        return
      }

      if (response.ok && data.success) {
        console.log("=== LOGIN SUCCESS ===")
        console.log("User role:", data.user.rol)

        // Guardar datos en localStorage Y cookies
        if (data.token && data.user) {
          // localStorage para el cliente
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))

          // Cookies para el middleware
          setCookie("token", data.token, 7)
          setCookie("user", JSON.stringify(data.user), 7)

          console.log("Data saved to localStorage and cookies")
        }

        setSuccessMessage("Iniciando sesión...")

        // Pequeño delay para asegurar que las cookies se guarden
        setTimeout(() => {
          console.log("Redirecting to:", data.user.rol === "admin" ? "/admin/dashboard" : "/cliente/dashboard")

          if (data.user.rol === "admin") {
            window.location.href = "/admin/dashboard"
          } else {
            window.location.href = "/cliente/dashboard"
          }
        }, 500)
      } else {
        setError(data.error || "Credenciales inválidas")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const testLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <MapPin className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">TurismoWeb</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">Accede a tu cuenta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {successMessage && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">¿No tienes cuenta? </span>
              <Link href="/register" className="text-blue-600 hover:underline">
                Regístrate aquí
              </Link>
            </div>

            {/* Credenciales de prueba - simplificadas */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-3">Credenciales de prueba:</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-700">
                    <strong>Administrador:</strong> admin@turismoweb.com / admin123
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testLogin("admin@turismoweb.com", "admin123")}
                    className="ml-2 text-xs h-6"
                    disabled={loading}
                  >
                    Usar
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-700">
                    <strong>Cliente:</strong> cliente@test.com / cliente123
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testLogin("cliente@test.com", "cliente123")}
                    className="ml-2 text-xs h-6"
                    disabled={loading}
                  >
                    Usar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
