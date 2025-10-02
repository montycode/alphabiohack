import { NextRequest, NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/services/api-errors.service";

import { createOverrideTimeSlot } from "@/services/overrides.service";
import { prisma } from "@/lib/prisma";

// GET: listar slots de un override
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateOverrideId = searchParams.get("dateOverrideId");
    if (!dateOverrideId) {
      const { body, status } = errorResponse(
        "bad_request",
        "dateOverrideId is required",
        400
      );
      return NextResponse.json(body, { status });
    }

    const slots = await prisma.overrideTimeSlot.findMany({
      where: { dateOverrideId },
      orderBy: { startTime: "asc" },
    });
    return NextResponse.json(successResponse(slots));
  } catch (error) {
    console.error("Error fetching override slots:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}

// POST: crear nuevo slot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = {
      dateOverrideId: body.dateOverrideId as string,
      startTime: body.startTime as string,
      endTime: body.endTime as string,
      isActive: body.isActive ?? true,
    };
    if (!payload.dateOverrideId || !payload.startTime || !payload.endTime) {
      const { body, status } = errorResponse(
        "bad_request",
        "dateOverrideId, startTime, endTime required",
        400
      );
      return NextResponse.json(body, { status });
    }
    const created = await createOverrideTimeSlot(payload);
    return NextResponse.json(
      successResponse(created, "override_slots.create.success")
    );
  } catch (error) {
    console.error("Error creating override slot:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}
