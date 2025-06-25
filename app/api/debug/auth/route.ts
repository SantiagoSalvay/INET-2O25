import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const cookies = request.cookies.getAll()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      headers: {
        authorization: authHeader ? authHeader.substring(0, 50) + "..." : "none",
        userAgent: request.headers.get("user-agent"),
      },
      cookies: cookies.map((c) => ({ name: c.name, hasValue: !!c.value })),
      url: request.url,
      method: request.method,
      environment: {
        JWT_SECRET: !!process.env.JWT_SECRET,
        NODE_ENV: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug endpoint error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
