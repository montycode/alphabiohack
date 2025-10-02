import { NextRequest, NextResponse } from "next/server";
import { getPatientBookings, getTherapistBookings } from "@/services";

// GET /api/users/[id]/bookings - Obtener citas del usuario
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "patient" o "therapist"

    let bookings;

    if (type === "patient") {
      bookings = await getPatientBookings(id);
    } else if (type === "therapist") {
      bookings = await getTherapistBookings(id);
    } else {
      // Si no se especifica tipo, obtener ambos
      const [patientBookings, therapistBookings] = await Promise.all([
        getPatientBookings(id),
        getTherapistBookings(id),
      ]);

      bookings = {
        patientBookings,
        therapistBookings,
      };
    }

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error getting user bookings:", error);
    return NextResponse.json(
      { success: false, error: "Error getting user bookings" },
      { status: 500 }
    );
  }
}
