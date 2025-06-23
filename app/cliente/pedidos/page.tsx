"use client";
import { useEffect, useState } from "react";

interface Pedido {
  id: number;
  numero_pedido: string;
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

export default function PedidosUsuarioPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true);
      const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
      if (!user.id) return;
      const res = await fetch(`/api/pedidos/cliente/${user.id}`);
      const data = await res.json();
      setPedidos(data.pedidos || []);
      setLoading(false);
    }
    fetchPedidos();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded shadow p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Mis pedidos</h1>
      {loading ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>No tienes pedidos registrados.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2">ID</th>
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
                <td className="p-2">{new Date(p.fecha_pedido).toLocaleDateString()}</td>
                <td className="p-2">{p.detalles.asientos?.join(", ")}</td>
                <td className="p-2">${p.total}</td>
                <td className="p-2">{p.estado}</td>
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
    </div>
  );
} 