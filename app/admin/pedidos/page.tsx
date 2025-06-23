"use client";
import { useEffect, useState } from "react";

interface Pedido {
  id: number;
  numero_pedido: string;
  cliente_nombre: string;
  cliente_email: string;
  fecha_pedido: string;
  detalles: {
    asientos: string[];
    cantidad: number;
    fecha: string;
    precio: number;
    total: number;
    comprobanteNombre?: string;
  };
  total: number;
  estado: string;
}

const estados = ["pendiente", "verificado", "completado"];

export default function PedidosAdminPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true);
      const res = await fetch(`/api/pedidos`);
      const data = await res.json();
      setPedidos(data.pedidos || []);
      setLoading(false);
    }
    fetchPedidos();
  }, []);

  async function handleEstadoChange(id: number, estado: string) {
    try {
      await fetch(`/api/pedidos/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado })
      });
      setPedidos((prev) => prev.map(p => p.id === id ? { ...p, estado } : p));
    } catch (err) {
      setError("Error al actualizar el estado");
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded shadow p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Pedidos (Admin)</h1>
      {loading ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2">ID</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Email</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Asientos</th>
              <th className="p-2">Total</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Comprobante</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2 font-mono">{p.numero_pedido}</td>
                <td className="p-2">{p.cliente_nombre}</td>
                <td className="p-2">{p.cliente_email}</td>
                <td className="p-2">{new Date(p.fecha_pedido).toLocaleDateString()}</td>
                <td className="p-2">{p.detalles.asientos?.join(", ")}</td>
                <td className="p-2">${p.total}</td>
                <td className="p-2">
                  <select
                    value={p.estado}
                    onChange={e => handleEstadoChange(p.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {estados.map(est => (
                      <option key={est} value={est}>{est}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  {p.detalles.comprobanteNombre ? (
                    <a
                      href={`/comprobantes/${p.detalles.comprobanteNombre}`}
                      download
                      className="text-blue-600 underline hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Descargar
                    </a>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}
    </div>
  );
} 