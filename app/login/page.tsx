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
import { MapPin, Eye, EyeOff, AlertCircle, CheckCircle, ChevronLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [registerFormData, setRegisterFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  })
  const [registerError, setRegisterError] = useState("")
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState("")

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    })
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
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

        const setCookie = (name: string, value: string, days = 7) => {
          const expires = new Date()
          expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
          document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
        }

        if (data.token && data.user) {
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          setCookie("token", data.token, 7)
          setCookie("user", JSON.stringify(data.user), 7)
          console.log("Data saved to localStorage and cookies")
        }

        setSuccessMessage("Iniciando sesión...")

        setTimeout(() => {
          console.log("Redirecting to:", data.user.rol === "admin" ? "/admin/dashboard" : "/")
          if (data.user.rol === "admin") {
            window.location.href = "/admin/dashboard"
          } else {
            window.location.href = "/"
          }
        }, 500)
      } else {
        setError(data.error || "Credenciales inválidas")
      }
    } catch (loginError) {
      console.error("Login error:", loginError)
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterLoading(true)
    setRegisterError("")
    setRegisterSuccessMessage("")

    if (registerFormData.password !== registerFormData.confirmPassword) {
      setRegisterError("Las contraseñas no coinciden")
      setRegisterLoading(false)
      return
    }

    if (registerFormData.password.length < 6) {
      setRegisterError("La contraseña debe tener al menos 6 caracteres")
      setRegisterLoading(false)
      return
    }

    console.log("=== REGISTER ATTEMPT ===")
    console.log("Email:", registerFormData.email)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nombre: registerFormData.nombre,
          apellido: registerFormData.apellido,
          email: registerFormData.email,
          telefono: registerFormData.telefono,
          password: registerFormData.password,
        }),
      })

      console.log("Response status:", response.status)

      const responseText = await response.text()
      console.log("Response text:", responseText.substring(0, 200))

      if (responseText.startsWith("Internal server error") || responseText.startsWith("Error:")) {
        setRegisterError("Error del servidor: " + responseText)
        return
      }

      let data: any
      try {
        data = JSON.parse(responseText)
        console.log("JSON parsed successfully:", data)
      } catch (parseError) {
        setRegisterError("Respuesta del servidor no es JSON válida")
        return
      }

      if (response.ok && data.success) {
        console.log("Registration successful!")
        setRegisterSuccessMessage(data.message || "Registro exitoso")

        setRegisterFormData({
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          password: "",
          confirmPassword: "",
        })

        setTimeout(() => {
          setIsRegistering(false)
          setSuccessMessage("Registro exitoso. Puedes iniciar sesión.")
        }, 2000)
      } else {
        setRegisterError(data.error || "Error al registrarse")
      }
    } catch (registerError) {
      console.error("Registration error:", registerError)
      setRegisterError("Error de conexión")
    } finally {
      setRegisterLoading(false)
    }
  }

  useEffect(() => {
    const message = searchParams.get("message")
    if (message) {
      setSuccessMessage(message)
    }
    const isRegisterParam = searchParams.get("register")
    if (isRegisterParam === 'true') {
      setIsRegistering(true)
    }
  }, [searchParams])

  useEffect(() => {
    document.title = isRegistering ? "Registro" : "Iniciar Sesión"
  }, [isRegistering])

  const loginImage = '/inicio_sesion.jpg'
  const registerImage = '/registro.jpg'

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-purple-700 to-pink-500">
      <div className="relative z-10 flex w-full max-w-6xl mx-auto min-h-[70vh] rounded-lg shadow-2xl overflow-hidden bg-white/90 backdrop-blur-md">
        <Link href="/" className="absolute top-4 left-4 z-20">
          <Button variant="outline" size="sm" className="text-white border-white bg-transparent hover:bg-white hover:text-blue-600 transition-colors duration-300">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver a inicio
          </Button>
        </Link>
        <motion.div
          key="image-section"
          initial={{ opacity: 0, x: isRegistering ? 0 : -50 }}
          animate={{ opacity: 1, x: isRegistering ? 0 : 0 }}
          exit={{ opacity: 0, x: isRegistering ? 0 : -50 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="hidden md:flex flex-1 relative items-center justify-center p-8 bg-gradient-to-br from-blue-600 to-purple-700 bg-cover bg-center"
          style={{
            backgroundImage: `url(${isRegistering ? registerImage : loginImage})`
          }}
        >
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="absolute text-white text-center p-4">
            <h2 className="text-4xl font-bold mb-2">{isRegistering ? "Crea Tu Cuenta" : "Explora el Mundo"}</h2>
            <p className="text-lg">{isRegistering ? "Regístrate para tu próxima aventura." : "Tu próxima aventura te espera."}</p>
          </div>
        </motion.div>

        <motion.div
          key="form-container"
          initial={{ x: isRegistering ? '100%' : '0%' }}
          animate={{ x: isRegistering ? '0%' : '0%' }}
          transition={{ type: 'tween', duration: 0.7, ease: "easeInOut" }}
          className="w-full md:w-1/2 flex items-center justify-center p-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isRegistering ? (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -200 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full max-w-md"
              >
                <Card>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
                    <CardDescription className="text-center">Regístrate para comenzar a explorar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombre">Nombre</Label>
                          <Input
                            id="nombre"
                            name="nombre"
                            type="text"
                            placeholder="Tu nombre"
                            value={registerFormData.nombre}
                            onChange={handleRegisterChange}
                            required
                            disabled={registerLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apellido">Apellido</Label>
                          <Input
                            id="apellido"
                            name="apellido"
                            type="text"
                            placeholder="Tu apellido"
                            value={registerFormData.apellido}
                            onChange={handleRegisterChange}
                            required
                            disabled={registerLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          placeholder="tu@email.com"
                          value={registerFormData.email}
                          onChange={handleRegisterChange}
                          required
                          disabled={registerLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono (opcional)</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          placeholder="+54 11 1234-5678"
                          value={registerFormData.telefono}
                          onChange={handleRegisterChange}
                          disabled={registerLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">Contraseña</Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 6 caracteres"
                            value={registerFormData.password}
                            onChange={handleRegisterChange}
                            required
                            disabled={registerLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={registerLoading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Repite tu contraseña"
                          value={registerFormData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                          disabled={registerLoading}
                        />
                      </div>

                      {registerSuccessMessage && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription className="text-green-600">{registerSuccessMessage}</AlertDescription>
                        </Alert>
                      )}

                      {registerError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{registerError}</AlertDescription>
                        </Alert>
                      )}

                      <Button type="submit" className="w-full" disabled={registerLoading}>
                        {registerLoading ? "Registrando..." : "Registrarse"}
                      </Button>
                    </form>
                    <div className="mt-6 text-center text-sm">
                      <span className="text-gray-600">¿Ya tienes cuenta? </span>
                      <Link href="#" onClick={() => setIsRegistering(false)} className="text-blue-600 hover:underline">
                        Inicia sesión aquí
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 200 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full max-w-md"
              >
                <Card>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
                    <CardDescription className="text-center">Accede a tu cuenta para continuar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                      <Link href="#" onClick={() => setIsRegistering(true)} className="text-blue-600 hover:underline">
                        Regístrate aquí
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
