"use client";
import React, { useState } from "react";
import { Button } from "./button";

export default function TrasladoModal({ open, onClose, onComplete }: {
  open: boolean,
  onClose: () => void,
  onComplete: (data: { personas: number, fecha: string }) => void
}) {
  const [personas, setPersonas] = useState(1);
  const [fecha, setFecha] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personas || !fecha) return;
    onComplete({ personas, fecha });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Datos para Traslado</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-semibold">Cantidad de personas:</label>
            <input type="number" min={1} max={20} value={personas} onChange={e => setPersonas(Number(e.target.value))} className="border rounded px-2 py-1 w-20 ml-2" />
          </div>
          <div>
            <label className="font-semibold">Fecha:</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="border rounded px-2 py-1 ml-2" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={!personas || !fecha}>Confirmar</Button>
          </div>
        </form>
      </div>
    </div>
  );
} 