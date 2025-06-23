import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import CalendarioViaje from './CalendarioViaje';

interface Props {
  params: { slug: string; codigo: string };
}

export default async function ProductoDetallePage({ params }: Props) {
  const { codigo } = params;
  const producto = await prisma.producto.findUnique({
    where: { codigo: String(codigo) },
  });

  if (!producto) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-2">{producto.descripcion}</h1>
      <Image
        src="/placeholder.jpg"
        alt={producto.descripcion}
        width={400}
        height={250}
        className="rounded mb-4"
      />
      <p><strong>Código:</strong> {producto.codigo}</p>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      <p><strong>Categoría:</strong> {producto.categoria}</p>
      {producto.detalles && <p><strong>Detalles:</strong> {producto.detalles}</p>}
      <p><strong>Estado:</strong> {producto.activo ? 'Activo' : 'Inactivo'}</p>
      <p><strong>Fecha de creación:</strong> {new Date(producto.createdAt).toLocaleDateString()}</p>
      <CalendarioViaje precio={producto.precio} />
    </div>
  );
} 