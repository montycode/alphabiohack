import { NextRequest, NextResponse } from "next/server";

import { assignTherapistToBooking } from "@/services";

// POST /api/bookings/[id]/assign-therapist - Asignar terapeuta a una cita
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.therapistId) {
      return NextResponse.json(
        { success: false, error: "therapistId is required" },
        { status: 400 }
      );
    }

    const updatedBooking = await assignTherapistToBooking(id, body.therapistId);
    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Error assigning therapist:", error);
    return NextResponse.json(
      { success: false, error: "Error assigning therapist" },
      { status: 500 }
    );
  }
}
