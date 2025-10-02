import { NextRequest, NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/services/api-errors.service";

import type { CreateBusinessHoursData } from "@/types";
import { DaysOfWeek } from "@prisma/client";
import { createBusinessHours as createBusinessHoursService } from "@/services/business-hours.service";
import { prisma } from "@/lib/prisma";

// GET /api/business-hours - Obtener horarios de atención
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId");
    const dayOfWeek = searchParams.get("dayOfWeek");

    let businessHours;

    if (locationId && dayOfWeek) {
      // Obtener BusinessHours para una ubicación y día específico
      businessHours = await prisma.businessHours.findFirst({
        where: {
          locationId,
          dayOfWeek: dayOfWeek as DaysOfWeek,
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
    } else if (locationId) {
      // Obtener todos los BusinessHours para una ubicación
      businessHours = await prisma.businessHours.findMany({
        where: {
          locationId,
          isActive: true,
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
        orderBy: {
          dayOfWeek: "asc",
        },
      });
    } else {
      // Obtener todos los BusinessHours
      businessHours = await prisma.businessHours.findMany({
        where: {
          isActive: true,
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
        orderBy: {
          dayOfWeek: "asc",
        },
      });
    }

    return NextResponse.json(successResponse(businessHours));
  } catch (error) {
    console.error("Error fetching business hours:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}

// POST /api/business-hours - Crear nuevo horario de atención
export async function POST(request: NextRequest) {
  try {
    const body: CreateBusinessHoursData = await request.json();

    // Reutilizar si ya existe (activo o inactivo) por unique(locationId, dayOfWeek)
    const existing = await prisma.businessHours.findFirst({
      where: {
        locationId: body.locationId,
        dayOfWeek: body.dayOfWeek as DaysOfWeek,
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

    if (existing) {
      const ensureActive = body.isActive ?? true;
      if (existing.isActive !== ensureActive) {
        const updated = await prisma.businessHours.update({
          where: { id: existing.id },
          data: { isActive: ensureActive },
          include: {
            location: true,
            timeSlots: {
              where: { isActive: true },
              orderBy: { startTime: "asc" },
            },
          },
        });
        return NextResponse.json(
          successResponse(updated, "businessHours.update.success")
        );
      }
      return NextResponse.json(
        successResponse(existing, "businessHours.ensure.success")
      );
    }

    const created = await createBusinessHoursService({
      dayOfWeek: body.dayOfWeek as DaysOfWeek,
      locationId: body.locationId,
      isActive: body.isActive,
    });
    return NextResponse.json(
      successResponse(created, "businessHours.create.success")
    );
  } catch (error) {
    console.error("Error creating business hours:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}
