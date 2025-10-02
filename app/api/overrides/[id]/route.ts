import { NextRequest, NextResponse } from "next/server";
import {
  deleteDateOverride,
  updateDateOverride,
} from "@/services/overrides.service";
import { errorResponse, successResponse } from "@/services/api-errors.service";

import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const override = await prisma.dateOverride.findUnique({
      where: { id },
      include: { timeSlots: true, location: true },
    });
    if (!override) {
      const { body, status } = errorResponse("not_found", null, 404);
      return NextResponse.json(body, { status });
    }
    return NextResponse.json(successResponse(override));
  } catch (error) {
    console.error("Error fetching override:", error);
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
    const payload = {
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      isClosed: body.isClosed,
      reason: body.reason ?? undefined,
    };

    const updated = await updateDateOverride(id, payload);
    return NextResponse.json(
      successResponse(updated, "overrides.update.success")
    );
  } catch (error) {
    console.error("Error updating override:", error);
    const code = (
      error as
        | { errorCode?: import("@/services/api-errors.service").ApiErrorCode }
        | undefined
    )?.errorCode;
    const { body, status } = errorResponse(
      code || "internal_error",
      null,
      code ? 400 : 500
    );
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteDateOverride(id);
    return NextResponse.json(
      successResponse({ id }, "overrides.delete.success")
    );
  } catch (error) {
    console.error("Error deleting override:", error);
    const { body, status } = errorResponse("internal_error", null, 500);
    return NextResponse.json(body, { status });
  }
}
