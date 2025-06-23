"use client";
import React, { useState } from "react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { DateRange } from "react-day-picker";

export default function HotelModal({ open, onClose, onComplete }: {
  open: boolean,
  onClose: () => void,
  onComplete: (data: { entrada: Date, salida: Date }) => void
}) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!range?.from || !range?.to) return;
    onComplete({ entrada: range.from, salida: range.to });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Fechas de Estadía en Hotel</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-semibold block mb-2">Selecciona el rango de fechas:</label>
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              min={1}
              defaultMonth={new Date()}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={!range?.from || !range?.to}>Confirmar</Button>
          </div>
        </form>
      </div>
    </div>
  );
} 