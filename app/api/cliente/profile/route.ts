import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";
import { getToken } from "@/lib/auth"; // Assuming a helper for token retrieval

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken(req); // Helper to get token from request
    if (!token || !token.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = token.userId; // Assuming userId is available in the token payload
    const { nombre, apellido, email, newPassword } = await req.json();

    // Basic validation
    if (!nombre || !apellido || !email) {
      return NextResponse.json({ message: "Name, last name, and email are required" }, { status: 400 });
    }

    const updateData: {
      nombre?: string;
      apellido?: string;
      email?: string;
      password?: string;
    } = {
      nombre,
      apellido,
      email,
    };

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.Usuario.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true, // Include rol if it's needed in the client-side user object
      },
    });

    // Optionally, update the user data in the client's local storage or context if needed
    // For this example, we'll just return the updated user (without sensitive data)
    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser }, { status: 200 });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 