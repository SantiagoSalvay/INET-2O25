"use client"
import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function VerificarEmailPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>("pending")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      setStatus("error")
      setMessage("Token de verificación inválido.")
      return
    }
    fetch("/api/auth/verificar-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then(async res => {
        const data = await res.json()
        if (res.ok && data.success) {
          // Guardar token y usuario en localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
          }
          setStatus("success")
          setMessage("¡Tu cuenta ha sido verificada exitosamente! Serás redirigido a la página principal...")
          setTimeout(() => {
            router.replace("/")
          }, 3500)
        } else {
          setStatus("error")
          setMessage(data.error || "El token es inválido o expiró.")
        }
      })
      .catch(() => {
        setStatus("error")
        setMessage("Ocurrió un error al verificar el email.")
      })
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        {status === "pending" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-6"></div>
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Verificando tu email...</h2>
            <p className="text-gray-500">Por favor espera un momento.</p>
          </>
        )}
        {status === "success" && (
          <>
            <svg className="mb-4" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#2563eb"/>
              <path d="M20 34L29 43L44 26" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="text-xl font-semibold mb-2 text-blue-700">¡Email verificado!</h2>
            <p className="text-gray-500">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <svg className="mb-4" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#ef4444"/>
              <path d="M24 24L40 40M40 24L24 40" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error al verificar</h2>
            <p className="text-gray-500">{message}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerificarEmailPage() {
  return (
    <Suspense>
      <VerificarEmailPageInner />
    </Suspense>
  )
} 