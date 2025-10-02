import { NextRequest, NextResponse } from "next/server";
import {
  createDateOverride,
  getOverridesByLocation,
} from "@/services/overrides.service";
import { errorResponse, successResponse } from "@/services/api-errors.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!locationId) {
      const { body, status } = errorResponse(
        "validation.required",
        "locationId is required",
        400
      );
      return NextResponse.json(body, { status });
    }

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const overrides = await getOverridesByLocation(
      locationId,
      fromDate,
      toDate
    );
    return NextResponse.json(successResponse(overrides));
  } catch (error) {
    console.error("Error fetching overrides:", error);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = {
      locationId: body.locationId as string,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      isClosed: body.isClosed ?? true,
      reason: body.reason ?? undefined,
      timeSlots: Array.isArray(body.timeSlots) ? body.timeSlots : undefined,
    };

    if (
      !payload.locationId ||
      isNaN(payload.startDate.getTime()) ||
      isNaN(payload.endDate.getTime())
    ) {
      const { body, status } = errorResponse(
        "validation.required",
        "locationId, startDate and endDate are required",
        400
      );
      return NextResponse.json(body, { status });
    }

    const created = await createDateOverride(payload);
    return NextResponse.json(
      successResponse(created, "overrides.create.success")
    );
  } catch (error) {
    console.error("Error creating override:", error);
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
