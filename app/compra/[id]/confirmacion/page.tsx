"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

const DATOS_BANCARIOS = {
  banco: "Banco Ejemplo S.A.",
  titular: "INET S.A.",
  cbu: "1234567890123456789012",
  alias: "INET.VIAJES.PAGO",
  cuenta: "Caja de Ahorro $"
};

export default function ConfirmacionCompraPage() {
  // Simular generación de UUID para la compra
  const [compraId] = useState(uuidv4());
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [finalizado, setFinalizado] = useState(false);
  const [pedidoGuardado, setPedidoGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Leer datos de la compra desde localStorage si existen
  let compraData: any = null;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(`compra_${compraId}`);
    if (stored) {
      compraData = JSON.parse(stored);
    }
  }

  function handleComprobante(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setComprobante(e.target.files[0]);
    }
  }

  async function handleFinalizar() {
    // Generar y descargar recibo PDF
    if (compraData) {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Recibo de Compra - INET", 10, 15);
      doc.setFontSize(12);
      doc.text(`ID de compra: ${compraData.compraId || compraId}`, 10, 30);
      doc.text(`Cantidad de personas: ${compraData.cantidad || "-"}`, 10, 40);
      doc.text(`Asientos: ${compraData.asientos ? compraData.asientos.join(", ") : "-"}`, 10, 50);
      doc.text(`Fecha de viaje: ${compraData.fecha ? new Date(compraData.fecha).toLocaleDateString() : "-"}`, 10, 60);
      doc.text(`Total: $${compraData.total || "-"}`, 10, 70);
      doc.text("Datos bancarios:", 10, 85);
      doc.text(`Banco: ${DATOS_BANCARIOS.banco}`, 10, 95);
      doc.text(`Titular: ${DATOS_BANCARIOS.titular}`, 10, 105);
      doc.text(`CBU: ${DATOS_BANCARIOS.cbu}`, 10, 115);
      doc.text(`Alias: ${DATOS_BANCARIOS.alias}`, 10, 125);
      doc.text(`Tipo de cuenta: ${DATOS_BANCARIOS.cuenta}`, 10, 135);
      doc.save(`recibo_${compraData.compraId || compraId}.pdf`);
    }
    // Enviar pedido a la API
    try {
      const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
      await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          cliente_nombre: user.nombre ? `${user.nombre} ${user.apellido}` : "Cliente",
          cliente_email: user.email || "",
          cantidad: compraData?.cantidad,
          asientos: compraData?.asientos,
          fecha: compraData?.fecha,
          total: compraData?.total,
          precio: compraData?.precio,
          comprobanteNombre: comprobante?.name || ""
        })
      });
      setPedidoGuardado(true);
      setFinalizado(true);
    } catch (err) {
      setError("Error al guardar el pedido. Intenta nuevamente.");
    }
  }

  useEffect(() => {
    if (finalizado) {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [finalizado, router]);

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded shadow p-6 flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">Confirmación de compra</h1>
      <div className="w-full bg-blue-50 border border-blue-200 rounded p-4 mb-2">
        <h2 className="font-semibold mb-2">Datos bancarios para transferir</h2>
        <ul className="text-sm text-gray-800">
          <li><strong>Banco:</strong> {DATOS_BANCARIOS.banco}</li>
          <li><strong>Titular:</strong> {DATOS_BANCARIOS.titular}</li>
          <li><strong>CBU:</strong> {DATOS_BANCARIOS.cbu}</li>
          <li><strong>Alias:</strong> {DATOS_BANCARIOS.alias}</li>
          <li><strong>Tipo de cuenta:</strong> {DATOS_BANCARIOS.cuenta}</li>
        </ul>
      </div>
      <div className="w-full bg-gray-50 border border-gray-200 rounded p-4 mb-2">
        <h2 className="font-semibold mb-2">ID de compra</h2>
        <p className="text-blue-700 font-mono text-lg">{compraData?.compraId || compraId}</p>
      </div>
      <div className="w-full">
        <label className="block font-semibold mb-1">Sube el comprobante de pago:</label>
        <input type="file" accept="image/*,application/pdf" onChange={handleComprobante} className="mb-2" />
        {comprobante && <p className="text-green-700 text-sm">Archivo seleccionado: {comprobante.name}</p>}
      </div>
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!comprobante || finalizado}
        onClick={handleFinalizar}
      >
        Finalizar compra
      </Button>
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      {finalizado && (
        <div className="w-full bg-green-100 border border-green-300 rounded p-4 text-center mt-2">
          <h3 className="text-green-700 font-bold text-lg mb-1">¡Compra completada!</h3>
          <p>Tu pago será verificado y luego recibirás los tickets por email.</p>
          <p className="mt-2 text-gray-600 text-sm">Serás redirigido al inicio en 5 segundos...</p>
          <Button className="mt-4" onClick={() => router.push("/")}>Volver al inicio</Button>
        </div>
      )}
    </div>
  );
} 