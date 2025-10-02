import { NextRequest, NextResponse } from "next/server";
import {
  checkTherapistAvailability,
  checkTimeSlotAvailability,
  getAvailableTimeSlots,
} from "@/services";

// GET /api/bookings/availability - Verificar disponibilidad
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const therapistId = searchParams.get("therapistId");
    const date = searchParams.get("date");
    const bookingSchedule = searchParams.get("bookingSchedule");
    const locationId = searchParams.get("locationId");

    if (!therapistId) {
      return NextResponse.json(
        { success: false, error: "therapistId is required" },
        { status: 400 }
      );
    }

    let result;

    if (bookingSchedule) {
      // Verificar disponibilidad de un horario específico
      result = await checkTimeSlotAvailability(
        therapistId,
        new Date(bookingSchedule)
      );
    } else if (date && locationId) {
      // Obtener horarios disponibles para una fecha
      result = await getAvailableTimeSlots(
        therapistId,
        new Date(date),
        locationId
      );
    } else if (date) {
      // Verificar disponibilidad general del terapeuta en una fecha
      result = await checkTherapistAvailability(therapistId, new Date(date));
    } else {
      return NextResponse.json(
        { success: false, error: "date or bookingSchedule is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { success: false, error: "Error checking availability" },
      { status: 500 }
    );
  }
}
