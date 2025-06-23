"use client";
import { useEffect, useState } from "react";

interface Pedido {
  id: number;
  numero_pedido: string;
  cliente_nombre: string;
  cliente_email: string;
  fecha_pedido: string;
  detalles: {
    asientos?: string[];
    cantidad?: number;
    fecha?: string;
    precio?: number;
    total?: number;
    comprobanteNombre?: string;
  };
  total: number;
  estado: string;
}

const estados = ["pendiente", "verificado", "completado", "anulado"];

export default function PedidosAdminPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("pendiente");
  const [tab, setTab] = useState<'pedidos' | 'estadoCuenta' | 'historico'>("pedidos");
  const [clienteFiltro, setClienteFiltro] = useState<string>("");

  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true);
      const res = await fetch(`/api/pedidos`);
      const data = await res.json();
      setPedidos(data.pedidos || data || []);
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

  async function handleAnular(id: number) {
    if (!window.confirm("¿Seguro que deseas anular este pedido?")) return;
    try {
      await fetch(`/api/pedidos/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "anulado" })
      });
      setPedidos((prev) => prev.map(p => p.id === id ? { ...p, estado: "anulado" } : p));
    } catch (err) {
      setError("Error al anular el pedido");
    }
  }

  // --- Estado de cuenta ---
  // Solo pedidos pendientes o verificados (no completados ni anulados)
  const pedidosACobrar = pedidos.filter(p => ["pendiente", "verificado"].includes(p.estado));
  // Agrupar por cliente
  const clientes = Array.from(new Set(pedidosACobrar.map(p => p.cliente_email)));
  const resumenPorCliente = clientes.map(email => {
    const pedidosCliente = pedidosACobrar.filter(p => p.cliente_email === email);
    const total = pedidosCliente.reduce((sum, p) => sum + p.total, 0);
    return {
      cliente: pedidosCliente[0]?.cliente_nombre || email,
      email,
      total,
      pedidos: pedidosCliente
    };
  });
  const resumenFiltrado = clienteFiltro
    ? resumenPorCliente.filter(c => c.email === clienteFiltro)
    : resumenPorCliente;

  const pedidosFiltrados = filtroEstado === "todos"
    ? pedidos
    : pedidos.filter(p => p.estado === filtroEstado);

  // --- Histórico de pedidos entregados ---
  const pedidosCompletados = pedidos.filter(p => p.estado === "completado");

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded shadow p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Pedidos (Admin)</h1>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-t ${tab === 'pedidos' ? 'bg-blue-100 font-bold' : 'bg-gray-100'}`}
          onClick={() => setTab('pedidos')}
        >
          Gestión de Pedidos
        </button>
        <button
          className={`px-4 py-2 rounded-t ${tab === 'estadoCuenta' ? 'bg-blue-100 font-bold' : 'bg-gray-100'}`}
          onClick={() => setTab('estadoCuenta')}
        >
          Estado de Cuenta
        </button>
        <button
          className={`px-4 py-2 rounded-t ${tab === 'historico' ? 'bg-blue-100 font-bold' : 'bg-gray-100'}`}
          onClick={() => setTab('historico')}
        >
          Histórico
        </button>
      </div>
      {/* Tab: Gestión de Pedidos */}
      {tab === 'pedidos' && (
        <>
          <div className="mb-4 flex gap-4 items-center">
            <label className="font-semibold">Filtrar por estado:</label>
            <select
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="pendiente">Pendiente</option>
              <option value="verificado">Verificado</option>
              <option value="completado">Completado</option>
              <option value="anulado">Anulado</option>
              <option value="todos">Todos</option>
            </select>
          </div>
          {loading ? (
            <p>Cargando pedidos...</p>
          ) : pedidosFiltrados.length === 0 ? (
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
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((p) => (
                  <tr key={p.id} className={`border-t ${p.estado === "completado" ? "bg-green-50" : p.estado === "anulado" ? "bg-red-50 text-gray-400" : ""}`}>
                    <td className="p-2 font-mono">{p.numero_pedido}</td>
                    <td className="p-2">{p.cliente_nombre}</td>
                    <td className="p-2">{p.cliente_email}</td>
                    <td className="p-2">{new Date(p.fecha_pedido).toLocaleDateString()}</td>
                    <td className="p-2">{p.detalles?.asientos?.join(", ")}</td>
                    <td className="p-2">${p.total}</td>
                    <td className="p-2">
                      <select
                        value={p.estado}
                        onChange={e => handleEstadoChange(p.id, e.target.value)}
                        className="border rounded px-2 py-1"
                        disabled={p.estado === "anulado"}
                      >
                        {estados.map(est => (
                          <option key={est} value={est}>{est}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      {p.detalles?.comprobanteNombre ? (
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
                    <td className="p-2">
                      {p.estado !== "anulado" && (
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleAnular(p.id)}
                          disabled={p.estado === "completado"}
                        >
                          Anular
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      {/* Tab: Estado de Cuenta */}
      {tab === 'estadoCuenta' && (
        <div>
          <div className="mb-4 flex gap-4 items-center">
            <label className="font-semibold">Filtrar por cliente:</label>
            <select
              value={clienteFiltro}
              onChange={e => setClienteFiltro(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Todos</option>
              {clientes.map(email => (
                <option key={email} value={email}>{resumenPorCliente.find(c => c.email === email)?.cliente} ({email})</option>
              ))}
            </select>
          </div>
          {loading ? (
            <p>Cargando estado de cuenta...</p>
          ) : resumenFiltrado.length === 0 ? (
            <p>No hay facturas/pedidos a cobrar.</p>
          ) : (
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2">Cliente</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Cantidad de Pedidos</th>
                  <th className="p-2">Total Adeudado</th>
                  <th className="p-2">Pedidos</th>
                </tr>
              </thead>
              <tbody>
                {resumenFiltrado.map((c) => (
                  <tr key={c.email} className="border-t">
                    <td className="p-2">{c.cliente}</td>
                    <td className="p-2">{c.email}</td>
                    <td className="p-2">{c.pedidos.length}</td>
                    <td className="p-2 font-bold text-blue-700">${c.total}</td>
                    <td className="p-2">
                      <ul className="list-disc pl-4">
                        {c.pedidos.map(p => (
                          <li key={p.id}>
                            #{p.numero_pedido} - ${p.total} - {new Date(p.fecha_pedido).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {/* Tab: Histórico de Pedidos */}
      {tab === 'historico' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Histórico de Pedidos Entregados</h2>
          {loading ? (
            <p>Cargando histórico...</p>
          ) : pedidosCompletados.length === 0 ? (
            <p>No hay pedidos entregados.</p>
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
                  <th className="p-2">Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {pedidosCompletados.map((p) => (
                  <tr key={p.id} className="border-t bg-green-50">
                    <td className="p-2 font-mono">{p.numero_pedido}</td>
                    <td className="p-2">{p.cliente_nombre}</td>
                    <td className="p-2">{p.cliente_email}</td>
                    <td className="p-2">{new Date(p.fecha_pedido).toLocaleDateString()}</td>
                    <td className="p-2">{p.detalles?.asientos?.join(", ")}</td>
                    <td className="p-2">${p.total}</td>
                    <td className="p-2">
                      {p.detalles?.comprobanteNombre ? (
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
      )}
      {error && <p className="text-red-600 font-semibold mt-4">{error}</p>}
    </div>
  );
} 