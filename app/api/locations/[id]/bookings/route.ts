import { NextRequest, NextResponse } from "next/server";

import { getLocationBookings } from "@/services";

// GET /api/locations/[id]/bookings - Obtener citas de una ubicación
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const bookings = await getLocationBookings(id);
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error getting location bookings:", error);
    return NextResponse.json(
      { success: false, error: "Error getting location bookings" },
      { status: 500 }
    );
  }
}
