import { NextRequest, NextResponse } from "next/server";

import { getServicesBySpecialty } from "@/services";

// GET /api/specialties/[id]/services - Obtener servicios de una especialidad
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const services = await getServicesBySpecialty(id);
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("Error getting specialty services:", error);
    return NextResponse.json(
      { success: false, error: "Error getting specialty services" },
      { status: 500 }
    );
  }
}
