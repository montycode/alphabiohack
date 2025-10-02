import { NextResponse } from "next/server";
import { getBookingsByTherapist } from "@/services/booking.service";
import { getDefaultTherapistId } from "@/lib/config/features";

export async function GET() {
  try {

    // Usar el defaultTherapistId en lugar del ID del usuario
    const therapistId = getDefaultTherapistId() || "";

    const bookings = await getBookingsByTherapist(therapistId);

    return NextResponse.json({
      bookings,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
