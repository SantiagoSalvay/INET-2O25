import { NextResponse } from "next/server"
import { getUsers, getProducts, getOrders, getStats } from "@/lib/data-store"

export async function GET() {
  try {
    console.log("=== SYSTEM DEBUG ===")

    const [users, products, orders, stats] = await Promise.all([
      getUsers().catch((e) => ({ error: e.message, data: [] })),
      getProducts().catch((e) => ({ error: e.message, data: [] })),
      getOrders().catch((e) => ({ error: e.message, data: [] })),
      getStats().catch((e) => ({ error: e.message, data: null })),
    ])

    const systemStatus = {
      timestamp: new Date().toISOString(),
      users: Array.isArray(users) ? { count: users.length, data: users } : users,
      products: Array.isArray(products) ? { count: products.length, data: products } : products,
      orders: Array.isArray(orders) ? { count: orders.length, data: orders } : orders,
      stats: stats,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
      },
    }

    console.log("System status:", {
      users: Array.isArray(users) ? users.length : "ERROR",
      products: Array.isArray(products) ? products.length : "ERROR",
      orders: Array.isArray(orders) ? orders.length : "ERROR",
      stats: stats ? "OK" : "ERROR",
    })

    return NextResponse.json(systemStatus, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("System debug error:", error)
    return NextResponse.json(
      {
        error: "System debug failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
