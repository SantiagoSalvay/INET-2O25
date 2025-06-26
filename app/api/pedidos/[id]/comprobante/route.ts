import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
    }
    // Buscar el pedido por id numérico o numero_pedido (UUID)
    let pedidoExistente = null;
    let pedidoId: number | null = null;
    if (!isNaN(Number(params.id))) {
      pedidoId = Number(params.id);
      pedidoExistente = await prisma.pedido.findUnique({ where: { id: pedidoId } });
    } else {
      pedidoExistente = await prisma.pedido.findUnique({ where: { numero_pedido: params.id } });
      pedidoId = pedidoExistente?.id ?? null;
    }
    if (!pedidoExistente || !pedidoId) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }
    const detallesExistentes = pedidoExistente.detalles && typeof pedidoExistente.detalles === 'object' ? pedidoExistente.detalles : {};
    // Guardar archivo en /public/comprobantes
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const fileName = `comprobante_${pedidoId}_${Date.now()}${ext}`;
    const savePath = path.join(process.cwd(), "public", "comprobantes", fileName);
    await fs.mkdir(path.dirname(savePath), { recursive: true });
    await fs.writeFile(savePath, buffer);
    // URL pública
    const comprobanteUrl = `/comprobantes/${fileName}`;
    // Actualizar pedido en la base de datos
    const pedido = await prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        detalles: {
          ...detallesExistentes,
          comprobanteNombre: file.name,
          comprobanteUrl,
        },
      },
    });
    return NextResponse.json({ success: true, comprobanteUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 