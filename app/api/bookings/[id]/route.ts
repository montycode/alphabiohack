import { NextRequest, NextResponse } from "next/server";
import {
  checkTimeSlotAvailability,
  deleteBooking,
  getBookingById,
  updateBooking,
} from "@/services";

// GET /api/bookings/[id] - Obtener cita por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("Error getting booking:", error);
    return NextResponse.json(
      { success: false, error: "Error getting booking" },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Actualizar cita
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verificar que la cita existe
    const existingBooking = await getBookingById(id);
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Si se está cambiando el terapeuta o el horario, verificar disponibilidad
    if (body.therapistId || body.bookingSchedule) {
      const therapistId = body.therapistId || existingBooking.therapistId;
      const bookingSchedule =
        body.bookingSchedule || existingBooking.bookingSchedule;

      if (therapistId) {
        const availability = await checkTimeSlotAvailability(
          therapistId,
          new Date(bookingSchedule)
        );

        if (
          !availability.isAvailable &&
          availability.existingBooking?.id !== id
        ) {
          return NextResponse.json(
            { success: false, error: "Time slot not available" },
            { status: 409 }
          );
        }
      }
    }

    const updatedBooking = await updateBooking(id, body);
    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { success: false, error: "Error updating booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Eliminar cita
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar que la cita existe
    const existingBooking = await getBookingById(id);
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    await deleteBooking(id);
    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { success: false, error: "Error deleting booking" },
      { status: 500 }
    );
  }
}
