import { prisma } from "@/lib/prisma";

export interface CreateDateOverrideData {
  locationId: string;
  startDate: Date; // inclusive
  endDate: Date; // inclusive
  isClosed?: boolean; // default true
  reason?: string | null;
  timeSlots?: Array<{ startTime: string; endTime: string; isActive?: boolean }>;
}

export interface UpdateDateOverrideData {
  startDate?: Date;
  endDate?: Date;
  isClosed?: boolean;
  reason?: string | null;
}

export interface CreateOverrideTimeSlotData {
  dateOverrideId: string;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface UpdateOverrideTimeSlotData {
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

// Utilidades
function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export async function createDateOverride(data: CreateDateOverrideData) {
  // Validar solapamientos de rango por ubicación
  const overlaps = await prisma.dateOverride.findFirst({
    where: {
      locationId: data.locationId,
      AND: [
        { startDate: { lte: data.endDate } },
        { endDate: { gte: data.startDate } },
      ],
    },
  });

  if (overlaps) {
    throw Object.assign(new Error("override_range_overlap"), {
      errorCode: "override_range_overlap",
    });
  }

  const created = await prisma.dateOverride.create({
    data: {
      locationId: data.locationId,
      startDate: data.startDate,
      endDate: data.endDate,
      isClosed: data.isClosed ?? true,
      reason: data.reason ?? undefined,
      timeSlots:
        data.timeSlots?.length ?
          {
            createMany: {
              data: data.timeSlots.map((s) => ({
                startTime: s.startTime,
                endTime: s.endTime,
                isActive: s.isActive ?? true,
              })),
            },
          }
        : undefined,
    },
    include: { timeSlots: true },
  });

  return created;
}

export async function updateDateOverride(
  id: string,
  data: UpdateDateOverrideData
) {
  if (data.startDate || data.endDate) {
    // Traer actual para validar rango
    const current = await prisma.dateOverride.findUnique({ where: { id } });
    if (!current)
      throw Object.assign(new Error("not_found"), { errorCode: "not_found" });
    const newStart = data.startDate ?? current.startDate;
    const newEnd = data.endDate ?? current.endDate;

    const overlap = await prisma.dateOverride.findFirst({
      where: {
        id: { not: id },
        locationId: current.locationId,
        AND: [{ startDate: { lte: newEnd } }, { endDate: { gte: newStart } }],
      },
    });
    if (overlap) {
      throw Object.assign(new Error("override_range_overlap"), {
        errorCode: "override_range_overlap",
      });
    }
  }

  return prisma.dateOverride.update({
    where: { id },
    data: {
      startDate: data.startDate,
      endDate: data.endDate,
      isClosed: data.isClosed,
      reason: data.reason ?? undefined,
    },
    include: { timeSlots: true },
  });
}

export async function deleteDateOverride(id: string) {
  return prisma.dateOverride.delete({ where: { id } });
}

export async function getOverridesByLocation(
  locationId: string,
  from?: Date,
  to?: Date
) {
  return prisma.dateOverride.findMany({
    where: {
      locationId,
      ...(from && to ?
        { AND: [{ startDate: { lte: to } }, { endDate: { gte: from } }] }
      : {}),
    },
    orderBy: [{ startDate: "asc" }],
    include: { timeSlots: true },
  });
}

export async function createOverrideTimeSlot(data: CreateOverrideTimeSlotData) {
  // Idempotencia por unique(dateOverrideId, startTime, endTime)
  const existing = await prisma.overrideTimeSlot.findFirst({
    where: {
      dateOverrideId: data.dateOverrideId,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });
  if (existing) return existing;

  return prisma.overrideTimeSlot.create({
    data: {
      dateOverrideId: data.dateOverrideId,
      startTime: data.startTime,
      endTime: data.endTime,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateOverrideTimeSlot(
  id: string,
  data: UpdateOverrideTimeSlotData
) {
  return prisma.overrideTimeSlot.update({
    where: { id },
    data: {
      startTime: data.startTime,
      endTime: data.endTime,
      isActive: data.isActive,
    },
  });
}

export async function deleteOverrideTimeSlot(id: string) {
  return prisma.overrideTimeSlot.delete({ where: { id } });
}
