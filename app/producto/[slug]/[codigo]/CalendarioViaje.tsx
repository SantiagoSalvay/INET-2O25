"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

const filas = 19;
const columnas = 6;
const letras = ["A", "B", "C", "D", "E", "F"];

// Ejemplo de asientos ocupados (puedes cambiar estos valores)
const ocupados = new Set(["3B", "3C", "4B", "4C", "13A", "13F", "14A", "14F"]);
// Filas con salida de emergencia (13 y 14)
const salidasEmergencia = new Set([13, 14]);

export default function CalendarioViaje({ precio }: { precio: number }) {
  const [cantidad, setCantidad] = useState(1);
  const [asientos, setAsientos] = useState<string[]>([]);
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const maxPersonas = 6;
  const router = useRouter();

  // Selección de asientos
  function toggleAsiento(asiento: string) {
    if (ocupados.has(asiento)) return;
    if (asientos.includes(asiento)) {
      setAsientos(asientos.filter(a => a !== asiento));
    } else {
      if (asientos.length < cantidad) {
        setAsientos([...asientos, asiento]);
      }
    }
  }

  // Habilitar botón de comprar solo si todo está completo
  const puedeComprar = asientos.length === cantidad && fecha;
  const total = precio * cantidad;

  function handleComprar() {
    const compraId = uuidv4();
    // Guardar los datos de la compra en localStorage
    const compraData = {
      compraId,
      cantidad,
      asientos,
      fecha: fecha?.toISOString(),
      total,
      precio
    };
    localStorage.setItem(`compra_${compraId}`, JSON.stringify(compraData));
    router.push(`/compra/${compraId}/confirmacion`);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-bold text-2xl text-blue-700 mb-2">Precio del vuelo: <span className="text-black">${precio}</span></h2>
      {/* Paso 1: Cantidad de personas */}
      <div className="w-full max-w-xs mb-2">
        <label className="block font-semibold mb-1">Cantidad de personas:</label>
        <select
          className="w-full border rounded px-3 py-2 focus:outline-blue-500"
          value={cantidad}
          onChange={e => {
            setCantidad(Number(e.target.value));
            setAsientos([]); // Reset asientos al cambiar cantidad
          }}
        >
          {Array.from({ length: maxPersonas }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      {/* Paso 2: Selección de asientos */}
      <div className="flex flex-col items-center">
        <h3 className="font-semibold mb-2">Selecciona los asientos ({asientos.length}/{cantidad}):</h3>
        <div className="bg-gradient-to-b from-gray-200 to-gray-100 rounded-b-3xl rounded-t-xl p-4 shadow-lg flex flex-col items-center border border-gray-300" style={{ width: 340 }}>
          {/* Nariz del avión */}
          <div className="w-24 h-8 bg-gray-300 rounded-t-full mb-1"></div>
          {/* Filas de asientos */}
          {Array.from({ length: filas }, (_, filaIdx) => {
            const fila = filaIdx + 1;
            return (
              <div key={fila} className="flex justify-center mb-1 relative">
                {/* Salida de emergencia */}
                {salidasEmergencia.has(fila) && (
                  <span className="absolute -left-10 text-green-600 font-bold text-xs">SALIDA</span>
                )}
                {letras.map((letra, colIdx) => {
                  // Simular forma de avión: menos asientos adelante y atrás
                  if ((fila <= 2 && (colIdx === 0 || colIdx === 5)) || (fila >= 18 && (colIdx < 2 || colIdx > 3))) {
                    return <div key={letra} className="w-8 h-8 m-1"></div>; // Espacio vacío
                  }
                  const asientoId = `${fila}${letra}`;
                  const ocupado = ocupados.has(asientoId);
                  const seleccionado = asientos.includes(asientoId);
                  return (
                    <button
                      key={asientoId}
                      onClick={() => toggleAsiento(asientoId)}
                      disabled={ocupado || (asientos.length >= cantidad && !seleccionado)}
                      className={`w-8 h-8 m-1 rounded-md border text-xs font-bold flex items-center justify-center
                        ${ocupado ? "bg-gray-400 text-white cursor-not-allowed" : ""}
                        ${seleccionado ? "bg-blue-600 text-white" : "bg-white hover:bg-blue-100"}
                        ${salidasEmergencia.has(fila) ? "border-green-500" : ""}
                      `}
                      aria-label={`Asiento ${asientoId}`}
                    >
                      {ocupado ? "✕" : asientoId}
                    </button>
                  );
                })}
                {salidasEmergencia.has(fila) && (
                  <span className="absolute -right-10 text-green-600 font-bold text-xs">SALIDA</span>
                )}
              </div>
            );
          })}
          {/* Cola del avión */}
          <div className="w-10 h-8 bg-gray-300 rounded-b-full mt-2"></div>
        </div>
        {asientos.length < cantidad && (
          <p className="mt-2 text-red-600 text-sm">Selecciona {cantidad - asientos.length} asiento(s) más.</p>
        )}
        {asientos.length === cantidad && (
          <p className="mt-2 text-green-700 font-semibold">Asientos seleccionados: {asientos.join(", ")}</p>
        )}
      </div>
      {/* Paso 3: Selección de fecha */}
      <div className="w-full max-w-xs mb-2">
        <h3 className="font-semibold mb-2">Selecciona el día de salida:</h3>
        <Calendar mode="single" selected={fecha} onSelect={setFecha} className="rounded border shadow" />
        {fecha && (
          <p className="mt-2 text-blue-700">Día seleccionado: {fecha.toLocaleDateString()}</p>
        )}
      </div>
      {/* Resumen de compra */}
      {puedeComprar && (
        <div className="w-full max-w-xs bg-blue-50 border border-blue-200 rounded p-4 mb-2">
          <h4 className="font-bold text-blue-700 mb-2">Resumen de la compra</h4>
          <ul className="text-sm text-gray-800">
            <li><strong>Cantidad de personas:</strong> {cantidad}</li>
            <li><strong>Asientos:</strong> {asientos.join(", ")}</li>
            <li><strong>Fecha de viaje:</strong> {fecha?.toLocaleDateString()}</li>
            <li><strong>Total:</strong> ${total}</li>
          </ul>
        </div>
      )}
      {/* Paso 4: Botón de comprar */}
      <Button
        className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!puedeComprar}
        onClick={handleComprar}
      >
        Comprar
      </Button>
    </div>
  );
} 