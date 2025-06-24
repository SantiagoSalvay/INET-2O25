import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token faltante.' }, { status: 400 })
    }
    const user = await prisma.usuario.findFirst({
      where: {
        tokenVerificacion: token,
        tokenVerificacionExpira: { gte: new Date() },
        emailVerificado: false,
      },
    })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Token inválido o expirado.' }, { status: 400 })
    }
    await prisma.usuario.update({
      where: { id: user.id },
      data: {
        emailVerificado: true,
        tokenVerificacion: null,
        tokenVerificacionExpira: null,
      },
    })
    // Generar JWT igual que en login
    const jwtToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        rol: user.rol,
        timestamp: Date.now(),
      },
      process.env.JWT_SECRET || "olimpiada-turismo-2025-secret-key",
      { expiresIn: "24h" },
    )
    // Retornar token y user (sin password)
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ success: true, token: jwtToken, user: userWithoutPassword })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error interno.' }, { status: 500 })
  }
} 