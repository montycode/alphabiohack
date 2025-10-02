import { NextRequest, NextResponse } from "next/server";

import type { CreateBusinessHoursData } from "@/types";
import { DaysOfWeek } from "@prisma/client";
import { createBusinessHours as createBusinessHoursService } from "@/services/business-hours.service";
import { prisma } from "@/lib/prisma";

// GET /api/locations/[id]/business-hours - Obtener business hours de una ubicación
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: locationId } = await params;
    const { searchParams } = new URL(request.url);
    const dayOfWeek = searchParams.get("dayOfWeek");

    let businessHours;

    if (dayOfWeek) {
      // Obtener business hours para un día específico (activos e inactivos)
      businessHours = await prisma.businessHours.findFirst({
        where: {
          locationId,
          dayOfWeek: dayOfWeek as DaysOfWeek,
        },
        include: {
          timeSlots: {
            where: { isActive: true },
            orderBy: { startTime: "asc" },
          },
          location: true,
        },
      });
    } else {
      // Obtener todos los business hours de la ubicación (activos e inactivos)
      businessHours = await prisma.businessHours.findMany({
        where: {
          locationId,
        },
        include: {
          timeSlots: {
            where: { isActive: true },
            orderBy: { startTime: "asc" },
          },
          location: true,
        },
        orderBy: { dayOfWeek: "asc" },
      });
    }

    return NextResponse.json({
      success: true,
      data: businessHours,
    });
  } catch (error) {
    console.error("Error fetching business hours:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error fetching business hours",
      },
      { status: 500 }
    );
  }
}

// POST /api/locations/[id]/business-hours - Crear business hours para una ubicación
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: locationId } = await params;
    const body: CreateBusinessHoursData = await request.json();

    // Buscar existentes (activos o inactivos) para reutilizar
    const existing = await prisma.businessHours.findFirst({
      where: {
        locationId,
        dayOfWeek: body.dayOfWeek,
      },
      include: {
        timeSlots: {
          where: { isActive: true },
          orderBy: { startTime: "asc" },
        },
        location: true,
      },
    });

    if (existing) {
      // Rehabilitar si estaba inactivo
      const ensureActive = body.isActive ?? true;
      if (existing.isActive !== ensureActive) {
        const updated = await prisma.businessHours.update({
          where: { id: existing.id },
          data: { isActive: ensureActive },
          include: {
            timeSlots: {
              where: { isActive: true },
              orderBy: { startTime: "asc" },
            },
            location: true,
          },
        });
        return NextResponse.json({ success: true, data: updated });
      }
      return NextResponse.json({
        success: true,
        data: existing,
        warning: "Business hours already exists for this day",
      });
    }

    // Crear nuevo (servicio idempotente)
    const created = await createBusinessHoursService({
      dayOfWeek: body.dayOfWeek,
      locationId,
      isActive: body.isActive,
    });
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("Error creating business hours:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error creating business hours",
      },
      { status: 500 }
    );
  }
}
