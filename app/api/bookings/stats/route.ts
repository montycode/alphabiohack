import { NextRequest, NextResponse } from "next/server";
import {
  getBookingStats,
  getBookingStatsByLocation,
  getBookingStatsByTherapist,
} from "@/services";

// GET /api/bookings/stats - Obtener estadísticas de citas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const therapistId = searchParams.get("therapistId");
    const locationId = searchParams.get("locationId");

    let stats;

    if (therapistId) {
      stats = await getBookingStatsByTherapist(therapistId);
    } else if (locationId) {
      stats = await getBookingStatsByLocation(locationId);
    } else {
      stats = await getBookingStats();
    }

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error getting booking stats:", error);
    return NextResponse.json(
      { success: false, error: "Error getting booking stats" },
      { status: 500 }
    );
  }
}
