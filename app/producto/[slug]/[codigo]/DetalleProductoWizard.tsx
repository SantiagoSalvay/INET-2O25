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

  // Detectar tipo de producto
  const tipo = producto.categoria?.toLowerCase();

  // Renderizar formulario según tipo
  let detalleForm = null;
  if (tipo === 'vuelos') {
    detalleForm = <>
      <Button onClick={() => setShowFlight(true)} className="mb-4">Comprar vuelo</Button>
      <FlightModal open={showFlight} onClose={() => setShowFlight(false)} onComplete={setFlightData} />
      {flightData && (
        <div className="mt-4 p-4 bg-green-50 rounded">Vuelo reservado para {flightData.pasajeros} pasajero(s), asientos: {flightData.asientos.join(', ')}, fecha: {flightData.fecha}</div>
      )}
    </>;
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