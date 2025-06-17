"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, ShoppingBag, CreditCard, Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Purchase {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'purchases'>('personal');
  const [purchases, setPurchases] = useState<Purchase[]>([
    {
      id: '1',
      date: '2024-03-15',
      total: 1500,
      status: 'completed',
      items: [
        { name: 'Paquete Turístico Premium', quantity: 1, price: 1500 }
      ]
    },
    {
      id: '2',
      date: '2024-03-10',
      total: 800,
      status: 'pending',
      items: [
        { name: 'Tour Guiado', quantity: 2, price: 400 }
      ]
    },
    {
      id: '3',
      date: '2024-03-05',
      total: 1200,
      status: 'cancelled',
      items: [
        { name: 'Reserva Hotel', quantity: 1, price: 1200 }
      ]
    }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Volver al Inicio
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                activeTab === 'personal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Datos Personales</span>
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                activeTab === 'purchases'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Mis Compras</span>
            </button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {activeTab === 'personal' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Datos Personales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={user.nombre}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={user.apellido}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={user.telefono || 'No especificado'}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Mis Compras</h2>
                <div className="space-y-6">
                  {purchases.map((purchase) => (
                    <motion.div
                      key={purchase.id}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Compra #{purchase.id}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(purchase.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(purchase.status)}`}>
                          {getStatusIcon(purchase.status)}
                          <span className="text-sm font-medium capitalize">
                            {purchase.status === 'completed' ? 'Completada' : 
                             purchase.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {purchase.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{item.name} x{item.quantity}</span>
                            <span className="text-gray-900">${item.price.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between items-center font-semibold">
                            <span>Total</span>
                            <span>${purchase.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
