"use client";
import React, { useState } from "react";
import { Button } from "./button";

export default function FlightModal({ open, onClose, onComplete }: {
  open: boolean,
  onClose: () => void,
  onComplete: (data: { pasajeros: number, asientos: string[], fecha: string }) => void
}) {
  const [pasajeros, setPasajeros] = useState(1);
  const [asientos, setAsientos] = useState<string[]>([]);
  const [fecha, setFecha] = useState("");

  const asientosDisponibles = [
    "1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D", "3A", "3B", "3C", "3D"
  ];

  const handleAsiento = (asiento: string) => {
    if (asientos.includes(asiento)) {
      setAsientos(asientos.filter(a => a !== asiento));
    } else if (asientos.length < pasajeros) {
      setAsientos([...asientos, asiento]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (asientos.length !== pasajeros || !fecha) return;
    onComplete({ pasajeros, asientos, fecha });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Datos del Vuelo</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-semibold">Cantidad de pasajeros:</label>
            <input type="number" min={1} max={6} value={pasajeros} onChange={e => {
              setPasajeros(Number(e.target.value));
              setAsientos([]);
            }} className="border rounded px-2 py-1 w-20 ml-2" />
          </div>
          <div>
            <label className="font-semibold">Selecciona los asientos:</label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {asientosDisponibles.map(a => (
                <button
                  type="button"
                  key={a}
                  className={`border rounded px-2 py-1 ${asientos.includes(a) ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => handleAsiento(a)}
                  disabled={asientos.length >= pasajeros && !asientos.includes(a)}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">Selecciona {pasajeros} asiento(s).</div>
          </div>
          <div>
            <label className="font-semibold">Fecha del vuelo:</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="border rounded px-2 py-1 ml-2" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={asientos.length !== pasajeros || !fecha}>Confirmar</Button>
          </div>
        </form>
      </div>
    </div>
  );
} 