'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, ChevronRight, Menu, X, Plane, LogOut, User, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Product {
  id: number;
  codigo: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
}

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 1000000],
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<{ nombre: string; apellido: string; email: string; rol: string } | null>(null)
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
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

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/productos', {
          headers,
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch products');
        }
        const data: any[] = await response.json();
        const productsWithIds: Product[] = data.map((product: any, index: number) => ({
          id: product.id || index,
          codigo: product.codigo,
          name: product.descripcion,
          description: product.detalles || product.descripcion,
          category: product.categoria,
          price: product.precio,
          imageUrl: '/placeholder.jpg',
        }));
        setFetchedProducts(productsWithIds);
        const uniqueCategories = Array.from(new Set(productsWithIds.map(p => p.category)));
        setAvailableCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    setAppliedFilters(filters)
  }

  const filteredProducts = fetchedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(appliedFilters.search.toLowerCase())
    const matchesCategory = appliedFilters.category === 'all' || product.category === appliedFilters.category
    const matchesPrice = product.price >= appliedFilters.priceRange[0] && product.price <= appliedFilters.priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Inicio
              </Link>
              <Link href="/productos" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Productos
              </Link>
              <Link href="/sobre-nosotros" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Sobre Nosotros
              </Link>
              <Link href="/contacto" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Contacto
              </Link>
              <Link href="/destinos" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Destinos
              </Link>
              <Link href="/paquetes" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Paquetes
              </Link>
              <Link href="/experiencias" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">
                Experiencias
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
                        <span>Dashboard Cliente</span>
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
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                      Registrarse
                    </Button>
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
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/productos" 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link 
                href="/sobre-nosotros" 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <Link 
                href="/contacto" 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <Link 
                href="/destinos" 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Destinos
              </Link>
              <Link 
                href="/paquetes" 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Paquetes
              </Link>
              <Link 
                href="/experiencias" 
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Experiencias
              </Link>
              {user ? (
                <div className="px-3 py-2 space-y-2">
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.nombre}</span>
                  </Button>
                  {user.rol === 'admin' && (
                    <Link href="/admin/dashboard" className="block w-full">
                      <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                        Dashboard Admin
                      </Button>
                    </Link>
                  )}
                  {user.rol === 'cliente' && (
                    <Link href="/cliente/dashboard" className="block w-full">
                      <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                        Dashboard Cliente
                      </Button>
                    </Link>
                  )}
                  <Button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Link href="/login" className="block w-full">
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" className="block w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Contenido principal de la página de productos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8"
      >
        {/* Sidebar de filtros */}
        <aside className="md:col-span-1 bg-white p-4 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Filtros</h3>

          <div className="mb-3">
            <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-2">
              Buscar por nombre
            </label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Ej. Patagonia"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
              Categoría
            </label>
            <Select onValueChange={(value) => handleFilterChange('category', value)} value={filters.category}>
              <SelectTrigger className="w-full">
                <SelectValue>{filters.category === 'all' ? 'Todas' : filters.category}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
              Rango de Precios
            </label>
            <Slider
              min={0}
              max={1000000}
              step={50}
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange('priceRange', value)}
              className="w-[95%]"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>

          <Button 
            onClick={applyFilters} 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            Aplicar Filtros
          </Button>

          {/* Puedes añadir más filtros aquí */}
        </aside>

        {/* Listado de productos */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="md:col-span-3 text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="md:col-span-3 text-center py-10 text-red-600">
              Error: {error}
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className="group"
              >
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <CardContent className="p-4">
                    <CardTitle className="text-xl font-bold mb-2 truncate">{product.name}</CardTitle>
                    <p className="text-blue-600 text-lg font-semibold mb-4">${product.price}</p>
                    <Link href={`/producto/${product.id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
                        Ver Detalles <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="md:col-span-3 text-center py-10 text-gray-600">
              No se encontraron productos que coincidan con los filtros.
            </div>
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <MapPin className="h-8 w-8 text-blue-400 mr-2" />
                <h3 className="text-2xl font-bold">TurismoWeb</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Tu agencia de viajes de confianza. Creamos experiencias únicas e inolvidables para cada tipo de viajero.
              </p>
              <p className="text-sm text-gray-500">Olimpíada Nacional de Programación 2025</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Vuelos nacionales</li>
                <li>Vuelos internacionales</li>
                <li>Hoteles y estadías</li>
                <li>Alquiler de autos</li>
                <li>Paquetes completos</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@turismoweb.com</li>
                <li>📞 +54 11 1234-5678</li>
                <li>📍 Buenos Aires, Argentina</li>
                <li>🕒 Lun-Vie 9:00-18:00</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TurismoWeb. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 