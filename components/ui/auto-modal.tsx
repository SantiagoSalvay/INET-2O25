"use client";
import React, { useState } from "react";
import { Button } from "./button";

export default function AutoModal({ open, onClose, onComplete }: {
  open: boolean,
  onClose: () => void,
  onComplete: (data: { patente: string, nombre: string, email: string, poliza: string, marca: string, modelo: string }) => void
}) {
  const [patente, setPatente] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [poliza, setPoliza] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patente || !nombre || !email || !poliza || !marca || !modelo) return;
    onComplete({ patente, nombre, email, poliza, marca, modelo });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Datos para Alquiler de Auto</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="border rounded px-2 py-1" placeholder="Patente" value={patente} onChange={e => setPatente(e.target.value)} />
          <input className="border rounded px-2 py-1" placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} />
          <input className="border rounded px-2 py-1" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border rounded px-2 py-1" placeholder="Póliza de seguro" value={poliza} onChange={e => setPoliza(e.target.value)} />
          <input className="border rounded px-2 py-1" placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
          <input className="border rounded px-2 py-1" placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={!patente || !nombre || !email || !poliza || !marca || !modelo}>Confirmar</Button>
          </div>
        </form>
      </div>
    </div>
  );
} 