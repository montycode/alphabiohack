import { NextRequest, NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/services/api-errors.service";

import type { UpdateBusinessHoursData } from "@/types";
import { prisma } from "@/lib/prisma";

// GET /api/business-hours/[id] - Obtener un horario de atención específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const businessHours = await prisma.businessHours.findUnique({
      where: {
        id,
      },
      include: {
        location: true,
        timeSlots: {
          where: {
            isActive: true,
          },
          orderBy: {
            startTime: "asc",
          },
        },
      },
    });

    if (!businessHours) {
      const { body, status } = errorResponse("not_found", null, 404);
      return NextResponse.json(body, { status });
    }

    return NextResponse.json(successResponse(businessHours));
  } catch (error) {
    console.error("Error fetching business hours:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}

// PUT /api/business-hours/[id] - Actualizar un horario de atención
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateBusinessHoursData = await request.json();

    // Obtener el business hours actual para comparar
    const currentBusinessHours = await prisma.businessHours.findUnique({
      where: { id },
      include: {
        timeSlots: true,
      },
    });

    if (!currentBusinessHours) {
      const { body, status } = errorResponse("not_found", null, 404);
      return NextResponse.json(body, { status });
    }

    const businessHours = await prisma.businessHours.update({
      where: {
        id,
      },
      data: {
        dayOfWeek: body.dayOfWeek,
        isActive: body.isActive,
      },
      include: {
        location: true,
        timeSlots: {
          where: {
            isActive: true,
          },
          orderBy: {
            startTime: "asc",
          },
        },
      },
    });

    return NextResponse.json(
      successResponse(businessHours, "businessHours.update.success")
    );
  } catch (error) {
    console.error("Error updating business hours:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}

// DELETE /api/business-hours/[id] - Eliminar un horario de atención
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.businessHours.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      successResponse({ id }, "businessHours.delete.success")
    );
  } catch (error) {
    console.error("Error deleting business hours:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}
