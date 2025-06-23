import { prisma } from '@/lib/prisma';
import productos from '@/data/productos.json';
import DetalleProductoWizard from './DetalleProductoWizard';

export default async function ProductoDetallePage({ params }: { params: { slug: string; codigo: string } }) {
  const { codigo } = params;
  const producto = await prisma.producto.findUnique({
    where: { codigo: String(codigo) },
  });

  // Recomendaciones: otros productos activos, distintos al actual
  const recomendaciones = productos.filter(
    (p) => p.codigo !== codigo && p.activo
  ).slice(0, 4);

  if (!producto) {
    return <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-xl shadow text-center">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Producto no encontrado</h1>
      <p className="text-gray-600">El producto que buscas no existe o fue eliminado.</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-2 text-center">{producto.descripcion}</h1>
        <p className="text-gray-500 mb-8 text-center">Código: <span className="font-mono">{producto.codigo}</span></p>
        <DetalleProductoWizard producto={producto} recomendaciones={recomendaciones} />
      </div>
    </div>
  );
} 