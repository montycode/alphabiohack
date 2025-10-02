import { NextRequest, NextResponse } from "next/server";

import { updateBookingStatus } from "@/services";

// PUT /api/bookings/[id]/status - Actualizar estado de una cita
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { success: false, error: "status is required" },
        { status: 400 }
      );
    }

    const updatedBooking = await updateBookingStatus(id, body.status);
    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { success: false, error: "Error updating booking status" },
      { status: 500 }
    );
  }
}
