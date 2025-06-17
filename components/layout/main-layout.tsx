"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plane, Menu, X, LogOut, User, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<{ nombre: string; apellido: string; email: string; rol: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Error parsing user from localStorage", e)
        localStorage.removeItem('user')
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TravelWeb</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Inicio
              </Link>
              <Link href="/productos" className="text-gray-600 hover:text-blue-600 transition-colors">
                Productos
              </Link>
              <Link href="/sobre-nosotros" className="text-gray-600 hover:text-blue-600 transition-colors">
                Sobre Nosotros
              </Link>
              <Link href="/contacto" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contacto
              </Link>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{`${user.nombre.charAt(0).toUpperCase()}${user.apellido.charAt(0).toUpperCase()}`}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.nombre} {user.apellido}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.rol === 'admin' && (
                      <DropdownMenuItem onClick={() => router.push('/admin/dashboard')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard Admin</span>
                      </DropdownMenuItem>
                    )}
                    {user.rol === 'cliente' && (
                      <DropdownMenuItem onClick={() => router.push('/cliente/dashboard')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Panel de Cliente</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                        Iniciar Sesión
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/register">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                        Registrarse
                      </Button>
                    </motion.div>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg py-4 px-4 border-b border-gray-200/20">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/productos" 
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link 
                href="/sobre-nosotros" 
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <Link 
                href="/contacto" 
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Plane className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">TravelWeb</span>
              </div>
              <p className="text-gray-400">
                Tu compañero de viaje perfecto para descubrir el mundo.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/productos" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link href="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-gray-400">
                  <Phone className="h-5 w-5" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-400">
                  <Mail className="h-5 w-5" />
                  <span>contacto@empresa.com</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-400">
                  <MapPin className="h-5 w-5" />
                  <span>Calle Principal #123, Ciudad</span>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TravelWeb. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 