import { NextRequest, NextResponse } from "next/server";
import { getServiceStats, getServiceStatsBySpecialty } from "@/services";

// GET /api/services/stats - Obtener estadísticas de servicios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialtyId = searchParams.get("specialtyId");

    let stats;

    if (specialtyId) {
      stats = await getServiceStatsBySpecialty(specialtyId);
    } else {
      stats = await getServiceStats();
    }

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error getting service stats:", error);
    return NextResponse.json(
      { success: false, error: "Error getting service stats" },
      { status: 500 }
    );
  }
}
