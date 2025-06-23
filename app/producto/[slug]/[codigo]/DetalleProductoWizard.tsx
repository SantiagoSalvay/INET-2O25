"use client";
import Image from 'next/image';
import Link from 'next/link';
import CalendarioViaje from './CalendarioViaje';

export default function DetalleProductoWizard({ producto, recomendaciones }: {
  producto: any;
  recomendaciones: any[];
}) {
  const imagenReferencia = '/placeholder.jpg';

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 flex justify-center">
          <Image src={imagenReferencia} alt="Referencia" width={350} height={250} className="rounded-xl shadow" />
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <CalendarioViaje precio={producto.precio} />
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