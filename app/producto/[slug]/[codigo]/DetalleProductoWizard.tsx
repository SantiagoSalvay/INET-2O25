"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import FlightModal from '@/components/ui/flight-modal';
import HotelModal from '@/components/ui/hotel-modal';
import { Button } from '@/components/ui/button';
import AutoModal from '@/components/ui/auto-modal';
import TrasladoModal from '@/components/ui/traslado-modal';
import PaqueteModal from '@/components/ui/paquete-modal';
import CalendarioViaje from './CalendarioViaje';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

function AvionAsientos({ pasajeros, asientos, setAsientos }: { pasajeros: number, asientos: string[], setAsientos: (a: string[]) => void }) {
  // Filas 3-19, columnas A-F
  const filas = Array.from({ length: 17 }, (_, i) => i + 3); // 3 a 19
  const columnas = ['A', 'B', 'C', 'D', 'E', 'F'];
  const asientosDisponibles: string[] = [];
  for (let f of filas) {
    for (let c of columnas) {
      asientosDisponibles.push(`${f}${c}`);
    }
  }
  // Generar asientos ocupados aleatoriamente (por ejemplo, 20 asientos)
  const [ocupados] = useState(() => {
    const total = asientosDisponibles.length;
    const n = 20;
    const set = new Set<string>();
    while (set.size < n) {
      const idx = Math.floor(Math.random() * total);
      set.add(asientosDisponibles[idx]);
    }
    return Array.from(set);
  });
  const handleAsiento = (asiento: string) => {
    if (ocupados.includes(asiento)) return;
    if (asientos.includes(asiento)) {
      setAsientos(asientos.filter(a => a !== asiento));
    } else if (asientos.length < pasajeros) {
      setAsientos([...asientos, asiento]);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-[#f4f6fb] rounded-2xl p-4 shadow-lg" style={{ width: 340 }}>
        {/* Numeración de columnas */}
        <div className="flex justify-between px-8 mb-1">
          {columnas.map(col => (
            <span key={col} className="text-xs font-bold text-gray-700" style={{ width: 36, textAlign: 'center' }}>{col}</span>
          ))}
        </div>
        {/* Grilla de asientos */}
        <div className="flex flex-col">
          {filas.map((fila, filaIdx) => (
            <div key={fila} className="flex items-center mb-1 relative">
              {/* Número de fila izquierda */}
              <span className="text-xs font-bold text-gray-700 w-5 text-right mr-1">{fila}</span>
              {/* Asientos */}
              {columnas.map((col, colIdx) => {
                const asiento = `${fila}${col}`;
                const ocupado = ocupados.includes(asiento);
                const seleccionado = asientos.includes(asiento);
                return (
                  <button
                    key={asiento}
                    title={asiento}
                    onClick={() => handleAsiento(asiento)}
                    disabled={ocupado}
                    className={`mx-1 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-150
                      ${ocupado ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' : seleccionado ? 'bg-blue-600 border-blue-700 text-white shadow-lg' : 'bg-white border-blue-200 hover:bg-blue-100 text-blue-700'}
                    `}
                    style={{ boxShadow: seleccionado ? '0 0 0 2px #2563eb55' : undefined }}
                  >
                    {ocupado ? '✕' : seleccionado ? <User size={16} /> : ''}
                  </button>
                );
              })}
              {/* Número de fila derecha */}
              <span className="text-xs font-bold text-gray-700 w-5 ml-1">{fila}</span>
              {/* Salidas de emergencia */}
              {(fila === 13 || fila === 14) && (
                <span className="absolute -left-12 text-green-700 font-bold flex items-center gap-1" style={{ fontSize: 13 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18"><path d="M14 9H2M2 9l4-4M2 9l4 4" stroke="#15803d" strokeWidth="2" fill="none"/></svg>
                  SALIDA
                </span>
              )}
              {(fila === 13 || fila === 14) && (
                <span className="absolute -right-12 text-green-700 font-bold flex items-center gap-1" style={{ fontSize: 13 }}>
                  SALIDA
                  <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 9h12M16 9l-4-4M16 9l-4 4" stroke="#15803d" strokeWidth="2" fill="none"/></svg>
                </span>
              )}
            </div>
          ))}
        </div>
        {/* Nariz y cola del avión (decorativo) */}
        <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-16 h-6 bg-[#e0e7ef] rounded-t-full border-t-4 border-blue-200"></div>
        <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-20 h-8 bg-[#e0e7ef] rounded-b-3xl border-b-4 border-blue-200"></div>
      </div>
      <div className="text-xs text-gray-500 mt-2">Selecciona {pasajeros} asiento(s).</div>
    </div>
  );
}

export default function DetalleProductoWizard({ producto, recomendaciones }: {
  producto: any;
  recomendaciones: any[];
}) {
  const [showFlight, setShowFlight] = useState(false);
  const [showHotel, setShowHotel] = useState(false);
  const [showAuto, setShowAuto] = useState(false);
  const [showTraslado, setShowTraslado] = useState(false);
  const [showPaquete, setShowPaquete] = useState(false);
  const [flightData, setFlightData] = useState<any>(null);
  const [hotelData, setHotelData] = useState<any>(null);
  const [autoData, setAutoData] = useState<any>(null);
  const [trasladoData, setTrasladoData] = useState<any>(null);
  const [paqueteData, setPaqueteData] = useState<any>(null);
  const router = useRouter();

  // Detectar tipo de producto
  const tipo = producto.categoria?.toLowerCase();

  // Wizard de vuelo
  const [step, setStep] = useState(0);
  const [pasajeros, setPasajeros] = useState(1);
  const [asientos, setAsientos] = useState<string[]>([]);
  const [fecha, setFecha] = useState<string>("");
  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Renderizar formulario según tipo
  let detalleForm = null;
  if (tipo === 'vuelos') {
    detalleForm = (
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between mb-6">
          <div className={`font-bold ${step === 0 ? 'text-blue-700' : 'text-gray-400'}`}>1. Pasajeros</div>
          <div className={`font-bold ${step === 1 ? 'text-blue-700' : 'text-gray-400'}`}>2. Asientos</div>
          <div className={`font-bold ${step === 2 ? 'text-blue-700' : 'text-gray-400'}`}>3. Fecha</div>
          <div className={`font-bold ${step === 3 ? 'text-blue-700' : 'text-gray-400'}`}>4. Confirmar</div>
        </div>
        {step === 0 && (
          <div className="flex flex-col items-center gap-4">
            <label className="font-semibold">¿Cuántas personas viajan?</label>
            <input type="number" min={1} max={6} value={pasajeros} onChange={e => {
              setPasajeros(Number(e.target.value));
              setAsientos([]);
            }} className="border rounded px-2 py-1 w-24 text-center" />
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-semibold" onClick={() => setStep(1)}>Siguiente</button>
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col items-center gap-4">
            <label className="font-semibold">Selecciona los asientos</label>
            <AvionAsientos pasajeros={pasajeros} asientos={asientos} setAsientos={setAsientos} />
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-semibold" disabled={asientos.length !== pasajeros} onClick={() => setStep(2)}>Siguiente</button>
            <button className="mt-2 text-blue-600 underline" onClick={() => setStep(0)}>Anterior</button>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col items-center gap-4">
            <label className="font-semibold">Selecciona la fecha del vuelo</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="border rounded px-2 py-1" />
            {/* O usar <CalendarioViaje ... /> si se prefiere */}
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-semibold" disabled={!fecha} onClick={() => setStep(3)}>Siguiente</button>
            <button className="mt-2 text-blue-600 underline" onClick={() => setStep(1)}>Anterior</button>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-blue-50 rounded-lg p-4 w-full text-center">
              <div className="font-semibold mb-2">Resumen de tu reserva</div>
              <div><b>Pasajeros:</b> {pasajeros}</div>
              <div><b>Asientos:</b> {asientos.join(', ')}</div>
              <div><b>Fecha:</b> {fecha}</div>
              <div><b>Total:</b> ${producto.precio * pasajeros}</div>
            </div>
            <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-60" onClick={handleConfirmar} disabled={loading}>
              {loading ? 'Procesando...' : 'Confirmar y continuar'}
            </button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            <button className="mt-2 text-blue-600 underline" onClick={() => setStep(2)}>Anterior</button>
          </div>
        )}
        {confirmado && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="32" fill="#22c55e"/><path d="M20 34L29 43L44 26" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div className="text-green-700 font-bold text-lg">¡Reserva confirmada!</div>
            <div className="text-gray-600">Recibirás un email con los detalles de tu vuelo.</div>
          </div>
        )}
      </div>
    );
  } else if (tipo === 'hoteles') {
    detalleForm = <>
      <Button onClick={() => setShowHotel(true)} className="mb-4">Reservar hotel</Button>
      <HotelModal open={showHotel} onClose={() => setShowHotel(false)} onComplete={setHotelData} />
      {hotelData && (
        <div className="mt-4 p-4 bg-green-50 rounded">Hotel reservado del {hotelData.entrada.toLocaleDateString()} al {hotelData.salida.toLocaleDateString()}</div>
      )}
    </>;
  } else if (tipo === 'autos') {
    detalleForm = <>
      <Button onClick={() => setShowAuto(true)} className="mb-4">Alquilar auto</Button>
      <AutoModal open={showAuto} onClose={() => setShowAuto(false)} onComplete={setAutoData} />
      {autoData && (
        <div className="mt-4 p-4 bg-green-50 rounded">Auto reservado: {autoData.marca} {autoData.modelo}, patente: {autoData.patente}</div>
      )}
    </>;
  } else if (tipo === 'traslados') {
    detalleForm = <>
      <Button onClick={() => setShowTraslado(true)} className="mb-4">Reservar traslado</Button>
      <TrasladoModal open={showTraslado} onClose={() => setShowTraslado(false)} onComplete={setTrasladoData} />
      {trasladoData && (
        <div className="mt-4 p-4 bg-green-50 rounded">Traslado reservado para {trasladoData.personas} persona(s), fecha: {trasladoData.fecha}</div>
      )}
    </>;
  } else if (tipo === 'paquetes' || tipo === 'excursiones') {
    detalleForm = <>
      <Button onClick={() => setShowPaquete(true)} className="mb-4">Reservar paquete/excursión</Button>
      <PaqueteModal open={showPaquete} onClose={() => setShowPaquete(false)} onComplete={setPaqueteData} />
      {paqueteData && (
        <div className="mt-4 p-4 bg-green-50 rounded">Reserva para {paqueteData.personas} persona(s), del {paqueteData.inicio.toLocaleDateString()} al {paqueteData.fin.toLocaleDateString()}</div>
      )}
    </>;
  } else {
    detalleForm = <div className="p-4 bg-gray-50 rounded">No hay formulario disponible para este producto.</div>;
  }

  async function handleConfirmar() {
    setLoading(true);
    setError("");
    try {
      // Obtener usuario autenticado de localStorage
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) throw new Error('Debes iniciar sesión para comprar.');
      const total = producto.precio * pasajeros;
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          cantidad: pasajeros,
          asientos,
          fecha,
          total,
          precio: producto.precio,
          cliente_nombre: user.nombre + ' ' + user.apellido,
          cliente_email: user.email,
          detalles: {
            producto: producto.descripcion,
            codigo: producto.codigo,
            categoria: producto.categoria
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setConfirmado(true);
        setStep(4);
        // Redirigir a página de pago con el token UUID de compra
        if (data.pedido && data.pedido.numero_pedido) {
          setTimeout(() => {
            router.push(`/compra/${data.pedido.numero_pedido}/pago`);
          }, 1200);
        }
      } else {
        setError(data.error || 'Error al crear el pedido');
      }
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image src={'/placeholder.jpg'} alt="Referencia" width={350} height={250} className="rounded-xl shadow" />
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            {detalleForm}
          </div>
        </div>
      </div>
      {/* Recomendaciones */}
      <div className="mt-12 w-full">
        <h3 className="text-xl font-bold text-blue-700 mb-4">Recomendaciones</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recomendaciones.map((rec) => (
            <Link key={rec.codigo} href={`/producto/${rec.descripcion.toLowerCase().replace(/ /g, '-')}/${rec.codigo}`} className="block">
              <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all flex flex-col items-center">
                <Image src="/placeholder.jpg" alt={rec.descripcion} width={120} height={80} className="rounded mb-2" />
                <div className="font-semibold text-gray-800 text-center mb-1">{rec.descripcion}</div>
                <div className="text-blue-600 font-bold">${rec.precio}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 