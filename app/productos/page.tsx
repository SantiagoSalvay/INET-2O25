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
import MainLayout from '@/components/layout/main-layout'

interface Product {
  id: number;
  codigo: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
}

// Función para crear un slug a partir del nombre del producto
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 1000000],
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [user, setUser] = useState<{ nombre: string; apellido: string; email: string; rol: string } | null>(null)
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
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
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Main Content for Products Page */}
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
                      <Link href={`/producto/${slugify(product.name)}/${product.codigo}`}>
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
      </div>
    </MainLayout>
  )
} 