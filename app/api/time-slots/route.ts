import { NextRequest, NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/services/api-errors.service";

import type { CreateTimeSlotData } from "@/types";
import { DaysOfWeek } from "@prisma/client";
import { createTimeSlot as createTimeSlotService } from "@/services/business-hours.service";
import { prisma } from "@/lib/prisma";

// GET /api/time-slots - Obtener slots de tiempo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessHoursId = searchParams.get("businessHoursId");
    const locationId = searchParams.get("locationId");
    const dayOfWeek = searchParams.get("dayOfWeek");

    let timeSlots;

    if (businessHoursId) {
      // Obtener slots para un BusinessHours específico
      timeSlots = await prisma.timeSlot.findMany({
        where: {
          businessHoursId,
          isActive: true,
        },
        orderBy: {
          startTime: "asc",
        },
      });
    } else if (locationId && dayOfWeek) {
      // Obtener slots para una ubicación y día específico
      timeSlots = await prisma.timeSlot.findMany({
        where: {
          businessHours: {
            locationId,
            dayOfWeek: dayOfWeek as DaysOfWeek,
            isActive: true,
          },
          isActive: true,
        },
        include: {
          businessHours: true,
        },
        orderBy: {
          startTime: "asc",
        },
      });
    } else {
      // Obtener todos los slots activos
      timeSlots = await prisma.timeSlot.findMany({
        where: {
          isActive: true,
        },
        include: {
          businessHours: {
            include: {
              location: true,
            },
          },
        },
        orderBy: {
          startTime: "asc",
        },
      });
    }

    return NextResponse.json(successResponse(timeSlots));
  } catch {
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}

// POST /api/time-slots - Crear nuevo slot de tiempo
export async function POST(request: NextRequest) {
  try {
    const body: CreateTimeSlotData = await request.json();

    // Verificar si ya existe un slot similar
    const existingSlot = await prisma.timeSlot.findFirst({
      where: {
        businessHoursId: body.businessHoursId,
        startTime: body.startTime,
        endTime: body.endTime,
        isActive: true,
      },
    });

    if (existingSlot) {
      return NextResponse.json(
        successResponse(existingSlot, "timeSlots.ensure.success")
      );
    }

    // Intentar crear, si falla por unique, devolver existente
    const timeSlot = await createTimeSlotService(body);
    return NextResponse.json(
      successResponse(timeSlot, "timeSlots.create.success")
    );
  } catch (error) {
    console.error("Error creating time slot:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}
