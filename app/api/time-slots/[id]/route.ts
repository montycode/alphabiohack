import { NextRequest, NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/services/api-errors.service";

import type { UpdateTimeSlotData } from "@/types";
import { prisma } from "@/lib/prisma";

// GET /api/time-slots/[id] - Obtener un slot de tiempo específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const timeSlot = await prisma.timeSlot.findUnique({
      where: {
        id,
      },
      include: {
        businessHours: {
          include: {
            location: true,
          },
        },
      },
    });

    if (!timeSlot) {
      const { body, status } = errorResponse("not_found", null, 404);
      return NextResponse.json(body, { status });
    }

    return NextResponse.json(successResponse(timeSlot));
  } catch (error) {
    console.error("Error fetching time slot:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}

// PUT /api/time-slots/[id] - Actualizar un slot de tiempo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateTimeSlotData = await request.json();

    // Obtener el slot actual para comparar
    const currentSlot = await prisma.timeSlot.findUnique({
      where: { id },
      include: {
        businessHours: true,
      },
    });

    if (!currentSlot) {
      const { body, status } = errorResponse("not_found", null, 404);
      return NextResponse.json(body, { status });
    }

    const timeSlot = await prisma.timeSlot.update({
      where: {
        id,
      },
      data: {
        startTime: body.startTime,
        endTime: body.endTime,
        isActive: body.isActive,
      },
      include: {
        businessHours: {
          include: {
            location: true,
          },
        },
      },
    });

    return NextResponse.json(
      successResponse(timeSlot, "timeSlots.update.success")
    );
  } catch (error) {
    console.error("Error updating time slot:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}

// DELETE /api/time-slots/[id] - Eliminar un slot de tiempo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar que el slot existe
    const slotToDelete = await prisma.timeSlot.findUnique({
      where: { id },
    });

    if (!slotToDelete) {
      const { body, status } = errorResponse("not_found", null, 404);
      return NextResponse.json(body, { status });
    }

    await prisma.timeSlot.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      successResponse({ id }, "timeSlots.delete.success")
    );
  } catch (error) {
    console.error("Error deleting time slot:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}
