'use client'

import React, { useState, useEffect } from 'react';
import { useCart } from '../cart-context';
import { Button } from './button';

export default function CartSidebar({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      const detalles = cart.map(item => ({
        id: item.id,
        codigo: item.codigo,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          cliente_nombre: user.nombre ? `${user.nombre} ${user.apellido}` : 'Cliente',
          cliente_email: user.email || '',
          total,
          detalles
        })
      });
      if (!res.ok) throw new Error('Error al registrar el pedido');
      setSuccess(true);
      clearCart();
    } catch (e: any) {
      setError(e.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => setOpen(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [success, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
      <div className="w-80 bg-white h-full shadow-lg p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Carrito</h2>
          <Button variant="ghost" onClick={() => setOpen(false)}>✕</Button>
        </div>
        {cart.length === 0 && !success ? (
          <p className="text-gray-500">El carrito está vacío.</p>
        ) : success ? (
          <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded mb-4 text-center">
            ¡Compra registrada con éxito!
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto">
            {cart.map(item => (
              <li key={item.id} className="mb-3 border-b pb-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold">{item.name}</span><br/>
                  <span className="text-sm text-gray-600">x{item.quantity} - ${item.price}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button>
                  <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                  <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>🗑️</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <div className="font-bold mb-2">Total: ${total}</div>
          <Button className="w-full mb-2" disabled={cart.length === 0 || loading || success} onClick={handleConfirm}>
            {loading ? 'Registrando...' : 'Confirmar compra'}
          </Button>
          <Button className="w-full" variant="outline" onClick={clearCart} disabled={cart.length === 0 || loading || success}>Vaciar carrito</Button>
          {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
        </div>
      </div>
    </div>
  );
} 