import { NextRequest, NextResponse } from "next/server";
import {
  deleteOverrideTimeSlot,
  updateOverrideTimeSlot,
} from "@/services/overrides.service";
import { errorResponse, successResponse } from "@/services/api-errors.service";

import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slot = await prisma.overrideTimeSlot.findUnique({ where: { id } });
    if (!slot) {
      const { body, status } = errorResponse("not_found", null, 404);
      return NextResponse.json(body, { status });
    }
    return NextResponse.json(successResponse(slot));
  } catch (error) {
    console.error("Error fetching override slot:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateOverrideTimeSlot(id, {
      startTime: body.startTime,
      endTime: body.endTime,
      isActive: body.isActive,
    });
    return NextResponse.json(
      successResponse(updated, "override_slots.update.success")
    );
  } catch (error) {
    console.error("Error updating override slot:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteOverrideTimeSlot(id);
    return NextResponse.json(
      successResponse({ id }, "override_slots.delete.success")
    );
  } catch (error) {
    console.error("Error deleting override slot:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}
